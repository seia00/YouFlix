/* ==========================================================================
   Youflix — Home Page (Server Component)
   Fetches hero content and content rows, then renders the cinematic
   homepage layout with HeroCarousel + HorizontalRows.
   ========================================================================== */

import { Suspense } from "react";
import HeroSection from "@/components/HeroSection";
import HorizontalRow from "@/components/HorizontalRow";
import { HeroBannerSkeleton, RowSkeleton } from "@/components/Skeleton";
import { getContentRows } from "@/lib/data";

export default async function HomePage() {
  const rows = await getContentRows();

  return (
    <div className="min-h-screen bg-bg">
      {/* ------------------------------------------------------------------
          Hero Carousel — all shows rotate as a teaser reel
          ------------------------------------------------------------------ */}
      <Suspense fallback={<HeroBannerSkeleton />}>
        <HeroSection />
      </Suspense>

      {/* ------------------------------------------------------------------
          Content Rows — trending gets ranked numerals, each row streams
          ------------------------------------------------------------------ */}
      <div className="relative z-30 space-y-10 pb-24 pt-8">
        {rows.map((row, index) => (
          <Suspense key={row.id} fallback={<RowSkeleton />}>
            <HorizontalRow
              label={row.label}
              shows={row.shows}
              index={index}
              ranked={row.id === "trending"}
            />
          </Suspense>
        ))}
      </div>
    </div>
  );
}
