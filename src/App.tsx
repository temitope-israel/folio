import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
// Routes → container for all your route definitions
// Route  → maps a URL path to a component
import { motion } from "framer-motion";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/shared/ScrollToTop";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import TechStack from "@/components/sections/TechStack";
import Projects from "@/components/sections/Projects";
import Services from "@/components/sections/Services";
import Contact from "@/components/sections/Contact";
import AdminLogin from "@/pages/admin/Login";
import { recordPageVisit } from "@/lib/api";

// Portfolio home page — all sections together
function Portfolio() {
  return (
    <motion.div
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
  );
}

function App() {
  useLenis();

  useEffect(() => {
    recordPageVisit("/");
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        {/* "/" → the portfolio home page */}

        <Route path="/admin/login" element={<AdminLogin />} />
        {/* "/admin/login" → the login page — public, no protection needed */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-bg-base flex items-center justify-center">
                <p className="text-text-primary text-xl">
                  Dashboard — Day 24 builds this
                </p>
              </div>
            </ProtectedRoute>
          }
        />
        {/* "/admin/dashboard" → protected — only accessible with a valid token */}
      </Routes>



      <ScrollToTop />
    </>
  );
}

export default App;
