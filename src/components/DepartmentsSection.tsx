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
      className="relative border-t border-[#141414] bg-[#000000] py-20 md:py-28 lg:py-32 overflow-hidden"
    >
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12">
        {/* Split Header */}
        <div className="mb-10 lg:mb-14 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="dept-header-reveal blur-reveal font-mono text-xs uppercase tracking-[0.2em] text-[#FF7800]">
              Disciplines & Focus
            </p>
            <h2
              id="departments-heading"
              className="dept-header-reveal blur-reveal mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.02em] leading-[1.08] text-[#E8E8E8]"
            >
              Departments
            </h2>
          </div>
          <p className="dept-header-reveal blur-reveal max-w-[44ch] text-sm sm:text-base leading-[1.65] text-[#888888]">
            How our members collaborate across disciplines to design, build, and organize.
          </p>
        </div>

        {/* 9 Department Cells — 1px Hairline Architectural Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#1A1A1A]">
          {departments.map((dept, index) => {
            const indexStr = String(index + 1).padStart(2, "0");
            return (
              <div
                key={dept.id}
                className="dept-card-reveal blur-reveal group relative flex flex-col justify-between border-r border-b border-[#1A1A1A] bg-[#030303] p-7 lg:p-8 transition-colors duration-300 hover:bg-[#080808]"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-0 right-0 h-[2px] bg-[#FF7800] origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"
                />
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold tracking-wider text-[#FF7800]">
                      {indexStr}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[#A0A0A0] group-hover:text-[#D0D0D0] transition-colors">
                      {dept.category}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg sm:text-xl font-bold tracking-[-0.01em] text-[#E8E8E8] transition-all duration-300 group-hover:translate-x-1 group-hover:text-white">
                    {dept.name}
                  </h3>
                  <p className="mt-2.5 text-sm leading-[1.65] text-[#A0A0A0] group-hover:text-[#C0C0C0] transition-colors">
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
