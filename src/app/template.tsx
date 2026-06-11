/* ==========================================================================
   Template — Route Transition
   Remounts on every navigation: each page arrives with a quiet fade so
   route changes read as a cut, not a reload. Opacity only — transforms
   here would break fixed-position descendants like the watch overlay.
   ========================================================================== */
"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
