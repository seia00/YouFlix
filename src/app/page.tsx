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
          Hero Carousel — all 8 shows rotate on a timer
          ------------------------------------------------------------------ */}
      <Suspense fallback={<HeroBannerSkeleton />}>
        <HeroSection />
      </Suspense>

      {/* ------------------------------------------------------------------
          Content Rows — each row streams independently
          ------------------------------------------------------------------ */}
      <div className="-mt-16 relative z-30 space-y-8 pb-16">
        {rows.map((row) => (
          <Suspense key={row.id} fallback={<RowSkeleton />}>
            <HorizontalRow label={row.label} shows={row.shows} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}
