/* ==========================================================================
   Show Detail — Loading Skeleton
   ========================================================================== */

export default function Loading() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Banner skeleton */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-surface-alt" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-32 sm:px-8 lg:px-12">
          <div className="max-w-2xl space-y-4">
            <div className="shimmer h-6 w-24 rounded-full" />
            <div className="shimmer h-10 w-3/4 rounded-lg sm:h-12" />
            <div className="shimmer h-4 w-32 rounded-lg" />
            <div className="shimmer h-4 w-full rounded-lg" />
            <div className="shimmer h-4 w-2/3 rounded-lg" />
            <div className="flex gap-4 pt-4">
              <div className="shimmer h-12 w-36 rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Episodes skeleton */}
      <section className="mx-auto max-w-7xl px-6 pb-24 sm:px-8 lg:px-12">
        <div className="shimmer mb-6 h-10 w-48 rounded-lg" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-4 rounded-xl p-3">
              <div className="shimmer h-[90px] w-[160px] flex-shrink-0 rounded-lg sm:h-[113px] sm:w-[200px]" />
              <div className="flex flex-1 flex-col justify-center gap-2">
                <div className="shimmer h-4 w-3/4 rounded" />
                <div className="shimmer h-3 w-full rounded" />
                <div className="shimmer h-3 w-1/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
