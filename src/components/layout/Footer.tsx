import { motion } from "framer-motion";
import { SiGithub, SiX } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";
import { personalInfo, navLinks } from "@/data";

const socialLinks = [
  {
    label: "GitHub",
    href: personalInfo.github,
    icon: SiGithub,
  },
  {
    label: "LinkedIn",
    href: personalInfo.linkedin,
    icon: FaLinkedin, // <--- Updated reference
  },
  {
    label: "Twitter",
    href: "https://twitter.com/temitope_dev",
    icon: SiX,
  },
  {
    label: "Email",
    href: `mailto:${personalInfo.email}`,
    icon: Mail,
  },
];

const stackItems = [
  "React",
  "TypeScript",
  "Next.js",
  "Node.js",
  "PostgreSQL",
  "Prisma",
  "Tailwind CSS",
];

const scrollToSection = (href: string) => {
  const id = href.replace("#", "");
  const element = document.getElementById(id);
  if (element) element.scrollIntoView({ behavior: "smooth" });
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-bg-border bg-bg-base">
      {/* ── Top Row ─────────────────────────────────────────── */}
      <div className="container-custom pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Col 1 — Brand */}
          <motion.div
            className="lg:col-span-2 flex flex-col gap-5"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm font-display">
                  TI
                </span>
              </div>
              <div>
                <p className="text-text-primary font-semibold text-sm">
                  {personalInfo.name}
                </p>
                <p className="text-text-muted text-xs">{personalInfo.title}</p>
              </div>
            </div>

            {/* Tagline */}
            <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
              Building fast, scalable web applications with clean code and
              purposeful design. Available for freelance and full-time roles.
            </p>

            {/* Location + Email */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-text-muted text-sm">
                <MapPin size={13} className="text-brand flex-shrink-0" />
                {personalInfo.location}
              </div>

              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-2 text-text-muted text-sm hover:text-brand transition-colors duration-200"
              >
                <Mail size={13} className="text-brand flex-shrink-0" />
                {personalInfo.email}
              </a>
            </div>

            {/* Social icons */}
            <div className="flex gap-3 mt-1">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target={
                      social.href.startsWith("mailto") ? undefined : "_blank"
                    }
                    rel={
                      social.href.startsWith("mailto")
                        ? undefined
                        : "noopener noreferrer"
                    }
                    aria-label={social.label}
                    className="w-9 h-9 rounded-lg bg-bg-surface border border-bg-border flex items-center justify-center text-text-muted hover:text-brand hover:border-brand/50 transition-all duration-200"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={14} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Col 2 — Navigation */}
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-text-primary text-sm font-semibold uppercase tracking-wider">
              Navigation
            </p>
            <div className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.href)}
                  className="text-text-muted hover:text-brand text-sm transition-colors duration-200 text-left"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Col 3 — Stack */}
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-text-primary text-sm font-semibold uppercase tracking-wider">
              Built With
            </p>
            <div className="flex flex-col gap-2.5">
              {stackItems.map((item) => (
                <span key={item} className="text-text-muted text-sm">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── CTA Banner ──────────────────────────────────────── */}
      <div className="border-t border-bg-border">
        <div className="container-custom py-8">
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-xl bg-bg-surface border border-bg-border"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div>
              <p className="text-text-primary font-semibold text-sm">
                Have a project in mind?
              </p>
              <p className="text-text-muted text-xs mt-0.5">
                Let's build something great together.
              </p>
            </div>

            <a
              href={`mailto:${personalInfo.email}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand hover:bg-brand-dark text-white text-sm font-semibold transition-colors duration-200 flex-shrink-0"
            >
              Get in touch
              <ArrowUpRight size={14} />
            </a>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom Bar ──────────────────────────────────────── */}
      <div className="border-t border-bg-border">
        <div className="container-custom py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-text-muted text-xs">
              © {currentYear}{" "}
              <span className="text-text-secondary font-medium">
                {personalInfo.name}
              </span>
              . All rights reserved.
            </p>
            <p className="text-text-muted text-xs">
              Designed & built by{" "}
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:underline"
              >
                {personalInfo.shortName}
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
