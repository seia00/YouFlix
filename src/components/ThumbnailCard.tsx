/* ==========================================================================
   ThumbnailCard — Client Component
   Renders a single show thumbnail with Framer Motion hover animation,
   lazy-loaded image, and shimmer placeholder.
   Links to the show detail page.
   ========================================================================== */
"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { ShowCard } from "@/lib/types";

interface ThumbnailCardProps {
  show: ShowCard;
  index: number;
}

/**
 * Framer Motion variants for staggered entrance animation.
 */
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.45,
      ease: [0.23, 1, 0.32, 1] as const,
    },
  }),
};

/**
 * Card dimensions — Netflix-style portrait-ish aspect ratio.
 */
const CARD_WIDTH = 280;
const CARD_HEIGHT = 158;
const HOVER_SCALE = 1.08;

export default function ThumbnailCard({ show, index }: ThumbnailCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const onImageLoad = useCallback(() => setImageLoaded(true), []);
  const onImageError = useCallback(() => setImageError(true), []);

  return (
    <motion.div
      className="relative flex-shrink-0 cursor-pointer"
      style={{ width: CARD_WIDTH }}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      custom={index}
      whileHover={{ scale: HOVER_SCALE, zIndex: 50 }}
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
    >
      <Link href={`/show/${show.id}`} className="block">
        {/* Thumbnail container */}
        <div
          className="relative overflow-hidden rounded-lg bg-surface-alt"
          style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
        >
          {/* Shimmer placeholder */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 shimmer" />
          )}

          {/* YouTube thumbnail */}
          {show.thumbnail_url ? (
            <Image
              src={show.thumbnail_url}
              alt={show.title}
              width={CARD_WIDTH}
              height={CARD_HEIGHT}
              unoptimized
              onLoad={onImageLoad}
              onError={onImageError}
              className={`h-full w-full object-cover transition-opacity duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          ) : (
            /* Fallback gradient when no thumbnail URL */
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/40 to-surface-alt p-4 text-center">
              <span className="text-xs font-semibold text-text-muted line-clamp-2">
                {show.title}
              </span>
            </div>
          )}

          {/* Hover overlay — gradient fill from bottom */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-bg/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        {/* Title below card */}
        <p className="mt-2 text-sm font-medium leading-tight text-text-muted transition-colors duration-300 group-hover:text-text line-clamp-1">
          {show.title}
        </p>
      </Link>
    </motion.div>
  );
}
