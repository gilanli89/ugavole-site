-- Run only against an isolated database after migrations 001, 002 and 003.
-- Every fixture is rolled back.
begin;

do $$
declare
  v_actor constant uuid := '10000000-0000-4000-8000-000000000001';
  v_content constant uuid := '20000000-0000-4000-8000-000000000001';
  v_media_sha256 constant text := repeat('a', 64);
  v_job uuid;
  v_lease uuid;
  v_inserted boolean;
  v_status public.social_outbox_status;
begin
  insert into auth.users (id, raw_user_meta_data)
  values (v_actor, '{"display_name":"Smoke Editor"}'::jsonb);
  update public.profiles set role = 'editor' where id = v_actor;

  insert into public.content_items (
    id, slug, title, excerpt, cover_image_url, status, ad_status, social_status,
    content_version
  ) values (
    v_content, 'social-outbox-smoke', 'Social outbox smoke article', 'Smoke excerpt',
    'https://ugavole.com/media/social-outbox-smoke.jpg',
    'approved', 'off', 'off', 1
  );

  update public.social_accounts
  set
    enabled = true,
    target_account_id = 'facebook-page-smoke',
    api_version = 'v99.0',
    config_fingerprint = md5('facebook-page-smoke')
  where platform = 'facebook';

  perform set_config('request.jwt.claim.role', 'authenticated', true);
  perform set_config('request.jwt.claim.sub', v_actor::text, true);
  perform set_config(
    'request.jwt.claims',
    jsonb_build_object('role', 'authenticated', 'sub', v_actor, 'aal', 'aal2')::text,
    true
  );

  perform public.publish_content_with_social(
    v_content,
    1,
    true,
    true,
    null,
    array['facebook']::public.social_platform[],
    '{"facebook":"Smoke caption"}'::jsonb,
    v_media_sha256
  );
  select id into v_job
  from public.social_outbox
  where content_id = v_content and platform = 'facebook';
  v_inserted := v_job is not null;
  if v_job is null or not v_inserted then
    raise exception 'atomic publish did not enqueue';
  end if;
  if not exists (
    select 1 from public.social_outbox
    where id = v_job and payload #>> '{media,sha256}' = v_media_sha256
  ) then
    raise exception 'approval-time media hash was not snapshotted';
  end if;

  if not exists (
    select 1 from public.content_items
    where id = v_content
      and status = 'published'
      and ad_status = 'eligible'
      and social_status = 'ready'
  ) then
    raise exception 'atomic publish state transition failed';
  end if;

  select result.inserted into v_inserted
  from public.enqueue_social_outbox(
    v_content,
    1,
    null,
    array['facebook']::public.social_platform[],
    '{"facebook":"Smoke caption"}'::jsonb,
    v_media_sha256
  ) result;
  if v_inserted then
    raise exception 'duplicate enqueue bypassed idempotency';
  end if;
  select result.inserted into v_inserted
  from public.enqueue_social_outbox(
    v_content,
    1,
    null,
    array['facebook']::public.social_platform[],
    '{"facebook":"Changed caption must not create a second revision job"}'::jsonb,
    v_media_sha256
  ) result;
  if v_inserted then
    raise exception 'changed caption bypassed revision/account idempotency';
  end if;

  perform set_config('request.jwt.claim.role', 'service_role', true);
  select claimed.lease_token into v_lease
  from public.claim_social_outbox('db-smoke-worker', 1, 600) claimed
  where claimed.id = v_job;
  if v_lease is null then
    raise exception 'job was not claimed';
  end if;

  if public.mark_social_publication_started(v_job, v_lease, '{}'::jsonb) <> 'started' then
    raise exception 'publish-start marker failed';
  end if;

  begin
    update public.content_items
    set title = 'Changed during public mutation'
    where id = v_content;
    raise exception 'in-flight content snapshot mutation unexpectedly succeeded';
  exception
    when sqlstate '55000' then
      if sqlerrm <> 'social_publication_in_flight' then
        raise;
      end if;
  end;

  begin
    update public.social_accounts
    set target_account_id = 'different-facebook-page'
    where platform = 'facebook';
    raise exception 'in-flight destination mutation unexpectedly succeeded';
  exception
    when sqlstate '55000' then
      if sqlerrm <> 'social_destination_publication_in_flight' then
        raise;
      end if;
  end;

  update public.social_outbox
  set leased_until = now() - interval '1 second'
  where id = v_job;
  perform public.claim_social_outbox('db-smoke-recovery', 1, 600);

  select status into v_status from public.social_outbox where id = v_job;
  if v_status <> 'ambiguous' then
    raise exception 'expired post-mutation lease replayed instead of becoming ambiguous';
  end if;
end;
$$;

do $$
declare
  v_actor constant uuid := '10000000-0000-4000-8000-000000000001';
  v_content constant uuid := '20000000-0000-4000-8000-000000000003';
  v_job uuid;
  v_lease uuid;
  v_worker_runs integer;
  v_status public.social_outbox_status;
