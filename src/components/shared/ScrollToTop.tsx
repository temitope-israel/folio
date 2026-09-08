import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { getLenis } from "@/hooks/useLenis";

const SIZE = 44;
const STROKE_WIDTH = 3;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [offset, setOffset] = useState(CIRCUMFERENCE);

  useEffect(() => {
    let cleanup: (() => void) | null = null;

    // Poll for Lenis — it initializes asynchronously in useLenis()
    // We check every 100ms until it's available, then attach the listener
    const interval = setInterval(() => {
      const lenis = getLenis();

      if (!lenis) return;
      // Not ready yet — try again next tick

      clearInterval(interval);
      // Lenis is ready — stop polling

      const handleScroll = ({ scroll }: { scroll: number }) => {
        setIsVisible(scroll > 200);

        const documentHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = documentHeight > 0 ? scroll / documentHeight : 0;
        setOffset(CIRCUMFERENCE * (1 - scrollProgress));
      };

      lenis.on("scroll", handleScroll);

      cleanup = () => lenis.off("scroll", handleScroll);
    }, 100);

    return () => {
      clearInterval(interval);
      if (cleanup) cleanup();
    };
  }, []);

  const scrollToTop = () => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 group"
          aria-label="Scroll to top"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="-rotate-90"
          >
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth={STROKE_WIDTH}
              className="text-bg-border"
            />
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              className="text-brand transition-none"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <ArrowUp
              size={16}
              className="text-text-secondary group-hover:text-brand transition-colors duration-200"
            />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
