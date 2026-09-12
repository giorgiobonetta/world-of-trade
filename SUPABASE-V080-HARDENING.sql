-- World of Trade — v0.8.x backend hardening
-- Safe to run after the base SUPABASE-SETUP.md blocks.
-- Run once in Supabase SQL Editor. Statements are written to be re-runnable.

begin;

-- ---------------------------------------------------------------------------
-- 1) League: normalize old column names and remove direct score writes.
-- ---------------------------------------------------------------------------
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='league_scores' and column_name='tier')
     and not exists (select 1 from information_schema.columns where table_schema='public' and table_name='league_scores' and column_name='division') then
    execute 'alter table public.league_scores rename column tier to division';
  end if;
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='league_scores' and column_name='score')
     and not exists (select 1 from information_schema.columns where table_schema='public' and table_name='league_scores' and column_name='weekly_xp') then
    execute 'alter table public.league_scores rename column score to weekly_xp';
  end if;
end $$;

alter table public.league_scores enable row level security;
drop policy if exists "league inserisce solo se stesso" on public.league_scores;
drop policy if exists "league aggiorna solo se stesso" on public.league_scores;
drop policy if exists "league insert own" on public.league_scores;
drop policy if exists "league update own" on public.league_scores;
revoke insert, update, delete on public.league_scores from anon, authenticated;
grant select on public.league_scores to anon, authenticated;

