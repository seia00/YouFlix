/* ==========================================================================
   Skeleton — Loading placeholders for async components.
   Includes: HeroBannerSkeleton, RowSkeleton, CardSkeleton.
   ========================================================================== */

function shimmerClass() {
  return "shimmer rounded-lg";
}

/* ------------------------------------------------------------------
   Hero Banner skeleton — matches the HeroBanner layout dimensions
   ------------------------------------------------------------------ */
export function HeroBannerSkeleton() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="flex min-h-[85vh] flex-col justify-end px-6 pb-24 pt-48 sm:px-8 lg:px-12">
        <div className="max-w-2xl space-y-4">
          {/* Genre badge placeholder */}
          <div className={`${shimmerClass()} h-6 w-24`} />
          {/* Title placeholder */}
          <div className={`${shimmerClass()} h-10 w-3/4 sm:h-14`} />
          {/* Creator placeholder */}
          <div className={`${shimmerClass()} h-4 w-32`} />
          {/* Description placeholder — two lines */}
          <div className={`${shimmerClass()} h-4 w-full`} />
          <div className={`${shimmerClass()} h-4 w-2/3`} />
          {/* CTA buttons */}
          <div className="flex gap-4 pt-4">
            <div className={`${shimmerClass()} h-12 w-36`} />
            <div className={`${shimmerClass()} h-12 w-32`} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   Content row skeleton — label + row of card skeletons
   ------------------------------------------------------------------ */
export function RowSkeleton() {
  return (
    <div className="px-6 pb-8 sm:px-8 lg:px-12">
      {/* Label */}
      <div className={`${shimmerClass()} mb-3 h-6 w-48`} />
      {/* Cards row */}
      <div className="flex gap-2 overflow-hidden">
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
    <div
      className="flex-shrink-0"
      style={{ width: 280 }}
    >
      <div
        className={`${shimmerClass()}`}
        style={{ width: 280, height: 158 }}
      />
      <div
        className={`${shimmerClass()} mt-2 h-4`}
        style={{ width: "75%" }}
      />
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
      {Array.from({ length: 3 }).map((_, i) => (
        <RowSkeleton key={i} />
      ))}
    </>
  );
}
