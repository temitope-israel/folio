import { motion } from "framer-motion";
import { personalInfo, navLinks } from "@/data";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (href: string) => {
    const id = href.replace("#", "");
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t border-bg-border bg-bg-base">
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <motion.p
            className="text-text-muted text-sm"
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            © {currentYear}{" "}
            <span className="text-text-secondary font-medium">
              {personalInfo.name}
            </span>
            . All rights reserved.
          </motion.p>

          <motion.nav
            className="flex items-center gap-6"
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="text-text-muted hover:text-text-primary text-sm transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
          </motion.nav>

          <motion.p
            className="text-text-muted text-sm"
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Built with <span className="text-brand">React</span>
            {" & "}
            <span className="text-gold">TypeScript</span>
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
