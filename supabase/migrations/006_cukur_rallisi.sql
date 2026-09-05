-- Only the game API may write runs; the public API exposes the top scores only.
begin;
create table if not exists public.cukur_rallisi_runs (
  id uuid primary key default gen_random_uuid(),
  nickname text not null check (char_length(nickname) between 2 and 20),
  seed bigint not null check (seed between 0 and 4294967295),
  version integer not null default 2,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  score integer check (score between 0 and 100000),
  distance numeric(5,2) check (distance between 0 and 30),
  won boolean,
  frames integer check (frames between 1 and 72000)
);
create index if not exists cukur_scores_idx on public.cukur_rallisi_runs (score desc, finished_at asc) where score > 0;
create index if not exists cukur_runs_started_idx on public.cukur_rallisi_runs (started_at) where finished_at is null;
create table if not exists public.cukur_rallisi_rate_limits (
  fingerprint text primary key,
  window_started_at timestamptz not null default now(),
  hits integer not null default 1
);
alter table public.cukur_rallisi_runs enable row level security;
alter table public.cukur_rallisi_rate_limits enable row level security;
revoke all on public.cukur_rallisi_runs, public.cukur_rallisi_rate_limits from public, anon, authenticated;
grant all on public.cukur_rallisi_runs, public.cukur_rallisi_rate_limits to service_role;
create or replace function public.begin_cukur_rallisi(p_nickname text, p_seed bigint, p_fingerprint text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare run_id uuid; total_hits integer;
begin
  if p_fingerprint is null or length(p_fingerprint) <> 64 then raise exception 'invalid_fingerprint'; end if;
  insert into public.cukur_rallisi_rate_limits as r (fingerprint) values (p_fingerprint)
  on conflict (fingerprint) do update set
    hits = case when r.window_started_at < now() - interval '1 hour' then 1 else r.hits + 1 end,
    window_started_at = case when r.window_started_at < now() - interval '1 hour' then now() else r.window_started_at end
  returning hits into total_hits;
  if total_hits > 60 then raise exception 'game_rate_limit'; end if;
  delete from public.cukur_rallisi_runs where finished_at is null and started_at < now() - interval '1 day';
  delete from public.cukur_rallisi_rate_limits where window_started_at < now() - interval '2 days';
  insert into public.cukur_rallisi_runs (nickname, seed) values (p_nickname, p_seed) returning id into run_id;
  return run_id;
end;
$$;
revoke all on function public.begin_cukur_rallisi(text,bigint,text) from public, anon, authenticated;
grant execute on function public.begin_cukur_rallisi(text,bigint,text) to service_role;
create or replace view public.cukur_rallisi_leaderboard with (security_invoker = true) as
select nickname, score, distance, won, finished_at
from (
  select nickname, score, distance, won, finished_at,
    row_number() over (partition by lower(nickname) order by score desc, finished_at asc) as player_rank
  from public.cukur_rallisi_runs where score > 0 and version = 2
) best where player_rank = 1;
revoke all on public.cukur_rallisi_leaderboard from public, anon, authenticated;
grant select on public.cukur_rallisi_leaderboard to service_role;
notify pgrst, 'reload schema';
commit;
