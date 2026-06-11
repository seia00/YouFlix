/* ==========================================================================
   Youflix — Data Layer
   Auto-detects Supabase availability and seamlessly delegates between
   the static seed vendor (local dev / no Supabase) and the production
   Supabase database. All components import from this single module.
   ========================================================================== */

import {
  staticSeedVendor,
  HERO_FALLBACK_YT_ID,
  SEED_SHOWS,
  SEED_SEASONS,
  SEED_EPISODES,
} from "@/lib/seed-data";
import type {
  HeroContent,
  ContentRow,
  ShowCard,
  ShowWithDetails,
  EpisodeWithSeason,
  QueueItem,
  ContinueWatchingCard,
  Creator,
  Show,
  Season,
  Episode,
} from "@/lib/types";

/* ------------------------------------------------------------------
   Supabase detection — cached at module level (one check per cold start)
   ------------------------------------------------------------------ */
let _supabaseAvailable: boolean | null = null;

function isSupabaseConfigured(): boolean {
  if (_supabaseAvailable !== null) return _supabaseAvailable;
  _supabaseAvailable = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  return _supabaseAvailable;
}

async function getSupabaseServerClient() {
  if (!isSupabaseConfigured()) return null;
  const { createClient } = await import("@/lib/supabase/server");
  try {
    return await createClient();
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------
   Placeholder ID guard — prevents YouTube player crashes
   ------------------------------------------------------------------ */
function resolveYoutubeId(raw: string): string {
  return raw.startsWith("REPLACE_ME_") ? HERO_FALLBACK_YT_ID : raw;
}

/** Picks a random element from an array. */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Builds a map of showId → YouTube thumbnail URL by finding each
 * show's first episode and using its video ID to generate a thumbnail.
 */
function buildShowThumbnailMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const show of SEED_SHOWS) {
    const firstSeason = SEED_SEASONS.find((s) => s.show_id === show.id);
    const firstEp = firstSeason
      ? SEED_EPISODES.find((e) => e.season_id === firstSeason.id)
      : null;
    // Only generate thumbnails for shows with real (non-placeholder) video IDs
    if (firstEp && !firstEp.youtube_id.startsWith("REPLACE_ME_")) {
      map.set(
        show.id,
        `https://i.ytimg.com/vi/${firstEp.youtube_id}/hqdefault.jpg`,
      );
    }
  }
  return map;
}

/* ==================================================================
   Homepage — Hero Banner (randomized per request)
   ================================================================== */
export async function getHeroContent(): Promise<HeroContent> {
  const sb = await getSupabaseServerClient();

  if (sb) {
    const { data: shows } = await sb
      .from("shows")
      .select("*, creator:creators(*)")
      .order("created_at", { ascending: false });

    if (shows && shows.length > 0) {
      const show = pickRandom(shows);
      const creator = show.creator as unknown as Creator;

      const { data: seasons } = await sb
        .from("seasons")
        .select("id")
        .eq("show_id", show.id)
        .order("season_number", { ascending: true })
        .limit(1);

      let trailerYtId = HERO_FALLBACK_YT_ID;
      if (seasons && seasons.length > 0) {
        const { data: firstEp } = await sb
          .from("episodes")
          .select("youtube_id")
          .eq("season_id", seasons[0].id)
          .order("episode_number", { ascending: true })
          .limit(1)
          .single();

        if (firstEp?.youtube_id) {
          trailerYtId = resolveYoutubeId(firstEp.youtube_id);
        }
      }

      return {
        show: { ...show, creator_id: show.creator_id },
        creator,
        trailer_youtube_id: trailerYtId,
      };
    }
  }

  // Fallback: static seed data — pick a random show each page load
  const [creators, shows, seasons, episodes] = await Promise.all([
    staticSeedVendor.fetchCreators(),
    staticSeedVendor.fetchShows(),
    staticSeedVendor.fetchSeasons(),
    staticSeedVendor.fetchEpisodes(),
  ]);

  const show = pickRandom(shows);
  const creator = creators.find((c) => c.id === show.creator_id)!;
  const firstSeasonId = seasons.filter((s) => s.show_id === show.id)[0]?.id;
  const firstEpId = episodes.filter((e) => e.season_id === firstSeasonId)[0]?.youtube_id;
  const trailer_youtube_id = resolveYoutubeId(firstEpId ?? HERO_FALLBACK_YT_ID);

  return { show, creator, trailer_youtube_id };
}

