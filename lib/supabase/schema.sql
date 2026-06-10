/* ==========================================================================
   Youflix — Supabase PostgreSQL Schema
   Run this in the Supabase SQL Editor to bootstrap the database.
   Includes Row Level Security policies.
   ========================================================================== */

/* ------------------------------------------------------------------
   Extensions
   ------------------------------------------------------------------ */
create extension if not exists "uuid-ossp";

/* ------------------------------------------------------------------
   Profiles — 1:1 with Supabase Auth users
   ------------------------------------------------------------------ */
create table if not exists public.profiles (
  id          uuid primary key default uuid_generate_v4(),
  auth_id     uuid unique not null references auth.users(id) on delete cascade,
  avatar_url  text,
  preferences jsonb default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = auth_id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = auth_id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = auth_id);

/* Index for fast auth-id lookups */
create index if not exists idx_profiles_auth_id on public.profiles(auth_id);

/* ------------------------------------------------------------------
   Creators — YouTube channels as "production studios"
   ------------------------------------------------------------------ */
create table if not exists public.creators (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  bio         text,
  banner_url  text,
  profile_url text,
  created_at  timestamptz not null default now()
);

alter table public.creators enable row level security;

/* Creators are public read-only */
create policy "Anyone can read creators"
  on public.creators for select
  using (true);

/* ------------------------------------------------------------------
   Shows — content series grouped by creator
   ------------------------------------------------------------------ */
create table if not exists public.shows (
  id            uuid primary key default uuid_generate_v4(),
  creator_id    uuid not null references public.creators(id) on delete cascade,
  title         text not null,
  description   text,
  banner_url    text,
  thumbnail_url text,
  genre         text,
  created_at    timestamptz not null default now()
);

alter table public.shows enable row level security;

create policy "Anyone can read shows"
  on public.shows for select
  using (true);

create index if not exists idx_shows_creator_id on public.shows(creator_id);

/* ------------------------------------------------------------------
   Seasons — thematic collections inside a show
   ------------------------------------------------------------------ */
create table if not exists public.seasons (
  id            uuid primary key default uuid_generate_v4(),
  show_id       uuid not null references public.shows(id) on delete cascade,
  season_number integer not null check (season_number > 0),
  title         text,
  created_at    timestamptz not null default now(),
  unique(show_id, season_number)
);

alter table public.seasons enable row level security;

create policy "Anyone can read seasons"
  on public.seasons for select
  using (true);

create index if not exists idx_seasons_show_id on public.seasons(show_id);

/* ------------------------------------------------------------------
   Episodes — individual YouTube videos
   ------------------------------------------------------------------ */
create table if not exists public.episodes (
  id             uuid primary key default uuid_generate_v4(),
  season_id      uuid not null references public.seasons(id) on delete cascade,
  youtube_id     text not null,
  title          text not null,
  description    text,
  duration       integer,           -- seconds (nullable until enriched)
  episode_number integer not null check (episode_number > 0),
  created_at     timestamptz not null default now(),
  unique(season_id, episode_number)
);

alter table public.episodes enable row level security;

create policy "Anyone can read episodes"
  on public.episodes for select
  using (true);

create index if not exists idx_episodes_season_id on public.episodes(season_id);

/* ------------------------------------------------------------------
   Watch History — per-user tracking
   ------------------------------------------------------------------ */
create table if not exists public.watch_history (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  episode_id       uuid not null references public.episodes(id) on delete cascade,
  progress_seconds integer not null default 0,
  is_completed     boolean not null default false,
  updated_at       timestamptz not null default now(),
  unique(user_id, episode_id)
);

alter table public.watch_history enable row level security;

create policy "Users can view own watch history"
  on public.watch_history for select
  using (user_id = (select id from public.profiles where auth_id = auth.uid()));

create policy "Users can insert own watch history"
  on public.watch_history for insert
  with check (user_id = (select id from public.profiles where auth_id = auth.uid()));

create policy "Users can update own watch history"
  on public.watch_history for update
  using (user_id = (select id from public.profiles where auth_id = auth.uid()));

create index if not exists idx_watch_history_user_id on public.watch_history(user_id);

/* ------------------------------------------------------------------
   Trigger: auto-create profile on sign-up
   ------------------------------------------------------------------ */
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (auth_id, avatar_url)
  values (new.id, new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
