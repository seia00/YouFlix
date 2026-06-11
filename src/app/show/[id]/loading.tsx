/* ==========================================================================
   Show Detail — Loading Skeleton
   Mirrors the banner + episodes layout so content resolves in place.
   ========================================================================== */

export default function Loading() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Banner skeleton */}
      <section className="relative overflow-hidden">
        <div className="mx-auto flex min-h-[60svh] w-full max-w-[1400px] flex-col justify-end px-5 pb-12 pt-36 sm:px-10 lg:min-h-[68svh] lg:px-14">
          <div className="max-w-3xl space-y-5">
            <div className="shimmer h-3 w-44 rounded" />
            <div className="shimmer h-12 w-3/4 rounded-lg sm:h-16" />
            <div className="shimmer h-4 w-full max-w-xl rounded" />
            <div className="shimmer h-4 w-2/3 max-w-md rounded" />
            <div className="shimmer h-3 w-40 rounded" />
            <div className="pt-2">
              <div className="shimmer h-11 w-36 rounded-md" />
            </div>
          </div>
        </div>
      </section>

      {/* Episodes skeleton */}
      <section className="mx-auto max-w-[1400px] px-5 pb-28 pt-10 sm:px-10 lg:px-14">
        <div className="mb-6 flex items-end justify-between">
          <div className="shimmer h-7 w-36 rounded" />
          <div className="shimmer h-10 w-40 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 gap-1 lg:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 sm:gap-4">
              <div className="shimmer h-5 w-7 flex-shrink-0 rounded" />
              <div className="shimmer h-[78px] w-[138px] flex-shrink-0 rounded-lg sm:h-[101px] sm:w-[180px]" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="shimmer h-4 w-3/4 rounded" />
                <div className="shimmer h-3 w-full rounded" />
                <div className="shimmer h-3 w-1/4 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
