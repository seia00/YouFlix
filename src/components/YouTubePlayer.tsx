/* ==========================================================================
   YouTubePlayer — Client Component
   Wraps the YouTube IFrame API in React. Manages player lifecycle,
   state syncs to Zustand, and exposes imperative controls.
   ========================================================================== */
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";

interface YouTubePlayerProps {
  youtubeId: string;
  onEnded?: () => void;
}

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  getVolume(): number;
  setVolume(volume: number): void;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  getPlayerState(): number;
  destroy(): void;
}

declare global {
  interface Window {
    YT: { Player: new (elementId: string, config: Record<string, unknown>) => YTPlayer; PlayerState: Record<string, number> };
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

const PLAYER_STATES = {
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
};

export default function YouTubePlayer({ youtubeId, onEnded }: YouTubePlayerProps) {
  const playerRef = useRef<YTPlayer | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerId = `yt-player-${youtubeId}`;
  const [isReady, setIsReady] = useState(false);
  const [playerError, setPlayerError] = useState(false);

  const syncProgress = usePlayerStore((s) => s.syncProgress);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const volume = usePlayerStore((s) => s.volume);
  const isMuted = usePlayerStore((s) => s.isMuted);
  const setPlayerReady = usePlayerStore((s) => s.setPlayerReady);
  const pause = usePlayerStore((s) => s.pause);
  const resume = usePlayerStore((s) => s.resume);

  const startProgressSync = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      try { syncProgress(playerRef.current?.getCurrentTime() ?? 0); } catch { /* */ }
    }, 1000);
  }, [syncProgress]);

  const stopProgressSync = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  /* Initialize / reinitialize player when youtubeId changes */
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setPlayerError(false);
    setIsReady(false);
    /* eslint-enable react-hooks/set-state-in-effect */

    function createPlayer() {
      if (playerRef.current) { try { playerRef.current.destroy(); } catch { /* */ } playerRef.current = null; }
      stopProgressSync();

      try {
        playerRef.current = new window.YT.Player(containerId, {
          videoId: youtubeId,
          playerVars: {
            autoplay: 1, controls: 0, modestbranding: 1, rel: 0,
            showinfo: 0, iv_load_policy: 3, playsinline: 1, fs: 1,
          },
          events: {
            onReady: () => {
              setIsReady(true);
              setPlayerReady(true);
              const p = playerRef.current;
              if (p) {
                const s = usePlayerStore.getState();
                p.setVolume(s.volume);
                if (s.isMuted) { p.mute(); } else { p.unMute(); }
              }
              startProgressSync();
            },
            onStateChange: (event: { data: number }) => {
              switch (event.data) {
                case PLAYER_STATES.PLAYING: resume(); startProgressSync(); break;
                case PLAYER_STATES.PAUSED: pause(); stopProgressSync(); break;
                case PLAYER_STATES.ENDED: stopProgressSync(); onEnded?.(); break;
              }
            },
            onError: () => { setPlayerError(true); setIsReady(false); },
          },
        });
      } catch { setPlayerError(true); }
    }

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.getElementsByTagName("script")[0].parentNode?.insertBefore(tag, document.getElementsByTagName("script")[0]);
      window.onYouTubeIframeAPIReady = createPlayer;
    } else {
      createPlayer();
    }

    return () => {
      stopProgressSync();
      if (playerRef.current) { try { playerRef.current.destroy(); } catch { /* */ } playerRef.current = null; }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeId]);

  /* React to Zustand state */
  useEffect(() => {
    const p = playerRef.current;
    if (!p || !isReady) return;
    if (isPlaying) { p.playVideo(); } else { p.pauseVideo(); }
  }, [isPlaying, isReady]);

  useEffect(() => {
    const p = playerRef.current;
    if (!p || !isReady) return;
    p.setVolume(volume);
  }, [volume, isReady]);

  useEffect(() => {
    const p = playerRef.current;
    if (!p || !isReady) return;
    if (isMuted) { p.mute(); } else { p.unMute(); }
  }, [isMuted, isReady]);

  /* Keyboard shortcuts */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const p = playerRef.current;
      if (!p || !isReady) return;
      switch (e.key) {
        case " ": case "k":
          e.preventDefault();
          if (isPlaying) { p.pauseVideo(); pause(); } else { p.playVideo(); resume(); }
          break;
        case "ArrowRight": e.preventDefault(); p.seekTo(p.getCurrentTime() + 10, true); break;
        case "ArrowLeft": e.preventDefault(); p.seekTo(Math.max(0, p.getCurrentTime() - 10), true); break;
        case "ArrowUp": e.preventDefault(); usePlayerStore.getState().setVolume(Math.min(100, volume + 5)); break;
        case "ArrowDown": e.preventDefault(); usePlayerStore.getState().setVolume(Math.max(0, volume - 5)); break;
        case "m": e.preventDefault(); usePlayerStore.getState().toggleMute(); break;
        case "f": e.preventDefault(); document.querySelector("#player-container")?.requestFullscreen?.(); break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isReady, isPlaying, volume, pause, resume]);

  return (
    <>
      <div id={containerId} className="absolute inset-0" aria-label="YouTube video player" />
      {!isReady && !playerError && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-border border-t-accent" />
            <p className="text-sm text-text-muted">Loading player...</p>
          </div>
        </div>
      )}
      {playerError && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg">
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-lg font-semibold text-text">Unable to load video</p>
            <p className="text-sm text-text-muted">This video may be unavailable or restricted.</p>
          </div>
        </div>
      )}
    </>
  );
}
