// src/hooks/useLenis.ts
// ============================================================
// SMOOTH SCROLL HOOK
// ============================================================
// Lenis is a smooth scroll library. It intercepts the browser's
// native scroll and applies a smooth, eased animation to it.
// This hook initializes Lenis once and wires it into React's
// lifecycle so it starts when the app mounts and cleans up
// properly when the app unmounts.
// ============================================================

import {useEffect} from "react";
// useEffect for initialization and clean up.

import Lenis from "Lenis";
// Import the Lenis class. To be instantiated inside useEffect.

export function useLenis (){
    // This is our custom hook.
  // It takes no arguments — Lenis needs no configuration from outside.
  // It returns nothing — it has no state to share with the component.
  // Its entire job is the SIDE EFFECT of initializing Lenis.

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
        // Lenis configuration object

        duration: 1.2,
        // How long (in seconds) the smooth scroll animation takes
      // to decelerate to a stop after you stop scrolling.
      // Lower = snappier. Higher = more floaty.
      // 1.2 seconds is a premium, high-end feel.
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        // The easing function controls the scroll CURVE — how it
      // accelerates and decelerates.
      //
      // t → a value from 0 (start) to 1 (end) representing scroll progress
      // This specific formula is an "exponential ease-out":
      //   - Starts fast (immediately responsive to your scroll input)
      //   - Decelerates exponentially (feels natural, like inertia)
      //   - Math.min(1, ...) clamps the value so it never exceeds 1
      //   - Math.pow(2, -10 * t) → 2 to the power of (-10 × t)
      //     When t=0: Math.pow(2, 0) = 1 → 1.001 - 1 = 0.001 (near zero)
      //     When t=1: Math.pow(2, -10) = 0.001 → 1.001 - 0.001 ≈ 1 (full)
      // You don't need to memorize this formula — just know it creates
      // a smooth, decelerating scroll curve.
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      // true → applies smooth easing to mouse wheel scroll input.
      // false → mouse wheel scrolls at the browser's native speed.
      // We want smooth, so true.
      wheelMultiplier: 1,
      // How sensitive the scroll is to mouse wheel input.
      // 1 = normal speed. 1.5 = 50% faster. 0.8 = slower.

      touchMultiplier: 2,
      // How sensitive the scroll is to touch (mobile) input.
      // 2 = touch scrolls twice as fast as wheel.
      // Touch needs higher multiplier to feel responsive on mobile.
    });


      // --------------------------------------------------------
    // The Animation Frame Loop
    // --------------------------------------------------------
    // Lenis doesn't automatically connect to the browser's rendering cycle.
    // We need to tell it to update on every animation frame.
    //
    // requestAnimationFrame (RAF) is a browser API that calls a function
    // before the next screen paint. Screens typically refresh 60 times
    // per second (60fps) — RAF calls your function ~60 times per second.
    //
    // By calling lenis.raf(time) in every frame, Lenis can calculate
    // how far to scroll based on elapsed time and apply the easing.
    let animationFrameId: number;
    // We store the frame ID in a variable so we can cancel it in cleanup.
    // number => RAF returns a numeric ID.

    const raf =(time: number)  =>{
        // This function runs on every animation frame (~60 times per second)
      // time → the timestamp passed by requestAnimationFrame (in milliseconds)
      //        it increases continuously as the page runs

      lenis.raf(time);
      // Tell Lenis about the current timestamp.
      // Lenis uses consecutive timestamps to calculate velocity and
      // apply the easing curve to the scroll position.

      animationFrameId = requestAnimationFrame(raf);
      // Schedule the NEXT frame — this creates a self-perpetuating loop:
      // raf() runs → schedules another raf() → runs → schedules another...
      // This loop runs for the entire lifetime of the app.

      animationFrameId = requestAnimationFrame(raf);
      // Start the loop - scheduel the first time.
      // Once it starts, it continues until we cancel it.



      // -=========================
      // Cleanup
      // ==========================
      return() =>{
        // This runs when the component using this hook unmounts.
      // In our case, App.tsx uses this hook — it unmounts when the
      // page closes. Cleanup prevents memory leaks.


      cancelAnimationFrame(animationFrameId)
      // cancelAnimationFrame stops the RAF loop.
      // Without this, the loop would try to run even after the
      // component is gone — wasted CPU cycles.


      lenis.destroy();
      // lenis.destroy() removes all event listeners Lenis added to the
      // window and restores native scroll behavior.
      // Without this, scroll events would keep firing with no component
      // to receive them.
      };

    }
  }, []);

  // Empty dependency array → run once when the hook is first used.
  // Lenis should initialize once and run for the app's lifetime.

  // This hook returns nothing.
  // Its value is entirely in the SIDE EFFECT — Lenis running silently.
}