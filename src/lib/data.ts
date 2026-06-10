/* ==========================================================================
   Youflix — Data Layer
   Server-side data fetching functions. Uses the static seed vendor
   as the data source (swap with Supabase in production).
   ========================================================================== */

import {
  staticSeedVendor,
} from "@/lib/seed-data";
import type {
  HeroContent,
  ContentRow,
  ShowCard,
  ShowWithDetails,
  EpisodeWithSeason,
  QueueItem,
  ContinueWatchingCard,
} from "@/lib/types";

/* ------------------------------------------------------------------
   Helpers
   ------------------------------------------------------------------ */

async function getCreators() { return staticSeedVendor.fetchCreators(); }
async function getShows() { return staticSeedVendor.fetchShows(); }
async function getSeasons() { return staticSeedVendor.fetchSeasons(); }
async function getEpisodes() { return staticSeedVendor.fetchEpisodes(); }

/* ------------------------------------------------------------------
   Homepage — Hero Banner
   ------------------------------------------------------------------ */

/**
 * Fetches the featured show for the hero banner.
 * Picks the first show and its creator, using the first episode
 * as the "trailer" YouTube video.
 */
export async function getHeroContent(): Promise<HeroContent> {
  const [creators, shows, seasons, episodes] = await Promise.all([
    getCreators(),
    getShows(),
    getSeasons(),
    getEpisodes(),
  ]);

  // Featured: first show
  const show = shows[0];
  const creator = creators.find((c) => c.id === show.creator_id)!;
  const showSeasons = seasons.filter((s) => s.show_id === show.id);
  const firstSeasonEpisodes = episodes.filter(
    (e) => e.season_id === showSeasons[0]?.id,
  );

  return {
    show,
    creator,
    trailer_youtube_id: firstSeasonEpisodes[0]?.youtube_id ?? "dQw4w9WgXcQ",
  };
}

/* ------------------------------------------------------------------
   Homepage — Content Rows
   ------------------------------------------------------------------ */

/**
 * Fetches all content rows for the homepage:
 * - Trending
 * - Creator Spotlights (one row per creator)
 */
export async function getContentRows(): Promise<ContentRow[]> {
  const [creators, shows] = await Promise.all([getCreators(), getShows()]);

  const mapToCard = (show: typeof shows[number]): ShowCard => ({
    id: show.id,
    title: show.title,
    thumbnail_url: show.thumbnail_url,
    genre: show.genre,
    creator_name: creators.find((c) => c.id === show.creator_id)?.name ?? "Unknown",
  });

  const rows: ContentRow[] = [
    {
      id: "trending",
      label: "Trending Now",
      shows: shows.map(mapToCard),
    },
  ];

  // One row per creator
  for (const creator of creators) {
    const creatorShows = shows.filter((s) => s.creator_id === creator.id);
    if (creatorShows.length === 0) continue;
    rows.push({
      id: `creator-${creator.id}`,
      label: `${creator.name} Spotlight`,
      shows: creatorShows.map(mapToCard),
    });
  }

  return rows;
}

/**
 * Returns "Continue Watching" cards.
 * Currently returns empty — wired to Supabase watch_history in production.
 */
export async function getContinueWatching(): Promise<ContinueWatchingCard[]> {
  // In production: query watch_history joined with episodes, seasons, shows.
  return [];
}

/* ------------------------------------------------------------------
   Show Detail Page — /show/[id]
   ------------------------------------------------------------------ */

/** Fetches a show with all seasons and episodes, plus creator info. */
export async function getShowWithDetails(
  showId: string,
): Promise<ShowWithDetails | null> {
  const [creators, shows, seasons, episodes] = await Promise.all([
    getCreators(),
    getShows(),
    getSeasons(),
    getEpisodes(),
  ]);

  const show = shows.find((s) => s.id === showId);
  if (!show) return null;

  const creator = creators.find((c) => c.id === show.creator_id)!;
  const showSeasons = seasons
    .filter((s) => s.show_id === show.id)
    .sort((a, b) => a.season_number - b.season_number)
    .map((season) => ({
      ...season,
      episodes: episodes
        .filter((e) => e.season_id === season.id)
        .sort((a, b) => a.episode_number - b.episode_number),
    }));

  return { ...show, creator, seasons: showSeasons };
}

/* ------------------------------------------------------------------
   Watch Page — /watch/[episode_id]
   ------------------------------------------------------------------ */

/** Fetches an episode with its season metadata. */
export async function getEpisodeWithSeason(
  episodeId: string,
): Promise<EpisodeWithSeason | null> {
  const [seasons, episodes] = await Promise.all([getSeasons(), getEpisodes()]);

  const episode = episodes.find((e) => e.id === episodeId);
  if (!episode) return null;

  const season = seasons.find((s) => s.id === episode.season_id);
  if (!season) return null;

  return { ...episode, season };
}

/**
 * Builds a play queue for a given episode.
 * Returns the current episode plus all subsequent episodes in the
 * same season (for autoplay).
 */
export async function getPlayQueue(
  episodeId: string,
): Promise<QueueItem[]> {
  const [shows, seasons, episodes] = await Promise.all([
    getShows(),
    getSeasons(),
    getEpisodes(),
  ]);

  const episode = episodes.find((e) => e.id === episodeId);
  if (!episode) return [];

  const season = seasons.find((s) => s.id === episode.season_id);
  if (!season) return [];

  const show = shows.find((s) => s.id === season.show_id);

  const seasonEpisodes = episodes
    .filter((e) => e.season_id === season.id)
    .sort((a, b) => a.episode_number - b.episode_number);

  // Start from the current episode
  const startIdx = seasonEpisodes.findIndex((e) => e.id === episodeId);

  return seasonEpisodes.slice(startIdx).map((ep) => ({
    episode: ep,
    show_title: show?.title ?? "Unknown Show",
    season_number: season.season_number,
  }));
}
