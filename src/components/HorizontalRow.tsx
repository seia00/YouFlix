/* ==========================================================================
   HorizontalRow — Client Component
   A labelled, horizontally-scrollable shelf. Edge masks say "there's more
   this way" without arrows; the header carries a mono row index, a title
   count, a live scroll-progress tick, and assist arrows. The trending row
   renders ranked numerals.
   ========================================================================== */
"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ThumbnailCard from "./ThumbnailCard";
import type { ShowCard } from "@/lib/types";

interface HorizontalRowProps {
  label: string;
  shows: ShowCard[];
  /** Row position on the page — rendered as a mono marker (01, 02, …). */
  index?: number;
  /** Render giant rank numerals (trending row). */
  ranked?: boolean;
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function HorizontalRow({
  label,
  shows,
  index,
  ranked = false,
}: HorizontalRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  /* Edge state drives the masks + arrow affordances; progress is written
     straight to the DOM so scrolling never re-renders the cards. */
  const updateScrollState = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= max - 4);
    if (progressRef.current) {
      const p = max > 0 ? el.scrollLeft / max : 1;
      progressRef.current.style.transform = `scaleX(${p})`;
    }
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [updateScrollState, shows.length]);

  const scroll = (direction: "left" | "right") => {
    const el = rowRef.current;
    if (!el) return;
    const offset = Math.round(el.clientWidth * 0.85);
    el.scrollBy({ left: direction === "left" ? -offset : offset, behavior: "smooth" });
  };

  if (!shows || shows.length === 0) return null;

  return (
    <section className="relative">
      {/* Header — index, label, count, progress tick, assist arrows */}
      <div className="mb-3 flex items-end justify-between px-5 sm:px-10 lg:px-14">
        <div className="flex items-baseline gap-3">
          {typeof index === "number" && (
            <span className="font-mono text-[11px] tracking-[0.2em] text-text-dim">
              {pad(index + 1)}
            </span>
          )}
          <h2 className="text-lg font-bold tracking-[-0.02em] text-text sm:text-[22px]">
            {label}
          </h2>
          <span className="hidden translate-y-[-1px] font-mono text-[10px] uppercase tracking-[0.18em] text-text-dim sm:inline">
            {shows.length} {shows.length === 1 ? "title" : "titles"}
          </span>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="h-[2px] w-10 overflow-hidden rounded-full bg-white/10">
            <div
              ref={progressRef}
              className="h-full w-full origin-left bg-white/45 transition-transform duration-150 ease-out"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={atStart}
            className="rounded-full border border-border p-1.5 text-text-muted transition-all duration-200 hover:border-border-hover hover:text-text disabled:pointer-events-none disabled:opacity-30"
            aria-label={`Scroll ${label} left`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={atEnd}
            className="rounded-full border border-border p-1.5 text-text-muted transition-all duration-200 hover:border-border-hover hover:text-text disabled:pointer-events-none disabled:opacity-30"
            aria-label={`Scroll ${label} right`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Shelf — masked edges, snap scrolling, headroom for the hover lift */}
      <div
        ref={rowRef}
        onScroll={updateScrollState}
        data-at-start={atStart}
        data-at-end={atEnd}
        className="snap-row row-mask hide-scrollbar -mb-5 flex gap-3 overflow-x-auto px-5 pb-8 pt-2 sm:px-10 lg:px-14"
      >
        {shows.map((show, i) => (
          <ThumbnailCard
            key={show.id}
            show={show}
            index={i}
            rank={ranked ? i + 1 : undefined}
          />
        ))}
      </div>
    </section>
  );
}
