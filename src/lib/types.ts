/* ==========================================================================
   Youflix — Core Type Definitions
   Mirrors the Supabase schema exactly. Zero `any` types.
   ========================================================================== */

/** A YouTube creator (the "production studio" behind Shows). */
export interface Creator {
  id: string;
  name: string;
  bio: string | null;
  banner_url: string | null;
  profile_url: string | null;
  created_at: string;
}

/** A Show groups episodes under a unified narrative arc. */
export interface Show {
  id: string;
  creator_id: string;
  title: string;
  description: string | null;
  banner_url: string | null;
  thumbnail_url: string | null;
  genre: string | null;
  created_at: string;
}

/** A Season represents a thematic collection of episodes within a Show. */
export interface Season {
  id: string;
  show_id: string;
  season_number: number;
  title: string | null;
  created_at: string;
}

/** An Episode is a single YouTube video inside a Season. */
export interface Episode {
  id: string;
  season_id: string;
  youtube_id: string;
  title: string;
  description: string | null;
  duration: number | null; // seconds
  episode_number: number;
  created_at: string;
}

/** Tracks per-user watch progress for any episode. */
export interface WatchHistory {
  id: string;
  user_id: string;
  episode_id: string;
  progress_seconds: number;
  is_completed: boolean;
  updated_at: string;
}

/** Application user profile (linked to Supabase Auth). */
export interface Profile {
  id: string;
  auth_id: string;
  avatar_url: string | null;
  preferences: Record<string, unknown> | null;
  created_at: string;
}

/* ------------------------------------------------------------------
   Composite / Denormalized types for the UI layer
   ------------------------------------------------------------------ */

/** An episode with its season metadata attached. */
export interface EpisodeWithSeason extends Episode {
  season: Season;
}

/** A show enriched with creator info and its seasons/episodes. */
export interface ShowWithDetails extends Show {
  creator: Creator;
  seasons: (Season & { episodes: Episode[] })[];
}

/** Used in horizontal rows — a card's minimal shape. */
export interface ShowCard {
  id: string;
  title: string;
  thumbnail_url: string | null;
  genre: string | null;
  creator_name: string;
}

/** Shaped for the Continue Watching row. */
export interface ContinueWatchingCard {
  episode_id: string;
  episode_title: string;
  show_title: string;
  thumbnail_url: string | null;
  progress_seconds: number;
  duration: number;
  youtube_id: string;
}

/** Hero banner payload. */
export interface HeroContent {
  show: Show;
  creator: Creator;
  trailer_youtube_id: string;
}

/** Row data contract — category label + an array of cards. */
export interface ContentRow {
  id: string;
  label: string;
  shows: ShowCard[];
}

/** Player queue entry. */
export interface QueueItem {
  episode: Episode;
  show_title: string;
  season_number: number;
}
