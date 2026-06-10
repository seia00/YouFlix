/* ==========================================================================
   Search Page — /search
   Minimal page; the actual search is the SearchModal (Cmd+K).
   This page serves as a standalone fallback for direct navigation.
   ========================================================================== */

import { Search } from "lucide-react";

export default function SearchPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="text-center">
        <Search className="mx-auto h-12 w-12 text-text-muted/40" />
        <h2 className="mt-4 text-xl font-semibold text-text">
          Press{" "}
          <kbd className="rounded border border-border bg-surface-alt px-2 py-0.5 text-sm">
            ⌘K
          </kbd>{" "}
          to search
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          Search across all shows, episodes, and creators instantly.
        </p>
      </div>
    </div>
  );
}
