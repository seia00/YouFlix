/* ==========================================================================
   HeroSection — Server Component
   Fetches all shows for the hero carousel and enriches each slide with
   a real /watch href (HeroContent only carries a raw YouTube id, which
   the watch route cannot resolve).
   ========================================================================== */

import { getAllHeroSlides } from "@/lib/data";
import { SEED_SEASONS, SEED_EPISODES } from "@/lib/seed-data";
import type { HeroSlide } from "@/lib/types";
import HeroCarousel from "./HeroCarousel";

/** Resolve a show's first episode so Play deep-links to a real episode id. */
function firstEpisodeHref(showId: string): string | null {
  const season = [...SEED_SEASONS]
    .filter((s) => s.show_id === showId)
    .sort((a, b) => a.season_number - b.season_number)[0];
  if (!season) return null;

  const episode = [...SEED_EPISODES]
    .filter((e) => e.season_id === season.id)
    .sort((a, b) => a.episode_number - b.episode_number)[0];
  return episode ? `/watch/${episode.id}` : null;
}

export default async function HeroSection() {
  const content = await getAllHeroSlides();
  if (content.length === 0) return null;

  const slides: HeroSlide[] = content.map((slide) => ({
    ...slide,
    watch_href: firstEpisodeHref(slide.show.id) ?? `/show/${slide.show.id}`,
  }));

  return <HeroCarousel slides={slides} />;
}
