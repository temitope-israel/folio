// src/hooks/useCounterAnimation.ts
// ============================================================
// COUNTER ANIMATION HOOK
// ============================================================
// Animates a number from 0 to a target value when the element
// enters the viewport. Used for the stat counters in About.
// ============================================================

import { useState, useEffect, useRef } from "react";

interface UseCounterAnimationOptions {
  target: number;
  // The final number to count up to

  duration?: number;
  // How long the count animation takes in milliseconds. Default 2000ms.

  startOnView?: boolean;
  // If true, animation only starts when the element is visible.
  // Default true — counters animate when scrolled into view,
  // not immediately on page load (they might be off-screen).
}

export function useCounterAnimation({
  target,
  duration = 2000,
  startOnView = true,
}: UseCounterAnimationOptions) {

  const [count, setCount] = useState(0);
  // The currently displayed number — starts at 0, animates to target.

  const [hasStarted, setHasStarted] = useState(!startOnView);
  // hasStarted controls whether the animation has begun.
  // If startOnView is false → hasStarted starts as true (start immediately).
  // If startOnView is true  → hasStarted starts as false (wait for visibility).
  // !startOnView flips the boolean:
  //   startOnView = true  → !true  = false (don't start yet)
  //   startOnView = false → !false = true  (start immediately)

  const elementRef = useRef<HTMLDivElement>(null);
  // Ref to attach to the counter element so we can observe its visibility.

  // --------------------------------------------------------
  // IntersectionObserver — detect when element enters viewport
  // --------------------------------------------------------
  useEffect(() => {
    if (!startOnView) return;
    // If startOnView is false, we don't need to observe visibility.
    // hasStarted is already true, so the counter animation effect below
    // will start immediately.

    const observer = new IntersectionObserver(
      (entries) => {
        // IntersectionObserver calls this callback whenever the observed
        // element enters or exits the viewport.
        // entries → array of IntersectionObserverEntry objects.
        // Each entry describes one observed element's intersection state.

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // isIntersecting → true when the element is visible in the viewport.
            setHasStarted(true);
            // Trigger the counter animation.

            observer.disconnect();
            // disconnect() stops observing entirely.
            // We only need to start the animation ONCE —
            // once it starts, there's no reason to keep watching.
          }
        });
      },
      { threshold: 0.3 }
      // threshold: 0.3 → trigger when 30% of the element is visible.
      // 0 = trigger as soon as any pixel is visible.
      // 1 = trigger only when 100% is visible.
      // 0.3 is a good balance — element is clearly in view before animating.
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
      // Start observing the element referenced by elementRef.
      // When it enters the viewport, the callback above fires.
    }

    return () => observer.disconnect();
    // Cleanup — stop observing when the component unmounts.
  }, [startOnView]);

  // --------------------------------------------------------
  // Counter animation — runs when hasStarted becomes true
  // --------------------------------------------------------
  useEffect(() => {
    if (!hasStarted) return;
    // Don't run until visibility is confirmed (or startOnView is false).

    if (target === 0) return;
    // Edge case: if target is 0, nothing to count. Avoid division by zero.

    const steps = 60;
    // Number of increments in the animation.
    // 60 steps over 2000ms = one step every ~33ms ≈ 60fps.
    // This matches the browser's typical refresh rate.

    const increment = target / steps;
    // How much to add on each step.
    // Example: target=100, steps=60 → increment ≈ 1.67 per step.

    const intervalTime = duration / steps;
    // Time between each step: 2000ms / 60 steps ≈ 33ms.

    let current = 0;

    const interval = setInterval(() => {
      current += increment;
      // Add the increment to the running total.

      if (current >= target) {
        setCount(target);
        // Snap to the exact target — prevents floating point overshoot.
        // Without this: might display 99.98 or 100.02 due to floating point math.
        clearInterval(interval);
        return;
      }

      setCount(Math.floor(current));
      // Math.floor() → round DOWN to nearest integer.
      // Counters should show whole numbers (not 47.33).
    }, intervalTime);

    return () => clearInterval(interval);
    // Cleanup — stop the interval if the component unmounts mid-animation.
  }, [hasStarted, target, duration]);

  return { count, elementRef };
  // Return both the current count AND the ref.
  // The component attaches elementRef to its DOM element so the
  // IntersectionObserver can watch it.
}