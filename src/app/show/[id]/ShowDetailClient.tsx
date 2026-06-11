/* ==========================================================================
   ShowDetailClient — Client Component
   Episodes section header (definitive label + mono count) with the
   season selector on the opposing edge, then the episode grid.
   ========================================================================== */
"use client";

import { useState, useMemo } from "react";
import SeasonSelector from "@/components/SeasonSelector";
import EpisodeGrid from "@/components/EpisodeGrid";
import type { Season, Episode } from "@/lib/types";

interface ShowDetailClientProps {
  showId: string;
  seasons: (Season & { episodes: Episode[] })[];
}

export default function ShowDetailClient({
  showId,
  seasons,
}: ShowDetailClientProps) {
  // Default to first season
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>(
    seasons[0]?.id ?? "",
  );

  const selectedSeason = useMemo(
    () => seasons.find((s) => s.id === selectedSeasonId),
    [seasons, selectedSeasonId],
  );

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h2 className="text-xl font-bold tracking-[-0.02em] text-text sm:text-2xl">
            Episodes
          </h2>
          {selectedSeason && (
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-dim">
              {selectedSeason.episodes.length}{" "}
              {selectedSeason.episodes.length === 1 ? "title" : "titles"}
            </span>
          )}
        </div>

        <SeasonSelector
          seasons={seasons}
          selectedSeasonId={selectedSeasonId}
          onSelect={setSelectedSeasonId}
        />
      </div>

      {selectedSeason && (
        <EpisodeGrid
          key={selectedSeason.id}
          episodes={selectedSeason.episodes}
          showId={showId}
        />
      )}
    </>
  );
}