/**
 * Returns ALL shows formatted for a rotating hero carousel.
 * The client component cycles through these with fade transitions.
 */
export async function getAllHeroSlides(): Promise<HeroContent[]> {
  const [creators, shows, seasons, episodes] = await Promise.all([
    staticSeedVendor.fetchCreators(),
    staticSeedVendor.fetchShows(),
    staticSeedVendor.fetchSeasons(),
    staticSeedVendor.fetchEpisodes(),
  ]);

  return shows.map((show) => {
    const creator = creators.find((c) => c.id === show.creator_id)!;
    const firstSeasonId = seasons.filter((s) => s.show_id === show.id)[0]?.id;
    const firstEpId = episodes.filter((e) => e.season_id === firstSeasonId)[0]?.youtube_id;
    const trailer_youtube_id = resolveYoutubeId(firstEpId ?? HERO_FALLBACK_YT_ID);
    return { show, creator, trailer_youtube_id };
  });
}

/* ==================================================================
   Homepage — Content Rows
   ================================================================== */
export async function getContentRows(): Promise<ContentRow[]> {
  const sb = await getSupabaseServerClient();
  let allShows: Show[] = [];
  let allCreators: Creator[] = [];

  if (sb) {
    const { data: shows } = await sb
      .from("shows")
      .select("*, creator:creators(*)")
      .order("created_at", { ascending: false });

    const creatorMap = new Map<string, Creator>();
    for (const s of (shows ?? [])) {
      const c = s.creator as unknown as Creator;
      if (c && !creatorMap.has(c.id)) creatorMap.set(c.id, c);
      allShows.push({ ...s, creator_id: s.creator_id });
    }
    allCreators = [...creatorMap.values()];
  } else {
    const [creators, shows] = await Promise.all([
      staticSeedVendor.fetchCreators(),
      staticSeedVendor.fetchShows(),
    ]);
    allCreators = creators;
    allShows = shows;
  }

  const thumbnailMap = buildShowThumbnailMap();

  const mapToCard = (s: Show): ShowCard => ({
    id: s.id,
    title: s.title,
    thumbnail_url: s.thumbnail_url ?? thumbnailMap.get(s.id) ?? null,
    genre: s.genre,
    creator_name: allCreators.find((c) => c.id === s.creator_id)?.name ?? "Unknown",
  });

  const rows: ContentRow[] = [
    { id: "trending", label: "Trending Now", shows: allShows.map(mapToCard) },
  ];

  for (const creator of allCreators) {
    const cShows = allShows.filter((s) => s.creator_id === creator.id);
    if (cShows.length === 0) continue;
    rows.push({
      id: `creator-${creator.id}`,
      label: `${creator.name} Spotlight`,
      shows: cShows.map(mapToCard),
    });
  }

  return rows;
}

/* ==================================================================
   Show Detail
   ================================================================== */
