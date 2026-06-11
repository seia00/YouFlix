/* ==========================================================================
   HeroCarousel — Client Component
   Netflix-style rotating hero banner. Cycles through all shows with
   auto-rotation, navigation dots, and cinematic fade transitions.
   ========================================================================== */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { HeroBannerClient } from "./HeroBannerClient";
import { HeroCTAButtons } from "./HeroCTAButtons";
import type { HeroContent } from "@/lib/types";

interface HeroCarouselProps {
  slides: HeroContent[];
}

const AUTO_ROTATE_MS = 8000;

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const len = slides.length;
  const hero = slides[activeIndex];
  if (!hero) return null;

  const goTo = useCallback((index: number) => {
    setActiveIndex((index + len) % len);
  }, [len]);

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  /* Auto-rotate */
  useEffect(() => {
    if (isPaused || len <= 1) return;
    timerRef.current = setInterval(next, AUTO_ROTATE_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPaused, next, len]);

  /* Keyboard arrows */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  return (
    <section
      className="relative w-full overflow-hidden"
      aria-label="Featured shows"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background YouTube player — key forces remount on slide change */}
      <div className="absolute inset-0 z-0">
        <HeroBannerClient key={hero.trailer_youtube_id} youtubeId={hero.trailer_youtube_id} />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-10 gradient-hero pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 z-10 h-32 gradient-bottom pointer-events-none" />

      {/* Content — animated slide */}
      <div className="relative z-20 mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-end px-6 pb-24 pt-48 sm:px-8 lg:px-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={hero.show.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="max-w-2xl"
          >
            {/* Genre badge */}
            {hero.show.genre && (
              <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-medium uppercase tracking-widest text-text backdrop-blur-md">
                {hero.show.genre}
              </span>
            )}

            {/* Title */}
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-text sm:text-5xl lg:text-6xl xl:text-7xl">
              {hero.show.title}
            </h1>

            {/* Creator */}
            <p className="mt-3 text-sm font-medium text-accent">
              by {hero.creator.name}
            </p>

            {/* Description */}
            <p className="mt-4 max-w-lg text-base leading-relaxed text-text-muted sm:text-lg">
              {hero.show.description}
            </p>

            {/* CTAs */}
            <HeroCTAButtons watchHref={`/watch/${hero.trailer_youtube_id}`} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      {len > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/30 p-3 text-text backdrop-blur-md transition-all hover:bg-black/50 hover:scale-110"
            aria-label="Previous show"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/30 p-3 text-text backdrop-blur-md transition-all hover:bg-black/50 hover:scale-110"
            aria-label="Next show"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {len > 1 && (
        <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 gap-2">
          {slides.map((s, i) => (
            <button
              key={s.show.id}
              type="button"
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-8 bg-accent"
                  : "w-1.5 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Show ${i + 1}: ${s.show.title}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
