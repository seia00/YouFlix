/* ==========================================================================
   HeroCTAButtons — Client Component
   Interactive CTA buttons for the HeroBanner (Play + More Info).
   Separated so HeroBanner can remain a Server Component.
   ========================================================================== */
"use client";

interface HeroCTAButtonsProps {
  watchHref: string;
}

export function HeroCTAButtons({ watchHref }: HeroCTAButtonsProps) {
  return (
    <div className="mt-8 flex flex-wrap gap-4">
      {/* Play S1:E1 */}
      <a
        href={watchHref}
        className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-accent-hover hover:scale-105 active:scale-95"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M8 5.14v14l11-7-11-7z" />
        </svg>
        Play S1:E1
      </a>

      {/* More Info */}
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-8 py-3.5 text-sm font-semibold text-text backdrop-blur-md transition-all duration-300 hover:bg-white/20"
        onClick={() => {
          window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        More Info
      </button>
    </div>
  );
}