begin
  insert into public.content_items (
    id, slug, title, excerpt, status, ad_status, social_status,
    content_version, published_at
  ) values (
    v_content, 'x-credential-defer-smoke', 'X credential defer smoke article',
    'Smoke excerpt', 'published', 'eligible', 'ready', 1, now()
  );
  update public.social_accounts
  set
    enabled = true,
    target_account_id = 'x-user-smoke',
    api_version = '2',
    config_fingerprint = md5('x-user-smoke'),
    posting_cap = 10,
    cost_notice = 'Smoke-only cap'
  where platform = 'x';

  perform set_config('request.jwt.claim.role', 'authenticated', true);
  perform set_config('request.jwt.claim.sub', v_actor::text, true);
  perform set_config(
    'request.jwt.claims',
    jsonb_build_object('role', 'authenticated', 'sub', v_actor, 'aal', 'aal2')::text,
    true
  );
  select result.job_id into v_job
  from public.enqueue_social_outbox(
    v_content,
    1,
    null,
    array['x']::public.social_platform[],
    '{}'::jsonb,
    null
  ) result;

  perform set_config('request.jwt.claim.role', 'service_role', true);
  select claimed.lease_token into v_lease
  from public.claim_social_outbox('credential-defer-smoke', 1, 600) claimed
  where claimed.id = v_job;
  if v_lease is null then
    raise exception 'credential defer job was not claimed';
  end if;
  if not public.finish_social_outbox_job(
    p_job_id => v_job,
    p_lease_token => v_lease,
    p_outcome => 'retry',
    p_error_code => 'access_token_expired_or_imminent',
    p_error_message => 'Smoke credential refresh wait',
    p_retry_after_seconds => 900
  ) then
    raise exception 'credential defer outcome was not persisted';
  end if;

  select status, worker_run_count into v_status, v_worker_runs
  from public.social_outbox where id = v_job;
  if v_status <> 'retry' or v_worker_runs <> 0 then
    raise exception 'credential wait cancelled or exhausted the worker budget';
  end if;
end;
$$;

do $$
declare
  v_actor constant uuid := '10000000-0000-4000-8000-000000000001';
  v_content constant uuid := '20000000-0000-4000-8000-000000000005';
  v_job uuid;
  v_lease uuid;
  v_status public.social_outbox_status;
begin
  insert into public.content_items (
    id, slug, title, excerpt, status, ad_status, social_status,
    content_version, published_at
  ) values (
    v_content, 'post-mutation-retry-smoke',
    'Post mutation retry smoke article', 'Smoke excerpt',
    'published', 'eligible', 'ready', 1, now()
  );
  perform set_config('request.jwt.claim.role', 'authenticated', true);
  perform set_config('request.jwt.claim.sub', v_actor::text, true);
  perform set_config(
    'request.jwt.claims',
    jsonb_build_object('role', 'authenticated', 'sub', v_actor, 'aal', 'aal2')::text,
    true
  );
  select result.job_id into v_job
  from public.enqueue_social_outbox(
    v_content,
    1,
    null,
    array['facebook']::public.social_platform[],
    '{}'::jsonb,
    null
  ) result;

  perform set_config('request.jwt.claim.role', 'service_role', true);
  select claimed.lease_token into v_lease
  from public.claim_social_outbox('post-mutation-retry-smoke', 1, 600) claimed
  where claimed.id = v_job;
  if v_lease is null
     or public.mark_social_publication_started(v_job, v_lease, '{}'::jsonb) <> 'started' then
    raise exception 'post-mutation retry smoke marker failed';
  end if;
  if not public.finish_social_outbox_job(
    p_job_id => v_job,
    p_lease_token => v_lease,
    p_outcome => 'retry',
    p_error_code => 'facebook_publish_failed',
    p_error_message => 'Simulated HTTP 429 after mutation marker',
    p_http_status => 429,
    p_retry_after_seconds => 60
  ) then
    raise exception 'post-mutation retry smoke outcome was not persisted';
  end if;
  select status into v_status from public.social_outbox where id = v_job;
  if v_status <> 'ambiguous' then
    raise exception 'post-mutation non-success was automatically replayable';
  end if;
end;
$$;

-- Simulate a legacy/inconsistent row to prove the publish RPC independently
-- fails closed even if the base-table UGC check is temporarily absent.
alter table public.content_items
  drop constraint content_ugc_approval_gate;

do $$
declare
  v_actor constant uuid := '10000000-0000-4000-8000-000000000001';
  v_content constant uuid := '20000000-0000-4000-8000-000000000002';
