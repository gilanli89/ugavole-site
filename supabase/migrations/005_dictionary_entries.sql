-- Moderated community additions for the Kibris Turkish dictionary.
-- This is intentionally separate from content_items and the news workflow.

do $$ begin
  create type public.dictionary_status as enum (
    'pending', 'in_review', 'published', 'rejected'
  );
exception when duplicate_object then null;
end $$;

-- Mirrors the application-side Turkish search key. The caller supplies the
-- parsed key, and this database function verifies it before any row is stored.
create or replace function public.dictionary_normalized_key(p_value text)
returns text
language sql
immutable
strict
parallel safe
set search_path = pg_catalog, public
as $$
  select btrim(
    regexp_replace(
      regexp_replace(
        normalize(
          translate(
            lower(translate(p_value, 'Iİ', 'ıi')),
            'ı',
            'i'
          ),
          NFKD
        ),
        U&'[\0300-\036f]',
        '',
        'g'
      ),
      '[^a-z0-9]+',
      ' ',
      'g'
    )
  );
$$;

revoke all on function public.dictionary_normalized_key(text) from public, anon, authenticated;
grant execute on function public.dictionary_normalized_key(text) to service_role;

create or replace function public.dictionary_aliases_are_valid(p_aliases text[])
returns boolean
language sql
immutable
strict
parallel safe
set search_path = pg_catalog, public
as $$
  select
    coalesce(cardinality(p_aliases), 0) <= 6
    and not exists (
      select 1
      from unnest(p_aliases) as item(alias)
      where
        alias is null
        or alias <> btrim(alias)
        or char_length(alias) not between 2 and 80
        or public.dictionary_normalized_key(alias) = ''
        or char_length(public.dictionary_normalized_key(alias)) > 80
    );
$$;

revoke all on function public.dictionary_aliases_are_valid(text[]) from public, anon, authenticated;
grant execute on function public.dictionary_aliases_are_valid(text[]) to service_role;

create table if not exists public.dictionary_entries (
  id uuid primary key default gen_random_uuid(),
  word text not null check (char_length(word) between 2 and 80 and word = btrim(word)),
  normalized_key text not null check (
    char_length(normalized_key) between 1 and 80
    and normalized_key ~ '^[a-z0-9]+(?: [a-z0-9]+)*$'
    and normalized_key = public.dictionary_normalized_key(word)
  ),
  aliases text[] not null default '{}'::text[]
    check (public.dictionary_aliases_are_valid(aliases)),
  definition text not null check (
    char_length(definition) between 3 and 600 and definition = btrim(definition)
  ),
  example text check (
    example is null or (char_length(example) between 1 and 400 and example = btrim(example))
  ),
  category text not null check (category = any (array[
    'günlük', 'argo', 'deyim', 'anlam farkı', 'ünlem', 'yemek',
    'kültür', 'sevgi', 'doğa', 'alet', 'araç', 'mekan'
  ]::text[])),
  status public.dictionary_status not null default 'pending',
  content_version integer not null default 1 check (content_version > 0),
  rights_confirmed_at timestamptz not null,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint dictionary_publication_timestamp check (
    status <> 'published' or published_at is not null
  ),
  constraint dictionary_review_timestamp check (
    status = 'pending' or reviewed_at is not null
  )
);

create unique index if not exists dictionary_entries_active_key_unique
  on public.dictionary_entries (normalized_key)
  where status in ('pending', 'in_review', 'published');
create index if not exists dictionary_entries_public_order_idx
  on public.dictionary_entries (normalized_key, published_at desc)
  where status = 'published';
create index if not exists dictionary_entries_moderation_idx
  on public.dictionary_entries (status, created_at asc);

-- Anonymous/authenticated readers receive only this narrow published view.
-- The view owner applies the predicate while no caller receives base-table
-- access to pending or rejected entries.
create or replace view public.published_dictionary_entries
with (security_barrier = true, security_invoker = false)
as
select
  id,
  word,
  normalized_key,
  aliases,
  definition,
  example,
  category,
  published_at,
  updated_at
from public.dictionary_entries
where status = 'published' and published_at is not null;

