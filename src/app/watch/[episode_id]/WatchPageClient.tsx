/* ==========================================================================
   WatchPageClient — Client Component
   Initializes the Zustand player store with the episode + queue,
   renders the YouTube player, overlay, and UpNext sidebar.
   ========================================================================== */
"use client";

import { useEffect, useRef, useCallback } from "react";
import YouTubePlayer from "@/components/YouTubePlayer";
import PlayerOverlay from "@/components/PlayerOverlay";
import UpNext from "@/components/UpNext";
import { usePlayerStore } from "@/store/usePlayerStore";
import {
  debouncedSyncProgress,
  teardownSync,
} from "@/lib/player-sync";
import type { EpisodeWithSeason, QueueItem } from "@/lib/types";

interface WatchPageClientProps {
  episode: EpisodeWithSeason;
  queue: QueueItem[];
}

export default function WatchPageClient({
  episode,
  queue,
}: WatchPageClientProps) {
  const playEpisode = usePlayerStore((s) => s.playEpisode);
  const currentEpisode = usePlayerStore((s) => s.currentEpisode);
  const advanceQueue = usePlayerStore((s) => s.advanceQueue);
  const isMountedRef = useRef(true);

  /* ------------------------------------------------------------------
     Initialize the player store on mount
     ------------------------------------------------------------------ */
  useEffect(() => {
    playEpisode(episode, queue);
    return () => {
      isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episode.id]);

  /* ------------------------------------------------------------------
     Sync watch progress to Supabase every 10 seconds
     ------------------------------------------------------------------ */
  useEffect(() => {
    if (!currentEpisode) return;

    const interval = setInterval(() => {
      const { currentTime: time, duration } = usePlayerStore.getState();
      debouncedSyncProgress(
        currentEpisode.id,
        time,
        duration,
        "anonymous", // TODO: replace with actual user ID when auth is wired
      );
    }, 10_000);

    return () => {
      clearInterval(interval);
      teardownSync();
    };
  }, [currentEpisode]);

  /* ------------------------------------------------------------------
     Handle episode ended → auto-advance
     ------------------------------------------------------------------ */
  const handleEnded = useCallback(() => {
    const state = usePlayerStore.getState();
    if (state.queue.length > 1) {
      // Wait 2 seconds, then advance
      setTimeout(() => {
        if (isMountedRef.current) {
          const nextState = usePlayerStore.getState();
          if (nextState.queue.length > 1) {
            advanceQueue();
          }
        }
      }, 2000);
    }
  }, [advanceQueue]);

  if (!currentEpisode) {
    return (
      <div className="flex h-full items-center justify-center bg-black">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-accent" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col lg:flex-row">
      {/* ------------------------------------------------------------------
          Player area — takes remaining space
          ------------------------------------------------------------------ */}
      <div id="player-container" className="relative flex-1 bg-black">
        <YouTubePlayer
          youtubeId={currentEpisode.youtube_id}
          onEnded={handleEnded}
        />
        <PlayerOverlay />
      </div>

      {/* ------------------------------------------------------------------
          Up Next sidebar — hidden on mobile, shown on lg+
          ------------------------------------------------------------------ */}
      <div className="hidden w-[360px] flex-shrink-0 lg:block xl:w-[400px]">
        <UpNext />
      </div>

      {/* ------------------------------------------------------------------
          Mobile Up Next — bottom sheet (visible on screens < lg)
          ------------------------------------------------------------------ */}
      <div className="block lg:hidden">
        {/* Compact mobile queue bar */}
        {queue.length > 1 && (
          <div className="border-t border-border bg-surface p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Up Next
            </p>
            <div className="mt-2 flex gap-2 overflow-x-auto hide-scrollbar">
              {queue.slice(1, 5).map((item) => (
                <button
                  key={item.episode.id}
                  type="button"
                  onClick={() => {
                    const idx = queue.findIndex(
                      (q) => q.episode.id === item.episode.id,
                    );
                    if (idx >= 0) {
                      playEpisode(item.episode, queue.slice(idx));
                    }
                  }}
                  className="flex-shrink-0 text-left group"
                >
                  <div className="relative w-[140px] overflow-hidden rounded-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://i.ytimg.com/vi/${item.episode.youtube_id}/mqdefault.jpg`}
                      alt={item.episode.title}
                      loading="lazy"
                      className="aspect-video w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="rounded-full bg-white/20 p-1.5 backdrop-blur-sm">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                          <path d="M8 5.14v14l11-7-11-7z" />
                        </svg>
                      </div>
                    </div>
                    <span className="absolute left-1 top-1 rounded bg-black/70 px-1 py-0.5 text-[9px] font-semibold text-white">
                      E{item.episode.episode_number}
                    </span>
                  </div>
                  <p className="mt-1 w-[140px] truncate text-[11px] text-text-muted group-hover:text-text line-clamp-1">
                    {item.episode.title}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
