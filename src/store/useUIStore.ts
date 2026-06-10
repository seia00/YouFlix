/* ==========================================================================
   useUIStore — Zustand slice for global UI state (search, nav, loading).
   ========================================================================== */

import { create } from "zustand";

/* ------------------------------------------------------------------
   State shape
   ------------------------------------------------------------------ */
interface UIState {
  /* Command‑K search modal */
  isSearchOpen: boolean;
  searchQuery: string;

  /* Mobile navigation */
  isMobileNavOpen: boolean;

  /* Global loading bar */
  isRouteLoading: boolean;

  /* Actions */
  openSearch: () => void;
  closeSearch: () => void;
  setSearchQuery: (q: string) => void;
  toggleMobileNav: () => void;
  setRouteLoading: (loading: boolean) => void;
}

/* ------------------------------------------------------------------
   Store
   ------------------------------------------------------------------ */
export const useUIStore = create<UIState>((set) => ({
  isSearchOpen: false,
  searchQuery: "",
  isMobileNavOpen: false,
  isRouteLoading: false,

  openSearch: () => set({ isSearchOpen: true, searchQuery: "" }),
  closeSearch: () => set({ isSearchOpen: false, searchQuery: "" }),
  setSearchQuery: (q) => set({ searchQuery: q }),

  toggleMobileNav: () => set((s) => ({ isMobileNavOpen: !s.isMobileNavOpen })),

  setRouteLoading: (loading) => set({ isRouteLoading: loading }),
}));
