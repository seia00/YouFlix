/* ==========================================================================
   Show Detail Page — /show/[id]
   Server Component. Fetches the show with all seasons and episodes.
   Renders the cinematic banner + season selector + episode grid.
   ========================================================================== */

import { notFound } from "next/navigation";
import Link from "next/link";
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

  // First episode of first season for the "Play" button
  const firstSeason = show.seasons[0];
  const firstEpisode = firstSeason?.episodes[0];

  return (
    <div className="min-h-screen bg-bg">
      {/* ------------------------------------------------------------------
          Banner — gradient background with show info
          ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-surface to-bg" />

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-32 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl animate-fade-up">
              {/* Genre */}
              {show.genre && (
                <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-medium uppercase tracking-widest text-text backdrop-blur-md">
                  {show.genre}
                </span>
              )}

              {/* Title */}
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-text sm:text-4xl lg:text-5xl">
                {show.title}
              </h1>

              {/* Creator */}
              <p className="mt-3 flex items-center gap-2 text-sm text-accent">
                <span>by</span>
                <span className="font-semibold">{show.creator.name}</span>
              </p>

              {/* Description */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-text-muted">
                {show.description}
              </p>

              {/* Stats */}
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-text-muted">
                <span>
                  {show.seasons.length} Season{show.seasons.length !== 1 ? "s" : ""}
                </span>
                <span className="text-border">|</span>
                <span>
                  {show.seasons.reduce((sum, s) => sum + s.episodes.length, 0)} Episode
                  {show.seasons.reduce((sum, s) => sum + s.episodes.length, 0) !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* CTA — Play first episode */}
            {firstEpisode && (
              <Link
                href={`/watch/${firstEpisode.id}`}
                className="flex-shrink-0 inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-accent-hover hover:scale-105 active:scale-95 lg:self-end"
              >
                <Play className="h-5 w-5 fill-white" />
                Play S1:E1
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          Episodes — season selector + episode grid
          ------------------------------------------------------------------ */}
      <section className="mx-auto max-w-7xl px-6 pb-24 sm:px-8 lg:px-12">
        <ShowDetailClient
          showId={show.id}
          seasons={show.seasons}
        />
      </section>
    </div>
  );
}
