/* ==========================================================================
   Show Not Found
   ========================================================================== */

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-text-muted/30">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-text">Show Not Found</h2>
        <p className="mt-2 text-sm text-text-muted">
          The show you are looking for doesn&apos;t exist or has been removed.
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
