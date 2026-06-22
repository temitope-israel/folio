// src/hooks/useLenisScroll.ts
import { useEffect, RefObject } from "react";
import { useMotionValue } from "framer-motion";
import { getLenis } from "./useLenis";

export function useLenisScroll(ref: RefObject<HTMLElement | null>) {
  const scrollProgress = useMotionValue(0);

  useEffect(() => {
    console.log("useLenisScroll effect running");
    // Step 1 — does the effect even run?

    const lenis = getLenis();
    console.log("Lenis instance:", lenis);
    // Step 2 — is Lenis available at this point?

    if (!lenis) {
      console.log("Lenis is null — bailing out");
      return;
    }

    if (!ref.current) {
      console.log("ref.current is null — bailing out");
      return;
    }

    console.log("ref.current:", ref.current);
    // Step 3 — is the section element attached?

    const element = ref.current;

    const onScroll = ({ scroll }: { scroll: number }) => {
      console.log("Lenis scroll event fired, scroll:", scroll);
      // Step 4 — is the Lenis scroll event firing at all?

      const rect = element.getBoundingClientRect();
      const elementTop = rect.top;
      const elementHeight = rect.height;

      const progress = Math.max(0, Math.min(1, -elementTop / elementHeight));
      console.log("progress:", progress);

      scrollProgress.set(progress);
    };

    lenis.on("scroll", onScroll);
    console.log("Lenis scroll listener attached");
    // Step 5 — confirm listener was registered

    return () => {
      lenis.off("scroll", onScroll);
    };
  }, [ref, scrollProgress]);

  return scrollProgress;
}