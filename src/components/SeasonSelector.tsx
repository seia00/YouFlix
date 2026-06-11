/* ==========================================================================
   SeasonSelector — Client Component
   Dropdown-style season picker for the show detail page.
   ========================================================================== */
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Season } from "@/lib/types";

interface SeasonSelectorProps {
  seasons: Season[];
  selectedSeasonId: string;
  onSelect: (seasonId: string) => void;
}

export default function SeasonSelector({
  seasons,
  selectedSeasonId,
  onSelect,
}: SeasonSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedSeason = seasons.find((s) => s.id === selectedSeasonId);
  const label = selectedSeason
    ? `Season ${selectedSeason.season_number}${selectedSeason.title ? `: ${selectedSeason.title}` : ""}`
    : "Select Season";

  if (seasons.length <= 1) {
    return (
      <span className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-text-muted">
        {label}
      </span>
    );
  }

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-text transition-all duration-200 hover:border-border-hover hover:bg-surface-alt"
      >
        <span>{label}</span>
        <ChevronDown
          className={`h-4 w-4 text-text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            className="absolute left-0 top-full z-40 mt-2 min-w-[260px] overflow-hidden rounded-xl border border-border bg-surface shadow-2xl shadow-black/40 backdrop-blur-xl"
          >
            <div className="p-1">
              {seasons
                .sort((a, b) => a.season_number - b.season_number)
                .map((season) => {
                  const isSelected = season.id === selectedSeasonId;
                  return (
                    <button
                      key={season.id}
                      type="button"
                      onClick={() => {
                        onSelect(season.id);
                        setIsOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors duration-150 ${
                        isSelected
                          ? "bg-accent/15 text-accent-hover"
                          : "text-text-muted hover:bg-surface-alt hover:text-text"
                      }`}
                    >
                      <span className="flex-1">
                        Season {season.season_number}
                        {season.title && (
                          <span className="ml-1 text-text-muted/60">
                            — {season.title}
                          </span>
                        )}
                      </span>
                      {isSelected && (
                        <span className="h-2 w-2 rounded-full bg-accent" />
                      )}
                    </button>
                  );
                })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop click handler */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
