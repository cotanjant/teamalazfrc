"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteCollection, OutreachProjectItem } from "@/data/collection";

gsap.registerPlugin(ScrollTrigger);

export function OutreachPreviewSection() {
  const { outreach } = siteCollection;
  const sectionRef = useRef<HTMLElement>(null);

  const stats = Array.isArray(outreach.stats) ? outreach.stats : [];
  const projects = Array.isArray(outreach.projects) ? outreach.projects : [];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".outreach-reveal");

      gsap.fromTo(
        items,
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
      id="outreach"
      ref={sectionRef}
      aria-labelledby="outreach-preview-heading"
      className="relative bg-[#000000] py-20 md:py-28 lg:py-32 overflow-hidden"
    >
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12">
        <div className="max-w-[70ch]">
          <p className="outreach-reveal blur-reveal font-mono text-xs uppercase tracking-[0.2em] text-[#FF7800]">
            {outreach.title || "Outreach"}
          </p>
          <h2
            id="outreach-preview-heading"
            className="outreach-reveal blur-reveal mt-3 text-3xl font-bold tracking-[-0.02em] leading-[1.08] text-[#E8E8E8] sm:text-4xl md:text-5xl"
          >
            {outreach.tagline}
          </h2>

          <p className="outreach-reveal blur-reveal mt-6 text-base leading-[1.65] text-[#E8E8E8]/80">
            {outreach.description}
          </p>
        </div>

        {/* Dynamic Outreach Stats if entered */}
        {stats.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-4 border-y border-[#1A1A1A] py-8 sm:grid-cols-3">
            {stats.map((stat, idx) => (
              <div
                key={stat.code || idx}
                className="border-l-2 border-[#FF7800] bg-[#0A0A0A] p-4 shadow-lg"
              >
                <p className="font-mono text-3xl font-bold text-[#FF7800]">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[#E8E8E8]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Dynamic Projects if entered */}
        {projects.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((proj: OutreachProjectItem, idx: number) => (
              <div
                key={proj.id || idx}
                className="outreach-reveal blur-reveal border border-[#1A1A1A] bg-[#050505] p-6 hover:border-[#FF7800]/50 transition-colors"
              >
                <h3 className="font-mono text-base font-semibold text-[#E8E8E8]">
                  {proj.title}
                </h3>
                {proj.summary && (
                  <p className="mt-2 text-sm text-[#E8E8E8]/75">
                    {proj.summary}
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

export default OutreachPreviewSection;
