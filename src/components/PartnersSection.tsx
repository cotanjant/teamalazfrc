"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteCollection } from "@/data/collection";

gsap.registerPlugin(ScrollTrigger);

export function PartnersSection() {
  const { partners } = siteCollection;
  const sectionRef = useRef<HTMLElement>(null);

  const rawTiers = Array.isArray(partners.tiers) && partners.tiers.length > 0 ? partners.tiers : [];
  const rawSponsors = (Array.isArray(partners.sponsors) ? partners.sponsors : []) as Array<{
    id?: string;
    name?: string;
    description?: string;
  }>;

  const partnerItems =
    rawTiers.length > 0
      ? rawTiers.filter((item) => item && item.name && item.name.trim().length > 0)
      : rawSponsors
          .filter((item) => item && item.name && item.name.trim().length > 0)
          .map((s) => ({
            id: s.id || "",
            name: s.name || "",
            role: s.description || "",
            href: undefined,
          }));

  const ctaLabel = partners.cta?.label || "Become a Partner";
  const ctaHref = partners.cta?.href || "#contact";

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".partner-reveal");

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
      id="partners"
      ref={sectionRef}
      aria-labelledby="partners-heading"
      className="relative border-t border-[#141414] bg-[#000000] py-20 md:py-28 lg:py-32"
    >
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12">
        {partnerItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <p className="partner-reveal blur-reveal font-mono text-xs uppercase tracking-[0.2em] text-[#FF7800]">
                {partners.title || "Partners"}
              </p>
              <h2
                id="partners-heading"
                className="partner-reveal blur-reveal mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.02em] leading-[1.08] text-[#E8E8E8]"
              >
                {partners.tagline}
              </h2>
              <p className="partner-reveal blur-reveal mt-6 text-base md:text-lg leading-[1.65] text-[#E8E8E8]/80">
                {partners.description}
              </p>
              <div className="partner-reveal blur-reveal mt-8">
                <a
                  href={ctaHref}
                  className="group relative inline-flex min-h-[52px] items-center justify-center overflow-hidden bg-[#FF7800] px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#050505] transition-all duration-300 hover:bg-[#FF9020] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7800] focus-visible:ring-offset-2 focus-visible:ring-offset-[#000000]"
                >
                  <span className="relative z-10">{ctaLabel}</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 w-full">
              <div className="divide-y divide-[#1A1A1A] border-y border-[#1A1A1A]">
                {partnerItems.map((partner, idx) => {
                  const hasLink = Boolean(
                    partner.href &&
                      partner.href.trim().length > 0 &&
                      partner.href.trim() !== "https://"
                  );

                  return (
                    <div
                      key={partner.id || `${partner.name}-${idx}`}
                      className="partner-reveal blur-reveal group relative flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 sm:gap-8 py-8 sm:py-10 px-4 sm:px-6 transition-colors duration-300 hover:bg-[#070707]"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#FF7800] origin-top scale-y-0 transition-transform duration-300 ease-out group-hover:scale-y-100"
                      />
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[-0.02em] text-[#E8E8E8] transition-all duration-300 ease-out group-hover:translate-x-2 group-hover:text-white">
                        {hasLink ? (
                          <a
                            href={partner.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="focus:outline-none focus-visible:underline"
                          >
                            {partner.name}
                          </a>
                        ) : (
                          partner.name
                        )}
                      </h3>
                      {partner.role && partner.role.trim().length > 0 && (
                        <p className="text-sm sm:text-base text-[#A0A0A0] sm:text-right max-w-[40ch] leading-relaxed transition-colors duration-300 group-hover:text-[#D0D0D0]">
                          {partner.role}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start lg:items-end border-y border-[#1A1A1A] py-12 sm:py-16">
            <div className="lg:col-span-8 max-w-[68ch]">
              <p className="partner-reveal blur-reveal font-mono text-xs uppercase tracking-[0.2em] text-[#FF7800]">
                {partners.title || "Partners"}
              </p>
              <h2
                id="partners-heading"
                className="partner-reveal blur-reveal mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.02em] leading-[1.08] text-[#E8E8E8]"
              >
                {partners.tagline}
              </h2>
              <p className="partner-reveal blur-reveal mt-6 text-base md:text-lg leading-[1.65] text-[#E8E8E8]/80">
                {partners.description}
              </p>
            </div>

            <div className="lg:col-span-4 flex lg:justify-end w-full lg:w-auto">
              <div className="partner-reveal blur-reveal w-full sm:w-auto">
                <a
                  href={ctaHref}
                  className="group relative inline-flex w-full sm:w-auto min-h-[52px] items-center justify-center overflow-hidden bg-[#FF7800] px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#050505] transition-all duration-300 hover:bg-[#FF9020] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7800] focus-visible:ring-offset-2 focus-visible:ring-offset-[#000000]"
                >
                  <span className="relative z-10">{ctaLabel}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default PartnersSection;

