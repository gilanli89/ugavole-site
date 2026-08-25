-- Ugavole content kernel: roles, moderated UGC and ad/social eligibility.
-- Apply with the Supabase CLI or SQL editor before enabling production writes.

create extension if not exists pgcrypto;

do $$ begin
  create type public.user_role as enum ('reader', 'contributor', 'editor', 'admin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.content_type as enum ('article', 'list', 'quiz', 'poll', 'story', 'tip');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.content_origin as enum ('editorial', 'ugc', 'syndicated');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.content_status as enum (
    'draft', 'pending', 'in_review', 'approved', 'scheduled',
    'published', 'rejected', 'archived', 'takedown'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.ad_status as enum ('off', 'eligible', 'restricted');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.social_status as enum ('off', 'ready', 'paused');
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role public.user_role not null default 'reader',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  type public.content_type not null default 'article',
  origin public.content_origin not null default 'editorial',
  title text not null check (char_length(title) between 8 and 180),
  excerpt text not null default '' check (char_length(excerpt) <= 360),
  body jsonb not null default '{"version":1,"blocks":[]}'::jsonb
    check (jsonb_typeof(body) = 'object' and jsonb_typeof(body->'blocks') = 'array'),
  cover_image_url text,
  category text not null default 'Bizden Şeyler' check (char_length(category) between 2 and 60),
  location text check (location is null or char_length(location) <= 120),
  source_url text,
  author_name text not null default 'ugavole' check (char_length(author_name) between 2 and 100),
  contributor_id uuid references auth.users(id) on delete set null,
  status public.content_status not null default 'pending',
  ad_status public.ad_status not null default 'off',
  social_status public.social_status not null default 'off',
  content_version integer not null default 1 check (content_version > 0),
  rights_confirmed_at timestamptz,
  privacy_consent_version text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  scheduled_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint content_publish_timestamp check (status <> 'published' or published_at is not null),
  constraint content_ad_gate check (ad_status <> 'eligible' or status = 'published'),
  constraint content_social_gate check (social_status <> 'ready' or status = 'published'),
  constraint content_ugc_approval_gate check (
    origin <> 'ugc' or
    status not in ('approved', 'scheduled', 'published') or
    (
      rights_confirmed_at is not null and
      nullif(btrim(privacy_consent_version), '') is not null
    )
  )
);

create index if not exists content_items_public_feed_idx
  on public.content_items (published_at desc)
  where status = 'published';
create index if not exists content_items_moderation_idx
  on public.content_items (status, created_at asc);
create index if not exists content_items_contributor_idx
  on public.content_items (contributor_id, created_at desc);

-- Public readers use a deliberately narrow projection. The view owner applies
-- the published predicate while callers receive no base-table privilege.
create or replace view public.published_content
with (security_barrier = true, security_invoker = false)
as
select
  id,
  slug,
  type,
  origin,
  title,
  excerpt,
  body,
  cover_image_url,
  category,
  location,
  source_url,
  author_name,
  ad_status,
  social_status,
  content_version,
  published_at,
  created_at,
  updated_at
from public.content_items
where status = 'published' and published_at is not null;

-- Contact details and abuse signals never travel in the public content DTO.
create table if not exists public.submission_contacts (
  content_id uuid primary key references public.content_items(id) on delete cascade,
  email text not null,
  ip_hash text not null,
  user_agent_hash text,
  idempotency_key_hash text not null unique,
  payload_hash text not null check (char_length(payload_hash) = 64),
  consented_at timestamptz not null default now(),
  delete_after timestamptz not null default (now() + interval '180 days')
);

