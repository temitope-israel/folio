import { useRef } from "react";
import { motion, useTransform } from "framer-motion";
import { ArrowRight, MapPin, Briefcase } from "lucide-react";
import { personalInfo, heroStats, projects } from "@/data";
import { SiGithub } from "react-icons/si";
import { cn } from "@/lib/utils";
import { useTextScramble } from "@/hooks/useTextScramble";
import { useLenisScroll } from "@/hooks/useLenisScroll";

const heroVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  } as const,

  item: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  } as const,

  visual: {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 },
    },
  } as const,
};

export default function Hero() {
  const liveProjectCount = projects.filter((p) => p.status === "live").length;

  const sectionRef = useRef<HTMLElement>(null);
  const scrollYProgress = useLenisScroll(sectionRef);

  const blobOneY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const blobTwoY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const scrambledHeadline = useTextScramble({
    text: "I build things",
    trigger: true,
    speed: 35,
    revealDelay: 3,
  });

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex items-center pt-16 md:pt-20 overflow-hidden"
      // overflow-hidden added — clips blobs on mobile
    >
      {/* Blob 1 */}
      <motion.div
        className="absolute top-0 left-0 w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] md:w-[600px] md:h-[600px] rounded-full opacity-[0.07] blur-[120px] bg-brand pointer-events-none"
        style={{ y: blobOneY } as any}
      />

      {/* Blob 2 */}
      <motion.div
        className="absolute bottom-0 right-0 w-[150px] h-[150px] sm:w-[300px] sm:h-[300px] md:w-[500px] md:h-[500px] rounded-full opacity-[0.05] blur-[100px] bg-gold pointer-events-none"
        style={{ y: blobTwoY } as any}
      />

      <div className="container-custom w-full py-12 md:py-20">
        {/* py-12 on mobile (was py-20) — less cramped */}

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center"
          // gap-10 on mobile (was gap-12) — tighter
          variants={heroVariants.container}
          initial="hidden"
          animate="visible"
        >
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6 md:gap-8">
            {/* gap-6 on mobile — tighter vertical spacing */}

            {/* Availability badge */}
            <motion.div variants={heroVariants.item}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-bg-border bg-bg-surface">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                </span>
                <span className="text-xs md:text-sm text-text-secondary font-medium">
                  Available for new projects
                </span>
                <span className="text-xs text-brand font-semibold px-2 py-0.5 rounded-full bg-brand/10">
                  {liveProjectCount} live
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div variants={heroVariants.item} className="space-y-2">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary leading-[1.05] tracking-tight">
                {/*
                  text-4xl  → 36px on mobile (was text-5xl = 48px — too big)
                  sm:text-5xl → 48px at 640px+
                  md:text-6xl → 60px at 768px+
                  lg:text-7xl → 72px at 1024px+
                */}
                <span className="block">{scrambledHeadline}</span>
                <motion.span
                  className="block text-gradient"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8, duration: 0.6, ease: "easeOut" }}
                >
                  that work.
                </motion.span>
              </h1>
            </motion.div>

            {/* Sub-headline */}
            <motion.p
              variants={heroVariants.item}
              className="text-base md:text-lg lg:text-xl text-text-secondary leading-relaxed max-w-lg"
              // text-base on mobile (was text-lg) — fits better
            >
              Full-Stack Developer based in{" "}
              <span className="text-text-primary font-medium">
                {personalInfo.location}
              </span>
              . I craft fast, scalable web applications with{" "}
              <span className="text-text-primary font-medium">
                React, TypeScript, Next.js, Node.js, MongoDB, and PostgreSQL
              </span>
              .
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={heroVariants.item}
              className="flex flex-wrap gap-3"
              // gap-3 on mobile (was gap-4) — prevents overflow on small screens
            >
              <a href="#projects" className={cn("btn-primary group")}>
                View My Work
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </a>
              <a href="#contact" className="btn-outline">
                Let's Talk
              </a>

              <a  href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline flex items-center gap-2"
              >
                <SiGithub size={16} /> GitHub
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={heroVariants.item}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 pt-6 md:pt-8 border-t border-bg-border"
              // gap-4 on mobile, pt-6 on mobile — tighter
            >
              {heroStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="flex flex-col gap-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                >
                  <span className="text-2xl md:text-3xl font-bold text-gold font-display">
                    {/* text-2xl on mobile (was text-3xl) */}
                    {stat.value}
                  </span>
                  <span className="text-xs md:text-sm text-text-muted leading-tight">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT COLUMN — hidden on mobile, shows on lg */}
          <motion.div
            variants={heroVariants.visual}
            className="relative hidden lg:block"
            style={{ y: cardY, opacity: cardOpacity } as any}
          >
            <div className="relative z-10 rounded-2xl border border-bg-border bg-bg-surface p-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-brand/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-brand flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg font-display">
                      {personalInfo.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="text-text-primary font-semibold text-sm">{personalInfo.shortName}</p>
                    <p className="text-text-muted text-xs">{personalInfo.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-success">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  Open to work
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-bg-border flex items-center justify-center flex-shrink-0">
                    <MapPin size={14} className="text-brand" />
                  </div>
                  <div>
                    <p className="text-text-muted text-xs">Location</p>
                    <p className="text-text-primary font-medium">{personalInfo.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-bg-border flex items-center justify-center flex-shrink-0">
                    <Briefcase size={14} className="text-brand" />
                  </div>
                  <div>
                    <p className="text-text-muted text-xs">Experience</p>
                    <p className="text-text-primary font-medium">3+ Years Freelance</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-bg-border flex items-center justify-center flex-shrink-0">
                    <SiGithub size={16} />
                  </div>
                  <div>
                    <p className="text-text-muted text-xs">GitHub</p>

                   <a   href={personalInfo.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-primary font-medium hover:text-brand transition-colors duration-200"
                    >
                      temitope-israel
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {["React", "TypeScript", "Node.js", "PostgreSQL"].map((tech) => (
                  <span key={tech} className="tag">{tech}</span>
                ))}
              </div>
            </div>

            <div
              className="absolute inset-0 rounded-2xl border border-brand/20 -z-10"
              style={{ transform: "translate(12px, 12px)" }}
            />
            <div
              className="absolute inset-0 rounded-2xl border border-brand/10 -z-20"
              style={{ transform: "translate(24px, 24px)" }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}