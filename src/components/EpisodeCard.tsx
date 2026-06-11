/* ==========================================================================
   EpisodeCard — Client Component
   An episode row in the show detail grid: mono episode numeral, blur-up
   thumbnail with play reveal, progress bar. Links to the watch page.
   ========================================================================== */
"use client";

import { useState } from "react";
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
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/watch/${episode.id}`}
        className="group flex items-center gap-3 rounded-xl p-3 transition-colors duration-300 hover:bg-white/[0.04] sm:gap-4"
      >
        {/* Episode numeral */}
        <span className="w-7 flex-shrink-0 text-center font-mono text-base text-text-dim transition-colors duration-300 group-hover:text-accent-hover sm:text-lg">
          {String(episode.episode_number).padStart(2, "0")}
        </span>

        {/* Thumbnail */}
        <div className="relative flex-shrink-0 overflow-hidden rounded-lg bg-surface-alt ring-1 ring-white/5">
          <Image
            src={thumbnailUrl}
            alt={episode.title}
            width={200}
            height={113}
            unoptimized
            onLoad={() => setLoaded(true)}
            className={`h-[78px] w-[138px] object-cover transition-[opacity,filter,transform] duration-500 group-hover:scale-105 sm:h-[101px] sm:w-[180px] ${
              loaded ? "opacity-100 blur-0" : "opacity-0 blur-md"
            }`}
          />

          {/* Play reveal */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-text">
              <Play className="h-4 w-4 fill-bg text-bg" />
            </span>
          </div>

          {/* Watched checkmark */}
          {isWatched && (
            <div className="absolute right-2 top-2 rounded-full bg-accent p-0.5">
              <CheckCircle2 className="h-4 w-4 text-white" />
            </div>
          )}

          {/* Progress bar — pinned to the thumbnail's bottom edge */}
          {progressPercent > 0 && !isWatched && (
            <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/15">
              <div
                className="h-full bg-accent"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <h3 className="text-sm font-semibold leading-snug text-text line-clamp-2 sm:text-[15px]">
            {episode.title}
          </h3>

          {episode.description && (
            <p className="mt-1 text-xs leading-relaxed text-text-muted line-clamp-2">
              {episode.description}
            </p>
          )}

          {episode.duration && (
            <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim">
              {formatDuration(episode.duration)}
            </p>
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
