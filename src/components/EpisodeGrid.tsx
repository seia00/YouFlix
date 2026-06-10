/* ==========================================================================
   EpisodeGrid — Client Component
   Renders the list of episodes for the selected season.
   ========================================================================== */
"use client";

import EpisodeCard from "./EpisodeCard";
import type { Episode } from "@/lib/types";

interface EpisodeGridProps {
  episodes: Episode[];
  showId: string;
}

export default function EpisodeGrid({ episodes, showId }: EpisodeGridProps) {
  if (episodes.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-text-muted">
        No episodes yet. Check back soon.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-1 lg:grid-cols-2">
      {episodes.map((episode, index) => (
        <EpisodeCard
          key={episode.id}
          episode={episode}
          showId={showId}
          index={index}
        />
      ))}
    </div>
  );
}
