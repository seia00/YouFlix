/* ==========================================================================
   Watch Page — Loading
   ========================================================================== */

export default function Loading() {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="h-14 w-14 animate-spin rounded-full border-2 border-border border-t-accent" />
        <p className="text-sm text-text-muted">Loading episode...</p>
      </div>
    </div>
  );
}
