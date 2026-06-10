/* ==========================================================================
   EpisodeCard — Client Component
   Renders a single episode in the show detail grid with progress bar.
   Links to the watch page for that episode.
   ========================================================================== */
"use client";

import Link from "next/link";
import Image from "next/image";
import { Play, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import type { Episode } from "@/lib/types";

interface EpisodeCardProps {
  episode: Episode;
  showId: string;
  isWatched?: boolean;
  progressPercent?: number;
  index: number;
}

export default function EpisodeCard({
  episode,
  isWatched = false,
  progressPercent = 0,
  index,
}: EpisodeCardProps) {
  const thumbnailUrl = `https://i.ytimg.com/vi/${episode.youtube_id}/hqdefault.jpg`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
    >
      <Link
        href={`/watch/${episode.id}`}
        className="group flex gap-4 rounded-xl p-3 transition-all duration-300 hover:bg-surface-alt"
      >
        {/* Thumbnail */}
        <div className="relative flex-shrink-0 overflow-hidden rounded-lg bg-surface-alt">
          <Image
            src={thumbnailUrl}
            alt={episode.title}
            width={200}
            height={113}
            unoptimized
            className="h-[90px] w-[160px] object-cover transition-transform duration-500 group-hover:scale-105 sm:h-[113px] sm:w-[200px]"
          />

          {/* Play button overlay on hover */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Play className="h-8 w-8 fill-white text-white drop-shadow-lg" />
          </div>

          {/* Episode number badge */}
          <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
            {episode.episode_number}
          </span>

          {/* Watched checkmark */}
          {isWatched && (
            <div className="absolute right-2 top-2 rounded-full bg-accent p-0.5">
              <CheckCircle2 className="h-4 w-4 text-white" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <h3 className="text-sm font-semibold text-text line-clamp-2 group-hover:text-accent-hover transition-colors sm:text-base">
            {episode.title}
          </h3>

          {episode.description && (
            <p className="mt-1 text-xs text-text-muted line-clamp-2 sm:text-sm">
              {episode.description}
            </p>
          )}

          {/* Duration */}
          {episode.duration && (
            <p className="mt-2 text-xs text-text-muted">
              {formatDuration(episode.duration)}
            </p>
          )}

          {/* Progress bar */}
          {progressPercent > 0 && !isWatched && (
            <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

/** Formats seconds into "Xh Ym" or "Ym" format. */
function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}