-- Idempotency and abuse signals are private even from staff-facing DTOs.
create table if not exists public.dictionary_submission_meta (
  entry_id uuid primary key references public.dictionary_entries(id) on delete cascade,
  ip_hash text not null check (ip_hash ~ '^[a-f0-9]{64}$'),
  user_agent_hash text check (
    user_agent_hash is null or user_agent_hash ~ '^[a-f0-9]{64}$'
  ),
  idempotency_key_hash text not null unique
    check (idempotency_key_hash ~ '^[a-f0-9]{64}$'),
  payload_hash text not null check (payload_hash ~ '^[a-f0-9]{64}$'),
  consent_version text not null check (char_length(btrim(consent_version)) between 1 and 80),
  consented_at timestamptz not null default now(),
  delete_after timestamptz not null default (now() + interval '180 days')
);

create table if not exists public.dictionary_submission_rate_limits (
  ip_hash text primary key check (ip_hash ~ '^[a-f0-9]{64}$'),
  window_started_at timestamptz not null default now(),
  hits integer not null default 1 check (hits > 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.dictionary_moderation_events (
  id bigint generated always as identity primary key,
  entry_id uuid not null references public.dictionary_entries(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null check (
    action in ('submitted', 'review', 'publish', 'reject', 'unpublish')
  ),
  from_status public.dictionary_status,
  to_status public.dictionary_status not null,
  note text check (note is null or char_length(note) <= 1000),
  created_at timestamptz not null default now()
);

create index if not exists dictionary_moderation_events_entry_idx
  on public.dictionary_moderation_events (entry_id, created_at desc);

create or replace function public.touch_dictionary_entry()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
declare
  material_change boolean;
begin
  material_change :=
    new.word is distinct from old.word or
    new.normalized_key is distinct from old.normalized_key or
    new.aliases is distinct from old.aliases or
    new.definition is distinct from old.definition or
    new.example is distinct from old.example or
    new.category is distinct from old.category or
    new.rights_confirmed_at is distinct from old.rights_confirmed_at;

  new.updated_at := now();
  if material_change then
    new.content_version := old.content_version + 1;
  else
    new.content_version := old.content_version;
  end if;
  return new;
end;
$$;

revoke all on function public.touch_dictionary_entry() from public, anon, authenticated;

drop trigger if exists dictionary_entries_touch on public.dictionary_entries;
create trigger dictionary_entries_touch
  before update on public.dictionary_entries
  for each row execute procedure public.touch_dictionary_entry();

-- Atomic database-backed anonymous submission limit. Successful idempotent
-- retries are resolved before this function is called and consume no new hit.
create or replace function public.consume_dictionary_submission_rate_limit(
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
  if
    auth.role() <> 'service_role'
    or p_ip_hash is null
    or p_ip_hash !~ '^[a-f0-9]{64}$'
    or p_limit not between 1 and 100
    or p_window_seconds not between 60 and 86400
  then
    return false;
  end if;

  insert into public.dictionary_submission_rate_limits (
    ip_hash, window_started_at, hits, updated_at
  ) values (
    p_ip_hash, now(), 1, now()
  )
  on conflict (ip_hash) do update
  set
    window_started_at = case
      when public.dictionary_submission_rate_limits.window_started_at
        < now() - make_interval(secs => p_window_seconds)
        then now()
      else public.dictionary_submission_rate_limits.window_started_at
    end,
    hits = case
      when public.dictionary_submission_rate_limits.window_started_at
        < now() - make_interval(secs => p_window_seconds)
        then 1
      else public.dictionary_submission_rate_limits.hits + 1
    end,
    updated_at = now()
  returning hits into current_hits;

  return current_hits <= p_limit;
end;
$$;

revoke all on function public.consume_dictionary_submission_rate_limit(text, integer, integer)
  from public, anon, authenticated;
grant execute on function public.consume_dictionary_submission_rate_limit(text, integer, integer)
  to service_role;

create or replace function public.submit_dictionary_entry(
  p_word text,
  p_normalized_key text,
  p_aliases text[],
  p_definition text,
  p_example text,
  p_category text,
  p_rights_confirmed boolean,
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
  clean_aliases text[] := coalesce(p_aliases, '{}'::text[]);
  proposed_keys text[];
  proposed_key text;
begin
  if auth.role() <> 'service_role' then
    raise exception 'service_role_required' using errcode = '42501';
  end if;
  if p_word is null or char_length(p_word) not between 2 and 80 or p_word <> btrim(p_word) then
    raise exception 'invalid_dictionary_word' using errcode = '22023';
  end if;
  if
    p_normalized_key is null
    or p_normalized_key <> public.dictionary_normalized_key(p_word)
    or char_length(p_normalized_key) not between 1 and 80
  then
    raise exception 'invalid_dictionary_normalized_key' using errcode = '22023';
  end if;
  if not public.dictionary_aliases_are_valid(clean_aliases) then
    raise exception 'invalid_dictionary_aliases' using errcode = '22023';
  end if;
  if exists (
    select 1
    from unnest(clean_aliases) as item(alias)
    where public.dictionary_normalized_key(alias) = p_normalized_key
  ) or (
    select count(*) <> count(distinct public.dictionary_normalized_key(alias))
    from unnest(clean_aliases) as item(alias)
  ) then
    raise exception 'duplicate_dictionary_aliases' using errcode = '22023';
  end if;
  if
    p_definition is null
    or char_length(p_definition) not between 3 and 600
    or p_definition <> btrim(p_definition)
  then
    raise exception 'invalid_dictionary_definition' using errcode = '22023';
  end if;
  if
    p_example is not null
    and (char_length(p_example) not between 1 and 400 or p_example <> btrim(p_example))
  then
    raise exception 'invalid_dictionary_example' using errcode = '22023';
  end if;
  if p_category is null or not (p_category = any (array[
    'günlük', 'argo', 'deyim', 'anlam farkı', 'ünlem', 'yemek',
    'kültür', 'sevgi', 'doğa', 'alet', 'araç', 'mekan'
  ]::text[])) then
    raise exception 'invalid_dictionary_category' using errcode = '22023';
  end if;
  if p_rights_confirmed is distinct from true then
    raise exception 'dictionary_rights_confirmation_required' using errcode = '22023';
  end if;
  if p_ip_hash is null or p_ip_hash !~ '^[a-f0-9]{64}$' then
    raise exception 'invalid_dictionary_ip_hash' using errcode = '22023';
  end if;
  if p_user_agent_hash is not null and p_user_agent_hash !~ '^[a-f0-9]{64}$' then
    raise exception 'invalid_dictionary_user_agent_hash' using errcode = '22023';
  end if;
  if p_idempotency_key_hash is null or p_idempotency_key_hash !~ '^[a-f0-9]{64}$' then
    raise exception 'invalid_dictionary_idempotency_hash' using errcode = '22023';
  end if;
  if p_payload_hash is null or p_payload_hash !~ '^[a-f0-9]{64}$' then
    raise exception 'invalid_dictionary_payload_hash' using errcode = '22023';
  end if;
  if
    p_consent_version is null
    or char_length(btrim(p_consent_version)) not between 1 and 80
  then
    raise exception 'invalid_dictionary_consent_version' using errcode = '22023';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_idempotency_key_hash, 0));

  select entry_id, payload_hash into existing_id, existing_payload_hash
  from public.dictionary_submission_meta
  where idempotency_key_hash = p_idempotency_key_hash;

  if existing_id is not null then
    if existing_payload_hash <> p_payload_hash then
      raise exception 'dictionary_idempotency_payload_mismatch' using errcode = '22023';
    end if;
    return existing_id;
  end if;

  -- Lock every proposed lexical key (main word and aliases) in deterministic
  -- order. Competing submissions therefore cannot race by swapping a main
  -- word and an alias, while rejected entries release their keys naturally.
  select array_agg(candidate.key order by candidate.key)
  into proposed_keys
  from (
    select distinct key
    from (
      select p_normalized_key as key
      union all
      select public.dictionary_normalized_key(alias)
      from unnest(clean_aliases) as item(alias)
    ) all_keys
  ) candidate;

  foreach proposed_key in array proposed_keys loop
    perform pg_advisory_xact_lock(hashtextextended(proposed_key, 1));
  end loop;

  if exists (
    select 1
    from public.dictionary_entries existing
    where
      existing.status in ('pending', 'in_review', 'published')
      and (
        existing.normalized_key = any(proposed_keys)
        or exists (
          select 1
          from unnest(existing.aliases) as item(alias)
          where public.dictionary_normalized_key(alias) = any(proposed_keys)
        )
      )
  ) then
    raise exception 'dictionary_entry_already_active' using errcode = '23505';
  end if;

  if not public.consume_dictionary_submission_rate_limit(p_ip_hash, 5, 3600) then
    raise exception 'dictionary_rate_limit_exceeded' using errcode = 'P0001';
  end if;

  insert into public.dictionary_entries (
    word,
    normalized_key,
    aliases,
    definition,
    example,
    category,
    status,
    rights_confirmed_at
  ) values (
    p_word,
    p_normalized_key,
    clean_aliases,
    p_definition,
    nullif(p_example, ''),
    p_category,
    'pending',
    now()
  ) returning id into new_id;

  insert into public.dictionary_submission_meta (
    entry_id,
    ip_hash,
    user_agent_hash,
    idempotency_key_hash,
    payload_hash,
    consent_version
  ) values (
    new_id,
    p_ip_hash,
    nullif(p_user_agent_hash, ''),
    p_idempotency_key_hash,
    p_payload_hash,
    p_consent_version
  );

  insert into public.dictionary_moderation_events (
    entry_id, action, from_status, to_status, note
  ) values (
    new_id, 'submitted', null, 'pending', 'Anonymous dictionary contribution'
  );

  return new_id;
end;
$$;

revoke all on function public.submit_dictionary_entry(
  text, text, text[], text, text, text, boolean, text, text, text, text, text
) from public, anon, authenticated;
grant execute on function public.submit_dictionary_entry(
  text, text, text[], text, text, text, boolean, text, text, text, text, text
) to service_role;

create or replace function public.cleanup_dictionary_retention(
  p_rate_limit_retention_days integer default 2
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  deleted_submission_meta integer;
  deleted_rate_limits integer;
begin
  if auth.role() <> 'service_role' then
    raise exception 'service_role_required' using errcode = '42501';
  end if;
  if
    p_rate_limit_retention_days is null
    or p_rate_limit_retention_days not between 1 and 30
  then
    raise exception 'invalid_retention_days' using errcode = '22023';
  end if;

  delete from public.dictionary_submission_meta
  where delete_after <= now();
  get diagnostics deleted_submission_meta = row_count;

  delete from public.dictionary_submission_rate_limits
  where updated_at <= now() - make_interval(days => p_rate_limit_retention_days);
  get diagnostics deleted_rate_limits = row_count;

  return jsonb_build_object(
    'deleted_submission_meta', deleted_submission_meta,
    'deleted_rate_limits', deleted_rate_limits
  );
end;
$$;

revoke all on function public.cleanup_dictionary_retention(integer)
  from public, anon, authenticated;
grant execute on function public.cleanup_dictionary_retention(integer)
  to service_role;

-- Staff moderation is deliberately authenticated-session only. The helper
-- checks both the editor/admin profile and the aal2 claim in the user's JWT.
create or replace function public.moderate_dictionary_entry(
  p_entry_id uuid,
  p_expected_content_version integer,
  p_action text,
  p_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  item public.dictionary_entries%rowtype;
  target_status public.dictionary_status;
begin
  if not public.is_staff_aal2() then
    raise exception 'staff_aal2_required' using errcode = '42501';
  end if;
  if p_expected_content_version is null or p_expected_content_version < 1 then
    raise exception 'invalid_dictionary_content_version' using errcode = '22023';
  end if;
  if p_note is not null and char_length(btrim(p_note)) > 1000 then
    raise exception 'dictionary_note_too_long' using errcode = '22023';
  end if;

  select * into item
  from public.dictionary_entries
  where id = p_entry_id
  for update;

  if not found then
    raise exception 'dictionary_entry_not_found' using errcode = 'P0002';
  end if;
  if item.content_version <> p_expected_content_version then
    raise exception 'dictionary_content_version_conflict' using errcode = '40001';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(item.normalized_key, 1));

  case p_action
    when 'review' then
      if item.status <> 'pending' then
        raise exception 'invalid_dictionary_transition' using errcode = '22023';
      end if;
      target_status := 'in_review';
    when 'publish' then
      if item.status not in ('pending', 'in_review') then
        raise exception 'invalid_dictionary_transition' using errcode = '22023';
      end if;
      if exists (
        select 1
        from public.dictionary_entries other
        where
          other.normalized_key = item.normalized_key
          and other.status = 'published'
          and other.id <> item.id
      ) then
        raise exception 'duplicate_published_dictionary_key' using errcode = '23505';
      end if;
      target_status := 'published';
    when 'reject' then
      if item.status not in ('pending', 'in_review') then
        raise exception 'invalid_dictionary_transition' using errcode = '22023';
      end if;
      if p_note is null or char_length(btrim(p_note)) < 3 then
        raise exception 'dictionary_rejection_note_required' using errcode = '22023';
      end if;
      target_status := 'rejected';
    when 'unpublish' then
      if item.status <> 'published' then
        raise exception 'invalid_dictionary_transition' using errcode = '22023';
      end if;
      if p_note is null or char_length(btrim(p_note)) < 3 then
        raise exception 'dictionary_unpublish_note_required' using errcode = '22023';
      end if;
      target_status := 'rejected';
    else
      raise exception 'unknown_dictionary_action' using errcode = '22023';
  end case;

  update public.dictionary_entries
  set
    status = target_status,
    reviewed_by = auth.uid(),
    reviewed_at = now(),
    published_at = case when target_status = 'published' then now() else null end
  where id = item.id;

  insert into public.dictionary_moderation_events (
    entry_id, actor_id, action, from_status, to_status, note
  ) values (
    item.id,
    auth.uid(),
    p_action,
    item.status,
    target_status,
    nullif(btrim(p_note), '')
  );

  return jsonb_build_object(
    'entry_id', item.id,
    'status', target_status::text,
    'content_version', item.content_version
  );
end;
$$;

revoke all on function public.moderate_dictionary_entry(uuid, integer, text, text)
  from public, anon;
grant execute on function public.moderate_dictionary_entry(uuid, integer, text, text)
  to authenticated;

alter table public.dictionary_entries enable row level security;
alter table public.dictionary_submission_meta enable row level security;
alter table public.dictionary_submission_rate_limits enable row level security;
alter table public.dictionary_moderation_events enable row level security;

drop policy if exists dictionary_entries_staff_aal2_read on public.dictionary_entries;
create policy dictionary_entries_staff_aal2_read on public.dictionary_entries
  for select to authenticated
  using (public.is_staff_aal2());

drop policy if exists dictionary_moderation_events_staff_aal2_read
  on public.dictionary_moderation_events;
create policy dictionary_moderation_events_staff_aal2_read
  on public.dictionary_moderation_events
  for select to authenticated
  using (public.is_staff_aal2());

-- There are deliberately no anon/authenticated policies for base-table writes,
-- private submission metadata, or the rate-limit table.
grant usage on schema public to anon, authenticated;
revoke all on public.dictionary_entries from public, anon, authenticated;
grant select on public.dictionary_entries to authenticated;
revoke all on public.published_dictionary_entries from public, anon, authenticated;
grant select on public.published_dictionary_entries to anon, authenticated;
revoke all on public.dictionary_submission_meta from public, anon, authenticated;
revoke all on public.dictionary_submission_rate_limits from public, anon, authenticated;
revoke all on public.dictionary_moderation_events from public, anon, authenticated;
grant select on public.dictionary_moderation_events to authenticated;

grant all on public.dictionary_entries,
  public.dictionary_submission_meta,
  public.dictionary_submission_rate_limits,
  public.dictionary_moderation_events
  to service_role;
grant select on public.published_dictionary_entries to service_role;
grant usage, select on sequence public.dictionary_moderation_events_id_seq to service_role;
