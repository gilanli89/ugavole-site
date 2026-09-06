-- Road season 03: preserve v2/v3 runs and scores; v4 has seeded encounters and expenses.
begin;
create or replace function public.begin_cukur_rallisi_v4(p_nickname text,p_seed bigint,p_fingerprint text,p_vehicle text,p_garage_id uuid)
returns uuid language plpgsql security definer set search_path = '' as $$
declare run_id uuid;
begin
 run_id := public.begin_cukur_rallisi_v3(p_nickname,p_seed,p_fingerprint,p_vehicle,p_garage_id);
 update public.cukur_rallisi_runs set version=4 where id=run_id;
 return run_id;
end;
$$;
revoke all on function public.begin_cukur_rallisi_v4(text,bigint,text,text,uuid) from public,anon,authenticated;
grant execute on function public.begin_cukur_rallisi_v4(text,bigint,text,text,uuid) to service_role;
create or replace function public.finish_cukur_rallisi_v4(p_run_id uuid,p_garage_id uuid,p_score integer,p_distance numeric,p_won boolean,p_frames integer)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare r public.cukur_rallisi_runs%rowtype; earned bigint;
begin
 select * into r from public.cukur_rallisi_runs where id=p_run_id for update;
 if not found or r.version<>4 or r.garage_id is distinct from p_garage_id then raise exception 'invalid_run'; end if;
 if r.score is null then
   update public.cukur_rallisi_runs set score=p_score,distance=p_distance,won=p_won,frames=p_frames,finished_at=now() where id=p_run_id;
   update public.cukur_rallisi_garages set points=points+p_score where id=p_garage_id;
 end if;
 select points into earned from public.cukur_rallisi_garages where id=p_garage_id;
 return jsonb_build_object('saved',true,'score',coalesce(r.score,p_score),'points',earned);
end;
$$;
revoke all on function public.finish_cukur_rallisi_v4(uuid,uuid,integer,numeric,boolean,integer) from public,anon,authenticated;
grant execute on function public.finish_cukur_rallisi_v4(uuid,uuid,integer,numeric,boolean,integer) to service_role;
create or replace view public.cukur_rallisi_leaderboard with (security_invoker = true) as
select nickname,score,distance,won,finished_at from (
 select nickname,score,distance,won,finished_at,row_number() over(partition by lower(nickname) order by score desc,finished_at asc) as player_rank
 from public.cukur_rallisi_runs where score>0 and version in (3,4)
) best where player_rank=1;
revoke all on public.cukur_rallisi_leaderboard from public,anon,authenticated;
grant select on public.cukur_rallisi_leaderboard to service_role;
notify pgrst,'reload schema';
commit;
