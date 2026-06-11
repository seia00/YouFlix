/* ==========================================================================
   HeroBannerClient — Client Component
   Renders a non-interactive YouTube iframe backdrop that fades in over
   the poster only once playback has actually started. Blocks all pointer
   events so YouTube's native UI never appears. Supports a controlled
   muted prop for the hero sound toggle.
   ========================================================================== */
"use client";

import { useEffect, useRef, useState } from "react";

interface HeroBannerClientProps {
  youtubeId: string;
  muted?: boolean;
}

// Keep track of whether the IFrame API script has been injected globally.
let _apiLoading = false;
const _pendingCallbacks: (() => void)[] = [];

function loadYouTubeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  if (_apiLoading) {
    return new Promise((resolve) => _pendingCallbacks.push(resolve));
  }
  _apiLoading = true;
  return new Promise((resolve) => {
    _pendingCallbacks.push(resolve);
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.getElementsByTagName("script")[0].parentNode?.insertBefore(tag, document.getElementsByTagName("script")[0]);
    (window as unknown as Record<string, () => void>).onYouTubeIframeAPIReady = () => {
      _apiLoading = false;
      _pendingCallbacks.forEach((cb) => cb());
      _pendingCallbacks.length = 0;
    };
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type YTPlayer = any;

export function HeroBannerClient({ youtubeId, muted = true }: HeroBannerClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const elementId = `hero-yt-${youtubeId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  useEffect(() => {
    let cancelled = false;

    async function init() {
      await loadYouTubeApi();
      if (cancelled) return;

      const isMobile = window.innerWidth < 768;

      try {
        playerRef.current = new window.YT.Player(elementId, {
          videoId: youtubeId,
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            playsinline: 1,
            loop: 1,
            playlist: youtubeId,
            start: isMobile ? 30 : 0,
            disablekb: 1,
            fs: 0,
          },
          events: {
            onReady: () => { if (!cancelled) setIsReady(true); },
            onStateChange: (e: { data: number }) => {
              if (!cancelled && e.data === 1) setIsPlaying(true);
            },
          },
        });
      } catch {
        // Player creation can fail if element not found during rapid switches
      }
    }

    init();

    return () => {
      cancelled = true;
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch { /* */ }
        playerRef.current = null;
      }
      setIsReady(false);
      setIsPlaying(false);
    };
  }, [youtubeId, elementId]);

  /* Controlled mute — the hero's sound toggle */
  useEffect(() => {
    const player = playerRef.current;
    if (!player || !isReady) return;
    try {
      if (muted) player.mute();
      else player.unMute();
    } catch { /* */ }
  }, [muted, isReady]);

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden transition-opacity duration-700 ${
        isPlaying ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Scale the iframe up for a cinematic zoom-to-fill crop */}
      <div className="absolute left-1/2 top-1/2 h-[177.78vh] w-[177.78vw] min-h-full min-w-full -translate-x-1/2 -translate-y-1/2">
        <div
          id={elementId}
          className="h-full w-full"
          aria-hidden="true"
        />
      </div>

      {/* ------------------------------------------------------------------
          CRITICAL: Transparent shield absorbs all pointer events before
          they reach the YouTube iframe, preventing the pause button and
          title overlay from ever appearing. The video is purely ambient.
          ------------------------------------------------------------------ */}
      <div className="absolute inset-0 z-10" />

      {/* Dark vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(9,9,9,0.55) 100%)",
        }}
      />
    </div>
  );
}
