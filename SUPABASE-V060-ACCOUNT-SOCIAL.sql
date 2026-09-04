-- 1) Searchable Trader ID -----------------------------------------------------
alter table public.social_profiles
  add column if not exists trader_tag text;

-- Backfill old profiles with a deterministic unique tag.
update public.social_profiles
set trader_tag = left(
  coalesce(nullif(lower(regexp_replace(alias, '[^a-zA-Z0-9]+', '', 'g')), ''), 'trader')
  || '_' || substr(replace(user_id::text, '-', ''), 1, 6), 20)
where trader_tag is null or trader_tag = '';

create unique index if not exists social_profiles_trader_tag_unique
  on public.social_profiles (lower(trader_tag));

alter table public.social_profiles
  drop constraint if exists social_profiles_trader_tag_format;
alter table public.social_profiles
  add constraint social_profiles_trader_tag_format
  check (trader_tag ~ '^[a-z0-9_]{3,20}$');

-- 2) Friend requests ----------------------------------------------------------
create table if not exists public.friend_requests (
  id            uuid primary key default gen_random_uuid(),
  pair_key      text not null unique,
  requester_id  uuid not null references auth.users(id) on delete cascade,
  addressee_id  uuid not null references auth.users(id) on delete cascade,
  status        text not null default 'pending' check (status in ('pending','accepted','declined')),
  created_at    timestamptz not null default now(),
  responded_at  timestamptz,
  check (requester_id <> addressee_id)
);

alter table public.friend_requests enable row level security;

drop policy if exists "friend requests participants read" on public.friend_requests;
create policy "friend requests participants read"
  on public.friend_requests for select
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

create index if not exists friend_requests_requester_idx
  on public.friend_requests(requester_id, created_at desc);
create index if not exists friend_requests_addressee_idx
  on public.friend_requests(addressee_id, created_at desc);

-- Sending is server-side so a client cannot fabricate an accepted friendship.
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
  if not exists(select 1 from public.social_profiles where user_id = p_addressee) then return; end if;
  if me::text < p_addressee::text then a:=me; b:=p_addressee; else a:=p_addressee; b:=me; end if;
  key := a::text || ':' || b::text;
  if exists(select 1 from public.friendships f where f.pair_key = key) then
    return query select null::uuid, 'already-friends'::text; return;
  end if;
  select * into existing from public.friend_requests where pair_key=key;
  if found and existing.status='pending' then
    return query select existing.id, existing.status; return;
  end if;
  insert into public.friend_requests(pair_key,requester_id,addressee_id,status,created_at,responded_at)
  values(key,me,p_addressee,'pending',now(),null)
  on conflict(pair_key) do update set requester_id=excluded.requester_id,
    addressee_id=excluded.addressee_id,status='pending',created_at=now(),responded_at=null
  returning id,status into request_id,request_status;
  return next;
end;
$$;

create or replace function public.respond_wot_friend_request(p_request uuid, p_accept boolean)
returns table(request_id uuid, request_status text)
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid(); r public.friend_requests%rowtype; a uuid; b uuid; key text;
begin
  select * into r from public.friend_requests where id=p_request for update;
  if me is null or r.id is null or r.addressee_id <> me or r.status <> 'pending' then return; end if;
  if p_accept then
    if r.requester_id::text < r.addressee_id::text then a:=r.requester_id;b:=r.addressee_id;else a:=r.addressee_id;b:=r.requester_id;end if;
    key:=a::text||':'||b::text;
    insert into public.friendships(pair_key,user_a,user_b,invited_by,source)
      values(key,a,b,r.requester_id,'search') on conflict(pair_key) do nothing;
    update public.friend_requests set status='accepted',responded_at=now() where id=r.id;
    return query select r.id,'accepted'::text;
  else
    update public.friend_requests set status='declined',responded_at=now() where id=r.id;
    return query select r.id,'declined'::text;
  end if;
end;
$$;

revoke all on function public.send_wot_friend_request(uuid) from public;
revoke all on function public.respond_wot_friend_request(uuid,boolean) from public;
grant execute on function public.send_wot_friend_request(uuid) to authenticated;
grant execute on function public.respond_wot_friend_request(uuid,boolean) to authenticated;

-- 3) User-initiated account deletion -----------------------------------------
-- The SECURITY DEFINER function runs as its owner and deletes auth.users.
-- Existing ON DELETE CASCADE constraints remove progress/social rows.
create or replace function public.delete_wot_account()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare me uuid := auth.uid();
begin
  if me is null then raise exception 'Not authenticated'; end if;
  delete from auth.users where id = me;
end;
$$;

revoke all on function public.delete_wot_account() from public;
grant execute on function public.delete_wot_account() to authenticated;
