import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";
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
import AdminDashboard from "./pages/admin/Dashboard";
import { recordPageVisit } from "@/lib/api";

function Portfolio() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      // exit → plays when navigating away from this route
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Navbar />
      <main className="bg-bg-base overflow-x-hidden">
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
  const location = useLocation();
  // useLocation() → returns the current URL object
  // location.pathname → e.g. "/", "/admin/login", "/admin/dashboard"
  // We pass it as key to AnimatePresence so it detects route changes

  useEffect(() => {
    recordPageVisit("/");
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {/*
          mode="wait" → waits for the exit animation to finish
          before mounting the next route's enter animation.
          key={location.pathname} → tells AnimatePresence that when
          the URL changes, the old component should exit and the
          new one should enter.
        */}
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Portfolio />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnimatePresence>

      <ScrollToTop />
    </>
  );
}

export default App;
