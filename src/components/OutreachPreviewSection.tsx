"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteCollection, OutreachProjectItem } from "@/data/collection";

gsap.registerPlugin(ScrollTrigger);

export function OutreachPreviewSection() {
  const { outreach } = siteCollection;
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const stats = Array.isArray(outreach.stats)
    ? outreach.stats.filter(
        (s) =>
          s &&
          ((s.value && String(s.value).trim().length > 0) ||
            (s.label && s.label.trim().length > 0))
      )
    : [];
  const projects = Array.isArray(outreach.projects)
    ? outreach.projects.filter(
        (p) => p && p.title && p.title.trim().length > 0
      )
    : [];
  const hasDynamicContent = stats.length > 0 || projects.length > 0;
  const statCols =
    stats.length === 1
      ? "grid-cols-1"
      : stats.length === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-3";

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
      className="relative border-t border-[#141414] bg-[#000000] py-20 md:py-28 lg:py-32 overflow-hidden"
    >
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12">
        {!hasDynamicContent ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1 outreach-reveal blur-reveal">
              <div className="border border-[#1A1A1A] bg-[#050505] p-3 sm:p-4 transition-colors duration-500 hover:border-[#FF7800]/40 group">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0A0A0A]">
                  <picture>
                    <source srcSet="/medias/crew-5.webp" type="image/webp" />
                    <img
                      src="/medias/crew-5.jpg"
                      alt={outreach.title || "Team ALAZ Outreach"}
                      loading="lazy"
                      className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </picture>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="border-l-2 border-[#FF7800] pl-6 md:pl-8">
                <p className="outreach-reveal blur-reveal font-mono text-xs uppercase tracking-[0.2em] text-[#FF7800]">
                  {outreach.title || "Outreach"}
                </p>
                <h2
                  id="outreach-preview-heading"
                  className="outreach-reveal blur-reveal mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.02em] leading-[1.08] text-[#E8E8E8]"
                >
                  {outreach.tagline}
                </h2>
                <p className="outreach-reveal blur-reveal mt-6 text-base md:text-lg leading-[1.7] text-[#E8E8E8]/80 max-w-[60ch]">
                  {outreach.description}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-8">
              <div className="outreach-reveal blur-reveal border border-[#1A1A1A] bg-[#050505] p-3 transition-colors duration-500 hover:border-[#FF7800]/40 group">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0A0A0A]">
                  <picture>
                    <source srcSet="/medias/crew-5.webp" type="image/webp" />
                    <img
                      src="/medias/crew-5.jpg"
                      alt={outreach.title || "Team ALAZ Outreach"}
                      loading="lazy"
                      className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </picture>
                </div>
              </div>

              <div className="border-l-2 border-[#FF7800] pl-6 md:pl-8">
                <p className="outreach-reveal blur-reveal font-mono text-xs uppercase tracking-[0.2em] text-[#FF7800]">
                  {outreach.title || "Outreach"}
                </p>
                <h2
                  id="outreach-preview-heading"
                  className="outreach-reveal blur-reveal mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.02em] leading-[1.08] text-[#E8E8E8]"
                >
                  {outreach.tagline}
                </h2>
                <p className="outreach-reveal blur-reveal mt-6 text-base md:text-lg leading-[1.7] text-[#E8E8E8]/80 max-w-[60ch]">
                  {outreach.description}
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-10">
              {stats.length > 0 && (
                <div
                  className={`outreach-reveal blur-reveal grid ${statCols} border-t border-l border-[#1A1A1A]`}
                >
                  {stats.map((stat, idx) => (
                    <div
                      key={`${stat.label}-${idx}`}
                      className="border-r border-b border-[#1A1A1A] bg-[#050505] p-6 sm:p-7"
                    >
                      <p className="font-mono text-3xl md:text-4xl font-bold text-[#FF7800] tracking-tight">
                        {stat.value}
                      </p>
                      <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-[#E8E8E8]/80">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {projects.length > 0 && (
                <div className="outreach-reveal blur-reveal divide-y divide-[#1A1A1A] border-y border-[#1A1A1A]">
                  {projects.map((proj: OutreachProjectItem, idx: number) => {
                    const isActive = activeIndex === idx;
                    return (
                      <button
                        key={proj.id || `${proj.title}-${idx}`}
                        type="button"
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={() => setActiveIndex(idx)}
                        onFocus={() => setActiveIndex(idx)}
                        aria-expanded={isActive}
                        className={`w-full text-left py-6 sm:py-8 px-5 sm:px-7 transition-colors duration-300 relative group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF7800] ${
                          isActive
                            ? "bg-[#080808]"
                            : "bg-transparent hover:bg-[#050505]"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`absolute left-0 top-0 bottom-0 w-[3px] bg-[#FF7800] transition-opacity duration-300 ${
                            isActive
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-40"
                          }`}
                        />
                        <h3
                          className={`text-xl sm:text-2xl font-bold tracking-[-0.01em] transition-colors duration-300 ${
                            isActive
                              ? "text-white"
                              : "text-[#E8E8E8]/80 group-hover:text-white"
                          }`}
                        >
                          {proj.title}
                        </h3>
                        {proj.summary && (
                          <p
                            className={`mt-3 text-sm sm:text-base leading-[1.65] transition-colors duration-300 ${
                              isActive
                                ? "text-[#E8E8E8]/85"
                                : "text-[#A0A0A0]/70 line-clamp-2"
                            }`}
                          >
                            {proj.summary}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default OutreachPreviewSection;

