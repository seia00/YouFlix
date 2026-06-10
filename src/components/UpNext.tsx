/* ==========================================================================
   UpNext — Client Component
   Sidebar panel showing upcoming episodes in the queue.
   Appears on the right side of the watch page (or bottom on mobile).
   ========================================================================== */
"use client";

import { Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayerStore } from "@/store/usePlayerStore";
import type { QueueItem } from "@/lib/types";

export default function UpNext() {
  const queue = usePlayerStore((s) => s.queue);
  const currentEpisode = usePlayerStore((s) => s.currentEpisode);
  const playEpisode = usePlayerStore((s) => s.playEpisode);

  // Upcoming episodes (everything after the first/current)
  const upcoming = queue.slice(1);
  const hasUpcoming = upcoming.length > 0;

  const handlePlay = (item: QueueItem) => {
    // Rebuild queue starting from this episode
    const idx = queue.findIndex((q) => q.episode.id === item.episode.id);
    if (idx < 0) return;
    const newQueue = queue.slice(idx);
    playEpisode(item.episode, newQueue);
  };

  if (!currentEpisode) return null;

  const thumbnailUrl = `https://i.ytimg.com/vi/${currentEpisode.youtube_id}/maxresdefault.jpg`;

  return (
    <div className="flex h-full flex-col border-l border-border bg-surface/60 backdrop-blur-xl">
      {/* Current episode info */}
      <div className="p-4 pb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Now Playing
        </h3>
        <div className="mt-3 overflow-hidden rounded-lg bg-surface-alt">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnailUrl}
            alt={currentEpisode.title}
            loading="lazy"
            className="aspect-video w-full object-cover"
          />
          <div className="p-3">
            <p className="text-xs text-text-muted">
              {queue[0]?.show_title ?? ""}
            </p>
            <p className="mt-0.5 text-sm font-semibold text-text line-clamp-2">
              {currentEpisode.title}
            </p>
          </div>
        </div>
      </div>

      {/* Up Next heading */}
      <div className="px-4 pb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Up Next {hasUpcoming ? `(${upcoming.length})` : ""}
        </h3>
      </div>

      {/* Upcoming episodes list */}
      <div className="flex-1 overflow-y-auto px-2">
        <AnimatePresence>
          {hasUpcoming ? (
            <ul className="space-y-1">
              {upcoming.map((item, index) => (
                <motion.li
                  key={item.episode.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.3 }}
                >
                  <button
                    type="button"
                    onClick={() => handlePlay(item)}
                    className="group flex w-full gap-3 rounded-lg p-2 text-left transition-colors hover:bg-surface-alt"
                  >
                    {/* Thumbnail */}
                    <div className="relative flex-shrink-0 overflow-hidden rounded-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://i.ytimg.com/vi/${item.episode.youtube_id}/mqdefault.jpg`}
                        alt={item.episode.title}
                        loading="lazy"
                        className="h-[50px] w-[89px] object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <Play className="h-5 w-5 fill-white text-white" />
                      </div>
                      {/* Episode number */}
                      <span className="absolute left-1 top-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        {item.episode.episode_number}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-text line-clamp-2 group-hover:text-accent-hover transition-colors">
                        {item.episode.title}
                      </p>
                      {item.episode.duration && (
                        <p className="mt-0.5 text-[11px] text-text-muted">
                          {formatShortDuration(item.episode.duration)}
                        </p>
                      )}
                    </div>
                  </button>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="px-2 py-6 text-center text-xs text-text-muted">
              No more episodes in this season.
            </p>
          )}
        </AnimatePresence>
      </div>

      {/* Auto-play indicator */}
      {hasUpcoming && (
        <div className="border-t border-border p-3">
          <p className="text-center text-[11px] text-text-muted">
            Auto-play is on. Next episode starts in a moment.
          </p>
        </div>
      )}
    </div>
  );
}

function formatShortDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
