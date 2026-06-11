/* ==========================================================================
   ThumbnailCard — Client Component
   A card that earns its hover: the thumbnail resolves from blur to sharp
   on load, and on pointer hover the card lifts while genre, creator, and
   a play affordance unfold from the bottom edge. Optionally renders a
   giant hollow rank numeral for the trending row.
   ========================================================================== */
"use client";

import { useState, useCallback } from "react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import type { ShowCard } from "@/lib/types";

interface ThumbnailCardProps {
  show: ShowCard;
  index: number;
  rank?: number;
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const entrance: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: Math.min(i * 0.06, 0.5), duration: 0.5, ease: EASE_OUT },
  }),
};

/* Hover choreography — lift, internal zoom, info unfold, resting title cedes */
const lift: Variants = {
  rest: { y: 0 },
  hover: { y: -6, transition: { duration: 0.25, ease: EASE_OUT } },
};
const zoom: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.07, transition: { duration: 0.4, ease: EASE_OUT } },
};
const unfold: Variants = {
  rest: { opacity: 0, y: 14 },
  hover: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE_OUT } },
};
const restingTitle: Variants = {
  rest: { opacity: 1 },
  hover: { opacity: 0, transition: { duration: 0.2 } },
};

export default function ThumbnailCard({ show, index, rank }: ThumbnailCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const onImageLoad = useCallback(() => setImageLoaded(true), []);
  const onImageError = useCallback(() => setImageError(true), []);

  return (
    <motion.div
      className={`card-unit relative flex-shrink-0 ${rank ? "pl-9 sm:pl-12" : ""}`}
      variants={entrance}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
      custom={index}
    >
      {/* Rank numeral — sits behind the card's left edge */}
      {rank && (
        <span
          aria-hidden
          className="rank-digit pointer-events-none absolute -left-1 bottom-6 z-0 select-none text-[5rem] font-extrabold leading-[0.8] tracking-[-0.08em] sm:text-[6.5rem]"
        >
          {rank}
        </span>
      )}

      <motion.div
        initial="rest"
        whileHover="hover"
        animate="rest"
        className="relative z-[1] w-[200px] sm:w-[250px] lg:w-[278px]"
      >
        <Link href={`/show/${show.id}`} className="group block">
          <motion.div
            variants={lift}
            className="relative overflow-hidden rounded-lg bg-surface-alt ring-1 ring-white/5 transition-shadow duration-300 group-hover:shadow-[0_18px_44px_-12px_rgba(0,0,0,0.85)] group-hover:ring-white/15"
          >
            <div className="relative aspect-video">
              {/* Shimmer placeholder until the image resolves */}
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 shimmer" />
              )}

              {show.thumbnail_url && !imageError ? (
                <motion.div variants={zoom} className="absolute inset-0">
                  <Image
                    src={show.thumbnail_url}
                    alt={show.title}
                    fill
                    unoptimized
                    onLoad={onImageLoad}
                    onError={onImageError}
                    className={`object-cover transition-[opacity,filter,transform] duration-500 ${
                      imageLoaded
                        ? "scale-100 opacity-100 blur-0"
                        : "scale-105 opacity-0 blur-md"
                    }`}
                  />
                </motion.div>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/30 to-surface-alt p-4 text-center">
                  <span className="text-xs font-semibold text-text-muted line-clamp-2">
                    {show.title}
                  </span>
                </div>
              )}

              {/* Unfolding info panel */}
              <motion.div
                variants={unfold}
                className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3 pt-10"
              >
                <p className="type-overline text-[9px] text-accent-hover">
                  {show.genre ?? "Series"}
                </p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text">
                      {show.title}
                    </p>
                    <p className="truncate text-[11px] text-text-muted">
                      {show.creator_name}
                    </p>
                  </div>
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-text text-bg">
                    <Play className="h-3.5 w-3.5 fill-bg" />
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Resting title — cedes to the in-card panel on hover */}
          <motion.p
            variants={restingTitle}
            className="mt-2 truncate text-[13px] font-medium leading-tight text-text-muted"
          >
            {show.title}
          </motion.p>
        </Link>
      </motion.div>
    </motion.div>
  );
}
