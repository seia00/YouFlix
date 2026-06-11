/* ==========================================================================
   Show Detail Page — /show/[id]
   Server Component. The homepage thumbnail grown into a full banner:
   real show imagery under the same gradient architecture as the hero,
   monumental title, mono stats, staggered CSS entrance.
   ========================================================================== */

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import type { Metadata } from "next";
import { getShowWithDetails } from "@/lib/data";
import ShowDetailClient from "./ShowDetailClient";

/* ------------------------------------------------------------------
   Dynamic metadata for SEO
   ------------------------------------------------------------------ */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const show = await getShowWithDetails(id);
  if (!show) return { title: "Show Not Found" };
  return {
    title: show.title,
    description: show.description,
  };
}

export default async function ShowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const show = await getShowWithDetails(id);

  if (!show) notFound();

  const firstSeason = show.seasons[0];
  const firstEpisode = firstSeason?.episodes[0];
  const episodeCount = show.seasons.reduce((sum, s) => sum + s.episodes.length, 0);
  const bannerUrl = show.banner_url ?? show.thumbnail_url;

  return (
    <div className="min-h-screen bg-bg">
      {/* ------------------------------------------------------------------
          Banner — the clicked thumbnail in its grown state
          ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grain">
          {bannerUrl ? (
            <Image
              src={bannerUrl}
              alt=""
              aria-hidden
              fill
              priority
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-accent/25 via-surface to-bg" />
          )}
          <div className="absolute inset-0 gradient-hero" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[60svh] w-full max-w-[1400px] flex-col justify-end px-5 pb-12 pt-36 sm:px-10 lg:min-h-[68svh] lg:px-14">
          <div className="max-w-3xl">
            {/* Overline — genre, rule, creator */}
            <div className="type-overline animate-fade-up mb-4 flex items-center gap-3">
              {show.genre && <span className="text-accent-hover">{show.genre}</span>}
              <span className="h-px w-8 bg-white/30" aria-hidden />
              <span className="text-text-muted">{show.creator.name}</span>
            </div>

            {/* Title */}
            <h1
              className="type-display animate-fade-up text-[clamp(2.25rem,7vw,4.75rem)] text-text"
              style={{ animationDelay: "70ms" }}
            >
              {show.title}
            </h1>

            {/* Description */}
            {show.description && (
              <p
                className="animate-fade-up mt-5 max-w-xl text-sm leading-relaxed text-text-muted sm:text-base"
                style={{ animationDelay: "140ms" }}
              >
                {show.description}
              </p>
            )}

            {/* Stats */}
            <p
              className="animate-fade-up mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-text-dim"
              style={{ animationDelay: "200ms" }}
            >
              {show.seasons.length} {show.seasons.length === 1 ? "Season" : "Seasons"}
              <span className="mx-3 text-white/20">/</span>
              {episodeCount} {episodeCount === 1 ? "Episode" : "Episodes"}
            </p>

            {/* CTA */}
            {firstEpisode && (
              <div className="animate-fade-up mt-7" style={{ animationDelay: "260ms" }}>
                <Link
                  href={`/watch/${firstEpisode.id}`}
                  className="inline-flex items-center gap-2.5 rounded-md bg-text px-6 py-3 text-sm font-semibold text-bg transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97] sm:px-7"
                >
                  <Play className="h-4 w-4 fill-bg" />
                  Play S{firstSeason.season_number} · E{firstEpisode.episode_number}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          Episodes — header, season selector, and grid live in the client
          ------------------------------------------------------------------ */}
      <section className="mx-auto max-w-[1400px] px-5 pb-28 pt-10 sm:px-10 lg:px-14">
        <ShowDetailClient showId={show.id} seasons={show.seasons} />
      </section>
    </div>
  );
}
