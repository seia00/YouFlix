/* ==========================================================================
   HeroBannerClient — Client Component
   Renders the muted autoplaying YouTube iframe.
   Separated from HeroBanner to keep the server component lean.
   ========================================================================== */
"use client";

import { useEffect, useRef, useState } from "react";

interface HeroBannerClientProps {
  youtubeId: string;
}

export function HeroBannerClient({ youtubeId }: HeroBannerClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Load the YouTube IFrame API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Define the global callback
    (window as unknown as Record<string, unknown>).onYouTubeIframeAPIReady = () => {
      const isMobile = window.innerWidth < 768;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new (window as any).YT.Player(`hero-youtube-${youtubeId}`, {
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
          playlist: youtubeId, // required for looping
          start: isMobile ? 30 : 0,
        },
        events: {
          onReady: () => setIsReady(true),
        },
      });
    };

    return () => {
      delete (window as unknown as Record<string, unknown>).onYouTubeIframeAPIReady;
    };
  }, [youtubeId]);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      {/* Scale the iframe up for a "zoom-to-fill" cinematic crop */}
      <div className="absolute left-1/2 top-1/2 h-[177.78vh] w-[177.78vw] min-h-full min-w-full -translate-x-1/2 -translate-y-1/2">
        <div
          id={`hero-youtube-${youtubeId}`}
          className="h-full w-full"
          aria-hidden="true"
        />
      </div>

      {/* Fade-in overlay while player loads */}
      {!isReady && (
        <div className="absolute inset-0 bg-bg animate-fade-in" />
      )}

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
