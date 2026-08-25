-- Durable, fail-closed social delivery outbox for Ugavole.
-- Depends on 001_content_kernel.sql. No provider credential is stored here.

do $$ begin
  create type public.social_platform as enum ('facebook', 'instagram', 'x');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.social_outbox_status as enum (
    'pending', 'processing', 'retry', 'failed', 'succeeded', 'cancelled', 'ambiguous'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.social_delivery_phase as enum (
    'queued', 'preflight', 'preparation', 'provider_processing',
    'publish_started', 'completed'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.social_accounts (
  id uuid primary key default gen_random_uuid(),
  platform public.social_platform not null unique,
  enabled boolean not null default false,
  target_account_id text,
  display_handle text,
  api_version text,
  config_fingerprint text,
  posting_cap integer check (posting_cap is null or posting_cap > 0),
  cost_notice text check (cost_notice is null or char_length(cost_notice) <= 500),
  credential_expires_at timestamptz,
  last_configured_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint social_accounts_id_platform_unique unique (id, platform),
  constraint social_account_enabled_configuration check (
    not enabled or (
      nullif(target_account_id, '') is not null and
      nullif(api_version, '') is not null and
      nullif(config_fingerprint, '') is not null
    )
  ),
  constraint social_account_x_cost_gate check (
    platform <> 'x' or not enabled or (posting_cap is not null and nullif(cost_notice, '') is not null)
  )
);

insert into public.social_accounts (platform, enabled, display_handle, cost_notice)
values
  ('facebook', false, 'UGavole', null),
  ('instagram', false, null, null),
  ('x', false, null, 'Kapalı: güncel ücret ve aylık paylaşım kotası doğrulanmadan etkinleştirilmez.')
on conflict (platform) do nothing;

create table if not exists public.social_outbox (
  id uuid primary key default gen_random_uuid(),
  event_key text not null check (char_length(event_key) = 64),
  content_id uuid not null references public.content_items(id) on delete restrict,
  content_version integer not null check (content_version > 0),
  account_id uuid not null references public.social_accounts(id) on delete restrict,
  platform public.social_platform not null,
  target_account_id text not null check (char_length(target_account_id) between 1 and 255),
  target_fingerprint text not null check (char_length(target_fingerprint) = 32),
  payload jsonb not null check (
    jsonb_typeof(payload) = 'object' and
    payload ? 'caption' and
    payload ? 'canonical_url' and
    payload ? 'content_version' and
    (
      not (payload ? 'media') or (
        jsonb_typeof(payload -> 'media') = 'object' and
        nullif(payload #>> '{media,url}', '') is not null and
        coalesce(payload #>> '{media,url_hash}', '') ~ '^[a-f0-9]{64}$' and
        coalesce(payload #>> '{media,sha256}', '') ~ '^[a-f0-9]{64}$'
      )
    )
  ),
  payload_hash text not null check (char_length(payload_hash) = 64),
  status public.social_outbox_status not null default 'pending',
  delivery_phase public.social_delivery_phase not null default 'queued',
  worker_run_count integer not null default 0 check (worker_run_count >= 0),
  max_worker_runs integer not null default 30 check (max_worker_runs between 1 and 100),
  attempt_count integer not null default 0 check (attempt_count >= 0),
  max_attempts integer not null default 6 check (max_attempts between 1 and 20),
  next_attempt_at timestamptz not null default now(),
  lease_owner text,
  lease_token uuid,
  leased_until timestamptz,
  provider_state jsonb not null default '{}'::jsonb check (jsonb_typeof(provider_state) = 'object'),
  remote_id text,
  remote_url text,
  error_code text,
  error_message text check (error_message is null or char_length(error_message) <= 1000),
  http_status integer check (http_status is null or http_status between 100 and 599),
  approved_by uuid not null references auth.users(id) on delete restrict,
  approved_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint social_outbox_event_key_unique unique (event_key),
  constraint social_outbox_once_per_content_version_account
    unique (content_id, content_version, account_id),
  constraint social_outbox_account_platform_fk
    foreign key (account_id, platform)
    references public.social_accounts(id, platform) on delete restrict,
  constraint social_outbox_lease_shape check (
    (status = 'processing' and lease_token is not null and leased_until is not null and lease_owner is not null)
    or
    (status <> 'processing' and lease_token is null and leased_until is null and lease_owner is null)
  ),
  constraint social_outbox_success_shape check (
    status <> 'succeeded' or (nullif(remote_id, '') is not null and completed_at is not null)
  )
);

create index if not exists social_outbox_claim_idx
  on public.social_outbox (next_attempt_at, created_at)
  where status in ('pending', 'retry');
create index if not exists social_outbox_content_idx
  on public.social_outbox (content_id, content_version, created_at desc);
create index if not exists social_outbox_status_idx
  on public.social_outbox (status, updated_at desc);
create index if not exists social_outbox_expired_lease_idx
  on public.social_outbox (leased_until)
  where status = 'processing';
create index if not exists social_outbox_account_inflight_idx
  on public.social_outbox (account_id, delivery_phase, leased_until)
  where status = 'processing';
create index if not exists social_outbox_account_completed_idx
  on public.social_outbox (account_id, completed_at desc)
  where status in ('succeeded', 'ambiguous');

create table if not exists public.social_delivery_attempts (
  id bigint generated always as identity primary key,
  job_id uuid not null references public.social_outbox(id) on delete cascade,
  worker_run integer not null check (worker_run > 0),
  mutation_attempt integer not null check (mutation_attempt >= 0),
  outcome public.social_outbox_status not null,
  delivery_phase public.social_delivery_phase not null,
  http_status integer check (http_status is null or http_status between 100 and 599),
  error_code text,
  error_message text check (error_message is null or char_length(error_message) <= 1000),
  created_at timestamptz not null default now()
);

create index if not exists social_delivery_attempts_job_idx
  on public.social_delivery_attempts (job_id, created_at desc);

create table if not exists public.social_outbox_events (
  id bigint generated always as identity primary key,
  job_id uuid not null references public.social_outbox(id) on delete cascade,
  from_status public.social_outbox_status,
  to_status public.social_outbox_status not null,
  from_phase public.social_delivery_phase,
  to_phase public.social_delivery_phase not null,
  error_code text,
  created_at timestamptz not null default now()
);

create index if not exists social_outbox_events_job_idx
  on public.social_outbox_events (job_id, created_at desc);

create table if not exists public.social_cron_nonces (
  signature_hash text primary key check (char_length(signature_hash) = 64),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists social_cron_nonces_expiry_idx
  on public.social_cron_nonces (expires_at);

create or replace function public.touch_social_account()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists social_accounts_touch on public.social_accounts;
create trigger social_accounts_touch
  before update on public.social_accounts
  for each row execute procedure public.touch_social_account();

create or replace function public.audit_social_outbox_change()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.social_outbox_events (
      job_id, from_status, to_status, from_phase, to_phase, error_code
    ) values (
      new.id, null, new.status, null, new.delivery_phase, new.error_code
    );
  elsif new.status is distinct from old.status or new.delivery_phase is distinct from old.delivery_phase then
    insert into public.social_outbox_events (
      job_id, from_status, to_status, from_phase, to_phase, error_code
    ) values (
      new.id, old.status, new.status, old.delivery_phase, new.delivery_phase, new.error_code
    );
  end if;
  return new;
end;
$$;

drop trigger if exists social_outbox_audit on public.social_outbox;
create trigger social_outbox_audit
  after insert or update on public.social_outbox
  for each row execute procedure public.audit_social_outbox_change();

-- Close the short gap between the atomic publish-start marker and the external
-- HTTP request. Once a leased job is marked publish_started, its approved
-- content snapshot cannot be changed or deleted until delivery finishes or the
-- bounded lease expires. The worker's provider calls time out well before the
-- minimum 60-second lease, so an expired lease cannot block editorial recovery.
create or replace function public.guard_inflight_social_content()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if exists (
    select 1
    from public.social_outbox o
    where o.content_id = old.id
      and o.status = 'processing'
      and o.delivery_phase = 'publish_started'
      and o.leased_until >= now()
  ) then
    raise exception 'social_publication_in_flight' using errcode = '55000';
  end if;
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

revoke all on function public.guard_inflight_social_content() from public, anon, authenticated;

drop trigger if exists zz_content_social_inflight_guard on public.content_items;
create trigger zz_content_social_inflight_guard
  before update or delete on public.content_items
  for each row execute procedure public.guard_inflight_social_content();

-- Destination metadata is likewise immutable during the bounded public-call
-- window. Harmless sync fields may still change, but target identity, API
-- binding, credential expiry and the paid X cap cannot be switched underneath
-- an in-flight publication.
create or replace function public.guard_inflight_social_account()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_inflight boolean;
begin
  select exists (
    select 1
    from public.social_outbox o
    where o.account_id = old.id
      and o.status = 'processing'
      and o.delivery_phase = 'publish_started'
      and o.leased_until >= now()
  ) into v_inflight;

  if v_inflight then
    if tg_op = 'DELETE' then
      raise exception 'social_destination_publication_in_flight' using errcode = '55000';
    end if;
    if new.platform is distinct from old.platform
       or new.enabled is distinct from old.enabled
       or new.target_account_id is distinct from old.target_account_id
       or new.api_version is distinct from old.api_version
       or new.config_fingerprint is distinct from old.config_fingerprint
       or new.posting_cap is distinct from old.posting_cap
       or new.credential_expires_at is distinct from old.credential_expires_at then
      raise exception 'social_destination_publication_in_flight' using errcode = '55000';
    end if;
  end if;
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

revoke all on function public.guard_inflight_social_account() from public, anon, authenticated;

drop trigger if exists zz_social_account_inflight_guard on public.social_accounts;
create trigger zz_social_account_inflight_guard
  before update or delete on public.social_accounts
  for each row execute procedure public.guard_inflight_social_account();

-- Editor approval snapshots the exact content version, approved media bytes and
-- configured destination.
-- Authenticated calls use auth.uid(); service-role calls must supply p_actor_id.
drop function if exists public.enqueue_social_outbox(
  uuid, integer, uuid, public.social_platform[], jsonb
);
create or replace function public.enqueue_social_outbox(
  p_content_id uuid,
  p_expected_content_version integer,
  p_actor_id uuid default null,
  p_platforms public.social_platform[] default null,
  p_captions jsonb default '{}'::jsonb,
  p_media_sha256 text default null
)
returns table (
  job_id uuid,
  queued_platform public.social_platform,
  job_status public.social_outbox_status,
  event_key text,
  inserted boolean
)
language plpgsql
security definer
set search_path = pg_catalog, extensions, public
as $$
declare
  v_actor uuid;
  v_content public.content_items%rowtype;
  v_platform public.social_platform;
  v_platforms public.social_platform[];
  v_account public.social_accounts%rowtype;
  v_caption text;
  v_canonical_url text;
  v_payload jsonb;
  v_payload_hash text;
  v_event_key text;
  v_job_id uuid;
  v_job_status public.social_outbox_status;
  v_inserted boolean;
begin
  if auth.role() = 'service_role' then
    v_actor := p_actor_id;
    if v_actor is null or not public.is_staff(v_actor) then
      raise exception 'staff_required' using errcode = '42501';
    end if;
  else
    v_actor := auth.uid();
    if p_actor_id is not null and p_actor_id <> v_actor then
      raise exception 'actor_mismatch' using errcode = '42501';
    end if;
    if not public.is_staff_aal2() then
      raise exception 'staff_aal2_required' using errcode = '42501';
    end if;
  end if;

  if p_expected_content_version is null or p_expected_content_version < 1 then
    raise exception 'invalid_content_version' using errcode = '22023';
  end if;

  if p_captions is null or jsonb_typeof(p_captions) <> 'object' then
    raise exception 'captions_must_be_object' using errcode = '22023';
  end if;

  select * into v_content
  from public.content_items
  where id = p_content_id
  for update;

  if not found then
    raise exception 'content_not_found' using errcode = 'P0002';
  end if;

  if v_content.content_version <> p_expected_content_version then
    raise exception 'content_version_conflict' using errcode = '40001';
  end if;

  if v_content.status::text <> 'published'
     or v_content.ad_status::text <> 'eligible'
     or v_content.social_status::text <> 'ready'
     or v_content.published_at is null then
    raise exception 'content_not_social_eligible' using errcode = '22023';
  end if;

  if v_content.origin::text = 'ugc' and (
    v_content.rights_confirmed_at is null
    or nullif(btrim(v_content.privacy_consent_version), '') is null
  ) then
    raise exception 'ugc_rights_and_privacy_confirmation_required' using errcode = '22023';
  end if;

  if nullif(v_content.cover_image_url, '') is not null and (
    char_length(v_content.cover_image_url) > 2048
    or lower(v_content.cover_image_url) !~ '^https://'
    or position('?' in v_content.cover_image_url) > 0
    or position('#' in v_content.cover_image_url) > 0
  ) then
    raise exception 'social_media_url_must_be_public' using errcode = '22023';
  end if;
  if nullif(v_content.cover_image_url, '') is not null then
    if coalesce(p_media_sha256, '') !~ '^[a-f0-9]{64}$' then
      raise exception 'approved_media_sha256_required' using errcode = '22023';
    end if;
  elsif p_media_sha256 is not null then
    raise exception 'approved_media_sha256_without_media' using errcode = '22023';
  end if;

  if p_platforms is null then
    select array_agg(a.platform order by a.platform::text)
      into v_platforms
    from public.social_accounts a
    where a.enabled;
  else
    select array_agg(requested.platform order by requested.platform::text)
      into v_platforms
    from (
      select distinct requested_platform as platform
      from unnest(p_platforms) requested_platform
    ) requested;
  end if;

  if coalesce(array_length(v_platforms, 1), 0) = 0 then
    raise exception 'no_social_platform_selected' using errcode = '22023';
  end if;

  v_canonical_url := 'https://ugavole.com/haber/' || v_content.slug;

  foreach v_platform in array v_platforms loop
    select * into v_account
    from public.social_accounts a
    where a.platform = v_platform and a.enabled
    for share;

    if not found
       or nullif(v_account.target_account_id, '') is null
       or nullif(v_account.config_fingerprint, '') is null then
      raise exception 'social_account_not_enabled:%', v_platform using errcode = '22023';
    end if;

    v_caption := coalesce(nullif(btrim(p_captions ->> v_platform::text), ''), v_content.title);

    if (v_platform = 'x' and char_length(v_caption) > 240)
       or (v_platform = 'instagram' and char_length(v_caption) > 2100)
       or (v_platform = 'facebook' and char_length(v_caption) > 4000) then
      raise exception 'caption_too_long:%', v_platform using errcode = '22023';
    end if;

    v_payload := jsonb_strip_nulls(jsonb_build_object(
      'schema_version', 1,
      'content_id', v_content.id,
      'content_version', v_content.content_version,
      'slug', v_content.slug,
      'title', v_content.title,
      'excerpt', v_content.excerpt,
      'caption', v_caption,
      'canonical_url', v_canonical_url,
      'media', case
        when nullif(v_content.cover_image_url, '') is null then null
        else jsonb_build_object(
          'url', v_content.cover_image_url,
          'url_hash', encode(digest(v_content.cover_image_url, 'sha256'), 'hex'),
          'sha256', p_media_sha256
        )
      end
    ));
    v_payload_hash := encode(digest(v_payload::text, 'sha256'), 'hex');
    v_event_key := encode(digest(concat_ws('|',
      v_content.id::text,
      v_content.content_version::text,
      v_platform::text,
      v_account.id::text,
      v_account.config_fingerprint,
      v_payload_hash
    ), 'sha256'), 'hex');

    v_job_id := null;
    v_job_status := null;
    insert into public.social_outbox (
      event_key, content_id, content_version, account_id, platform,
      target_account_id, target_fingerprint, payload, payload_hash,
      approved_by, approved_at
    ) values (
      v_event_key, v_content.id, v_content.content_version, v_account.id, v_platform,
      v_account.target_account_id, v_account.config_fingerprint, v_payload, v_payload_hash,
      v_actor, now()
    )
    on conflict do nothing
    returning id, status into v_job_id, v_job_status;

    v_inserted := v_job_id is not null;
    if not v_inserted then
      select o.id, o.status, o.event_key into v_job_id, v_job_status, v_event_key
      from public.social_outbox o
      where o.content_id = v_content.id
        and o.content_version = v_content.content_version
        and o.account_id = v_account.id;
      if v_job_id is null then
        raise exception 'social_outbox_idempotency_conflict' using errcode = '23505';
      end if;
    end if;

    job_id := v_job_id;
    queued_platform := v_platform;
    job_status := v_job_status;
    event_key := v_event_key;
    inserted := v_inserted;
    return next;
  end loop;
end;
$$;

revoke all on function public.enqueue_social_outbox(
  uuid, integer, uuid, public.social_platform[], jsonb, text
) from public, anon;
grant execute on function public.enqueue_social_outbox(
  uuid, integer, uuid, public.social_platform[], jsonb, text
) to authenticated, service_role;

-- Claiming also resolves expired leases. Once a public mutation was durably marked,
-- an expired lease becomes ambiguous and is never replayed automatically.
create or replace function public.claim_social_outbox(
  p_worker_id text,
  p_batch_size integer default 5,
  p_lease_seconds integer default 600
)
returns setof public.social_outbox
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if auth.role() <> 'service_role' then
    raise exception 'service_role_required' using errcode = '42501';
  end if;
  if nullif(btrim(p_worker_id), '') is null
     or p_batch_size not between 1 and 25
     or p_lease_seconds not between 60 and 1800 then
    raise exception 'invalid_claim_parameters' using errcode = '22023';
  end if;

  update public.social_outbox
  set
    status = case
      when delivery_phase in ('publish_started', 'completed') then 'ambiguous'::public.social_outbox_status
      else 'retry'::public.social_outbox_status
    end,
    error_code = case
      when delivery_phase in ('publish_started', 'completed') then 'ambiguous_worker_exit'
      else 'worker_lease_expired'
    end,
    error_message = case
      when delivery_phase in ('publish_started', 'completed')
        then 'Worker lease expired after a public mutation may have started; manual reconciliation required.'
      else 'Worker lease expired before public mutation; safely returned to retry queue.'
    end,
    next_attempt_at = case
      when delivery_phase in ('publish_started', 'completed') then next_attempt_at
      else now() + interval '30 seconds'
    end,
    lease_owner = null,
    lease_token = null,
    leased_until = null,
    updated_at = now(),
    completed_at = case
      when delivery_phase in ('publish_started', 'completed') then now()
      else completed_at
    end
  where status = 'processing' and leased_until < now();

  update public.social_outbox
  set
    status = 'failed',
    error_code = 'worker_run_limit_exhausted',
    error_message = 'Maximum worker run count reached before delivery completed.',
    completed_at = now(),
    updated_at = now()
  where status in ('pending', 'retry')
    and worker_run_count >= max_worker_runs;

  update public.social_outbox
  set
    status = 'failed',
    error_code = 'delivery_attempt_limit_exhausted',
    error_message = 'Maximum public delivery attempt count reached.',
    completed_at = now(),
    updated_at = now()
  where status in ('pending', 'retry')
    and attempt_count >= max_attempts;

  return query
  with candidates as (
    select o.id
    from public.social_outbox o
    where o.status in ('pending', 'retry')
      and o.next_attempt_at <= now()
      and o.worker_run_count < o.max_worker_runs
      and o.attempt_count < o.max_attempts
    order by o.next_attempt_at asc, o.created_at asc
    for update skip locked
    limit p_batch_size
  )
  update public.social_outbox o
  set
    status = 'processing',
    delivery_phase = 'preflight',
    worker_run_count = o.worker_run_count + 1,
    lease_owner = p_worker_id,
    lease_token = gen_random_uuid(),
    leased_until = now() + make_interval(secs => p_lease_seconds),
    started_at = coalesce(o.started_at, now()),
    error_code = null,
    error_message = null,
    http_status = null,
    updated_at = now()
  from candidates c
  where o.id = c.id
  returning o.*;
end;
$$;

revoke all on function public.claim_social_outbox(text, integer, integer) from public, anon, authenticated;
grant execute on function public.claim_social_outbox(text, integer, integer) to service_role;

create or replace function public.persist_social_provider_state(
  p_job_id uuid,
  p_lease_token uuid,
  p_phase public.social_delivery_phase,
  p_provider_state jsonb
)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_rows integer;
begin
  if auth.role() <> 'service_role' then
    raise exception 'service_role_required' using errcode = '42501';
  end if;
  if p_phase not in ('preflight', 'preparation', 'provider_processing')
     or p_provider_state is null
     or jsonb_typeof(p_provider_state) <> 'object' then
    raise exception 'invalid_provider_state' using errcode = '22023';
  end if;

  update public.social_outbox
  set
    delivery_phase = p_phase,
    provider_state = provider_state || p_provider_state,
    updated_at = now()
  where id = p_job_id
    and status = 'processing'
    and lease_token = p_lease_token
    and leased_until >= now()
    and delivery_phase <> 'publish_started';
  get diagnostics v_rows = row_count;
  return v_rows = 1;
end;
$$;

revoke all on function public.persist_social_provider_state(
  uuid, uuid, public.social_delivery_phase, jsonb
) from public, anon, authenticated;
grant execute on function public.persist_social_provider_state(
  uuid, uuid, public.social_delivery_phase, jsonb
) to service_role;

create or replace function public.mark_social_publication_started(
  p_job_id uuid,
  p_lease_token uuid,
  p_provider_state jsonb default '{}'::jsonb
)
returns text
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_job public.social_outbox%rowtype;
  v_content public.content_items%rowtype;
  v_account public.social_accounts%rowtype;
  v_monthly_reserved bigint;
begin
  if auth.role() <> 'service_role' then
    raise exception 'service_role_required' using errcode = '42501';
  end if;
  if p_provider_state is null or jsonb_typeof(p_provider_state) <> 'object' then
    raise exception 'invalid_provider_state' using errcode = '22023';
  end if;

  select * into v_job
  from public.social_outbox
  where id = p_job_id
    and status = 'processing'
    and lease_token = p_lease_token
    and leased_until >= now()
    and delivery_phase <> 'publish_started'
    and attempt_count < max_attempts
  for update;

  if not found then
    return 'lease_lost';
  end if;

  select * into v_content
  from public.content_items
  where id = v_job.content_id
  for share;

  select * into v_account
  from public.social_accounts
  where id = v_job.account_id
  for update;

  if v_content.id is null
     or v_account.id is null
     or v_content.status::text <> 'published'
     or v_content.ad_status::text <> 'eligible'
     or v_content.social_status::text <> 'ready'
     or v_content.published_at is null
     or (
       v_content.origin::text = 'ugc' and (
         v_content.rights_confirmed_at is null
         or nullif(btrim(v_content.privacy_consent_version), '') is null
       )
     )
     or v_content.content_version <> v_job.content_version
     or v_job.payload ->> 'content_id' is distinct from v_job.content_id::text
     or v_job.payload ->> 'content_version' is distinct from v_job.content_version::text
     or v_job.payload ->> 'slug' is distinct from v_content.slug
     or v_job.payload ->> 'title' is distinct from v_content.title
     or v_job.payload ->> 'excerpt' is distinct from v_content.excerpt
     or v_job.payload ->> 'canonical_url' is distinct from ('https://ugavole.com/haber/' || v_content.slug)
     or coalesce(v_job.payload #>> '{media,url}', '') <> coalesce(v_content.cover_image_url, '')
     or not v_account.enabled
     or v_account.platform is distinct from v_job.platform
     or v_account.target_account_id is distinct from v_job.target_account_id
     or v_account.config_fingerprint is distinct from v_job.target_fingerprint then
    update public.social_outbox
    set
      status = 'cancelled',
      error_code = 'approval_invalidated_at_mutation',
      error_message = 'Content or destination changed before the public provider mutation.',
      completed_at = now(),
      lease_owner = null,
      lease_token = null,
      leased_until = null,
      updated_at = now()
    where id = v_job.id and lease_token = p_lease_token;
    return 'invalidated';
  end if;

  if v_job.platform = 'x' then
    if v_account.posting_cap is null then
      update public.social_outbox
      set
        status = 'cancelled',
        error_code = 'x_posting_cap_unavailable',
        error_message = 'X posting is disabled until a positive monthly cap is configured.',
        completed_at = now(),
        lease_owner = null,
        lease_token = null,
        leased_until = null,
        updated_at = now()
      where id = v_job.id and lease_token = p_lease_token;
      return 'cap_reached';
    end if;

    select count(*) into v_monthly_reserved
    from public.social_outbox o
    where o.account_id = v_job.account_id
      and o.id <> v_job.id
      and (
        (o.status in ('succeeded', 'ambiguous') and o.completed_at >= date_trunc('month', now()))
        or (o.status = 'processing' and o.delivery_phase = 'publish_started')
      );

    if v_monthly_reserved >= v_account.posting_cap then
      update public.social_outbox
      set
        status = 'cancelled',
        error_code = 'x_monthly_posting_cap_reached',
        error_message = 'The configured monthly X posting cap has been reached.',
        completed_at = now(),
        lease_owner = null,
        lease_token = null,
        leased_until = null,
        updated_at = now()
      where id = v_job.id and lease_token = p_lease_token;
      return 'cap_reached';
    end if;
  end if;

  update public.social_outbox
  set
    delivery_phase = 'publish_started',
    provider_state = provider_state || p_provider_state,
    attempt_count = attempt_count + 1,
    updated_at = now()
  where id = v_job.id
    and status = 'processing'
    and lease_token = p_lease_token;
  return 'started';
end;
$$;

revoke all on function public.mark_social_publication_started(uuid, uuid, jsonb)
  from public, anon, authenticated;
grant execute on function public.mark_social_publication_started(uuid, uuid, jsonb)
  to service_role;

drop function if exists public.finish_social_outbox_job(
  uuid, uuid, public.social_outbox_status, text, text, text, text,
  integer, integer, jsonb, boolean
);
create or replace function public.finish_social_outbox_job(
  p_job_id uuid,
  p_lease_token uuid,
  p_outcome public.social_outbox_status,
  p_remote_id text default null,
  p_remote_url text default null,
  p_error_code text default null,
  p_error_message text default null,
  p_http_status integer default null,
  p_retry_after_seconds integer default null,
  p_provider_state jsonb default '{}'::jsonb
)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_job public.social_outbox%rowtype;
  v_outcome public.social_outbox_status;
  v_retry_seconds integer;
begin
  if auth.role() <> 'service_role' then
    raise exception 'service_role_required' using errcode = '42501';
  end if;
  if p_outcome not in ('retry', 'failed', 'succeeded', 'cancelled', 'ambiguous') then
    raise exception 'invalid_finish_outcome' using errcode = '22023';
  end if;
  if p_provider_state is null or jsonb_typeof(p_provider_state) <> 'object' then
    raise exception 'invalid_provider_state' using errcode = '22023';
  end if;

  select * into v_job
  from public.social_outbox
  where id = p_job_id
    and status = 'processing'
    and lease_token = p_lease_token
    and leased_until >= now()
  for update;

  if not found then
    return false;
  end if;

  v_outcome := p_outcome;
  if p_outcome = 'succeeded' and nullif(p_remote_id, '') is null then
    v_outcome := 'ambiguous';
    p_error_code := coalesce(p_error_code, 'provider_id_missing');
    p_error_message := coalesce(
      p_error_message,
      'Provider returned success without a remote identifier; manual reconciliation required.'
    );
  elsif p_outcome = 'retry' and v_job.delivery_phase = 'publish_started' then
    v_outcome := 'ambiguous';
    p_error_code := coalesce(p_error_code, 'ambiguous_delivery');
    p_error_message := coalesce(
      p_error_message,
      'Retry was requested after public mutation started; manual reconciliation required.'
    );
  end if;

  if v_outcome = 'retry' then
    v_retry_seconds := greatest(30, least(
      coalesce(p_retry_after_seconds, (30 * power(2, least(v_job.worker_run_count, 9)))::integer),
      21600
    ));
  end if;

  update public.social_outbox
  set
    status = v_outcome,
    worker_run_count = case
      when v_outcome = 'retry'
       and v_job.delivery_phase <> 'publish_started'
       and p_error_code in (
         'access_token_missing',
         'access_token_expiry_missing',
         'access_token_expired_or_imminent'
       )
        then greatest(worker_run_count - 1, 0)
      else worker_run_count
    end,
    delivery_phase = case
      when v_outcome = 'succeeded' then 'completed'::public.social_delivery_phase
      when v_outcome = 'retry' then 'queued'::public.social_delivery_phase
      else delivery_phase
    end,
    next_attempt_at = case
      when v_outcome = 'retry' then now() + make_interval(secs => v_retry_seconds)
      else next_attempt_at
    end,
    provider_state = provider_state || p_provider_state,
    remote_id = case when v_outcome = 'succeeded' then p_remote_id else remote_id end,
    remote_url = case when v_outcome = 'succeeded' then p_remote_url else remote_url end,
    error_code = case when v_outcome = 'succeeded' then null else left(p_error_code, 120) end,
    error_message = case when v_outcome = 'succeeded' then null else left(p_error_message, 1000) end,
    http_status = p_http_status,
    completed_at = case when v_outcome = 'retry' then null else now() end,
    lease_owner = null,
    lease_token = null,
    leased_until = null,
    updated_at = now()
  where id = p_job_id and status = 'processing' and lease_token = p_lease_token;

  insert into public.social_delivery_attempts (
    job_id, worker_run, mutation_attempt, outcome, delivery_phase,
    http_status, error_code, error_message
  ) values (
    v_job.id, v_job.worker_run_count, v_job.attempt_count, v_outcome, v_job.delivery_phase,
    p_http_status,
    case when v_outcome = 'succeeded' then null else left(p_error_code, 120) end,
    case when v_outcome = 'succeeded' then null else left(p_error_message, 1000) end
  );

  return true;
end;
$$;

revoke all on function public.finish_social_outbox_job(
  uuid, uuid, public.social_outbox_status, text, text, text, text,
  integer, integer, jsonb
) from public, anon, authenticated;
grant execute on function public.finish_social_outbox_job(
  uuid, uuid, public.social_outbox_status, text, text, text, text,
  integer, integer, jsonb
) to service_role;

-- Replay protection for signed cron calls. HMAC verification still happens in Next.js.
create or replace function public.consume_social_cron_nonce(
  p_signature_hash text,
  p_expires_at timestamptz
)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_rows integer;
begin
  if auth.role() <> 'service_role' then
    raise exception 'service_role_required' using errcode = '42501';
  end if;
  if p_signature_hash !~ '^[a-f0-9]{64}$'
     or p_expires_at <= now()
     or p_expires_at > now() + interval '10 minutes' then
    return false;
  end if;

  delete from public.social_cron_nonces where expires_at < now();
  insert into public.social_cron_nonces (signature_hash, expires_at)
  values (p_signature_hash, p_expires_at)
  on conflict (signature_hash) do nothing;
  get diagnostics v_rows = row_count;
  return v_rows = 1;
end;
$$;

revoke all on function public.consume_social_cron_nonce(text, timestamptz)
  from public, anon, authenticated;
grant execute on function public.consume_social_cron_nonce(text, timestamptz)
  to service_role;

alter table public.social_accounts enable row level security;
alter table public.social_outbox enable row level security;
alter table public.social_delivery_attempts enable row level security;
alter table public.social_outbox_events enable row level security;
alter table public.social_cron_nonces enable row level security;

drop policy if exists social_accounts_staff_read on public.social_accounts;
create policy social_accounts_staff_read on public.social_accounts
  for select to authenticated using (public.is_staff_aal2());

drop policy if exists social_outbox_staff_read on public.social_outbox;
create policy social_outbox_staff_read on public.social_outbox
  for select to authenticated using (public.is_staff_aal2());

drop policy if exists social_attempts_staff_read on public.social_delivery_attempts;
create policy social_attempts_staff_read on public.social_delivery_attempts
  for select to authenticated using (public.is_staff_aal2());

drop policy if exists social_events_staff_read on public.social_outbox_events;
create policy social_events_staff_read on public.social_outbox_events
  for select to authenticated using (public.is_staff_aal2());

revoke all on public.social_accounts, public.social_outbox,
  public.social_delivery_attempts, public.social_outbox_events,
  public.social_cron_nonces from anon, authenticated;
grant select on public.social_accounts, public.social_outbox,
  public.social_delivery_attempts, public.social_outbox_events to authenticated;
grant all on public.social_accounts, public.social_outbox,
  public.social_delivery_attempts, public.social_outbox_events,
  public.social_cron_nonces to service_role;
grant usage, select on sequence public.social_delivery_attempts_id_seq,
  public.social_outbox_events_id_seq to service_role;
