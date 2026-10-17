"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { GradientASCII } from "@/components/GradientASCII";
import { siteCollection } from "@/data/collection";

const DEFAULT_ROUTING_BUTTONS = [
  { label: "Team", href: "#team" },
  { label: "Departments", href: "#departments" },
  { label: "Mission", href: "#mission" },
  { label: "Robot", href: "#robot" },
  { label: "Outreach", href: "#outreach" },
  { label: "Partners", href: "#partners" },
  { label: "Contact", href: "#contact" },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      const chars = gsap.utils.toArray<HTMLElement>(".hero-char");
      const metaEls = gsap.utils.toArray<HTMLElement>(".hero-meta");

      gsap.set(chars, {
        opacity: 0,
        yPercent: 40,
        filter: "blur(12px)",
        color: "#FF7800",
      });

      gsap.set(metaEls, {
        opacity: 0,
        y: 20,
        filter: "blur(8px)",
      });

      const tl = gsap.timeline({
        defaults: {
          ease: "power2.out",
        },
      });

      // Character blur-in reveal
      tl.to(
        chars,
        {
          opacity: 1,
          yPercent: 0,
          filter: "blur(0px)",
          color: (_i, target: HTMLElement) =>
            target.dataset.accent === "true" ? "#FF7800" : "#E8E8E8",
          duration: 0.8,
          stagger: 0.015,
        },
        0.05
      );

      // Meta elements reveal (eyebrow, body, action buttons)
      tl.to(
        metaEls,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.1,
        },
        0.35
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const { hero, navigation } = siteCollection;

  // Dynamically derive headline lines from headlineFull if present, fallback to headlineLines
  const deriveHeadlineLines = (): [string, string] => {
    if (hero?.headlineFull && hero.headlineFull.trim().length > 0) {
      const full = hero.headlineFull.trim();
      if (full.includes("\n")) {
        const parts = full.split("\n").map((p) => p.trim()).filter(Boolean);
        return [parts[0] || "", parts.slice(1).join(" ") || ""];
      }
      if (full.includes(". ")) {
        const splitIdx = full.indexOf(". ") + 1;
        return [full.slice(0, splitIdx).trim(), full.slice(splitIdx).trim()];
      }
      const words = full.split(" ");
      const mid = Math.ceil(words.length / 2);
      return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
    }
    if (hero?.headlineLines && hero.headlineLines.length > 0) {
      const line1 = hero.headlineLines.slice(0, 2).join(" ");
      const line2 = hero.headlineLines.slice(2).join(" ");
      return [line1 || "Engineering the Future.", line2 || "Building Beyond Limits."];
    }
    return ["Engineering the Future.", "Building Beyond Limits."];
  };

  const [headlineLine1, headlineLine2] = deriveHeadlineLines();

  const badgeText = hero?.badge || "ALAZ";
  const subtitleText =
    hero?.subtitle ||
    "ALAZ is a FIRST Robotics Competition team that brings together science, engineering, and teamwork to develop the technologies of tomorrow.";

  const routingButtons =
    Array.isArray(navigation) && navigation.length > 0
      ? navigation
          .filter((item) => item.href.startsWith("#") || item.href.startsWith("/#"))
          .map((item) => ({ label: item.label, href: item.href }))
      : DEFAULT_ROUTING_BUTTONS;

  const renderSplitLine = (line: string, isAccentLine: boolean) => {
    const words = line.split(" ");
    return words.map((word, wordIdx) => (
      <span
        key={`${line}-${word}-${wordIdx}`}
        className="inline-block whitespace-nowrap"
      >
        {word.split("").map((char, charIdx) => (
          <span
            key={`${word}-${charIdx}`}
            data-accent={isAccentLine ? "true" : "false"}
            className={`hero-char inline-block will-change-transform ${
              isAccentLine ? "text-[#FF7800]" : "text-[#E8E8E8]"
            }`}
          >
            {char}
          </span>
        ))}
        {wordIdx < words.length - 1 && (
          <span className="inline-block">&nbsp;</span>
        )}
      </span>
    ));
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      aria-label="Team ALAZ Hero"
      className="relative min-h-[100dvh] bg-[#000000] flex flex-col justify-center items-center overflow-hidden py-24 sm:py-28"
    >
      {/* Full-bleed dynamic WebGL2 ASCII gradient canvas with rich fire stops & mouse reactivity */}
      <div className="absolute inset-0 z-0 pointer-events-auto opacity-85">
        <GradientASCII
          colors={["#5A0F05", "#8F1B0A", "#C92A0A", "#E83A0A", "#FF4B0B", "#FF7800", "#FFB000", "#FFD21C"]}
          shape="horizon"
          cellSize={14}
          density={1.2}
          glyphOpacity={0.85}
          glow={0.5}
          speed={0.9}
          gradientOpacity={0.9}
          mouseInteraction={true}
          scrambleRadius={120}
        />
      </div>

      {/* Subtle dark vignette overlay for high contrast text readability */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[#000000]/70 via-[#000000]/50 to-[#000000]/90"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] [background:radial-gradient(circle_at_center,transparent_25%,#000000_90%)]"
      />

      {/* Main Hero Content */}
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-12 lg:pt-8">
        <div className="max-w-4xl flex flex-col items-start justify-center">
          {/* Eyebrow: Badge */}
          <div className="hero-meta inline-flex items-center gap-2 border border-[#FF7800]/40 bg-[#000000]/90 px-3.5 py-1.5 mb-6 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 bg-[#FF7800] rounded-none animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#FF7800] font-semibold">
              {badgeText}
            </span>
          </div>

          {/* Headline: Engineering the Future. Building Beyond Limits. */}
          <h1
            aria-label={`${headlineLine1} ${headlineLine2}`}
            className="font-bold tracking-[-0.04em] leading-[0.95] text-4xl sm:text-6xl md:text-7xl xl:text-[80px] text-[#E8E8E8] uppercase mb-8 select-none"
          >
            <span aria-hidden="true" className="block">
              <span className="block overflow-hidden pb-[0.04em]">
                {renderSplitLine(headlineLine1, false)}
              </span>
              <span className="block overflow-hidden pb-[0.04em] mt-1 sm:mt-2">
                {renderSplitLine(headlineLine2, true)}
              </span>
            </span>
          </h1>

          {/* Dynamic Body Copy */}
          <p className="hero-meta text-base sm:text-lg md:text-xl text-[#B0B0B0] leading-[1.65] max-w-[72ch] mb-10">
            {subtitleText}
          </p>

          {/* Destination Pills */}
          <div className="hero-meta w-full flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#707070]">
              EXPLORE SECTIONS
            </span>
            <div className="flex flex-wrap gap-2.5 w-full">
              {routingButtons.map((btn) => (
                <Link
                  key={btn.href}
                  href={btn.href}
                  className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-none border border-[#1A1A1A] bg-[#000000]/80 hover:bg-[#141414] hover:border-[#FF7800] hover:shadow-[0_0_18px_rgba(255,120,0,0.18)] backdrop-blur-sm transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF7800]"
                >
                  <span className="font-mono text-xs font-medium uppercase tracking-wider text-[#D0D0D0] group-hover:text-white transition-colors">
                    {btn.label}
                  </span>
                  <span className="font-mono text-xs text-[#666666] group-hover:text-[#FF7800] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    ↗
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
