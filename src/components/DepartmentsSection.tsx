"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteCollection } from "@/data/collection";

gsap.registerPlugin(ScrollTrigger);

export function DepartmentsSection() {
  const { departments } = siteCollection;
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const headerEls = gsap.utils.toArray<HTMLElement>(".dept-header-reveal");
      const cards = gsap.utils.toArray<HTMLElement>(".dept-card-reveal");

      gsap.fromTo(
        headerEls,
        {
          opacity: 0,
          y: 20,
          filter: "blur(10px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 28,
          filter: "blur(12px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.75,
          ease: "power2.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="departments"
      ref={sectionRef}
      aria-labelledby="departments-heading"
      className="relative bg-[#000000] py-20 md:py-28 lg:py-32 overflow-hidden"
    >
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12">
        {/* Header */}
        <div className="max-w-[70ch] mb-8 lg:mb-10">
          <p className="dept-header-reveal blur-reveal font-mono text-xs uppercase tracking-[0.2em] text-[#FF7800]">
            Disciplines & Focus
          </p>
          <h2
            id="departments-heading"
            className="dept-header-reveal blur-reveal mt-2 text-3xl font-bold tracking-tight text-[#E8E8E8] sm:text-4xl"
          >
            Departments
          </h2>
          <p className="dept-header-reveal blur-reveal mt-2 text-sm sm:text-base text-[#888888]">
            How our members collaborate across disciplines to design, build, and organize.
          </p>
        </div>

        {/* 9 Department Cards Grid */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept, index) => {
            const indexStr = String(index + 1).padStart(2, "0");
            return (
              <div
                key={dept.id}
                className="dept-card-reveal blur-reveal group relative flex flex-col justify-between border border-[#1A1A1A] bg-[#050505] p-5 lg:p-6 transition-all duration-300 hover:border-[#FF7800] hover:shadow-[0_0_24px_rgba(255,120,0,0.18)] hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-xs text-[#555555] mb-2.5">
                    <span className="text-[#FF7800] font-semibold tracking-wider">
                      {indexStr}
                    </span>
                    <span className="text-[11px] uppercase tracking-wider text-[#666666] group-hover:text-[#D0D0D0] transition-colors">
                      {dept.category}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#E8E8E8] group-hover:text-[#FF7800] transition-colors">
                    {dept.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-[1.6] text-[#A0A0A0]">
                    {dept.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default DepartmentsSection;
