/* ==========================================================================
   HeroBanner — Server Component
   Fetches the featured show and renders a cinematic hero section
   with a muted autoplaying YouTube trailer, gradient overlays,
   title, description, and primary CTAs.
   ========================================================================== */

import { getHeroContent } from "@/lib/data";
import { HeroBannerClient } from "./HeroBannerClient";
import { HeroCTAButtons } from "./HeroCTAButtons";

export default async function HeroBanner() {
  const hero = await getHeroContent();

  return (
    <section className="relative w-full overflow-hidden" aria-label="Featured show">
      {/* ------------------------------------------------------------------
          Background — YouTube iframe, absolutely positioned behind content
          ------------------------------------------------------------------ */}
      <div className="absolute inset-0 z-0">
        <HeroBannerClient youtubeId={hero.trailer_youtube_id} />
      </div>

      {/* ------------------------------------------------------------------
          Gradient overlays — creates the cinematic vignette effect
          ------------------------------------------------------------------ */}
      <div className="absolute inset-0 z-10 gradient-hero pointer-events-none" />

      {/* ------------------------------------------------------------------
          Content — title, metadata, description, CTAs
          ------------------------------------------------------------------ */}
      <div className="relative z-20 mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-end px-6 pb-24 pt-48 sm:px-8 lg:px-12">
        <div className="max-w-2xl animate-fade-up">
          {/* Genre badge */}
          {hero.show.genre && (
            <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-medium uppercase tracking-widest text-text backdrop-blur-md">
              {hero.show.genre}
            </span>
          )}

          {/* Title */}
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-text sm:text-5xl lg:text-6xl xl:text-7xl">
            {hero.show.title}
          </h1>

          {/* Creator attribution */}
          <p className="mt-3 text-sm font-medium text-accent">
            by {hero.creator.name}
          </p>

          {/* Description */}
          <p className="mt-4 max-w-lg text-base leading-relaxed text-text-muted sm:text-lg">
            {hero.show.description}
          </p>

          {/* Client-side interactive CTAs */}
          <HeroCTAButtons watchHref={`/watch/${hero.trailer_youtube_id}`} />
        </div>
      </div>

      {/* ------------------------------------------------------------------
          Bottom fade-to-background
          ------------------------------------------------------------------ */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-32 gradient-bottom pointer-events-none" />
    </section>
  );
}
