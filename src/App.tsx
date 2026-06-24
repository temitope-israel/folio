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
import ProjectCard from "@/components/shared/ProjectCard";
import { projects } from "@/data";
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
              {/* TechStack replaces the "Stack" placeholder */}

              {/* Temporary Projects preview — replaced with full Projects section on Day 13 */}
              <section
                id="projects"
                className="section-padding border-t border-bg-border"
              >
                <div className="container-custom">
                  <h2 className="text-4xl font-bold text-text-primary mb-4">
                    Projects
                  </h2>
                  <p className="text-text-secondary mb-12">
                    Full Projects section coming Day 13. Previewing cards below.
                  </p>

                  {/* Featured card preview */}
                  <div className="mb-8">
                    <ProjectCard
                      project={projects[0]}
                      variant="featured"
                      index={0}
                    />
                  </div>

                  {/* Grid card previews */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.slice(1, 4).map((project, index) => (
                      // .slice(1, 4) → projects at index 1, 2, 3
                      // Skips index 0 (already shown as featured above)
                      <ProjectCard
                        key={project.id}
                        project={project}
                        variant="grid"
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              </section>

              {["Projects", "Services", "Process", "Contact"].map((section) => (
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
                      { Projects: 13, Services: 14, Process: 14, Contact: 15 }[
                        section
                      ]
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
