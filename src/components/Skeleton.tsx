/* ==========================================================================
   Skeleton — Loading placeholders for async components.
   Shaped to match the real layouts so content arrives, not replaces.
   ========================================================================== */

/* ------------------------------------------------------------------
   Hero skeleton — full-height, bottom-left composition
   ------------------------------------------------------------------ */
export function HeroBannerSkeleton() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="mx-auto flex min-h-[92svh] w-full max-w-[1400px] flex-col justify-end px-5 pb-20 pt-44 sm:px-10 lg:px-14">
        <div className="max-w-3xl space-y-5">
          {/* Overline */}
          <div className="shimmer h-3 w-44 rounded" />
          {/* Title — two monumental lines */}
          <div className="space-y-3">
            <div className="shimmer h-14 w-4/5 rounded-lg sm:h-20" />
            <div className="shimmer h-14 w-3/5 rounded-lg sm:h-20" />
          </div>
          {/* Description */}
          <div className="shimmer h-4 w-full max-w-xl rounded" />
          <div className="shimmer h-4 w-2/3 max-w-md rounded" />
          {/* CTAs */}
          <div className="flex gap-3 pt-2">
            <div className="shimmer h-11 w-36 rounded-md" />
            <div className="shimmer h-11 w-28 rounded-md" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   Content row skeleton — header + shelf of card skeletons
   ------------------------------------------------------------------ */
export function RowSkeleton() {
  return (
    <div>
      <div className="mb-3 flex items-end justify-between px-5 sm:px-10 lg:px-14">
        <div className="flex items-baseline gap-3">
          <div className="shimmer h-3 w-6 rounded" />
          <div className="shimmer h-6 w-44 rounded" />
        </div>
        <div className="hidden gap-2 lg:flex">
          <div className="shimmer h-7 w-7 rounded-full" />
          <div className="shimmer h-7 w-7 rounded-full" />
        </div>
      </div>
      <div className="flex gap-3 overflow-hidden px-5 pb-3 pt-2 sm:px-10 lg:px-14">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Card skeleton — matches ThumbnailCard dimensions
   ------------------------------------------------------------------ */
export function CardSkeleton() {
  return (
    <div className="w-[200px] flex-shrink-0 sm:w-[250px] lg:w-[278px]">
      <div className="shimmer aspect-video rounded-lg" />
      <div className="shimmer mt-2 h-3.5 w-3/4 rounded" />
    </div>
  );
}

/* ------------------------------------------------------------------
   Homepage full loading state
   ------------------------------------------------------------------ */
export function HomePageSkeleton() {
  return (
    <>
      <HeroBannerSkeleton />
      <div className="space-y-10 pt-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <RowSkeleton key={i} />
        ))}
      </div>
    </>
  );
}
