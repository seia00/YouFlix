/* ==========================================================================
   SearchModal — Client Component
   Command-K palette with Raycast materiality: deep backdrop dim, grouped
   results (Shows / Creators / Episodes), a selection highlight that glides
   between rows, and instant suggestions before you type.
   ========================================================================== */
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Play, User, Film, CornerDownLeft } from "lucide-react";
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

interface ResultSection {
  title: string;
  items: { result: SearchResult; flatIndex: number }[];
}

const SECTION_TITLES: Record<SearchResult["type"], string> = {
  show: "Shows",
  creator: "Creators",
  episode: "Episodes",
};

export default function SearchModal() {
  const router = useRouter();
  const isOpen = useUIStore((s) => s.isSearchOpen);
  const query = useUIStore((s) => s.searchQuery);
  const setQuery = useUIStore((s) => s.setSearchQuery);
  const close = useUIStore((s) => s.closeSearch);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const isBrowsing = query.trim() === "";

  /* Compute results from seed data */
  const results = useMemo<SearchResult[]>(() => {
    if (isBrowsing) {
      // Before typing: surface a browsable slice so the palette is never empty
      return SEED_SHOWS.slice(0, 6).map((show) => ({
        type: "show" as const,
        id: show.id,
        label: show.title,
        sublabel: SEED_CREATORS.find((c) => c.id === show.creator_id)?.name ?? "",
        href: `/show/${show.id}`,
        badge: show.genre ?? "Series",
      }));
    }

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
  }, [query, isBrowsing]);

  /* Group while preserving flat keyboard indices */
  const sections = useMemo<ResultSection[]>(() => {
    const grouped = new Map<string, ResultSection>();
    results.forEach((result, flatIndex) => {
      const title = isBrowsing ? "Suggested" : SECTION_TITLES[result.type];
      if (!grouped.has(title)) grouped.set(title, { title, items: [] });
      grouped.get(title)!.items.push({ result, flatIndex });
    });
    return [...grouped.values()];
  }, [results, isBrowsing]);

  /* Reset selection index when query changes */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIndex(0);
  }, [query]);

  /* Keyboard navigation */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      const move = (next: number) => {
        setSelectedIndex(next);
        document
          .getElementById(`search-item-${next}`)
          ?.scrollIntoView({ block: "nearest" });
      };
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          move((selectedIndex + 1) % Math.max(results.length, 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          move(selectedIndex <= 0 ? Math.max(results.length - 1, 0) : selectedIndex - 1);
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
      case "show":    return <Film className="h-4 w-4" />;
      case "episode": return <Play className="h-4 w-4" />;
      case "creator": return <User className="h-4 w-4" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md"
            onClick={close} aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-4 top-[12vh] z-[101] mx-auto max-w-xl"
          >
            <div className="overflow-hidden rounded-2xl bg-surface shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_24px_80px_-16px_rgba(0,0,0,0.9)]">
              {/* Input */}
              <div className="flex items-center gap-3 border-b border-border px-5 py-4">
                <Search className={`h-5 w-5 transition-colors duration-200 ${isBrowsing ? "text-text-dim" : "text-accent-hover"}`} />
                <input
                  type="text" value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search shows, episodes, creators..."
                  autoFocus
                  className="flex-1 bg-transparent text-base text-text placeholder:text-text-dim outline-none"
                />
                <button type="button" onClick={close}
                  className="rounded-lg p-1 text-text-muted transition-colors hover:bg-surface-alt hover:text-text"
                  aria-label="Close search">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[52vh] overflow-y-auto px-2 pb-2">
                {results.length === 0 ? (
                  <div className="px-3 py-12 text-center">
                    <p className="text-sm text-text-muted">
                      Nothing found for &ldquo;{query}&rdquo;.
                    </p>
                    <p className="mt-1 text-xs text-text-dim">
                      Try a show, an episode, or a creator name.
                    </p>
                  </div>
                ) : (
                  sections.map((section) => (
                    <div key={section.title}>
                      <p className="type-overline px-3 pb-1.5 pt-4 text-[9px] text-text-dim">
                        {section.title}
                      </p>
                      <ul>
                        {section.items.map(({ result: item, flatIndex }) => (
                          <li key={`${item.type}-${item.id}`}>
                            <button type="button"
                              id={`search-item-${flatIndex}`}
                              onClick={() => { router.push(item.href); close(); }}
                              onMouseEnter={() => setSelectedIndex(flatIndex)}
                              className="relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left">
                              {flatIndex === selectedIndex && (
                                <motion.span
                                  layoutId="search-highlight"
                                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                                  className="absolute inset-0 rounded-lg bg-white/[0.06] ring-1 ring-inset ring-white/10"
                                >
                                  <span className="absolute bottom-2 left-0 top-2 w-[2px] rounded-full bg-accent" />
                                </motion.span>
                              )}
                              <span className={`relative z-10 transition-colors duration-150 ${
                                flatIndex === selectedIndex ? "text-accent-hover" : "text-text-dim"
                              }`}>
                                {typeIcon(item.type)}
                              </span>
                              <span className="relative z-10 min-w-0 flex-1">
                                <span className="block truncate text-sm font-medium text-text">{item.label}</span>
                                <span className="block truncate text-xs text-text-muted">{item.sublabel}</span>
                              </span>
                              <span className="relative z-10 flex-shrink-0 rounded bg-white/[0.07] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-text-muted">
                                {item.badge}
                              </span>
                              {flatIndex === selectedIndex && (
                                <CornerDownLeft className="relative z-10 h-3.5 w-3.5 flex-shrink-0 text-text-dim" />
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-border px-5 py-2.5">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-[11px] text-text-dim">
                    <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">↑↓</kbd>
                    <span>Navigate</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-text-dim">
                    <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">↵</kbd>
                    <span>Open</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-text-dim">
                    <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">esc</kbd>
                    <span>Close</span>
                  </div>
                </div>
                {!isBrowsing && results.length > 0 && (
                  <span className="font-mono text-[10px] tracking-wider text-text-dim">
                    {results.length} {results.length === 1 ? "result" : "results"}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
