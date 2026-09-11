import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import { navLinks, personalInfo } from "@/data";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuOpenRef = useRef(false);
  // useRef stores a value that persists across renders WITHOUT causing re-renders.
  // We use it here so the scroll handler can read the latest menuOpen value
  // without being in the dependency array.

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      if (menuOpenRef.current) {
        setMenuOpen(false);
        menuOpenRef.current = false;
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // Empty dependency array — runs once on mount, never re-runs
  // The ref lets us read menuOpen inside without adding it as a dependency

  const toggleMenu = () => {
    const next = !menuOpen;
    setMenuOpen(next);
    menuOpenRef.current = next;
    // Keep ref in sync with state
  };

  const scrollToSection = (href: string) => {
    setMenuOpen(false);
    menuOpenRef.current = false;
    const id = href.replace("#", "");
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-bg-base/80 backdrop-blur-md border-b border-bg-border"
            : "bg-transparent border-b border-transparent"
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      >
        <div className="container-custom">
          <nav className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <motion.a
              href="#"
              className="flex items-center gap-3 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm font-display">
                  {personalInfo.name
                    .split(" ")
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join("")}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-text-primary font-semibold text-sm leading-tight group-hover:text-brand transition-colors duration-200">
                  {personalInfo.shortName}
                </p>
                <p className="text-text-muted text-xs leading-tight">
                  {personalInfo.title}
                </p>
              </div>
            </motion.a>

            {/* Desktop nav links */}
            <ul className="hidden md:flex items-center gap-1">
              {navLinks.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
                >

                  <a  href={link.href}
                    className="relative px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors duration-200 group/link"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-3 right-3 h-px bg-brand scale-x-0 group-hover/link:scale-x-100 transition-transform duration-200 origin-left" />
                  </a>
                </motion.li>
              ))}
            </ul>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {personalInfo.available && (
                <motion.div
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-bg-border bg-bg-surface"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <div className="relative w-2 h-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <div className="absolute inset-0 rounded-full bg-success animate-ping opacity-75" />
                  </div>
                  <span className="text-xs text-text-secondary font-medium">
                    Available for work
                  </span>
                </motion.div>
              )}

              <motion.a
                href={personalInfo.resumeUrl}
                download
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand hover:bg-brand-dark text-white text-sm font-semibold transition-colors duration-200"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Download size={14} strokeWidth={2.5} />
                <span className="hidden sm:inline">Resume</span>
              </motion.a>

              {/* Mobile hamburger */}
              <button
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-bg-border bg-bg-surface text-text-secondary hover:text-brand hover:border-brand/50 transition-all duration-200"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-bg-base/90 backdrop-blur-md"
              onClick={() => {
                setMenuOpen(false);
                menuOpenRef.current = false;
              }}
            />

            {/* Menu panel */}
            <motion.div
              className="absolute top-16 left-0 right-0 bg-bg-surface border-b border-bg-border px-6 py-8 flex flex-col gap-6"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ul className="flex flex-col gap-2">
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="w-full text-left px-4 py-3 text-text-secondary hover:text-text-primary hover:bg-bg-border/50 rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                      {link.label}
                    </button>
                  </motion.li>
                ))}
              </ul>

              <div className="flex flex-col gap-3 pt-4 border-t border-bg-border">
                {personalInfo.available && (
                  <div className="flex items-center gap-2 px-4 py-2">
                    <div className="relative w-2 h-2 flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      <div className="absolute inset-0 rounded-full bg-success animate-ping opacity-75" />
                    </div>
                    <span className="text-xs text-text-secondary">
                      Available for work
                    </span>
                  </div>
                )}

                <a  href={personalInfo.resumeUrl}
                  download
                  onClick={() => {
                    setMenuOpen(false);
                    menuOpenRef.current = false;
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-brand hover:bg-brand-dark text-white text-sm font-semibold transition-colors duration-200"
                >
                  <Download size={14} />
                  Download Resume
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}