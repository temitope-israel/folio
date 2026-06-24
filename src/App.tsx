// src/App.tsx
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "@/hooks/useLenis";
import CustomCursor from "@/components/shared/CustomCursor";
import Preloader from "@/components/shared/Preloader";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import TechStack from "@/components/sections/TechStack";
import Projects from "@/components/sections/Projects";
// import ProjectCard from "@/components/shared/ProjectCard";
// import { projects } from "@/data";
// Temporary imports for the preview — both will stay when Projects section is built

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
              <Hero />
              <About />
              <TechStack />
              <Projects />
              {/* Projects section — replaces the Day 12 preview */}

              {["Services", "Process", "Contact"].map((section) => (
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
                    {{ Services: 14, Process: 14, Contact: 15 }[section]}.
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
