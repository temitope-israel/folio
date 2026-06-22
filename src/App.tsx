// src/App.tsx
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "@/hooks/useLenis";
import CustomCursor from "@/components/shared/CustomCursor";
import Preloader from "@/components/shared/Preloader";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
// Import the Hero section

//import { personalInfo } from "@/data";

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

            <main className="bg-bg-base">
              {/*
                Removed min-h-screen and pt-16/pt-20 from here —
                the Hero section handles its own height (min-h-screen)
                and top padding (pt-16 md:pt-20) internally.
                This keeps each section self-contained.
              */}
              <Hero />
              {/* Hero section — full viewport height */}

              {/* Placeholder sections — replaced one by one over coming days */}
              {[
                "About",
                "Stack",
                "Projects",
                "Services",
                "Process",
                "Contact",
              ].map((section) => (
                <section
                  key={section}
                  id={section.toLowerCase()}
                  className="section-padding border-t border-bg-border container-custom"
                >
                  <h2 className="text-4xl font-bold text-text-primary mb-4">
                    {section}
                  </h2>
                  <p className="text-text-secondary">
                    Coming on Day{" "}
                    {
                      // Show which day each section is built
                      {
                        About: 10,
                        Stack: 11,
                        Projects: 13,
                        Services: 14,
                        Process: 14,
                        Contact: 15,
                      }[section]
                    }
                    .
                  </p>
                </section>
              ))}
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
