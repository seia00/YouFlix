/* ==========================================================================
   PlayerOverlay — Client Component
   Custom Netflix-style controls overlay for the watch page.
   Auto-hides after inactivity. Uses Zustand for state.
   ========================================================================== */
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Play,
  Pause,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayerStore } from "@/store/usePlayerStore";

const AUTO_HIDE_DELAY = 4000; // ms before controls fade

export default function PlayerOverlay() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const volume = usePlayerStore((s) => s.volume);
  const isMuted = usePlayerStore((s) => s.isMuted);
  const showControls = usePlayerStore((s) => s.showControls);
  const currentQueueItem = usePlayerStore((s) => s.currentQueueItem);

  const pause = usePlayerStore((s) => s.pause);
  const resume = usePlayerStore((s) => s.resume);
  const setShowControls = usePlayerStore((s) => s.setShowControls);
  const setVolume = usePlayerStore((s) => s.setVolume);
  const toggleMute = usePlayerStore((s) => s.toggleMute);
  const advanceQueue = usePlayerStore((s) => s.advanceQueue);

  /* ------------------------------------------------------------------
     Auto-hide controls
     ------------------------------------------------------------------ */
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, AUTO_HIDE_DELAY);
  }, [setShowControls]);

  useEffect(() => {
    if (isPlaying) resetHideTimer();
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [isPlaying, resetHideTimer]);

  /* Mouse move shows controls */
  const handleMouseMove = useCallback(() => {
    if (isPlaying) resetHideTimer();
  }, [isPlaying, resetHideTimer]);

  /* Fullscreen change listener */
  useEffect(() => {
    const onFSChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFSChange);
    return () => document.removeEventListener("fullscreenchange", onFSChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  /* ------------------------------------------------------------------
     Format time as mm:ss or h:mm:ss
     ------------------------------------------------------------------ */
  const fmt = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    const pad = (n: number) => String(n).padStart(2, "0");
    if (h > 0) return `${h}:${pad(m)}:${pad(sec)}`;
    return `${m}:${pad(sec)}`;
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-20 flex flex-col justify-between"
      onMouseMove={handleMouseMove}
      onClick={() => {
        if (isPlaying) {
          pause();
        } else {
          resume();
        }
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        toggleFullscreen();
      }}
    >
      {/* ------------------------------------------------------------------
          Top bar — back button + episode info
          ------------------------------------------------------------------ */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-4 px-6 py-4 gradient-top"
          >
            {/* Back */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                router.back();
              }}
              className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-sm text-text backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </button>

            {/* Episode title */}
            {currentQueueItem && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text">
                  {currentQueueItem.show_title}
                </p>
                <p className="truncate text-xs text-text-muted">
                  S{currentQueueItem.season_number}:E{currentQueueItem.episode.episode_number} — {currentQueueItem.episode.title}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------------
          Bottom bar — progress + controls
          ------------------------------------------------------------------ */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25 }}
            className="gradient-bottom px-6 pb-6 pt-16"
          >
            {/* Progress bar */}
            <div
              className="group/progress relative mb-4 h-1 w-full cursor-pointer rounded-full bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = (e.clientX - rect.left) / rect.width;
                usePlayerStore.getState().seek(pct * usePlayerStore.getState().duration);
              }}
            >
              {/* Buffered (placeholder for future) */}
              <div className="absolute inset-y-0 left-0 rounded-full bg-white/30" style={{ width: "0%" }} />
              {/* Progress */}
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-accent transition-[width] duration-200 group-hover/progress:bg-accent-hover"
                style={{ width: `${progressPct}%` }}
              />
              {/* Thumb */}
              <div
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 scale-0 rounded-full bg-accent group-hover/progress:scale-100 transition-transform"
                style={{ left: `${progressPct}%` }}
              />
            </div>

            {/* Controls row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Play / Pause */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isPlaying) pause();
                    else resume();
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-text transition-transform hover:scale-110 active:scale-90"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="h-7 w-7 fill-text" />
                  ) : (
                    <Play className="h-7 w-7 fill-text" />
                  )}
                </button>

                {/* Skip */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    advanceQueue();
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-text transition-transform hover:scale-110 active:scale-90"
                  aria-label="Next episode"
                >
                  <SkipForward className="h-6 w-6 fill-text" />
                </button>

                {/* Volume */}
                <div className="group/vol hidden items-center gap-2 sm:flex">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute();
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-text transition-colors hover:text-accent-hover"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      e.stopPropagation();
                      setVolume(Number(e.target.value));
                    }}
                    className="h-1 w-20 cursor-pointer accent-accent opacity-0 transition-opacity group-hover/vol:opacity-100"
                    aria-label="Volume"
                  />
                </div>

                {/* Time */}
                <span className="ml-2 text-xs tabular-nums text-text-muted">
                  {fmt(currentTime)} / {duration > 0 ? fmt(duration) : "--:--"}
                </span>
              </div>

              {/* Fullscreen */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full text-text transition-transform hover:scale-110"
                aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize className="h-5 w-5" />
                ) : (
                  <Maximize className="h-5 w-5" />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
