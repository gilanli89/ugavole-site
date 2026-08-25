-- Atomic editor publish transition with optional same-transaction social enqueue.
-- Depends on 001_content_kernel.sql and 002_social_outbox.sql.

drop function if exists public.publish_content_with_social(
  uuid, integer, boolean, boolean, uuid, public.social_platform[], jsonb
);
create or replace function public.publish_content_with_social(
  p_content_id uuid,
  p_expected_content_version integer,
  p_ad_eligible boolean,
  p_social_ready boolean,
  p_actor_id uuid default null,
  p_platforms public.social_platform[] default null,
  p_captions jsonb default '{}'::jsonb,
  p_media_sha256 text default null
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_actor uuid;
  v_content public.content_items%rowtype;
  v_jobs jsonb := '[]'::jsonb;
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
  if p_ad_eligible is null or p_social_ready is null then
    raise exception 'explicit_publish_flags_required' using errcode = '22023';
  end if;
  if p_social_ready and not p_ad_eligible then
    raise exception 'social_requires_ad_eligible_content' using errcode = '22023';
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
  if v_content.status::text <> 'approved' then
    raise exception 'content_must_be_approved' using errcode = '22023';
  end if;
  if v_content.origin::text = 'ugc' and (
    v_content.rights_confirmed_at is null
    or nullif(btrim(v_content.privacy_consent_version), '') is null
  ) then
    raise exception 'ugc_rights_and_privacy_confirmation_required' using errcode = '22023';
  end if;
  if p_social_ready and nullif(v_content.cover_image_url, '') is not null
     and coalesce(p_media_sha256, '') !~ '^[a-f0-9]{64}$' then
    raise exception 'approved_media_sha256_required' using errcode = '22023';
  end if;

  update public.content_items
  set
    status = 'published',
    ad_status = case
      when p_ad_eligible then 'eligible'::public.ad_status
      else 'off'::public.ad_status
    end,
    social_status = case
      when p_social_ready then 'ready'::public.social_status
      else 'off'::public.social_status
    end,
    reviewed_by = v_actor,
    reviewed_at = now(),
    published_at = now()
  where id = v_content.id;

  insert into public.moderation_events (
    content_id, actor_id, action, from_status, to_status, note
  ) values (
    v_content.id,
    v_actor,
    'publish',
    v_content.status,
    'published',
    format(
      'ad_eligible=%s; social_ready=%s',
      p_ad_eligible::text,
      p_social_ready::text
    )
  );

  if p_social_ready then
    select coalesce(
      jsonb_agg(to_jsonb(enqueued) order by enqueued.queued_platform::text),
      '[]'::jsonb
    ) into v_jobs
    from public.enqueue_social_outbox(
      v_content.id,
      v_content.content_version,
      v_actor,
      p_platforms,
      p_captions,
      p_media_sha256
    ) enqueued;
  end if;

  return jsonb_build_object(
    'content_id', v_content.id,
    'content_version', v_content.content_version,
    'status', 'published',
    'ad_status', case when p_ad_eligible then 'eligible' else 'off' end,
    'social_status', case when p_social_ready then 'ready' else 'off' end,
    'jobs', v_jobs
  );
end;
$$;

revoke all on function public.publish_content_with_social(
  uuid, integer, boolean, boolean, uuid, public.social_platform[], jsonb, text
) from public, anon;
grant execute on function public.publish_content_with_social(
  uuid, integer, boolean, boolean, uuid, public.social_platform[], jsonb, text
) to authenticated, service_role;