export async function getShowWithDetails(showId: string): Promise<ShowWithDetails | null> {
  const sb = await getSupabaseServerClient();

  if (sb) {
    const { data: show } = await sb
      .from("shows")
      .select("*, creator:creators(*)")
      .eq("id", showId)
      .single();

    if (show) {
      const { data: seasons } = await sb
        .from("seasons")
        .select("*, episodes:episodes(*)")
        .eq("show_id", showId)
        .order("season_number", { ascending: true });

      return {
        ...(show as Show),
        creator: show.creator as unknown as Creator,
        seasons: (seasons ?? []).map((s) => ({
          ...s,
          episodes: (s.episodes as unknown as Episode[]).sort(
            (a, b) => a.episode_number - b.episode_number,
          ),
        })) as (Season & { episodes: Episode[] })[],
      };
    }
    return null;
  }

  // Seed fallback
  const [creators, shows, seasons, episodes] = await Promise.all([
    staticSeedVendor.fetchCreators(),
    staticSeedVendor.fetchShows(),
    staticSeedVendor.fetchSeasons(),
    staticSeedVendor.fetchEpisodes(),
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

  // Derive banner/thumbnail from first episode if not explicitly set
  const firstEpisodeYtId = showSeasons[0]?.episodes[0]?.youtube_id;
  const derivedBanner = firstEpisodeYtId
    ? `https://i.ytimg.com/vi/${firstEpisodeYtId}/maxresdefault.jpg`
    : null;

  return {
    ...show,
    thumbnail_url: show.thumbnail_url ?? derivedBanner,
    banner_url: show.banner_url ?? derivedBanner,
    creator,
    seasons: showSeasons,
  };
}

/* ==================================================================
   Watch Page
   ================================================================== */
export async function getEpisodeWithSeason(episodeId: string): Promise<EpisodeWithSeason | null> {
  const sb = await getSupabaseServerClient();

  if (sb) {
    const { data: ep } = await sb
      .from("episodes")
      .select("*, season:seasons(*)")
      .eq("id", episodeId)
      .single();

    if (ep) {
      return {
        ...(ep as Episode),
        season: ep.season as unknown as Season,
      };
    }
    return null;
  }

  const [seasons, episodes] = await Promise.all([
    staticSeedVendor.fetchSeasons(),
    staticSeedVendor.fetchEpisodes(),
  ]);

  const episode = episodes.find((e) => e.id === episodeId);
  if (!episode) return null;
  const season = seasons.find((s) => s.id === episode.season_id);
  if (!season) return null;

  return { ...episode, season };
}

export async function getPlayQueue(episodeId: string): Promise<QueueItem[]> {
  const sb = await getSupabaseServerClient();

  if (sb) {
    const { data: ep } = await sb
      .from("episodes")
      .select("season_id, episode_number")
      .eq("id", episodeId)
      .single();

    if (ep) {
      const { data: season } = await sb
        .from("seasons")
        .select("show_id, season_number")
        .eq("id", ep.season_id)
        .single();

      const { data: show } = season
        ? await sb.from("shows").select("title").eq("id", season.show_id).single()
        : { data: null };

      const { data: episodes } = await sb
        .from("episodes")
        .select("*")
        .eq("season_id", ep.season_id)
        .gte("episode_number", ep.episode_number)
        .order("episode_number", { ascending: true });

      return (episodes ?? []).map((e) => ({
        episode: e as Episode,
        show_title: show?.title ?? "Unknown Show",
        season_number: season?.season_number ?? 1,
      }));
    }
    return [];
  }

  const [shows, seasons, episodes] = await Promise.all([
    staticSeedVendor.fetchShows(),
    staticSeedVendor.fetchSeasons(),
    staticSeedVendor.fetchEpisodes(),
  ]);

  const episode = episodes.find((e) => e.id === episodeId);
  if (!episode) return [];

  const season = seasons.find((s) => s.id === episode.season_id);
  if (!season) return [];

  const show = shows.find((s) => s.id === season.show_id);
  const seasonEpisodes = episodes
    .filter((e) => e.season_id === season.id)
    .sort((a, b) => a.episode_number - b.episode_number);

  const startIdx = seasonEpisodes.findIndex((e) => e.id === episodeId);

  return seasonEpisodes.slice(startIdx).map((ep) => ({
    episode: ep,
    show_title: show?.title ?? "Unknown Show",
    season_number: season.season_number,
  }));
}

/* ==================================================================
   Continue Watching (requires Supabase auth)
   ================================================================== */
export async function getContinueWatching(): Promise<ContinueWatchingCard[]> {
  const sb = await getSupabaseServerClient();
  if (!sb) return [];

  try {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return [];

    const { data: profile } = await sb
      .from("profiles")
      .select("id")
      .eq("auth_id", user.id)
      .single();

    if (!profile) return [];

    const { data: history } = await sb
      .from("watch_history")
      .select(`
        episode_id,
        progress_seconds,
        episode:episodes(
          youtube_id,
          title,
          duration,
          season:seasons(show:shows(title))
        )
      `)
      .eq("user_id", profile.id)
      .eq("is_completed", false)
      .order("updated_at", { ascending: false })
      .limit(10);

    return (history ?? []).map((h) => {
      const ep = h.episode as unknown as {
        youtube_id: string; title: string; duration: number;
        season: { show: { title: string } };
      };
      return {
        episode_id: h.episode_id,
        episode_title: ep?.title ?? "",
        show_title: ep?.season?.show?.title ?? "",
        thumbnail_url: null,
        progress_seconds: h.progress_seconds,
        duration: ep?.duration ?? 0,
        youtube_id: ep?.youtube_id ?? "",
      };
    });
  } catch {
    return [];
  }
}
