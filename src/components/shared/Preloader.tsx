// src/components/shared/Preloader.tsx
// ============================================================
// PRELOADER COMPONENT
// ============================================================
// Shown when the page first loads. Displays:
//   1. Initials "TI" that animate in with a stagger
//   2. A progress bar that fills from 0% to 100%
//   3. A subtle tagline that fades in
// After the animation completes, it calls onComplete()
// which tells App.tsx to hide the preloader.
// ============================================================

import { useEffect, useState } from "react";
// useEffect → to trigger the progress bar animation and call onComplete
// useState  → to track the progress bar percentage (0 to 100)

import { motion } from "framer-motion";
// motion → Framer Motion's animatable elements

import { personalInfo } from "@/data";
// We'll use personalInfo.name to derive the initials

// ============================================================
// COMPONENT PROPS
// ============================================================
interface PreloaderProps {
  onComplete: () => void;
  // onComplete is a function prop — the parent passes a function,
  // and the Preloader calls it when it's done animating.
  // () => void means: a function that takes no arguments and returns nothing.
  // This pattern is how child components communicate upward to parents
  // without the child knowing anything about the parent.
}

// ============================================================
// ANIMATION VARIANTS
// ============================================================
// Defined OUTSIDE the component — they're constants, no need to
// recreate them on every render.

const containerVariants = {
  // The outer container that holds the initials
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      // 200ms delay between each letter animating in.
      // With 2 letters (T and I), the sequence is:
      //   0ms   → T starts animating
      //   200ms → I starts animating
      delayChildren: 0.3,
      // Wait 300ms before starting the first child's animation.
      // Gives the page a moment to settle before the preloader starts.
    },
  },
  exit: {
    opacity: 0,
    scale: 1.05,
    // As the preloader exits: fade out AND scale up very slightly.
    // This creates a "zooming away" feel — more interesting than a plain fade.
    transition: {
      duration: 0.6,
      ease: "easeInOut",
      // easeInOut → starts slow, speeds up in the middle, slows at end.
      // Feels balanced and intentional.
    },
  },
} as const;

const letterVariants = {
  // Each individual letter (T, I)
  hidden: {
    opacity: 0,
    y: 40,
    // Start 40px below final position
    filter: "blur(8px)",
    // Start blurry — gives a "materializing from nothing" effect.
    // filter: blur() is GPU-accelerated — safe for animations.
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    // End at: fully visible, correct position, sharp
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
      // Cubic bezier easing — custom curve defined by 4 control points.
      // [0.25, 0.46, 0.45, 0.94] is a well-known "ease out quart" curve.
      // It starts very fast (punchy) then decelerates smoothly.
      // Compare to built-in:
      //   "easeOut"  → [0, 0, 0.58, 1]     — standard
      //   our curve  → starts even faster, more dramatic entry
    },
  },
} as const;

const taglineVariants = {
  // The subtitle below the initials
  hidden: {
    opacity: 0,
    letterSpacing: "0.3em",
    // Start with very wide letter spacing — text feels "spread out"
  },
  visible: {
    opacity: 1,
    letterSpacing: "0.15em",
    // Animates to tighter spacing — feels like the text "snaps together"
    transition: {
      duration: 0.8,
      delay: 0.9,
      // Start after the letters have fully appeared (0.3 delay + 0.7 duration ≈ 1s)
      // Slight overlap at 0.9 to keep momentum.
      ease: "easeOut",
    },
  },
} as const;

// NOTE: progressBarVariants removed — we use state-driven width instead.
// Framer Motion's scaleX on a thin element was unreliable across browsers.
// Driving width directly from React state is simpler and more predictable.

