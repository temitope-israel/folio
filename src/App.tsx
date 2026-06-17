// src/App.tsx
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "@/hooks/useLenis";
import CustomCursor from "@/components/shared/CustomCursor";
import Preloader from "@/components/shared/Preloader";
import Navbar from "@/components/layout/Navbar";
// Import the Navbar component
import { personalInfo } from "@/data";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  useLenis();

  return (
    <>
      <CustomCursor />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <Preloader key="preloader" onComplete={() => setIsLoading(false)} />
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Navbar />
            {/* Navbar is inside motion.div so it animates in WITH the content */}

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