create or replace function public.sync_wot_league_score(
  p_week text,
  p_alias text,
  p_house text,
  p_division text,
  p_claimed_xp integer
)
returns table(week text, user_id uuid, alias text, house text, division text, weekly_xp integer, updated_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  st jsonb;
  total_xp integer := 0;
  start_xp integer := 0;
  state_week text := '';
  verified_xp integer := 0;
  clean_alias text;
  clean_division text;
begin
  if me is null then raise exception 'Not authenticated'; end if;
  if p_week is null or p_week !~ '^[0-9]{4}-W[0-9]{2}$' then raise exception 'Invalid league week'; end if;

  select p.state into st from public.progress p where p.user_id = me;
  if st is null then raise exception 'No progress state found'; end if;

  total_xp := greatest(0, coalesce((st->>'xp')::integer, 0));
  start_xp := greatest(0, coalesce((st#>>'{competitive,startXp}')::integer, total_xp));
  state_week := coalesce(st#>>'{competitive,week}', '');
  if state_week <> p_week then
    raise exception 'League week does not match saved career state';
  end if;
  verified_xp := greatest(0, total_xp - start_xp);

  -- The client claim is never authoritative. Reject rather than silently accept
  -- a larger figure than the score derivable from the saved career state.
  if coalesce(p_claimed_xp, verified_xp) <> verified_xp then
    raise exception 'League score does not match saved career state';
  end if;

  clean_alias := left(regexp_replace(coalesce(nullif(trim(p_alias),''),'Trader'), '[[:space:]]+', ' ', 'g'), 24);
  if char_length(clean_alias) < 3 then clean_alias := 'Trader'; end if;
  clean_division := lower(coalesce(nullif(trim(p_division),''),'bronze'));
  if clean_division not in ('bronze','silver','gold','platinum','diamond','master') then clean_division := 'bronze'; end if;

  insert into public.league_scores as ls(week,user_id,alias,house,division,weekly_xp,updated_at)
  values(p_week,me,clean_alias,nullif(left(trim(coalesce(p_house,'')),40),''),clean_division,verified_xp,now())
  on conflict (week,user_id) do update
     set alias=excluded.alias, house=excluded.house, division=excluded.division,
         weekly_xp=excluded.weekly_xp, updated_at=now();

  return query
    select ls.week,ls.user_id,ls.alias,ls.house,ls.division,ls.weekly_xp,ls.updated_at
    from public.league_scores ls where ls.week=p_week and ls.user_id=me;
end;
$$;
revoke all on function public.sync_wot_league_score(text,text,text,text,integer) from public;
grant execute on function public.sync_wot_league_score(text,text,text,text,integer) to authenticated;

-- ---------------------------------------------------------------------------
-- 2) Social profile exposure: base table is no longer globally SELECT-able.
--    Only an authenticated safe view is exposed for discovery.
-- ---------------------------------------------------------------------------
alter table public.social_profiles enable row level security;
drop policy if exists "social profiles leggibili" on public.social_profiles;
drop policy if exists "social profiles readable" on public.social_profiles;
revoke select on public.social_profiles from anon, authenticated;

drop view if exists public.public_social_profiles;
create view public.public_social_profiles
with (security_invoker = false)
as
  select alias, house, trader_tag
  from public.social_profiles
  where trader_tag is not null;

revoke all on public.public_social_profiles from public;
revoke all on public.public_social_profiles from anon;
grant select on public.public_social_profiles to authenticated;

create or replace function public.get_my_social_profile()
returns table(user_id uuid, alias text, house text, trader_tag text, referral_code text)
language sql
security definer
set search_path = public
stable
as $$
  select sp.user_id,sp.alias,sp.house,sp.trader_tag,sp.referral_code
  from public.social_profiles sp where sp.user_id=auth.uid();
$$;
revoke all on function public.get_my_social_profile() from public;
grant execute on function public.get_my_social_profile() to authenticated;

-- UUIDs are returned only for profiles that already have a private relationship
-- with the caller (friendship, request or challenge). General discovery never
-- exposes auth.users identifiers.
create or replace function public.get_wot_social_profiles(p_user_ids uuid[])
returns table(user_id uuid, alias text, house text, trader_tag text)
language sql
security definer
set search_path = public
stable
as $$
  select sp.user_id,sp.alias,sp.house,sp.trader_tag
  from public.social_profiles sp
  where auth.uid() is not null
    and sp.user_id = any(coalesce(p_user_ids, array[]::uuid[]))
    and (
      sp.user_id = auth.uid()
      or exists(
        select 1 from public.friendships f
        where (f.user_a=auth.uid() and f.user_b=sp.user_id)
           or (f.user_b=auth.uid() and f.user_a=sp.user_id)
      )
      or exists(
        select 1 from public.friend_requests r
        where (r.requester_id=auth.uid() and r.addressee_id=sp.user_id)
           or (r.addressee_id=auth.uid() and r.requester_id=sp.user_id)
      )
      or exists(
        select 1 from public.friend_challenges c
        where (c.challenger_id=auth.uid() and c.opponent_id=sp.user_id)
           or (c.opponent_id=auth.uid() and c.challenger_id=sp.user_id)
      )
    );
$$;
revoke all on function public.get_wot_social_profiles(uuid[]) from public;
grant execute on function public.get_wot_social_profiles(uuid[]) to authenticated;

-- The discovery RPC filters blocked relationships, so the table must exist
-- before PostgreSQL validates the function body. This early create also makes
-- the migration safe on installations that have never enabled blocking.
create table if not exists public.blocked_users (
  blocker_id uuid not null references auth.users(id) on delete cascade,
  blocked_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(blocker_id, blocked_id),
  check(blocker_id <> blocked_id)
);

create or replace function public.search_wot_traders(p_query text)
returns table(alias text, house text, trader_tag text, relation_status text)
language sql
security definer
set search_path = public
stable
as $$
  select sp.alias,sp.house,sp.trader_tag,
    case
      when exists(
        select 1 from public.friendships f
        where (f.user_a=auth.uid() and f.user_b=sp.user_id)
           or (f.user_b=auth.uid() and f.user_a=sp.user_id)
      ) then 'friends'
      when exists(
        select 1 from public.friend_requests r
        where r.status='pending' and r.requester_id=auth.uid() and r.addressee_id=sp.user_id
      ) then 'pending-out'
      when exists(
        select 1 from public.friend_requests r
        where r.status='pending' and r.addressee_id=auth.uid() and r.requester_id=sp.user_id
      ) then 'pending-in'
      else 'none'
    end as relation_status
  from public.social_profiles sp
  where auth.uid() is not null
    and sp.user_id <> auth.uid()
    and sp.trader_tag is not null
    and char_length(trim(coalesce(p_query,''))) between 2 and 40
    and (sp.trader_tag ilike '%'||trim(p_query)||'%' or sp.alias ilike '%'||trim(p_query)||'%')
    and not exists(
      select 1 from public.blocked_users b
      where (b.blocker_id=auth.uid() and b.blocked_id=sp.user_id)
         or (b.blocked_id=auth.uid() and b.blocker_id=sp.user_id)
    )
  order by
    case when lower(sp.trader_tag)=lower(trim(p_query)) then 0 else 1 end,
    sp.trader_tag
  limit 20;
$$;
revoke all on function public.search_wot_traders(text) from public;
grant execute on function public.search_wot_traders(text) to authenticated;

-- ---------------------------------------------------------------------------
-- 3) Blocks + 24h cooldown after a declined request.
-- ---------------------------------------------------------------------------
create table if not exists public.blocked_users (
  blocker_id uuid not null references auth.users(id) on delete cascade,
  blocked_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(blocker_id, blocked_id),
  check(blocker_id <> blocked_id)
);
alter table public.blocked_users enable row level security;
drop policy if exists "blocked own read" on public.blocked_users;
create policy "blocked own read" on public.blocked_users for select using(auth.uid()=blocker_id);
revoke insert,update,delete on public.blocked_users from anon,authenticated;
grant select on public.blocked_users to authenticated;

create or replace function public.block_wot_user(p_blocked uuid)
returns boolean
language plpgsql
security definer
set search_path=public
as $$
declare me uuid:=auth.uid(); a uuid; b uuid; k text;
begin
  if me is null or p_blocked is null or p_blocked=me then return false; end if;
  insert into public.blocked_users(blocker_id,blocked_id) values(me,p_blocked) on conflict do nothing;
  if me::text < p_blocked::text then a:=me;b:=p_blocked; else a:=p_blocked;b:=me; end if;
  k:=a::text||':'||b::text;
  delete from public.friendships where pair_key=k;
  delete from public.friend_requests where pair_key=k;
  return true;
end;
$$;
revoke all on function public.block_wot_user(uuid) from public;
grant execute on function public.block_wot_user(uuid) to authenticated;

create or replace function public.send_wot_friend_request(p_addressee uuid)
returns table(request_id uuid, request_status text)
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  a uuid; b uuid; key text; existing public.friend_requests%rowtype;
begin
  if me is null or p_addressee is null or me = p_addressee then return; end if;
  if not exists(select 1 from public.social_profiles where user_id=p_addressee) then return; end if;
  if exists(select 1 from public.blocked_users where (blocker_id=me and blocked_id=p_addressee) or (blocker_id=p_addressee and blocked_id=me)) then
    return query select null::uuid,'blocked'::text; return;
  end if;
  if me::text < p_addressee::text then a:=me;b:=p_addressee;else a:=p_addressee;b:=me;end if;
  key:=a::text||':'||b::text;
  if exists(select 1 from public.friendships f where f.pair_key=key) then
    return query select null::uuid,'already-friends'::text; return;
  end if;
  select * into existing from public.friend_requests where pair_key=key;
  if found and existing.status='pending' then
    return query select existing.id,existing.status; return;
  end if;
  if found and existing.status='declined' and coalesce(existing.responded_at,existing.created_at) > now()-interval '24 hours' then
    return query select existing.id,'cooldown'::text; return;
  end if;
  insert into public.friend_requests(pair_key,requester_id,addressee_id,status,created_at,responded_at)
  values(key,me,p_addressee,'pending',now(),null)
  on conflict(pair_key) do update set requester_id=excluded.requester_id,
    addressee_id=excluded.addressee_id,status='pending',created_at=now(),responded_at=null
  returning id,status into request_id,request_status;
  return next;
end;
$$;
revoke all on function public.send_wot_friend_request(uuid) from public;
grant execute on function public.send_wot_friend_request(uuid) to authenticated;


create or replace function public.send_wot_friend_request_by_tag(p_trader_tag text)
returns table(request_id uuid, request_status text)
language plpgsql
security definer
set search_path = public
as $$
declare target uuid;
begin
  if auth.uid() is null then return; end if;
  select sp.user_id into target from public.social_profiles sp
    where lower(sp.trader_tag)=lower(trim(coalesce(p_trader_tag,''))) limit 1;
  if target is null then return query select null::uuid,'not-found'::text; return; end if;
  return query select * from public.send_wot_friend_request(target);
end;
$$;
revoke all on function public.send_wot_friend_request_by_tag(text) from public;
grant execute on function public.send_wot_friend_request_by_tag(text) to authenticated;

create or replace function public.block_wot_trader_by_tag(p_trader_tag text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare target uuid;
begin
  if auth.uid() is null then return false; end if;
  select sp.user_id into target from public.social_profiles sp
    where lower(sp.trader_tag)=lower(trim(coalesce(p_trader_tag,''))) limit 1;
  if target is null then return false; end if;
  return public.block_wot_user(target);
end;
$$;
revoke all on function public.block_wot_trader_by_tag(text) from public;
grant execute on function public.block_wot_trader_by_tag(text) to authenticated;

-- ---------------------------------------------------------------------------
-- 4) Challenge results: clients cannot write the score table directly.
--    Server validates participant, expiry, total and computes score formula.
-- ---------------------------------------------------------------------------
drop policy if exists "score duel inseribile solo dal giocatore" on public.friend_challenge_scores;
drop policy if exists "challenge score insert own" on public.friend_challenge_scores;
revoke insert,update,delete on public.friend_challenge_scores from anon,authenticated;
grant select on public.friend_challenge_scores to authenticated;

create or replace function public.submit_wot_challenge_score(
  p_challenge_id uuid,
  p_correct integer,
  p_total integer default 10
)
returns table(challenge_id uuid,user_id uuid,score integer,correct integer,total integer,completed_at timestamptz)
language plpgsql
security definer
set search_path=public
as $$
declare me uuid:=auth.uid(); c public.friend_challenges%rowtype; points integer;
begin
  if me is null then raise exception 'Not authenticated'; end if;
  select * into c from public.friend_challenges where id=p_challenge_id;
  if c.id is null or (c.challenger_id<>me and c.opponent_id<>me) then raise exception 'Challenge unavailable'; end if;
  if now()>c.expires_at then raise exception 'Challenge expired'; end if;
  if p_total<>10 or p_correct<0 or p_correct>10 then raise exception 'Invalid challenge result'; end if;
  points:=p_correct*100;
  insert into public.friend_challenge_scores as s(challenge_id,user_id,score,correct,total,completed_at)
  values(c.id,me,points,p_correct,10,now())
  on conflict(challenge_id,user_id) do nothing;
  return query select s.challenge_id,s.user_id,s.score,s.correct,s.total,s.completed_at
    from public.friend_challenge_scores s where s.challenge_id=c.id and s.user_id=me;
end;
$$;
revoke all on function public.submit_wot_challenge_score(uuid,integer,integer) from public;
grant execute on function public.submit_wot_challenge_score(uuid,integer,integer) to authenticated;

-- ---------------------------------------------------------------------------
-- 5) Avatar Storage. The browser stores only an HTTPS URL in career state.
-- ---------------------------------------------------------------------------
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('avatars','avatars',true,1048576,array['image/webp'])
on conflict(id) do update set public=true,file_size_limit=1048576,allowed_mime_types=array['image/webp'];

drop policy if exists "avatar own insert" on storage.objects;
drop policy if exists "avatar own update" on storage.objects;
drop policy if exists "avatar own delete" on storage.objects;
create policy "avatar own insert" on storage.objects for insert to authenticated
  with check(bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "avatar own update" on storage.objects for update to authenticated
  using(bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text)
  with check(bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "avatar own delete" on storage.objects for delete to authenticated
  using(bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text);

-- ---------------------------------------------------------------------------
-- 6) Contributor requests: no PayPal/payment data is stored.
-- ---------------------------------------------------------------------------
create table if not exists public.supporter_requests(
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  display_name text not null check(char_length(display_name) between 2 and 60),
  status text not null default 'pending' check(status in('pending','approved','rejected')),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz
);
alter table public.supporter_requests alter column user_id set default auth.uid();
alter table public.supporter_requests enable row level security;
drop policy if exists "supporter own insert" on public.supporter_requests;
drop policy if exists "supporter own read" on public.supporter_requests;
create policy "supporter own insert" on public.supporter_requests for insert to authenticated with check(auth.uid()=user_id and status='pending');
create policy "supporter own read" on public.supporter_requests for select to authenticated using(auth.uid()=user_id);
revoke update,delete on public.supporter_requests from anon,authenticated;
grant select,insert on public.supporter_requests to authenticated;

create or replace view public.public_supporters
with (security_invoker = false)
as select display_name,coalesce(reviewed_at,submitted_at) as approved_at from public.supporter_requests where status='approved';
revoke all on public.public_supporters from public;
grant select on public.public_supporters to anon,authenticated;

commit;
