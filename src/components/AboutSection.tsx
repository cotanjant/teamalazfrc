"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteCollection } from "@/data/collection";

gsap.registerPlugin(ScrollTrigger);

export function AboutSection() {
  const { team } = siteCollection;
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".about-reveal");

      gsap.fromTo(
        items,
        {
          opacity: 0,
          y: 24,
          filter: "blur(12px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.12,
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
      id="team"
      ref={sectionRef}
      aria-labelledby="team-heading"
      className="relative border-t border-[#141414] bg-[#000000] py-20 md:py-28 lg:py-32 overflow-hidden"
    >
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Narrative */}
          <div className="lg:col-span-7">
            <p className="about-reveal blur-reveal font-mono text-xs uppercase tracking-[0.2em] text-[#FF7800]">
              {team.title || "Our Team"}
            </p>
            <h2
              id="team-heading"
              className="about-reveal blur-reveal mt-3 text-3xl font-bold tracking-[-0.02em] leading-[1.08] text-[#E8E8E8] sm:text-4xl md:text-5xl"
            >
              {team.tagline}
            </h2>

            <div className="about-reveal blur-reveal mt-8 space-y-6 text-base leading-[1.65] text-[#E8E8E8]/80 max-w-[65ch]">
              <p>{team.description}</p>
            </div>
          </div>

          {/* Right Column: Authentic Team Photography */}
          <div className="about-reveal blur-reveal lg:col-span-5">
            <div className="group relative border border-[#1A1A1A] bg-[#050505] p-3 shadow-2xl transition-all duration-300 hover:border-[#FF7800]/50 hover:shadow-[0_0_30px_rgba(255,120,0,0.12)]">
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-[#1A1A1A] bg-[#0A0A0A]">
                <Image
                  src={team.media || "/medias/team-hands.webp"}
                  alt={team.mediaAlt || "Team ALAZ members"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
