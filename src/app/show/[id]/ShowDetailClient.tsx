/* ==========================================================================
   ShowDetailClient — Client Component
   Wraps the SeasonSelector + EpisodeGrid with state management.
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
      <SeasonSelector
        seasons={seasons}
        selectedSeasonId={selectedSeasonId}
        onSelect={setSelectedSeasonId}
      />

      {selectedSeason && (
        <EpisodeGrid
          episodes={selectedSeason.episodes}
          showId={showId}
        />
      )}
    </>
  );
}
