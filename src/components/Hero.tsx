"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { siteCollection } from "@/data/collection";

const GradientASCII = dynamic(
  () => import("@/components/GradientASCII").then((mod) => mod.GradientASCII),
  { ssr: false }
);
const AsciiPhoenixCore = dynamic(
  () => import("@/components/AsciiPhoenixCore").then((mod) => mod.AsciiPhoenixCore),
  { ssr: false }
);

function deriveHeadlineLines(
  headlineFull?: string,
  headlineLines?: string[]
): [string, string] {
  if (headlineFull && headlineFull.trim().length > 0) {
    const full = headlineFull.trim();
    if (full.includes("\n")) {
      const parts = full
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean);
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
  if (headlineLines && headlineLines.length > 0) {
    const line1 = headlineLines.slice(0, 2).join(" ");
    const line2 = headlineLines.slice(2).join(" ");
    return [
      line1 || "Engineering the Future.",
      line2 || "Building Beyond Limits.",
    ];
  }
  return ["Engineering the Future.", "Building Beyond Limits."];
}

function deriveLeadSentence(subtitle?: string): string {
  if (!subtitle) return "";
  const match = subtitle.match(/^[^.!?]+[.!?]/);
  return match ? match[0].trim() : subtitle;
}

function splitText(line: string) {
  const words = line.split(" ");
  return words.map((word, wordIdx) => (
    <span
      key={`${line}-${word}-${wordIdx}`}
      className="inline-block whitespace-nowrap break-words"
    >
      {word.split("").map((char, charIdx) => (
        <span
          key={`${word}-${charIdx}`}
          className="hero-char inline-block will-change-transform"
        >
          {char}
        </span>
      ))}
      {wordIdx < words.length - 1 && (
        <span className="inline-block">&nbsp;</span>
      )}
    </span>
  ));
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

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
      const fadeEls = gsap.utils.toArray<HTMLElement>(".hero-fade");

      gsap.set(chars, {
        opacity: 0,
        yPercent: 40,
        filter: "blur(12px)",
        color: "#FF7800",
      });

      gsap.set(fadeEls, {
        opacity: 0,
        y: 20,
        filter: "blur(8px)",
      });

      const tl = gsap.timeline({
        defaults: {
          ease: "power2.out",
        },
      });

      tl.to(
        chars,
        {
          opacity: 1,
          yPercent: 0,
          filter: "blur(0px)",
          color: "#FFFFFF",
          duration: 0.8,
          stagger: 0.015,
        },
        0.05
      );

      tl.to(
        fadeEls,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.1,
        },
        0.35
      );

      if (line1Ref.current) {
        gsap.to(line1Ref.current, {
          xPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }

      if (line2Ref.current) {
        gsap.to(line2Ref.current, {
          xPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const { hero } = siteCollection;

  const [headlineLine1, headlineLine2] = deriveHeadlineLines(
    hero.headlineFull,
    hero.headlineLines
  );

  const leadSentence = deriveLeadSentence(hero.subtitle);

  const primaryLabel = hero.primaryCta?.label || "Explore the Machine";
  const rawPrimaryHref = hero.primaryCta?.href || "/#robot";
  const primaryHref =
    rawPrimaryHref === "/robot"
      ? "/#robot"
      : rawPrimaryHref === "/outreach"
      ? "/#outreach"
      : rawPrimaryHref;

  const secondaryLabel = hero.secondaryCta?.label || "Join the Crew";
  const rawSecondaryHref = hero.secondaryCta?.href || "/#contact";
  const secondaryHref =
    rawSecondaryHref === "/robot"
      ? "/#robot"
      : rawSecondaryHref === "/outreach"
      ? "/#outreach"
      : rawSecondaryHref;

  return (
    <section
      id="hero"
      ref={sectionRef}
      aria-label="Team ALAZ Hero"
      className="relative w-full h-[calc(100dvh-4rem)] max-h-[calc(100dvh-4rem)] bg-[#000000] overflow-hidden"
    >
      {/* Full-bleed WebGL2 Eclipse Solar Corona ASCII Canvas */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <GradientASCII
          colors={[
            "#5A0F05",
            "#8F1B0A",
            "#C92A0A",
            "#E83A0A",
            "#FF4B0B",
            "#FF7800",
            "#FFB000",
            "#FFD21C",
          ]}
          shape="eclipse"
          characters=" .:-=+*#%@ALAZ"
          clickEffect="burst"
          mouseInteraction={true}
          scrambleRadius={0.18}
          cellSize={13}
          density={1.2}
          glyphOpacity={0.9}
          glow={0.65}
          speed={0.9}
          gradientOpacity={0.92}
        />
      </div>

      {/* Subtle corner/edge vignette preserving 100% eclipse brilliance in the center */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.06) 48%, rgba(0,0,0,0.65) 88%, rgba(0,0,0,0.88) 100%), linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 74%, rgba(0,0,0,0.78) 100%)",
        }}
      />

      {/* Animated ASCII Phoenix Emblem (from art.txt) Inside the Black Hole */}
      <AsciiPhoenixCore />

      {/* Four-Quadrant Diagonal Tension Poster Layout — Strictly 1 Screen (calc(100dvh - 4rem)) on PC & Mobile */}
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-12 h-full pt-5 sm:pt-7 lg:pt-8 pb-5 sm:pb-7 lg:pb-8 flex flex-col justify-between pointer-events-none">
        {/* Top Row: Top-Left Monumental Anchor */}
        <div className="w-full shrink-0 pointer-events-auto">
          <div className="hero-fade blur-reveal mb-2 sm:mb-3 flex items-center gap-3">
            <span aria-hidden="true" className="h-[2px] w-6 bg-[#FF7800]" />
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#FF7800]">
              {hero.badge}
            </span>
          </div>

          <h1
            aria-label={`${headlineLine1} ${headlineLine2}`}
            className="contents"
          >
            <div
              ref={line1Ref}
              className="max-w-[16ch] lg:max-w-[20ch] text-[clamp(1.75rem,8vw,3.65rem)] sm:text-[clamp(3.15rem,min(6.2vw,9.5dvh),6.85rem)] font-bold uppercase tracking-[-0.02em] leading-[1.02] text-white will-change-transform"
            >
              {splitText(headlineLine1)}
            </div>
            <span className="sr-only"> {headlineLine2}</span>
          </h1>
        </div>

        {/* Middle Equator: Flexibly absorbs remaining vertical space so total height never exceeds 1 screen */}
        <div className="flex-1 min-h-0 pointer-events-none" />

        {/* Bottom Row: Bottom-Left Compact Lead & CTAs + Bottom-Right Monumental Anchor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-end border-t border-white/10 pt-3.5 sm:pt-5 lg:pt-6 shrink-0">
          {/* Bottom-Left (lg:col-span-5) */}
          <div className="lg:col-span-5 order-2 lg:order-1 space-y-3 sm:space-y-4 pointer-events-auto">
            <p className="hero-fade blur-reveal text-xs sm:text-sm md:text-base leading-[1.5] text-[#E8E8E8]/85 max-w-[46ch] line-clamp-2 sm:line-clamp-3">
              {leadSentence}
            </p>

            <div className="hero-fade blur-reveal grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-4">
              <Link
                href={primaryHref}
                className="group relative overflow-hidden inline-flex min-h-[44px] sm:min-h-[50px] items-center justify-center bg-[#FF7800] px-3 sm:px-7 py-2.5 sm:py-3.5 text-center font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em] sm:tracking-[0.16em] text-[#050505] transition-all duration-300 hover:bg-[#FF9020] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7800] focus-visible:ring-offset-2 focus-visible:ring-offset-[#000000]"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-white/25 transition-transform duration-500 ease-out group-hover:translate-x-0"
                />
                <span className="relative z-10">{primaryLabel}</span>
              </Link>
              <Link
                href={secondaryHref}
                className="inline-flex min-h-[44px] sm:min-h-[50px] items-center justify-center border border-white/20 bg-black/75 backdrop-blur-md px-3 sm:px-7 py-2.5 sm:py-3.5 text-center font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em] sm:tracking-[0.16em] text-[#E8E8E8] transition-all duration-300 hover:border-[#FF7800] hover:text-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7800] focus-visible:ring-offset-2 focus-visible:ring-offset-[#000000]"
              >
                {secondaryLabel}
              </Link>
            </div>
          </div>

          {/* Bottom-Right (lg:col-span-7) */}
          <div className="lg:col-span-7 order-1 lg:order-2 lg:text-right pointer-events-auto">
            <div
              ref={line2Ref}
              aria-hidden="true"
              className="text-[clamp(2.35rem,9vw,3.65rem)] sm:text-[clamp(3.15rem,min(6.2vw,9.5dvh),6.85rem)] font-bold uppercase tracking-[-0.02em] leading-[1.02] text-[#E8E8E8] will-change-transform"
            >
              {splitText(headlineLine2)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
