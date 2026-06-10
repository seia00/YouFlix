/* ==========================================================================
   SearchModal — Client Component
   Command-K style global search overlay. Filters Creators, Shows,
   and Episodes from the seed data instantly.
   ========================================================================== */
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Play, User, Film } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/store/useUIStore";
import {
  SEED_CREATORS,
  SEED_SHOWS,
  SEED_EPISODES,
  SEED_SEASONS,
} from "@/lib/seed-data";

interface SearchResult {
  type: "show" | "episode" | "creator";
  id: string;
  label: string;
  sublabel: string;
  href: string;
  badge: string;
}

export default function SearchModal() {
  const router = useRouter();
  const isOpen = useUIStore((s) => s.isSearchOpen);
  const query = useUIStore((s) => s.searchQuery);
  const setQuery = useUIStore((s) => s.setSearchQuery);
  const close = useUIStore((s) => s.closeSearch);
  const [selectedIndex, setSelectedIndex] = useState(0);

  /* Compute results from seed data */
  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    const items: SearchResult[] = [];

    for (const show of SEED_SHOWS) {
      if (show.title.toLowerCase().includes(q)) {
        const creator = SEED_CREATORS.find((c) => c.id === show.creator_id);
        items.push({
          type: "show", id: show.id, label: show.title,
          sublabel: creator?.name ?? "Unknown", href: `/show/${show.id}`,
          badge: show.genre ?? "Series",
        });
      }
    }
    for (const creator of SEED_CREATORS) {
      if (creator.name.toLowerCase().includes(q)) {
        items.push({
          type: "creator", id: creator.id, label: creator.name,
          sublabel: creator.bio ?? "",
          href: `/show/${SEED_SHOWS.find((s) => s.creator_id === creator.id)?.id ?? ""}`,
          badge: "Creator",
        });
      }
    }
    for (const episode of SEED_EPISODES) {
      if (episode.title.toLowerCase().includes(q)) {
        const season = SEED_SEASONS.find((s) => s.id === episode.season_id);
        const show = season ? SEED_SHOWS.find((s) => s.id === season.show_id) : null;
        items.push({
          type: "episode", id: episode.id, label: episode.title,
          sublabel: show?.title ?? "Unknown Show", href: `/watch/${episode.id}`,
          badge: show ? `S${season?.season_number}:E${episode.episode_number}` : "",
        });
      }
    }
    return items.slice(0, 20);
  }, [query]);

  /* Reset selection index when query changes */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIndex(0);
  }, [query]);

  /* Keyboard navigation */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % Math.max(results.length, 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev <= 0 ? Math.max(results.length - 1, 0) : prev - 1));
          break;
        case "Enter":
          e.preventDefault();
          if (results[selectedIndex]) {
            router.push(results[selectedIndex].href);
            close();
          }
          break;
        case "Escape":
          e.preventDefault();
          close();
          break;
      }
    },
    [isOpen, results, selectedIndex, router, close],
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  /* Global Cmd+K shortcut */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const store = useUIStore.getState();
        if (store.isSearchOpen) store.closeSearch();
        else store.openSearch();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const typeIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "show":    return <Film className="h-4 w-4 text-text-muted" />;
      case "episode": return <Play className="h-4 w-4 text-text-muted" />;
      case "creator": return <User className="h-4 w-4 text-text-muted" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
            onClick={close} aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -16 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-x-4 top-[15vh] z-[101] mx-auto max-w-xl"
          >
            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/50 backdrop-blur-2xl">
              <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
                <Search className="h-5 w-5 text-text-muted" />
                <input
                  type="text" value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search shows, episodes, creators..."
                  autoFocus
                  className="flex-1 bg-transparent text-sm text-text placeholder:text-text-muted/60 outline-none"
                />
                <button type="button" onClick={close}
                  className="rounded-lg p-1 text-text-muted transition-colors hover:bg-surface-alt hover:text-text"
                  aria-label="Close search">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="max-h-[50vh] overflow-y-auto p-2">
                {query.trim() === "" ? (
                  <div className="px-3 py-10 text-center text-sm text-text-muted">
                    Type to search across all shows, episodes, and creators.
                  </div>
                ) : results.length === 0 ? (
                  <div className="px-3 py-10 text-center text-sm text-text-muted">
                    Nothing found for &ldquo;{query}&rdquo;.
                  </div>
                ) : (
                  <ul>
                    {results.map((item, index) => (
                      <li key={item.id}>
                        <button type="button"
                          onClick={() => { router.push(item.href); close(); }}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                            index === selectedIndex ? "bg-accent/15" : "hover:bg-surface-alt"
                          }`}>
                          {typeIcon(item.type)}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-text truncate">{item.label}</p>
                            <p className="text-xs text-text-muted truncate">{item.sublabel}</p>
                          </div>
                          <span className="flex-shrink-0 rounded bg-white/10 px-2 py-0.5 text-[10px] font-medium uppercase text-text-muted">
                            {item.badge}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex items-center gap-4 border-t border-border px-4 py-2.5">
                <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                  <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px]">↑↓</kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                  <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px]">↵</kbd>
                  <span>Select</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                  <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px]">Esc</kbd>
                  <span>Close</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
