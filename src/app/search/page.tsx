/* ==========================================================================
   Browse Page — /search
   The full catalog as a dense, filterable grid. Genre chips narrow the
   set; the grid repopulates with a staggered reveal. Cmd+K remains the
   fast path and is advertised in the header.
   ========================================================================== */
"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import ThumbnailCard from "@/components/ThumbnailCard";
import { useUIStore } from "@/store/useUIStore";
import {
  SEED_SHOWS,
  SEED_CREATORS,
  SEED_SEASONS,
  SEED_EPISODES,
} from "@/lib/seed-data";
import type { ShowCard } from "@/lib/types";

/** Mirror the data layer's thumbnail derivation for the static catalog. */
function thumbnailFor(showId: string): string | null {
  const season = SEED_SEASONS.find((s) => s.show_id === showId);
  const episode = season
    ? SEED_EPISODES.find((e) => e.season_id === season.id)
    : undefined;
  return episode && !episode.youtube_id.startsWith("REPLACE_ME_")
    ? `https://i.ytimg.com/vi/${episode.youtube_id}/hqdefault.jpg`
    : null;
}

const ALL_SHOWS: ShowCard[] = SEED_SHOWS.map((show) => ({
  id: show.id,
  title: show.title,
  thumbnail_url: show.thumbnail_url ?? thumbnailFor(show.id),
  genre: show.genre,
  creator_name:
    SEED_CREATORS.find((c) => c.id === show.creator_id)?.name ?? "Unknown",
}));

const GENRES = [...new Set(ALL_SHOWS.map((s) => s.genre).filter((g): g is string => !!g))];

export default function BrowsePage() {
  const openSearch = useUIStore((s) => s.openSearch);
  const [genre, setGenre] = useState<string | null>(null);

  const shows = useMemo(
    () => (genre ? ALL_SHOWS.filter((s) => s.genre === genre) : ALL_SHOWS),
    [genre],
  );

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-[1400px] px-5 pb-28 pt-28 sm:px-10 lg:px-14">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="type-overline animate-fade-up text-text-dim">
              The full catalog
            </p>
            <h1
              className="type-display animate-fade-up mt-2 text-[clamp(2.5rem,6vw,4rem)] text-text"
              style={{ animationDelay: "60ms" }}
            >
              Browse
            </h1>
          </div>
          <button
            type="button"
            onClick={openSearch}
            className="animate-fade-up flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-4 py-2 text-sm text-text-muted transition-colors duration-300 hover:border-border-hover hover:text-text"
            style={{ animationDelay: "120ms" }}
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
            <kbd className="ml-1 rounded border border-border bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-text-dim">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Genre chips */}
        <div
          className="animate-fade-up mt-8 flex flex-wrap items-center gap-2"
          style={{ animationDelay: "160ms" }}
        >
          {[null, ...GENRES].map((g) => {
            const isActive = genre === g;
            return (
              <button
                key={g ?? "all"}
                type="button"
                onClick={() => setGenre(g)}
                className={`relative rounded-full px-4 py-1.5 text-xs font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-bg"
                    : "border border-border text-text-muted hover:border-border-hover hover:text-text"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="genre-chip"
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 rounded-full bg-text"
                  />
                )}
                <span className="relative z-10">{g ?? "All"}</span>
              </button>
            );
          })}
          <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.18em] text-text-dim">
            {shows.length} {shows.length === 1 ? "title" : "titles"}
          </span>
        </div>

        {/* Grid — keyed by genre so each filter repopulates with a stagger */}
        <AnimatePresence mode="wait">
          <motion.div
            key={genre ?? "all"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-8 grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 xl:grid-cols-4"
          >
            {shows.map((show, index) => (
              <ThumbnailCard key={show.id} show={show} index={index} fluid />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
