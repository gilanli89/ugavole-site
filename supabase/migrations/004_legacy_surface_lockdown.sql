-- Legacy public content widgets are read-only until their writes move behind
-- authenticated, rate-limited server endpoints. Feedback is different: its
-- free-text message and optional email are private staff data, not public
-- content, so its SELECT surface is restricted to AAL2 staff as well.

do $$
declare
  legacy_table text;
begin
  foreach legacy_table in array array[
    'gorusler',
    'gunbatimi_fotolar',
    'liste_icerikler',
    'liste_maddeler'
  ]
  loop
    if to_regclass(format('public.%I', legacy_table)) is not null then
      execute format(
        'revoke insert, update, delete on table public.%I from public, anon, authenticated',
        legacy_table
      );
    end if;
  end loop;
end
$$;

do $$
declare
  legacy_policy text;
begin
  if to_regclass('public.gunbatimi_fotolar') is not null then
    execute 'alter table public.gunbatimi_fotolar enable row level security';

    -- Pending submissions previously shared the same table as the public
    -- gallery. Replace every permissive legacy policy so only approved rows
    -- remain public while AAL2 staff can still inspect the full history.
    for legacy_policy in
      select policyname
      from pg_catalog.pg_policies
      where schemaname = 'public' and tablename = 'gunbatimi_fotolar'
    loop
      execute format('drop policy %I on public.gunbatimi_fotolar', legacy_policy);
    end loop;

    execute $policy$
      create policy gunbatimi_public_approved_read on public.gunbatimi_fotolar
      for select to anon
      using (aktif is true)
    $policy$;
    execute $policy$
      create policy gunbatimi_authenticated_approved_or_staff_read on public.gunbatimi_fotolar
      for select to authenticated
      using (aktif is true or public.is_staff_aal2())
    $policy$;
    execute 'revoke all on table public.gunbatimi_fotolar from public, anon, authenticated';
    execute 'grant select on table public.gunbatimi_fotolar to anon, authenticated';
  end if;
end
$$;

do $$
begin
  -- The old browser uploader used a public bucket. All application uploads are
  -- now disabled; approved legacy images are served through a checked server
  -- route. Keeping the bucket private prevents direct access to pending files.
  if to_regclass('storage.objects') is not null then
    execute 'revoke select, insert, update, delete on table storage.objects from public, anon, authenticated';
  end if;
  if to_regclass('storage.buckets') is not null then
    update storage.buckets
    set public = false
    where id = 'sunset-photos';
    execute 'revoke insert, update, delete on table storage.buckets from public, anon, authenticated';
  end if;
end
$$;

do $$
declare
  legacy_policy text;
begin
  if to_regclass('public.gorusler') is not null then
    execute 'alter table public.gorusler enable row level security';

    -- PostgreSQL combines permissive policies with OR. Remove every legacy
    -- policy first so an older public/authenticated SELECT or ALL policy cannot
    -- bypass the AAL2 gate added below.
    for legacy_policy in
      select policyname
      from pg_catalog.pg_policies
      where schemaname = 'public' and tablename = 'gorusler'
    loop
      execute format('drop policy %I on public.gorusler', legacy_policy);
    end loop;

    execute $policy$
      create policy gorusler_staff_aal2_read on public.gorusler
      for select to authenticated
      using (public.is_staff_aal2())
    $policy$;
    execute 'revoke all on table public.gorusler from public, anon, authenticated';
    execute 'grant select on table public.gorusler to authenticated';
  end if;
end
$$;
