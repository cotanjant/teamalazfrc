"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface GsapSectionAnimatorProps {
  sectionId: string;
  selector: string;
  yOffset?: number;
  duration?: number;
  stagger?: number;
  start?: string;
  blur?: number;
}

export function GsapSectionAnimator({
  sectionId,
  selector,
  yOffset = 24,
  duration = 0.8,
  stagger = 0.1,
  start = "top 80%",
  blur = 10,
}: GsapSectionAnimatorProps) {
  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(selector);
      if (items.length === 0) return;

      gsap.fromTo(
        items,
        {
          opacity: 0,
          y: yOffset,
          filter: `blur(${blur}px)`,
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration,
          ease: "power2.out",
          stagger,
          scrollTrigger: {
            trigger: section,
            start,
            toggleActions: "play none none reverse",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [sectionId, selector, yOffset, duration, stagger, start, blur]);

  return null;
}
