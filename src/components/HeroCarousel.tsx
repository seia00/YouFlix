/* ==========================================================================
   HeroCarousel — Client Component
   The opening shot. A rotating, full-bleed teaser reel: poster crossfades
   under an ambient YouTube player, masked title reveals, a filmstrip of
   upcoming slides with a draining progress bar, swipe on touch, sound
   toggle, and scroll parallax into the rows below.
   ========================================================================== */
"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Volume2, VolumeX } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  type PanInfo,
  type Variants,
} from "framer-motion";
import { HeroBannerClient } from "./HeroBannerClient";
import type { HeroSlide } from "@/lib/types";

interface HeroCarouselProps {
  slides: HeroSlide[];
}

const ROTATE_MS = 8000;
const SWIPE_THRESHOLD = 70;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_IN = [0.55, 0, 0.1, 1] as const;

/* Swipe is only wired on touch devices (hover: none) */
function subscribeTouch(callback: () => void) {
  const mq = window.matchMedia("(hover: none)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
const getIsTouch = () => window.matchMedia("(hover: none)").matches;

/* Text choreography — the title rises out of a mask like a film credit,
   supporting lines follow with a short stagger. */
const blockVariants: Variants = {
  enter: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  exit: { transition: { staggerChildren: 0.03 } },
};
const maskVariants: Variants = {
  initial: { y: "112%" },
  enter: { y: "0%", transition: { duration: 0.75, ease: EASE_OUT } },
  exit: { y: "-112%", transition: { duration: 0.4, ease: EASE_IN } },
};
const riseVariants: Variants = {
  initial: { opacity: 0, y: 18 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease: EASE_IN } },
};

const pad = (n: number) => String(n).padStart(2, "0");

/* ------------------------------------------------------------------
   Poster — instant backdrop while the video player warms up.
   hqdefault always exists; maxres is layered on top and dropped if
   YouTube returns its tiny gray placeholder.
   ------------------------------------------------------------------ */
function Poster({ youtubeId, title }: { youtubeId: string; title: string }) {
  const [hasMaxres, setHasMaxres] = useState(true);
  return (
    <>
      <Image
        src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
        alt=""
        aria-hidden
        fill
        unoptimized
        className="scale-110 object-cover blur-md"
      />
      {hasMaxres && (
        <Image
          src={`https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`}
          alt={title}
          fill
          unoptimized
          priority
          className="object-cover"
          onLoad={(e) => {
            if (e.currentTarget.naturalWidth < 320) setHasMaxres(false);
          }}
        />
      )}
    </>
  );
}

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const len = slides.length;
  const [active, setActive] = useState(0);
  // Bumped to restart the rotation timer + progress drain (manual nav, tab refocus)
  const [cycle, setCycle] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const isTouch = useSyncExternalStore(subscribeTouch, getIsTouch, () => false);

  const hero = slides[active];

  const step = useCallback(
    (dir: 1 | -1) => {
      setActive((prev) => (prev + dir + len) % len);
      setCycle((c) => c + 1);
    },
    [len],
  );

  const select = useCallback((index: number) => {
    setActive(index);
    setCycle((c) => c + 1);
  }, []);

  /* Auto-rotate — one timeout per slide cycle, restartable via `cycle` */
  useEffect(() => {
    if (len <= 1) return;
    const t = setTimeout(() => step(1), ROTATE_MS);
    return () => clearTimeout(t);
  }, [active, cycle, len, step]);

  /* Re-sync the drain bar when the tab comes back into focus */
  useEffect(() => {
    const onVisibility = () => {
      if (!document.hidden) setCycle((c) => c + 1);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  /* Keyboard arrows — ignored while typing anywhere (e.g. search modal) */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  const onDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      if (info.offset.x < -SWIPE_THRESHOLD) step(1);
      else if (info.offset.x > SWIPE_THRESHOLD) step(-1);
    },
    [step],
  );

  /* Scroll parallax — the hero content recedes as the rows arrive */
  const { scrollY } = useScroll();
  const contentY = useTransform(scrollY, [0, 600], [0, 90]);
  const contentOpacity = useTransform(scrollY, [0, 440], [1, 0]);
  const backdropOpacity = useTransform(scrollY, [0, 700], [1, 0.3]);

  if (!hero) return null;

  return (
    <section
      className="relative w-full overflow-hidden bg-bg"
      aria-label="Featured shows"
    >
      {/* Backdrop — poster crossfade with the ambient player on top */}
      <motion.div style={{ opacity: backdropOpacity }} className="absolute inset-0 z-0 grain">
        <AnimatePresence initial={false}>
          <motion.div
            key={hero.show.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
          >
            <Poster youtubeId={hero.trailer_youtube_id} title={hero.show.title} />
            <HeroBannerClient
              key={hero.trailer_youtube_id}
              youtubeId={hero.trailer_youtube_id}
              muted={isMuted}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Light architecture — one composed gradient, no stacking of fades */}
      <div className="absolute inset-0 z-10 gradient-hero pointer-events-none" />

      {/* Content */}
      <motion.div
        drag={isTouch ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        dragMomentum={false}
        onDragEnd={onDragEnd}
        className="relative z-20 flex min-h-[92svh] flex-col justify-end"
      >
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="mx-auto w-full max-w-[1400px] px-5 pb-20 pt-44 sm:px-10 lg:px-14 lg:pb-16"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={hero.show.id}
              variants={blockVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className="max-w-3xl lg:pr-44"
            >
              {/* Overline — genre, rule, creator */}
              <motion.div
                variants={riseVariants}
                className="type-overline mb-4 flex items-center gap-3"
              >
                {hero.show.genre && (
                  <span className="text-accent-hover">{hero.show.genre}</span>
                )}
                <span className="h-px w-8 bg-white/30" aria-hidden />
                <span className="text-text-muted">{hero.creator.name}</span>
              </motion.div>

              {/* Title — masked rise */}
              <div className="overflow-hidden pb-[0.08em]">
                <motion.h1
                  variants={maskVariants}
                  className="type-display text-[clamp(2.625rem,8.5vw,6rem)] text-text"
                >
                  {hero.show.title}
                </motion.h1>
              </div>

              {/* Description */}
              {hero.show.description && (
                <motion.p
                  variants={riseVariants}
                  className="mt-5 max-w-xl text-sm leading-relaxed text-text-muted sm:text-base line-clamp-3 sm:line-clamp-2"
                >
                  {hero.show.description}
                </motion.p>
              )}

              {/* CTAs */}
              <motion.div variants={riseVariants} className="mt-7 flex items-center gap-3">
                <Link
                  href={hero.watch_href}
                  className="inline-flex items-center gap-2.5 rounded-md bg-text px-6 py-3 text-sm font-semibold text-bg transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97] sm:px-7"
                >
                  <Play className="h-4 w-4 fill-bg" />
                  Play S1 · E1
                </Link>
                <Link
                  href={`/show/${hero.show.id}`}
                  className="inline-flex items-center rounded-md bg-white/10 px-5 py-3 text-sm font-semibold text-text backdrop-blur-sm transition-colors duration-200 hover:bg-white/20 active:scale-[0.97] sm:px-6"
                >
                  Details
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Desktop chrome — sound, index counter, filmstrip with drain bar */}
      <div className="absolute bottom-8 right-14 z-30 hidden flex-col items-end gap-4 lg:flex">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsMuted((m) => !m)}
            className="rounded-full border border-white/15 bg-black/30 p-2.5 text-text-muted backdrop-blur-sm transition-colors duration-200 hover:border-white/40 hover:text-text"
            aria-label={isMuted ? "Unmute trailer" : "Mute trailer"}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <span className="font-mono text-[11px] tracking-[0.25em] text-text-muted">
            {pad(active + 1)} / {pad(len)}
          </span>
        </div>

        {len > 1 && (
          <div className="flex gap-2">
            {slides.map((s, i) => (
              <button
                key={s.show.id}
                type="button"
                onClick={() => select(i)}
                aria-label={`Featured ${i + 1}: ${s.show.title}`}
                aria-current={i === active}
                className={`relative h-[52px] w-[92px] overflow-hidden rounded transition-all duration-300 ${
                  i === active
                    ? "ring-1 ring-white/50"
                    : "opacity-40 saturate-50 hover:opacity-90 hover:saturate-100"
                }`}
              >
                <Image
                  src={`https://i.ytimg.com/vi/${s.trailer_youtube_id}/mqdefault.jpg`}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover"
                />
                {i === active && (
                  <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/20">
                    <motion.div
                      key={`${active}-${cycle}`}
                      className="h-full origin-left bg-accent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: ROTATE_MS / 1000, ease: "linear" }}
                    />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mobile chrome — sound toggle + story-style progress segments */}
      <button
        type="button"
        onClick={() => setIsMuted((m) => !m)}
        className="absolute bottom-12 right-5 z-30 rounded-full border border-white/15 bg-black/30 p-2.5 text-text-muted backdrop-blur-sm transition-colors lg:hidden"
        aria-label={isMuted ? "Unmute trailer" : "Mute trailer"}
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>

      {len > 1 && (
        <div className="absolute inset-x-5 bottom-5 z-30 flex gap-1.5 lg:hidden">
          {slides.map((s, i) => (
            <button
              key={s.show.id}
              type="button"
              onClick={() => select(i)}
              aria-label={`Featured ${i + 1}: ${s.show.title}`}
              className="-my-2 flex-1 py-2"
            >
              <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/20">
                {i < active && <div className="h-full w-full bg-white/60" />}
                {i === active && (
                  <motion.div
                    key={`${active}-${cycle}`}
                    className="h-full origin-left bg-accent"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: ROTATE_MS / 1000, ease: "linear" }}
                  />
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
