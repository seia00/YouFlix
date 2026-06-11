/* ==========================================================================
   Watch Page — Loading
   The lights are already down; just a quiet pulse while the reel loads.
   ========================================================================== */

export default function Loading() {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-5">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-accent" />
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
          Loading episode
        </p>
      </div>
    </div>
  );
}
