-- Expand the garage without changing the four existing vehicle rules.
begin;
alter table public.cukur_rallisi_runs drop constraint if exists cukur_rallisi_runs_vehicle_id_check;
alter table public.cukur_rallisi_runs add constraint cukur_rallisi_runs_vehicle_id_check check (vehicle_id in ('ada','aile','gecit','mesarya','simsek'));
create or replace function public.begin_cukur_rallisi_v4(p_nickname text,p_seed bigint,p_fingerprint text,p_vehicle text,p_garage_id uuid)
returns uuid language plpgsql security definer set search_path = '' as $$
declare run_id uuid; earned bigint; required_points integer;
begin
 if p_garage_id is null then raise exception 'invalid_garage'; end if;
 required_points := case p_vehicle when 'ada' then 0 when 'aile' then 0 when 'gecit' then 1800 when 'mesarya' then 5000 when 'simsek' then 9000 else null end;
 if required_points is null then raise exception 'invalid_vehicle'; end if;
 insert into public.cukur_rallisi_garages(id) values(p_garage_id) on conflict do nothing;
 select points into earned from public.cukur_rallisi_garages where id=p_garage_id;
 if earned < required_points then raise exception 'vehicle_locked'; end if;
 run_id := public.begin_cukur_rallisi(p_nickname,p_seed,p_fingerprint);
 update public.cukur_rallisi_runs set version=4,vehicle_id=p_vehicle,garage_id=p_garage_id where id=run_id;
 return run_id;
end;
$$;
revoke all on function public.begin_cukur_rallisi_v4(text,bigint,text,text,uuid) from public,anon,authenticated;
grant execute on function public.begin_cukur_rallisi_v4(text,bigint,text,text,uuid) to service_role;
notify pgrst,'reload schema';
commit;
