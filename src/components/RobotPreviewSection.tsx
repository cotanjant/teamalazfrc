"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteCollection } from "@/data/collection";

gsap.registerPlugin(ScrollTrigger);

export function RobotPreviewSection() {
  const { robot } = siteCollection;
  const sectionRef = useRef<HTMLElement>(null);

  // Dynamic items if registered via collection / CMS
  const items = Array.isArray(robot.items) ? robot.items : [];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const reveals = gsap.utils.toArray<HTMLElement>(".robot-reveal");

      gsap.fromTo(
        reveals,
        {
          opacity: 0,
          y: 24,
          filter: "blur(10px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="robot"
      ref={sectionRef}
      aria-labelledby="robot-preview-heading"
      className="relative bg-[#000000] py-20 md:py-28 lg:py-32 overflow-hidden"
    >
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12">
        <div className="border border-[#1A1A1A] bg-[#050505] p-8 md:p-14 shadow-2xl transition-all duration-300 hover:border-[#FF7800]/40">
          <div className="max-w-[70ch]">
            <p className="robot-reveal blur-reveal font-mono text-xs uppercase tracking-[0.2em] text-[#FF7800]">
              {robot.title || "Robot"}
            </p>
            <h2
              id="robot-preview-heading"
              className="robot-reveal blur-reveal mt-3 text-3xl font-bold tracking-[-0.02em] leading-[1.08] text-[#E8E8E8] sm:text-4xl md:text-5xl"
            >
              {robot.tagline}
            </h2>
            <p className="robot-reveal blur-reveal mt-6 text-base leading-[1.65] text-[#E8E8E8]/80">
              {robot.description}
            </p>
            <p className="robot-reveal blur-reveal mt-8 font-mono text-lg font-semibold text-[#FF7800]">
              {robot.precisionStatement || "We Make Our Robots With Precision."}
            </p>
          </div>

          {/* Dynamic items if added via Admin */}
          {items.length > 0 && (
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 border-t border-[#1A1A1A] pt-8">
              {items.map((item: any, idx: number) => (
                <div
                  key={item.id || idx}
                  className="robot-reveal blur-reveal border border-[#1A1A1A] bg-[#0A0A0A] p-6 hover:border-[#FF7800]/60 transition-colors"
                >
                  <h3 className="font-mono text-base font-semibold text-[#E8E8E8]">
                    {item.name || item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-2 text-sm text-[#E8E8E8]/75">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default RobotPreviewSection;
