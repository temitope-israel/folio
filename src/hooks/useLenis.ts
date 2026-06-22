// src/hooks/useLenis.ts
// ============================================================
// SMOOTH SCROLL HOOK
// ============================================================
// Initializes Lenis smooth scroll and returns the Lenis instance
// so other hooks can read its scroll position directly.
// This is necessary because Framer Motion's useScroll listens to
// native browser scroll events — which Lenis replaces with its own
// synthetic scroll system. Without this, useScroll sees nothing.
// ============================================================

import { useEffect } from "react";
import Lenis from "lenis";

// We export the Lenis instance in a module-level ref so any component
// can access it without prop drilling or context.
// Module-level means it lives OUTSIDE React — it's a plain JS variable
// shared across the entire app, initialized once.
let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  // Getter function — any component can call this to access the
  // current Lenis instance after useLenis() has initialized it.
  return lenisInstance;
}

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisInstance = lenis;
    // Store the instance in the module-level variable so getLenis()
    // can return it from anywhere in the app.

    const raf = (time: number) => {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    };

    let animationFrameId: number;
    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      lenisInstance = null;
      // Reset to null on cleanup so getLenis() doesn't return
      // a destroyed instance.
    };
  }, []);
}