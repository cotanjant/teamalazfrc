"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteCollection } from "@/data/collection";

gsap.registerPlugin(ScrollTrigger);

export function RobotPreviewSection() {
  const { robot } = siteCollection;
  const sectionRef = useRef<HTMLElement>(null);

  // Dynamic items if registered via collection / CMS
  const items = Array.isArray(robot.items) ? robot.items : [];
  const validItems = items.filter(
    (item: any) => item && (item.name || item.title)
  );
  const gridCols =
    validItems.length === 1
      ? "grid-cols-1"
      : validItems.length === 2
        ? "grid-cols-1 md:grid-cols-2"
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

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
      className="relative border-t border-[#141414] bg-[#000000] py-20 md:py-28 lg:py-32 overflow-hidden"
    >
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7">
            <p className="robot-reveal blur-reveal font-mono text-xs uppercase tracking-[0.2em] text-[#FF7800]">
              {robot.title || "Robot"}
            </p>
            <h2
              id="robot-preview-heading"
              className="robot-reveal blur-reveal mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.02em] leading-[1.08] text-[#E8E8E8]"
            >
              {robot.tagline}
            </h2>
            <p className="robot-reveal blur-reveal mt-6 text-base md:text-lg leading-[1.65] text-[#E8E8E8]/80 max-w-[65ch]">
              {robot.description}
            </p>
            <div className="robot-reveal blur-reveal mt-8 border-l-2 border-[#FF7800] bg-[#060606] px-6 py-4">
              <p className="font-mono text-base sm:text-lg font-semibold tracking-tight text-[#FF7800]">
                {robot.precisionStatement || "We Make Our Robots With Precision."}
              </p>
            </div>
          </div>

          <div className="robot-reveal blur-reveal lg:col-span-5">
            <div className="border border-[#1A1A1A] bg-[#050505] p-3 sm:p-4 transition-colors duration-500 hover:border-[#FF7800]/40 group">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0A0A0A]">
                <Image
                  src="/medias/crew-3.webp"
                  alt={robot.title || "Team ALAZ Robot Engineering"}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic items if added via Admin */}
        {validItems.length > 0 && (
          <div
            className={`mt-14 grid ${gridCols} gap-6 border-t border-[#1A1A1A] pt-10`}
          >
            {validItems.map((item: any, idx: number) => (
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
    </section>
  );
}

export default RobotPreviewSection;
