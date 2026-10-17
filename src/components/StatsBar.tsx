"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteCollection } from "@/data/collection";

gsap.registerPlugin(ScrollTrigger);

export function StatsBar() {
  const { stats } = siteCollection;

  // Filter for real stats with non-empty values (zero fake numbers)
  const activeStats = (stats || []).filter(
    (stat) => stat.value !== undefined && stat.value !== null && String(stat.value).trim() !== ""
  );

  const barRef = useRef<HTMLElement>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (activeStats.length === 0) return;
    const bar = barRef.current;
    if (!bar) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      activeStats.forEach((stat, index) => {
        const el = numberRefs.current[index];
        if (el) {
          el.textContent = `${stat.value}${stat.suffix || ""}`;
        }
      });
      return;
    }

    const ctx = gsap.context(() => {
      activeStats.forEach((stat, index) => {
        const el = numberRefs.current[index];
        if (!el) return;

        const numVal = typeof stat.value === "number" ? stat.value : parseFloat(String(stat.value));
        if (isNaN(numVal)) {
          el.textContent = `${stat.value}${stat.suffix || ""}`;
          return;
        }

        el.textContent = "0";
        const proxy = { val: 0 };

        gsap.to(proxy, {
          val: numVal,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: bar,
            start: "top 88%",
            once: true,
          },
          onUpdate: () => {
            if (el) {
              el.textContent = Math.round(proxy.val).toLocaleString("en-US");
            }
          },
        });
      });
    }, bar);

    return () => ctx.revert();
  }, [activeStats]);

  if (activeStats.length === 0) {
    return null;
  }

  return (
    <section
      ref={barRef}
      aria-label="Team Statistics"
      className="w-full rounded-none border-y border-[#141414] bg-[#000000]"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 divide-y md:divide-y-0 md:divide-x divide-[#1A1A1A] ${
            activeStats.length === 1
              ? "md:grid-cols-1"
              : activeStats.length === 2
              ? "md:grid-cols-2"
              : "md:grid-cols-3"
          }`}
        >
          {activeStats.map((stat, index) => (
            <div
              key={stat.id || index}
              className="flex flex-col justify-between py-8 px-4 sm:px-8 first:md:pl-0 last:md:pr-0"
            >
              <div className="flex items-baseline gap-1 my-1">
                <span
                  ref={(el) => {
                    numberRefs.current[index] = el;
                  }}
                  aria-label={`${stat.value}${stat.suffix || ""} ${stat.label}`}
                  className="font-mono text-4xl md:text-5xl font-bold tracking-tight text-[#E8E8E8] tabular-nums"
                >
                  {stat.value}
                </span>
                {stat.suffix && (
                  <span
                    aria-hidden="true"
                    className="font-mono text-3xl md:text-4xl font-bold text-[#FF7800]"
                  >
                    {stat.suffix}
                  </span>
                )}
              </div>

              <div className="mt-2">
                <p className="font-sans text-sm font-semibold tracking-tight text-[#E8E8E8]">
                  {stat.label}
                </p>
                {stat.description && (
                  <p className="font-sans text-xs text-[#666666] leading-relaxed mt-1">
                    {stat.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsBar;
