// src/components/shared/CustomCursor.tsx
// ============================================================
// CUSTOM CURSOR COMPONENT
// ============================================================
// Renders a green circular ring that follows the mouse cursor.
// Uses Framer Motion's useMotionValue and useSpring for smooth,
// physics-based movement.
//
// DESKTOP ONLY — hidden on touch devices (no cursor on mobile).
// ============================================================

import { useEffect, useRef } from "react";
// useEffect → to add/remove the mousemove event listener
// useRef    → to reference the cursor DOM element directly

import { motion, useMotionValue, useSpring } from "framer-motion";
// motion       → Framer Motion's animatable HTML elements (motion.div)
// useMotionValue → creates a special value that Framer Motion tracks
// useSpring    → wraps a MotionValue with spring physics

export default function CustomCursor() {
  // --------------------------------------------------------
  // useMotionValue
  // --------------------------------------------------------
  // useMotionValue creates a "motion value" — a special Framer Motion
  // primitive that can be animated without causing React re-renders.
  //
  // Regular useState: every update triggers a re-render
  // useMotionValue:   updates bypass React entirely — Framer Motion
  //                   writes directly to the DOM style.
  //                   This is critical for cursor performance — the cursor
  //                   moves with every mousemove event (potentially hundreds
  //                   of times per second). useState would be catastrophic.

  const cursorX = useMotionValue(-100);
  // same for Y asix, -100 keeps it off-screen initiall.

  const cursorY = useMotionValue(-100);

  // --------------------------------------------------------
  // useSpring
  // --------------------------------------------------------
  // useSpring wraps a MotionValue with spring physics.
  // Instead of snapping instantly to the new mouse position,
  // the cursor "springs" to it — it follows with a slight lag
  // and natural deceleration, like a rubber band.

  const springConfig = {
    damping: 25,
    // damping controls how quickly the spring stops oscillating.
    // Low damping (5) → bouncy, overshoots and oscillates.
    // High damping (50) → stiff, barely any spring feel.
    // 25 → subtle spring that quickly settles — feels premium.

    stiffness: 300,
    // stiffness controls how strongly the spring pulls toward the target.
    // High stiffness → faster, snappier response.
    // Low stiffness → slower, more floaty.
    // 300 → responsive but with a clear spring character.

    mass: 0.5,
    // mass simulates the weight of the cursor.
    // Lower mass → lighter, faster to accelerate and decelerate.
    // 0.5 → half the default mass — feels light and nimble.
  };

  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  // Moust Tracking with useEffect
  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      // MouseEvent is a TypeScript type for mouse event objects.
      // e.clientX → the X coordinate of the mouse, relative to the viewport
      // e.clientY → the Y coordinate of the mouse, relative to the viewport

      cursorX.set(e.clientX);
      // .set() updates the MotionValue to the new mouse X position.
      // This does NOT cause a React re-render.
      // Framer Motion picks up the change and updates the DOM directly.

      cursorY.set(e.clientY);
    };

    window.addEventListener("mousemove", moveCursor);
    // "mousemove" fires on every single mouse movement.
    // We listen on window (not a specific element) to track the cursor
    // everywhere on the page.

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      // Cleanup — remove the listener when this component unmounts.
      // Prevents memory leaks and ghost listeners.
    };
  }, [cursorX, cursorY]);
  // Dependencies: cursorX and cursorY.
  // These are MotionValue objects — their reference never changes,
  // so this effect runs once. We list them as deps for correctness
  // (the effect uses them), even though they won't trigger re-runs.

  // --------------------------------------------------------
  // Hover state — cursor expands when over interactive elements
  // --------------------------------------------------------

  const cursorRef = useRef<HTMLDivElement>(null);
  // We'll use this ref to directly manipulate the cursor's size
  // when hovering over links and buttons.

  useEffect(() => {
    const handleMouseEnter = () => {
      // Wnen mouse enters a link or button:
      if (cursorRef.current) {
        // cursorRef.current is the actual DOM div element.
        // We check it exists (not null) before accessing it.
        cursorRef.current.style.width = "48px";
        cursorRef.current.style.height = "48px";
        cursorRef.current.style.borderColor = "rgba(0, 168, 104, 0.8)";
        // Scale up and slightly change the border color.
      }
    };

    const handleMouseLeave = () => {
      // When mouse leaves - reset to normal size
      if (cursorRef.current) {
        cursorRef.current.style.width = "32px";
        cursorRef.current.style.height = "32px";
        cursorRef.current.style.borderColor = "rgba(0, 168, 107, 1)";
      }
    };

    // Query all interactive elements
    const interactives = document.querySelectorAll("a, button, [data-cursor]");
    // querySelectorAll → returns ALL elements matching the CSS selector.
    // "a, button, [data-cursor]" matches:
    //   a            → all anchor links
    //   button       → all buttons
    //   [data-cursor] → any element with a data-cursor attribute
    //                   (lets us mark custom interactive elements)

    interactives.forEach((el) => {
      // .forEach() iterates over each element in the NodeList.
      // For each element, we add both event listeners.
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      // Cleanup — remove all listeners from all interactive elements.
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);
  // Empty array → runs once after first render.
  // At that point, all the links and buttons exist in the DOM.

  // --------------------------------------------------------
  // Hide cursor on touch devices
  // --------------------------------------------------------
  // Touch screens have no mouse cursor. Showing this component
  // on mobile would be pointless — it would just sit at (-100, -100).
  // We detect touch capability and return null to render nothing.

  if (
    typeof window !== "undefined" &&
    window.matchMedia("(hover:none)").matches
  ) {
    // typeof window !== "undefined" → safety check for SSR environments.
    //   In server-side rendering, `window` doesn't exist.
    //   This check prevents crashes in those environments.
    //   Even though we're using Vite (no SSR), it's good practice.
    //
    // window.matchMedia("(hover: none)") → checks the CSS media feature.
    //   "(hover: none)" is true on touch-primary devices (phones, tablets).
    //   "(hover: hover)" is true on pointer devices (mouse, trackpad).
    //
    // .matches → true if the media query is currently active.

    return null;
    // Returning null from a React component renders NOTHING.
    // The component exists in React's tree but produces no DOM output.
  }

  // Render the cursor ring==============

  return (
    <motion.div
      ref={cursorRef}
      // Attach our ref so we can directly manipulate styels on hover
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border-2 border-brand"
      style={{
        width: "32px",
        height: "32px",
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        transition: "width 0.2s ease, height 0.2s ease, border-color 0.2s ease",
      }}
    ></motion.div>
  );
}
