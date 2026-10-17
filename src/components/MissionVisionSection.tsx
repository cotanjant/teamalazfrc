"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteCollection } from "@/data/collection";
import Grainient from "@/components/Grainient";

gsap.registerPlugin(ScrollTrigger);

export function MissionVisionSection() {
  const { missionVision } = siteCollection;
  const { mission, vision } = missionVision;
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".mv-card-reveal");

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
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.15,
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
      id="mission"
      ref={sectionRef}
      aria-labelledby="mission-vision-heading"
      className="relative border-y border-[#1A1A1A] bg-[#000000] min-h-screen py-24 flex flex-col justify-center"
    >
      {/* Background WebGL2 Grainient fire wave canvas */}
      <div className="absolute inset-0 pointer-events-none opacity-45 overflow-hidden">
        <Grainient
          colors={['#8F1B0A', '#C92A0A', '#E83A0A', '#FF4B0B', '#FF7800', '#FFD21C']}
          type="linear"
          angle={45}
          speed={0.7}
          flow={0.9}
          softness={0.95}
          grainAmount={0.06}
          interactive={false}
          className="w-full h-full"
        />
      </div>

      {/* Atmospheric dark overlay & vignette to ensure high text contrast */}
      <div className="absolute inset-0 pointer-events-none bg-radial-[circle_at_center,transparent_0%,#000000_85%] bg-black/60" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-12">
        <h2 id="mission-vision-heading" className="sr-only">
          Misyon & Vizyon
        </h2>
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
          {/* Left Column: Our Mission */}
          <div className="mv-card-reveal blur-reveal flex flex-col justify-between border border-[#1A1A1A] border-t-2 border-t-[#FF7800] bg-[#0A0A0A]/90 backdrop-blur-sm p-8 md:p-12 shadow-2xl transition-all duration-300 hover:border-[#FF7800]/60 hover:shadow-[0_0_30px_rgba(255,120,0,0.15)]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#FF7800]">
                {mission.title || "Our Mission"}
              </p>
              <h3 className="mt-4 text-2xl md:text-3xl font-bold tracking-tight text-[#E8E8E8]">
                {mission.tagline}
              </h3>
              <p className="mt-6 text-base leading-[1.7] text-[#E8E8E8]/80">
                {mission.body}
              </p>
            </div>
          </div>

          {/* Right Column: Our Vision */}
          <div className="mv-card-reveal blur-reveal lg:mt-12 flex flex-col justify-between border border-[#1A1A1A] border-t-2 border-t-[#FFD21C] bg-[#0A0A0A]/90 backdrop-blur-sm p-8 md:p-12 shadow-2xl transition-all duration-300 hover:border-[#FFD21C]/60 hover:shadow-[0_0_30px_rgba(255,210,28,0.15)]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#FFD21C]">
                {vision.title || "Our Vision"}
              </p>
              <h3 className="mt-4 text-2xl md:text-3xl font-bold tracking-tight text-[#E8E8E8]">
                {vision.tagline}
              </h3>
              <p className="mt-6 text-base leading-[1.7] text-[#E8E8E8]/80">
                {vision.body}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MissionVisionSection;
