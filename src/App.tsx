// src/App.tsx
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
// import { useLenis } from "@/hooks/useLenis";
// import CustomCursor from "@/components/shared/CustomCursor";
// import Preloader from "@/components/shared/Preloader";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import TechStack from "@/components/sections/TechStack";
import Projects from "@/components/sections/Projects";
import Services from "@/components/sections/Services";
import Contact from "@/components/sections/Contact";
import { recordPageVisit } from "@/lib/api";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  // useLenis();

  useEffect(() => {
    recordPageVisit("/");
  }, []);

  return (
    <>
      {/* <CustomCursor /> */}

      {/* <AnimatePresence mode="wait">
        {isLoading ? (
          <Preloader key="preloader" onComplete={() => setIsLoading(false)} />
        ) : null}
      </AnimatePresence> */}

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
          <Services />
          {/* <Process /> */}
          <Contact />
        </main>
      </motion.div>
    </>
  );
}

export default App;
