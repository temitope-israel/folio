// src/App.tsx
import { useState } from "react";
// useState → to track whether the preloader is still showing

import { AnimatePresence, motion } from "framer-motion";
// AnimatePresence → enables exit animations when Preloader is removed

import { useLenis } from "@/hooks/useLenis";
import CustomCursor from "@/components/shared/CustomCursor";
import Preloader from "@/components/shared/Preloader";
// import Navbar from "@/components/layout/Navbar";
import { personalInfo } from "@/data";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  // isLoading starts as true — the preloader shows immediately.
  // When setIsLoading(false) is called, the preloader exits.

  useLenis();
  // Initialize smooth scroll. Runs regardless of loading state —
  // Lenis sets up in the background while preloader is visible.

  return (
    <>
      <CustomCursor />
      {/*
        CustomCursor sits outside AnimatePresence — it renders
        immediately and persists regardless of loading state.
        This is why it must be OUTSIDE the AnimatePresence block.
      */}

      <AnimatePresence mode="wait">
        {/*
          mode="wait" → when a child exits, AnimatePresence waits for the
          exit animation to FULLY complete before rendering the entering element.

          Other modes:
          mode="sync"      → exit and enter animations run simultaneously (default)
          mode="popLayout" → used for layout animations (not needed here)

          We use "wait" so the preloader fully fades out before the
          main content appears — clean sequential transition.
        */}

        {isLoading ? (
          <Preloader
            key="preloader"
            // key is REQUIRED by AnimatePresence to track this element.
            // When isLoading changes from true to false, AnimatePresence
            // sees the key "preloader" disappear and triggers the exit animation.

            onComplete={() => setIsLoading(false)}
            // When Preloader calls onComplete(), we set isLoading to false.
            // This removes the Preloader from the JSX tree.
            // AnimatePresence intercepts, runs the exit animation, then
            // removes it from the DOM.
            // () => setIsLoading(false) is an arrow function:
            // "when called with no arguments, run setIsLoading(false)"
          />
        ) : (
          <motion.div
            key="main"
            // Different key from "preloader" — AnimatePresence treats this
            // as a new element entering when "preloader" exits.

            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            // The main content fades in after the preloader exits.
            // Simple fade — the preloader's exit is the star, not this entrance.
          >
            {/* <Navbar /> */}
            {/* Navbar is inside motion.div so it animates in with the content */}

            <main className="min-h-screen bg-bg-base pt-16 md:pt-20">
              {/*
                pt-16    → padding-top: 64px (matches navbar h-16 on mobile)
                md:pt-20 → padding-top: 80px (matches navbar md:h-20 on desktop)
                This prevents content from hiding behind the fixed navbar.
              */}
              <div className="container-custom section-padding">
                <h1 className="text-6xl font-bold text-text-primary mb-4 text-balance">
                  {personalInfo.tagline}
                </h1>
                <p className="text-text-secondary text-xl mb-12 max-w-2xl">
                  {personalInfo.subTagline} — {personalInfo.title} based in{" "}
                  {personalInfo.location}.
                </p>
                <div className="flex gap-4 mb-16">
                  <a href="#projects" className="btn-primary">
                    View Projects
                  </a>
                  <a href={personalInfo.resumeUrl} className="btn-outline">
                    Download CV
                  </a>
                </div>

                {["About", "Projects", "Services", "Contact"].map((section) => (
                  <section
                    key={section}
                    id={section.toLowerCase()}
                    className="section-padding border-t border-bg-border"
                  >
                    <h2 className="text-4xl font-bold text-text-primary mb-4">
                      {section}
                    </h2>
                    <p className="text-text-secondary">
                      This section coming soon.
                    </p>
                  </section>
                ))}
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
