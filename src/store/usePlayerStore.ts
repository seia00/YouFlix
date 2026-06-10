/* ==========================================================================
   usePlayerStore — Zustand slice for YouTube playback state.
   Syncs watch progress to Supabase every 10 s via the PlayerSync service.
   ========================================================================== */

import { create } from "zustand";
import type { Episode, QueueItem } from "@/lib/types";

/* ------------------------------------------------------------------
   State shape
   ------------------------------------------------------------------ */
interface PlayerState {
  /* Current playback */
  currentEpisode: Episode | null;
  currentQueueItem: QueueItem | null;
  isPlaying: boolean;
  currentTime: number;      // seconds elapsed
  duration: number;         // total seconds
  volume: number;           // 0–100
  isMuted: boolean;

  /* Queue */
  queue: QueueItem[];

  /* UI overlay visibility */
  showControls: boolean;    // auto-hide overlay

  /* YouTube player readiness */
  isPlayerReady: boolean;

  /* Actions */
  playEpisode: (episode: Episode, queue: QueueItem[]) => void;
  pause: () => void;
  resume: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  setPlayerReady: (ready: boolean) => void;
  setShowControls: (show: boolean) => void;
  advanceQueue: () => void;
  syncProgress: (time: number) => void;
}

/* ------------------------------------------------------------------
   Store
   ------------------------------------------------------------------ */
export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentEpisode: null,
  currentQueueItem: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 80,
  isMuted: false,
  queue: [],
  showControls: true,
  isPlayerReady: false,

  /**
   * Load an episode and set the play queue.
   * The queue should already be ordered correctly (current + upcoming).
   */
  playEpisode: (episode, queue) =>
    set({
      currentEpisode: episode,
      currentQueueItem: queue[0] ?? null,
      queue,
      isPlaying: true,
      currentTime: 0,
      showControls: true,
    }),

  pause: () => set({ isPlaying: false }),

  resume: () => set({ isPlaying: true }),

  seek: (time) => set({ currentTime: time }),

  setVolume: (vol) => set({ volume: Math.max(0, Math.min(100, vol)) }),

  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),

  setPlayerReady: (ready) => set({ isPlayerReady: ready }),

  setShowControls: (show) => set({ showControls: show }),

  /**
   * Move to the next episode in the queue.
   * Shifts the queue and sets the new current item.
   */
  advanceQueue: () => {
    const { queue } = get();
    if (queue.length < 2) {
      set({ isPlaying: false });
      return;
    }
    const [, ...rest] = queue;
    const next = rest[0];
    if (!next) {
      set({ isPlaying: false });
      return;
    }
    set({
      currentEpisode: next.episode,
      currentQueueItem: next,
      queue: rest,
      currentTime: 0,
      isPlaying: true,
    });
  },

  /**
   * Called every second by the YouTube IFrame timer.
   * Stores the latest time; the sync service debounces persistence.
   */
  syncProgress: (time) => set({ currentTime: time }),
}));
