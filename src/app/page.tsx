/* ==========================================================================
   Youflix — Home Page (Server Component)
   Fetches hero content and content rows, then renders the cinematic
   homepage layout with HeroBanner + HorizontalRows.
   ========================================================================== */

import { Suspense } from "react";
import HeroBanner from "@/components/HeroBanner";
import HorizontalRow from "@/components/HorizontalRow";
import { HeroBannerSkeleton, RowSkeleton } from "@/components/Skeleton";
import { getContentRows } from "@/lib/data";

/**
 * Home page is a Server Component that fetches all row data
 * and delegates rendering to client components for interactivity.
 */
export default async function HomePage() {
  const rows = await getContentRows();

  return (
    <div className="min-h-screen bg-bg">
      {/* ------------------------------------------------------------------
          Hero Banner — wrapped in Suspense for streaming
          ------------------------------------------------------------------ */}
      <Suspense fallback={<HeroBannerSkeleton />}>
        <HeroBanner />
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
