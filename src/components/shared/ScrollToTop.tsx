// ScrollToTop.tsx
// A fixed button in the bottom-right corner.
// Shows when the user scrolls down.
// Has an SVG ring that fills as the user scrolls.
// Clicking it scrolls back to the top.

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { getLenis } from "@/hooks/useLenis";

// ─── Constants ────────────────────────────────────────────────────────────────

const SIZE = 44;
// Total width and height of the SVG in pixels

const STROKE_WIDTH = 3;
// Thickness of the progress ring stroke in pixels

const RADIUS = (SIZE - STROKE_WIDTH) / 2;
// Radius of the circle.
// We subtract STROKE_WIDTH because SVG strokes are centered on the path —
// half the stroke goes inside the radius, half outside.
// Without this, the stroke gets clipped by the SVG viewBox.
// SIZE=44, STROKE_WIDTH=3 → RADIUS = (44-3)/2 = 20.5

const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
// Math.PI → JavaScript's built-in π (3.14159...)
// 2 × π × r → circumference of a circle
// This is the total length of our ring path
// RADIUS=20.5 → CIRCUMFERENCE ≈ 128.8

// ─── Component ────────────────────────────────────────────────────────────────

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  // isVisible → controls whether the button renders at all
  // Hidden until user scrolls past 200px

  const progress = useMotionValue(0);
  // useMotionValue → a Framer Motion value that can update without re-rendering
  // Starts at 0 (no scroll), goes to 1 (fully scrolled)
  // We update this on every Lenis scroll event

  const [offset, setOffset] = useState(CIRCUMFERENCE);
  // offset → the stroke-dashoffset value for the SVG ring
  // Starts at CIRCUMFERENCE (ring fully hidden)
  // Decreases as user scrolls (ring fills in)
  // useState because changing this updates the SVG — needs a re-render

  const sectionRef = useRef<HTMLDivElement>(null);
  // A ref attached to a dummy div at the top of the page
  // Used by useLenisScroll to calculate scroll progress

  useEffect(() => {
    // Get the Lenis instance — same pattern as useLenisScroll
    const lenis = getLenis();
    if (!lenis) return;
    // Guard: if Lenis isn't initialized yet, do nothing

    const handleScroll = ({ scroll }: { scroll: number }) => {
      // Lenis fires this callback on every scroll frame
      // scroll → current scroll position in pixels from the top

      // ── Visibility ──────────────────────────────────────────────────────
      setIsVisible(scroll > 200);
      // Show the button after scrolling 200px down
      // scroll > 200 → true/false → directly sets isVisible

      // ── Progress calculation ─────────────────────────────────────────────
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      // document.documentElement.scrollHeight → total height of the page content
      // window.innerHeight → height of the visible viewport
      // Their difference → the maximum scrollable distance
      // Example: page is 3000px tall, viewport is 900px → max scroll = 2100px

      const scrollProgress = documentHeight > 0 ? scroll / documentHeight : 0;
      // scroll / documentHeight → a number from 0 to 1
      // Guard against division by zero with the ternary (documentHeight > 0 ? ... : 0)

      progress.set(scrollProgress);
      // Update the motion value — doesn't trigger re-render

      // ── Offset calculation ───────────────────────────────────────────────
      const newOffset = CIRCUMFERENCE * (1 - scrollProgress);
      // At scrollProgress=0: offset = CIRCUMFERENCE × 1 = CIRCUMFERENCE (ring hidden)
      // At scrollProgress=0.5: offset = CIRCUMFERENCE × 0.5 (half ring shown)
      // At scrollProgress=1: offset = CIRCUMFERENCE × 0 = 0 (full ring shown)

      setOffset(newOffset);
      // Update state → triggers re-render → SVG updates its stroke-dashoffset
    };

    lenis.on("scroll", handleScroll);
    // Register the scroll listener on the Lenis instance
    // Lenis calls handleScroll on every animation frame while scrolling

    return () => {
      lenis.off("scroll", handleScroll);
      // Cleanup: remove the listener when the component unmounts
      // Without this, the listener would keep firing even after the component is gone
      // This is called a "memory leak" — always clean up event listeners
    };
  }, [progress]);
  // [progress] → dependency array. progress is a stable ref so this
  // effect only runs once on mount (same as [])

  const scrollToTop = () => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
      // lenis.scrollTo(target, options)
      // target: 0 → scroll to the very top of the page
      // duration: 1.2 → takes 1.2 seconds — smooth and satisfying
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 group"
          // fixed → stays in place as user scrolls
          // bottom-8 right-8 → 32px from bottom and right edges
          // z-50 → above most content
          // group → enables group-hover: on child elements
          aria-label="Scroll to top"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          // AnimatePresence handles mount/unmount animations
          // scale: 0.8 → slightly small when appearing/disappearing
          transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* SVG progress ring */}
          <svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            // viewBox defines the coordinate system.
            // "0 0 44 44" → origin at top-left, 44 units wide and tall.
            // The SVG scales to fit the width/height attributes.
            className="-rotate-90"
            // -rotate-90 → rotates the SVG 90 degrees counter-clockwise.
            // By default, SVG circles start at the 3 o'clock position (right).
            // Rotating -90° makes the ring start at 12 o'clock (top) — more natural.
          >
            {/* Background track — the faint full circle behind the progress ring */}
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              // cx, cy → center x and y coordinates
              // SIZE/2 = 22 → center of our 44×44 SVG
              r={RADIUS}
              fill="none"
              // fill: none → we only want the stroke, not a filled circle
              stroke="currentColor"
              // currentColor → inherits the CSS color property
              // We'll control this via Tailwind className
              strokeWidth={STROKE_WIDTH}
              className="text-bg-border"
              // text-bg-border → sets currentColor to our border color
              // The track is a faint grey circle showing the full path
            />

            {/* Progress arc — the colored portion that fills as you scroll */}
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              // strokeLinecap: "round" → rounded ends on the stroke
              // Makes the arc tip look polished instead of square
              strokeDasharray={CIRCUMFERENCE}
              // One single dash equal to the full circumference
              strokeDashoffset={offset}
              // offset controls how much of the dash is visible
              // Changes on every scroll frame via setOffset()
              className="text-brand transition-none"
              // text-brand → brand blue color for the progress arc
              // transition-none → disable CSS transitions on this element
              // We're updating strokeDashoffset directly via state —
              // CSS transitions would fight with our scroll calculations
            />
          </svg>

          {/* Arrow icon — centered inside the SVG ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/*
              absolute inset-0 → fills the parent (the button)
              flex items-center justify-center → centers the arrow
            */}
            <ArrowUp
              size={16}
              className="text-text-secondary group-hover:text-brand transition-colors duration-200"
              // group-hover:text-brand → when the button is hovered,
              // the arrow turns brand blue
              // group-hover: works because the button has className="group"
            />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