// ============================================================
// COMPONENT
// ============================================================
export default function Preloader({ onComplete }: PreloaderProps) {
  // { onComplete }: PreloaderProps → destructuring the props.
  // Instead of: (props) => props.onComplete
  // We write: ({ onComplete }) → extract onComplete directly.

  const [progress, setProgress] = useState(0);
  // progress tracks the numeric percentage (0–100).
  // We display it as text: "0%", "47%", "100%"
  // We also use it to trigger onComplete when it hits 100.

  // Derive initials from personalInfo.name
  const initials = personalInfo.name
    .split(" ")
    // .split(" ") → splits the string at every space character.
    // "Temitope Israel Omoniyi" → ["Temitope", "Israel", "Omoniyi"]
    .slice(0, 2)
    // .slice(0, 2) → takes elements from index 0 up to (not including) index 2.
    // ["Temitope", "Israel", "Omoniyi"] → ["Temitope", "Israel"]
    .map((word) => word[0])
    // .map((word) => word[0]) → for each word, take the first character (index 0).
    // ["Temitope", "Israel"] → ["T", "I"]
    .join("")
    // .join("") → joins array elements into a string with no separator.
    // ["T", "I"] → "TI"
    .toUpperCase();
  // .toUpperCase() → converts to uppercase (already uppercase, but safe practice).
  // "TI" → "TI"

  // Split initials into an array of individual characters for stagger animation
  const letters = initials.split("");
  // "TI".split("") → ["T", "I"]
  // We need them as separate elements so each can animate independently.

  // --------------------------------------------------------
  // Progress counter animation
  // --------------------------------------------------------
  useEffect(() => {
    // Animate the progress number from 0 to 100 over ~2 seconds.
    // We use setInterval to increment it in small steps.

    const duration = 2000;
    // Total duration in milliseconds — matches the visual fill duration.

    const steps = 100;
    // We'll increment 100 times (0→1→2→...→100).

    const intervalTime = duration / steps;
    // Time between each increment: 2000ms / 100 steps = 20ms per step.

    let current = 0;
    // Local counter — starts at 0.

    const interval = setInterval(() => {
      // setInterval calls a function repeatedly every `intervalTime` milliseconds.
      // Returns an ID we can use to stop it.

      current += 1;
      // Increment the counter by 1 each time.

      setProgress(current);
      // Update React state — triggers a re-render to show the new number.
      // This also drives the progress bar width via the style prop below.

      if (current >= 100) {
        clearInterval(interval);
        // clearInterval stops the interval from firing again.
        // Without this, it would keep running past 100 forever.

        setTimeout(() => {
          onComplete();
          // Call the parent's onComplete function AFTER a short pause.
          // setTimeout delays execution by the specified milliseconds.
          // 400ms pause after 100% before the preloader fades out.
          // Gives the user a moment to register "100%" before it disappears.
        }, 400);
      }
    }, intervalTime);

    return () => {
      clearInterval(interval);
      // Cleanup: if the component unmounts before the interval completes
      // (unlikely but possible), stop the interval to prevent memory leaks.
    };
  }, [onComplete]);
  // Dependency: onComplete. We list it because the effect uses it.
  // onComplete is a function passed from the parent — its reference is
  // stable (won't change), so this effect runs only once.

  // --------------------------------------------------------
  // Render
  // --------------------------------------------------------
  return (
    <motion.div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-bg-base"
      /*
        fixed           → position: fixed — covers the entire viewport
        inset-0         → top: 0, right: 0, bottom: 0, left: 0 (shorthand for all four)
                          Combined with fixed, this makes the element fill the screen.
        z-[99999]       → above everything, including the custom cursor (z-9999)
        flex            → flexbox container
        flex-col        → children stack vertically (column direction)
        items-center    → horizontally center children
        justify-center  → vertically center children
        bg-bg-base      → our deep blue-black background
      */
      variants={containerVariants}
      // Attach the container variant object.

      initial="hidden"
      // Start in the "hidden" state defined in containerVariants.

      animate="visible"
      // Animate to the "visible" state.

      exit="exit"
      // When AnimatePresence removes this element, animate to "exit" state.
      // Without AnimatePresence in the parent, this does nothing.
    >
      {/* ------------------------------------------------
          INITIALS
      ------------------------------------------------ */}
      <div className="flex items-end gap-1 mb-8">
        {/*
          flex         → children (letters) sit side by side
          items-end    → align letters to their bottom edge.
                         Useful if letters have different heights.
          gap-1        → 4px gap between letters
          mb-8         → 32px margin below the initials block
        */}

        {letters.map((letter, index) => (
          // .map() over ["T", "I"] to render each letter as a motion element.
          // letter → the current character ("T" or "I")
          // index  → the position (0, 1) — used for the key prop

          <motion.span
            key={index}
            // key={index} → unique identifier for each element in the list.
            // Using index as key is fine here because:
            // 1. The list never reorders
            // 2. Items are never added/removed dynamically
            // In dynamic lists (like a todo app), always use a stable ID.

            variants={letterVariants}
            // Each letter uses letterVariants.
            // The parent (containerVariants) has staggerChildren: 0.2 —
            // so "T" animates first, then "I" starts 200ms later.
            // The child does NOT need initial/animate — inherited from parent.

            className="text-[120px] font-bold leading-none text-text-primary font-display"
            /*
              text-[120px]      → font-size: 120px. Arbitrary value in Tailwind v4.
                                  Square brackets let you use any value not in the scale.
              font-bold         → font-weight: 700
              leading-none      → line-height: 1 (no extra line height — tight)
              text-text-primary → color: var(--color-text-primary) → #F4F6F9
              font-display      → font-family: var(--font-display) → Bricolage Grotesque
            */
          >
            {letter}
            {/* Renders "T" for the first iteration, "I" for the second */}
          </motion.span>
        ))}

        {/* Animated dot after initials — adds a design detail */}
        <motion.span
          variants={letterVariants}
          // Inherits from parent — animates in after "I" (200ms later)
          className="text-[120px] font-bold leading-none text-brand mb-1"
          /*
            text-brand → color: var(--color-brand) → #2D6FE0 (our deep blue)
            mb-1       → 4px bottom margin — nudges the dot up slightly
                         to optically align with the baseline of the letters
          */
        >
          .
        </motion.span>
      </div>

      {/* ------------------------------------------------
          TAGLINE
      ------------------------------------------------ */}
      <motion.p
        variants={taglineVariants}
        // Uses taglineVariants — separate from the container's stagger.
        // The container's stagger only affects direct children with variants.
        // taglineVariants has its own delay (0.9s) defined internally.
        className="text-text-muted text-sm font-body uppercase"
        /*
          text-text-muted → color: #5C6675 — subtle, doesn't compete with initials
          text-sm         → font-size: 0.875rem (14px)
          font-body       → Inter
          uppercase       → text-transform: uppercase
        */
      >
        {personalInfo.title}
        {/* Renders "Full-Stack Developer" */}
      </motion.p>

      {/* ------------------------------------------------
          PROGRESS BAR
      ------------------------------------------------ */}
      <div className="absolute bottom-0 left-0 right-0 h-[6px] bg-bg-border">
        {/*
          absolute        → position: absolute, relative to the nearest
                            positioned ancestor (the fixed motion.div above).
          bottom-0        → pinned to the bottom edge
          left-0 right-0  → spans full width
          h-[2px]         → height: 2px — thin, minimal progress bar
          bg-bg-border    → track color: #1F2733 (dark, barely visible)
        */}

        <div
          className="h-full bg-brand"
          /*
            h-full   → height: 100% (fills the 2px track)
            bg-brand → color: #2D6FE0 — blue fill
          */
          style={{
            width: `${progress}%`,
            // progress state (0→100) drives the width directly.
            // Template literal: `${progress}%` → "0%", "1%", ... "100%"
            // We use plain CSS width instead of Framer Motion scaleX because:
            // scaleX on a 2px element is unreliable — browsers sometimes
            // collapse sub-pixel transforms. Width from state is rock solid.
            transition: "width 0.02s linear",
            // Smooths the jump between each 20ms interval tick.
            // 0.02s matches the interval speed (20ms) so the bar appears
            // to move continuously rather than in visible steps.
          }}
        />
      </div>

      {/* ------------------------------------------------
          PROGRESS NUMBER
      ------------------------------------------------ */}
      <motion.span
        className="absolute bottom-4 right-6 text-base  font-mono tabular-nums"
        /*
          absolute        → positioned relative to the preloader container
          bottom-4        → 16px from the bottom
          right-6         → 24px from the right
          text-xs         → font-size: 12px
          text-text-muted → subtle color
          font-mono       → monospace font (numbers don't shift width)
          tabular-nums    → font feature: all digits take equal width.
                            Without this, "1" is narrower than "8" and the
                            counter would wobble left/right as numbers change.
        */
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        // Simple inline animation — no variants needed here.
        // Fades in after 500ms, over 400ms.
      >
        {progress}%{/* Shows: "0%", "1%", "2%", ... "100%" */}
      </motion.span>
    </motion.div>
  );
}
