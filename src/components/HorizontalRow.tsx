/* ==========================================================================
   HorizontalRow — Client Component
   Renders a labelled, horizontally-scrollable row of ThumbnailCards.
   Supports Framer Motion hover-scale, snap scrolling, and lazy loading.
   ========================================================================== */
"use client";

import { useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import ThumbnailCard from "./ThumbnailCard";
import type { ShowCard } from "@/lib/types";

interface HorizontalRowProps {
  label: string;
  shows: ShowCard[];
}

/**
 * Scroll amount in px per arrow click.
 * Approximately 4 cards of width on desktop.
 */
const SCROLL_OFFSET = 1200;

export default function HorizontalRow({ label, shows }: HorizontalRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  /**
   * Recalculates scroll edge visibility.
   * Called on scroll and after arrow clicks.
   */
  const updateScrollState = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  /** Scroll horizontally by a given offset. */
  const scroll = (direction: "left" | "right") => {
    const el = rowRef.current;
    if (!el) return;
    const offset = direction === "left" ? -SCROLL_OFFSET : SCROLL_OFFSET;
    el.scrollBy({ left: offset, behavior: "smooth" });
    // After smooth scroll, re-check after animation ends
    setTimeout(updateScrollState, 400);
  };

  if (!shows || shows.length === 0) return null;

  return (
    <section
      className="relative group/row"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Row label */}
      <h2 className="mb-3 px-6 text-lg font-semibold tracking-wide text-text sm:px-8 lg:px-12 sm:text-xl">
        {label}
      </h2>

      {/* Scroll container */}
      <div className="relative">
        {/* Left arrow */}
        <motion.button
          type="button"
          className="absolute left-0 top-0 bottom-0 z-30 flex w-12 items-center justify-center bg-gradient-to-r from-bg/90 to-transparent opacity-0 transition-opacity duration-300 group-hover/row:opacity-100"
          initial={false}
          animate={{ opacity: canScrollLeft && isHovered ? 1 : 0 }}
          onClick={() => scroll("left")}
          aria-label={`Scroll ${label} left`}
        >
          <ChevronLeft className="h-8 w-8 text-text drop-shadow-lg" />
        </motion.button>

        {/* Cards row */}
        <div
          ref={rowRef}
          className="snap-row hide-scrollbar flex gap-2 overflow-x-auto px-6 pb-4 sm:px-8 lg:px-12"
          onScroll={updateScrollState}
        >
          {shows.map((show, index) => (
            <ThumbnailCard
              key={show.id}
              show={show}
              index={index}
            />
          ))}
        </div>

        {/* Right arrow */}
        <motion.button
          type="button"
          className="absolute right-0 top-0 bottom-0 z-30 flex w-12 items-center justify-center bg-gradient-to-l from-bg/90 to-transparent opacity-0 transition-opacity duration-300 group-hover/row:opacity-100"
          initial={false}
          animate={{ opacity: canScrollRight && isHovered ? 1 : 0 }}
          onClick={() => scroll("right")}
          aria-label={`Scroll ${label} right`}
        >
          <ChevronRight className="h-8 w-8 text-text drop-shadow-lg" />
        </motion.button>
      </div>
    </section>
  );
}
