/* ==========================================================================
   Watch Page — Not Found
   ========================================================================== */

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-text-muted/20">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-text">Episode Not Found</h2>
        <p className="mt-2 text-sm text-text-muted">
          This episode may have been removed or the link is incorrect.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-accent-hover"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
