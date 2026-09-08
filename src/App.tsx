import { useEffect } from "react";
import { motion } from "framer-motion";
import { useLenis } from "@/hooks/useLenis"; // add back
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/shared/ScrollToTop";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import TechStack from "@/components/sections/TechStack";
import Projects from "@/components/sections/Projects";
import Services from "@/components/sections/Services";
import Contact from "@/components/sections/Contact";
import { recordPageVisit } from "@/lib/api";

function App() {
  useLenis(); // add back — initializes Lenis so getLenis() works everywhere

  useEffect(() => {
    recordPageVisit("/");
  }, []);

  return (
    <>
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
          <Contact />
        </main>
        <Footer />
      </motion.div>
      <ScrollToTop />
    </>
  );
}

export default App;