create table if not exists public.moderation_events (
  id bigint generated always as identity primary key,
  content_id uuid not null references public.content_items(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null check (char_length(action) between 2 and 60),
  from_status public.content_status,
  to_status public.content_status,
  note text check (note is null or char_length(note) <= 1000),
  created_at timestamptz not null default now()
);

create index if not exists moderation_events_content_idx
  on public.moderation_events (content_id, created_at desc);

create table if not exists public.ugc_rate_limits (
  ip_hash text primary key,
  window_started_at timestamptz not null default now(),
  hits integer not null default 1 check (hits > 0),
  updated_at timestamptz not null default now()
);

create or replace function public.is_staff(check_user uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1 from public.profiles
    where id = check_user and role in ('editor', 'admin')
  );
$$;

revoke all on function public.is_staff(uuid) from public;
grant execute on function public.is_staff(uuid) to authenticated, service_role;

create or replace function public.is_staff_aal2()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select
    auth.uid() is not null and
    coalesce(auth.jwt()->>'aal', 'aal1') = 'aal2' and
    public.is_staff(auth.uid());
$$;

revoke all on function public.is_staff_aal2() from public, anon;
grant execute on function public.is_staff_aal2() to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, nullif(new.raw_user_meta_data->>'display_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.touch_content_item()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
declare
  material_change boolean;
begin
  material_change :=
    new.slug is distinct from old.slug or
    new.type is distinct from old.type or
    new.origin is distinct from old.origin or
    new.title is distinct from old.title or
    new.excerpt is distinct from old.excerpt or
    new.body is distinct from old.body or
    new.cover_image_url is distinct from old.cover_image_url or
    new.category is distinct from old.category or
    new.location is distinct from old.location or
    new.source_url is distinct from old.source_url or
    new.author_name is distinct from old.author_name or
    new.rights_confirmed_at is distinct from old.rights_confirmed_at or
    new.privacy_consent_version is distinct from old.privacy_consent_version;

  new.updated_at := now();
  if material_change then
    new.content_version := old.content_version + 1;
    if old.status = 'published' then
      new.ad_status := 'off';
      new.social_status := 'paused';
    end if;
  else
    new.content_version := old.content_version;
  end if;
  return new;
end;
$$;

drop trigger if exists content_items_touch on public.content_items;
create trigger content_items_touch
  before update on public.content_items
  for each row execute procedure public.touch_content_item();

-- Atomic, database-backed anonymous UGC rate limit. Only the service role may call it.
create or replace function public.consume_ugc_rate_limit(
  p_ip_hash text,
  p_limit integer default 5,
  p_window_seconds integer default 3600
)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  current_hits integer;
begin
  if p_ip_hash is null or char_length(p_ip_hash) < 32 or p_limit < 1 or p_window_seconds < 60 then
    return false;
  end if;

  insert into public.ugc_rate_limits (ip_hash, window_started_at, hits, updated_at)
  values (p_ip_hash, now(), 1, now())
  on conflict (ip_hash) do update
  set
    window_started_at = case
      when public.ugc_rate_limits.window_started_at < now() - make_interval(secs => p_window_seconds)
        then now()
      else public.ugc_rate_limits.window_started_at
    end,
    hits = case
      when public.ugc_rate_limits.window_started_at < now() - make_interval(secs => p_window_seconds)
        then 1
      else public.ugc_rate_limits.hits + 1
    end,
    updated_at = now()
  returning hits into current_hits;

  return current_hits <= p_limit;
end;
$$;

revoke all on function public.consume_ugc_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_ugc_rate_limit(text, integer, integer) to service_role;

drop function if exists public.create_ugc_submission(
  text, public.content_type, text, text, jsonb, text, text, text,
  text, text, text, text, text, text
);

create or replace function public.create_ugc_submission(
  p_slug text,
  p_type public.content_type,
  p_title text,
  p_excerpt text,
  p_body jsonb,
  p_category text,
  p_location text,
  p_source_url text,
  p_author_name text,
  p_email text,
  p_ip_hash text,
  p_user_agent_hash text,
  p_idempotency_key_hash text,
  p_payload_hash text,
  p_consent_version text
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  existing_id uuid;
  existing_payload_hash text;
  new_id uuid;
  rate_limit_allowed boolean;
begin
  if p_idempotency_key_hash is null or char_length(p_idempotency_key_hash) <> 64 then
    raise exception 'invalid_idempotency_key_hash' using errcode = '22023';
  end if;
  if p_payload_hash is null or p_payload_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid_payload_hash' using errcode = '22023';
  end if;
  if p_ip_hash is null or char_length(p_ip_hash) < 32 then
    raise exception 'invalid_ip_hash' using errcode = '22023';
  end if;
  if nullif(btrim(p_consent_version), '') is null then
    raise exception 'consent_version_required' using errcode = '22023';
  end if;

  -- Serialize identical keys so two concurrent retries cannot create an orphan row.
  perform pg_advisory_xact_lock(hashtextextended(p_idempotency_key_hash, 0));

  select content_id, payload_hash into existing_id, existing_payload_hash
  from public.submission_contacts
  where idempotency_key_hash = p_idempotency_key_hash;

  if existing_id is not null then
    if existing_payload_hash <> p_payload_hash then
      raise exception 'idempotency_key_payload_mismatch' using errcode = '22023';
    end if;
    return existing_id;
  end if;

  -- Rate limiting happens only after the idempotency lookup and in this transaction,
  -- so successful retries do not consume another hit.
  rate_limit_allowed := public.consume_ugc_rate_limit(p_ip_hash, 5, 3600);
  if not rate_limit_allowed then
    raise exception 'ugc_rate_limit_exceeded' using errcode = 'P0001';
  end if;

  insert into public.content_items (
    slug, type, origin, title, excerpt, body, category, location, source_url,
    author_name, status, ad_status, social_status, rights_confirmed_at,
    privacy_consent_version
  ) values (
    p_slug, p_type, 'ugc', p_title, p_excerpt, p_body, p_category,
    nullif(p_location, ''), nullif(p_source_url, ''), p_author_name,
    'pending', 'off', 'off', now(), p_consent_version
  ) returning id into new_id;

  insert into public.submission_contacts (
    content_id, email, ip_hash, user_agent_hash, idempotency_key_hash, payload_hash
  ) values (
    new_id, p_email, p_ip_hash, nullif(p_user_agent_hash, ''),
    p_idempotency_key_hash, p_payload_hash
  );

  insert into public.moderation_events (content_id, action, to_status, note)
  values (new_id, 'submitted', 'pending', 'Anonymous UGC intake');

  return new_id;
end;
$$;

revoke all on function public.create_ugc_submission(
  text, public.content_type, text, text, jsonb, text, text, text,
  text, text, text, text, text, text, text
) from public, anon, authenticated;
grant execute on function public.create_ugc_submission(
  text, public.content_type, text, text, jsonb, text, text, text,
  text, text, text, text, text, text, text
) to service_role;

drop function if exists public.moderate_content(uuid, text, text);

create or replace function public.moderate_content(
  p_content_id uuid,
  p_expected_content_version integer,
  p_action text,
  p_note text default null
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  item public.content_items%rowtype;
  target_status public.content_status;
begin
  if not public.is_staff_aal2() then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if p_expected_content_version is null or p_expected_content_version < 1 then
    raise exception 'invalid_content_version' using errcode = '22023';
  end if;

  select * into item from public.content_items where id = p_content_id for update;
  if not found then
    raise exception 'not_found' using errcode = 'P0002';
  end if;
  if item.content_version <> p_expected_content_version then
    raise exception 'content_version_conflict' using errcode = '40001';
  end if;

  case p_action
    when 'review' then
      if item.status <> 'pending' then raise exception 'invalid_transition'; end if;
      target_status := 'in_review';
    when 'approve' then
      if item.status not in ('pending', 'in_review') then raise exception 'invalid_transition'; end if;
      if item.origin = 'ugc' and (
        item.rights_confirmed_at is null or
        nullif(btrim(item.privacy_consent_version), '') is null
      ) then
        raise exception 'ugc_rights_consent_required' using errcode = '22023';
      end if;
      target_status := 'approved';
    when 'reject' then
      if item.status not in ('pending', 'in_review', 'approved') then raise exception 'invalid_transition'; end if;
      if p_note is null or char_length(trim(p_note)) < 3 then raise exception 'note_required'; end if;
      target_status := 'rejected';
    else
      raise exception 'unknown_action';
  end case;

  update public.content_items
  set
    status = target_status,
    reviewed_by = auth.uid(),
    reviewed_at = now(),
    ad_status = 'off',
    social_status = 'off'
  where id = p_content_id;

  insert into public.moderation_events (
    content_id, actor_id, action, from_status, to_status, note
  ) values (
    p_content_id, auth.uid(), p_action, item.status, target_status, nullif(trim(p_note), '')
  );

  return p_content_id;
end;
$$;

revoke all on function public.moderate_content(uuid, integer, text, text) from public, anon;
grant execute on function public.moderate_content(uuid, integer, text, text) to authenticated, service_role;

-- Remove expired contact details and stale anti-abuse fingerprints. Only a
-- service-role worker may invoke this routine.
create or replace function public.cleanup_ugc_retention(
  p_rate_limit_retention_days integer default 2
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  deleted_contacts integer;
  deleted_rate_limits integer;
begin
  if auth.role() <> 'service_role' then
    raise exception 'service_role_required' using errcode = '42501';
  end if;
  if p_rate_limit_retention_days is null or p_rate_limit_retention_days not between 1 and 30 then
    raise exception 'invalid_retention_days' using errcode = '22023';
  end if;

  delete from public.submission_contacts
  where delete_after <= now();
  get diagnostics deleted_contacts = row_count;

  delete from public.ugc_rate_limits
  where updated_at <= now() - make_interval(days => p_rate_limit_retention_days);
  get diagnostics deleted_rate_limits = row_count;

  return jsonb_build_object(
    'deleted_contacts', deleted_contacts,
    'deleted_rate_limits', deleted_rate_limits
  );
end;
$$;

revoke all on function public.cleanup_ugc_retention(integer) from public, anon, authenticated;
grant execute on function public.cleanup_ugc_retention(integer) to service_role;

alter table public.profiles enable row level security;
alter table public.content_items enable row level security;
alter table public.submission_contacts enable row level security;
alter table public.moderation_events enable row level security;
alter table public.ugc_rate_limits enable row level security;

drop policy if exists profiles_read_own_or_staff on public.profiles;
create policy profiles_read_own_or_staff on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_staff_aal2());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists content_public_read_published on public.content_items;

drop policy if exists content_read_own_or_staff on public.content_items;
create policy content_read_own_or_staff on public.content_items
  for select to authenticated
  using (contributor_id = auth.uid() or public.is_staff_aal2());

drop policy if exists content_staff_insert on public.content_items;
drop policy if exists content_staff_update on public.content_items;
drop policy if exists content_admin_delete on public.content_items;

drop policy if exists contacts_staff_only on public.submission_contacts;
create policy contacts_staff_only on public.submission_contacts
  for select to authenticated
  using (public.is_staff_aal2());

drop policy if exists moderation_staff_read on public.moderation_events;
create policy moderation_staff_read on public.moderation_events
  for select to authenticated
  using (public.is_staff_aal2());

drop policy if exists moderation_staff_insert on public.moderation_events;

-- No anon/authenticated policies are granted for submission_contacts writes or rate-limit rows.
-- Content and audit writes are available only through the narrow workflow RPCs.
-- The server-only service client owns anonymous intake and retention cleanup.

grant usage on schema public to anon, authenticated;
revoke all on public.content_items from anon, authenticated;
grant select on public.content_items to authenticated;
revoke all on public.published_content from public, anon, authenticated;
grant select on public.published_content to anon, authenticated;
revoke update on public.profiles from authenticated;
grant select on public.profiles to authenticated;
grant update (display_name, updated_at) on public.profiles to authenticated;
revoke all on public.submission_contacts from anon, authenticated;
grant select on public.submission_contacts to authenticated;
revoke all on public.moderation_events from anon, authenticated;
grant select on public.moderation_events to authenticated;

-- Supabase's server-only service client performs intake, import, retention and
-- social preflight work; make those privileges explicit instead of relying on
-- project-level default privileges.
grant all on public.profiles, public.content_items, public.submission_contacts,
  public.moderation_events, public.ugc_rate_limits to service_role;
grant select on public.published_content to service_role;
grant usage, select on sequence public.moderation_events_id_seq to service_role;
