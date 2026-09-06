-- Add a new road season without deleting v2 scores or interrupting active v2 runs.
begin;
create table if not exists public.cukur_rallisi_garages (
 id uuid primary key,
 points bigint not null default 0 check (points >= 0),
 created_at timestamptz not null default now()
);
alter table public.cukur_rallisi_garages enable row level security;
revoke all on public.cukur_rallisi_garages from public, anon, authenticated;
grant all on public.cukur_rallisi_garages to service_role;
alter table public.cukur_rallisi_runs add column if not exists vehicle_id text not null default 'ada' check (vehicle_id in ('ada','aile','gecit','mesarya'));
alter table public.cukur_rallisi_runs add column if not exists garage_id uuid references public.cukur_rallisi_garages(id);
create or replace function public.begin_cukur_rallisi_v3(p_nickname text,p_seed bigint,p_fingerprint text,p_vehicle text,p_garage_id uuid)
returns uuid language plpgsql security definer set search_path = '' as $$
declare run_id uuid; earned bigint; required_points integer;
begin
 if p_garage_id is null then raise exception 'invalid_garage'; end if;
 required_points := case p_vehicle when 'ada' then 0 when 'aile' then 0 when 'gecit' then 1800 when 'mesarya' then 5000 else null end;
 if required_points is null then raise exception 'invalid_vehicle'; end if;
 insert into public.cukur_rallisi_garages(id) values(p_garage_id) on conflict do nothing;
 select points into earned from public.cukur_rallisi_garages where id=p_garage_id;
 if earned < required_points then raise exception 'vehicle_locked'; end if;
 run_id := public.begin_cukur_rallisi(p_nickname,p_seed,p_fingerprint);
 update public.cukur_rallisi_runs set version=3,vehicle_id=p_vehicle,garage_id=p_garage_id where id=run_id;
 return run_id;
end;
$$;
revoke all on function public.begin_cukur_rallisi_v3(text,bigint,text,text,uuid) from public,anon,authenticated;
grant execute on function public.begin_cukur_rallisi_v3(text,bigint,text,text,uuid) to service_role;
-- Lock the run before awarding points: retries/concurrent requests award exactly once.
create or replace function public.finish_cukur_rallisi_v3(p_run_id uuid,p_garage_id uuid,p_score integer,p_distance numeric,p_won boolean,p_frames integer)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare r public.cukur_rallisi_runs%rowtype; earned bigint;
begin
 select * into r from public.cukur_rallisi_runs where id=p_run_id for update;
 if not found or r.version<>3 or r.garage_id is distinct from p_garage_id then raise exception 'invalid_run'; end if;
 if r.score is null then
   update public.cukur_rallisi_runs set score=p_score,distance=p_distance,won=p_won,frames=p_frames,finished_at=now() where id=p_run_id;
   update public.cukur_rallisi_garages set points=points+p_score where id=p_garage_id;
 end if;
 select points into earned from public.cukur_rallisi_garages where id=p_garage_id;
 return jsonb_build_object('saved',true,'score',coalesce(r.score,p_score),'points',earned);
end;
$$;
revoke all on function public.finish_cukur_rallisi_v3(uuid,uuid,integer,numeric,boolean,integer) from public,anon,authenticated;
grant execute on function public.finish_cukur_rallisi_v3(uuid,uuid,integer,numeric,boolean,integer) to service_role;
create or replace view public.cukur_rallisi_leaderboard with (security_invoker = true) as
select nickname,score,distance,won,finished_at from (
 select nickname,score,distance,won,finished_at,row_number() over(partition by lower(nickname) order by score desc,finished_at asc) as player_rank
 from public.cukur_rallisi_runs where score>0 and version=3
) best where player_rank=1;
revoke all on public.cukur_rallisi_leaderboard from public,anon,authenticated;
grant select on public.cukur_rallisi_leaderboard to service_role;
notify pgrst,'reload schema';
commit;