begin
  insert into public.content_items (
    id, slug, origin, title, excerpt, status, ad_status, social_status,
    content_version
  ) values (
    v_content, 'ugc-rights-gate-smoke', 'ugc',
    'UGC rights gate smoke article', 'Smoke excerpt',
    'approved', 'off', 'off', 1
  );

  perform set_config('request.jwt.claim.role', 'authenticated', true);
  perform set_config('request.jwt.claim.sub', v_actor::text, true);
  perform set_config(
    'request.jwt.claims',
    jsonb_build_object('role', 'authenticated', 'sub', v_actor, 'aal', 'aal2')::text,
    true
  );

  begin
    perform public.publish_content_with_social(
      v_content,
      1,
      true,
      true,
      null,
      array['facebook']::public.social_platform[],
      '{}'::jsonb
    );
    raise exception 'UGC without rights/privacy was published';
  exception
    when sqlstate '22023' then
      if sqlerrm <> 'ugc_rights_and_privacy_confirmation_required' then
        raise;
      end if;
  end;

  if exists (
    select 1 from public.content_items
    where id = v_content and status = 'published'
  ) or exists (
    select 1 from public.social_outbox where content_id = v_content
  ) then
    raise exception 'UGC rights gate allowed state or outbox mutation';
  end if;

  -- Defense in depth: even an inconsistent legacy row cannot bypass the same
  -- rights/privacy gate by calling enqueue directly.
  update public.content_items
  set
    status = 'published',
    ad_status = 'eligible',
    social_status = 'ready',
    published_at = now()
  where id = v_content;
  begin
    perform public.enqueue_social_outbox(
      v_content,
      1,
      null,
      array['facebook']::public.social_platform[],
      '{}'::jsonb
    );
    raise exception 'UGC without rights/privacy was directly enqueued';
  exception
    when sqlstate '22023' then
      if sqlerrm <> 'ugc_rights_and_privacy_confirmation_required' then
        raise;
      end if;
  end;
  if exists (
    select 1 from public.social_outbox where content_id = v_content
  ) then
    raise exception 'direct UGC enqueue gate allowed an outbox mutation';
  end if;
end;
$$;

do $$
begin
  if has_table_privilege('anon', 'public.social_outbox', 'select') then
    raise exception 'anon unexpectedly has social_outbox select privilege';
  end if;
  if has_table_privilege('authenticated', 'public.social_outbox', 'insert') then
    raise exception 'authenticated unexpectedly has social_outbox insert privilege';
  end if;
  if has_table_privilege('authenticated', 'public.content_items', 'update') then
    raise exception 'authenticated unexpectedly has direct content update privilege';
  end if;
  if not has_table_privilege('authenticated', 'public.social_outbox', 'select') then
    raise exception 'authenticated staff queue read grant is missing';
  end if;
  if has_function_privilege(
    'anon',
    'public.enqueue_social_outbox(uuid,integer,uuid,public.social_platform[],jsonb,text)',
    'execute'
  ) then
    raise exception 'anon unexpectedly has enqueue execute privilege';
  end if;
end;
$$;

insert into public.content_items (
  id, slug, title, excerpt, status, ad_status, social_status, content_version
) values (
  '20000000-0000-4000-8000-000000000004',
  'aal1-publish-denial-smoke',
  'AAL1 publish denial smoke article',
  'Smoke excerpt',
  'approved',
  'off',
  'off',
  1
);

set local role authenticated;
select set_config('request.jwt.claim.role', 'authenticated', true);
select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000001', true);
select set_config(
  'request.jwt.claims',
  '{"role":"authenticated","sub":"10000000-0000-4000-8000-000000000001","aal":"aal1"}',
  true
);
do $$
begin
  if (select count(*) from public.social_outbox) <> 0 then
    raise exception 'AAL1 staff unexpectedly passed social queue RLS';
  end if;
  begin
    perform public.enqueue_social_outbox(
      '20000000-0000-4000-8000-000000000001',
      1,
      null,
      array['facebook']::public.social_platform[],
      '{"facebook":"AAL1 must fail"}'::jsonb,
      repeat('a', 64)
    );
    raise exception 'AAL1 staff unexpectedly enqueued social content';
  exception
    when sqlstate '42501' then
      if sqlerrm <> 'staff_aal2_required' then
        raise;
      end if;
  end;
  begin
    perform public.publish_content_with_social(
      '20000000-0000-4000-8000-000000000004',
      1,
      true,
      false
    );
    raise exception 'AAL1 staff unexpectedly published content';
  exception
    when sqlstate '42501' then
      if sqlerrm <> 'staff_aal2_required' then
        raise;
      end if;
  end;
end;
$$;
reset role;

set local role authenticated;
select set_config('request.jwt.claim.role', 'authenticated', true);
select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000001', true);
select set_config(
  'request.jwt.claims',
  '{"role":"authenticated","sub":"10000000-0000-4000-8000-000000000001","aal":"aal2"}',
  true
);
do $$
begin
  if (select count(*) from public.social_outbox) < 1 then
    raise exception 'staff RLS read unexpectedly returned no jobs';
  end if;

  begin
    update public.content_items
    set social_status = 'ready'
    where id = '20000000-0000-4000-8000-000000000002';
    raise exception 'staff direct workflow update unexpectedly succeeded';
  exception
    when insufficient_privilege then null;
  end;
end;
$$;
reset role;

set local role anon;
do $$
begin
  begin
    perform 1 from public.social_outbox;
    raise exception 'anon social_outbox read unexpectedly succeeded';
  exception
    when insufficient_privilege then null;
  end;
end;
$$;
reset role;

rollback;
