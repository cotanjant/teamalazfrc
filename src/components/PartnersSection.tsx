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
    tier?: string;
    name?: string;
    description?: string;
  }>;

  // Combine or prioritize tiers (from admin) while maintaining backward compatibility
  const partnerItems = rawTiers.length > 0
    ? rawTiers.filter((item) => item && item.name && item.name.trim().length > 0)
    : rawSponsors.filter((item) => item && item.name && item.name.trim().length > 0).map((s) => ({
        id: s.id || "",
        code: s.id || "",
        tier: s.tier || "Partner",
        name: s.name || "",
        role: s.description || "",
        href: undefined,
      }));

  // Group by tier
  const tierGroups = {
    title: partnerItems.filter((p) => p.tier === "Title Partner" || p.tier === "Founding Institution"),
    gold: partnerItems.filter((p) => p.tier === "Gold Partner"),
    silver: partnerItems.filter((p) => p.tier === "Silver Partner"),
    other: partnerItems.filter(
      (p) =>
        p.tier !== "Title Partner" &&
        p.tier !== "Founding Institution" &&
        p.tier !== "Gold Partner" &&
        p.tier !== "Silver Partner"
    ),
  };

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
      className="relative bg-[#000000] py-20 md:py-28 lg:py-32 overflow-hidden"
    >
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12">
        <div className="max-w-[70ch]">
          <p className="partner-reveal blur-reveal font-mono text-xs uppercase tracking-[0.2em] text-[#FF7800]">
            {partners.title || "Partners"}
          </p>
          <h2
            id="partners-heading"
            className="partner-reveal blur-reveal mt-3 text-3xl font-bold tracking-[-0.02em] leading-[1.08] text-[#E8E8E8] sm:text-4xl md:text-5xl"
          >
            {partners.tagline}
          </h2>
          <p className="partner-reveal blur-reveal mt-6 text-base leading-[1.65] text-[#E8E8E8]/80">
            {partners.description}
          </p>
        </div>

        {/* Tier Group 1: Title & Founding Partners */}
        {tierGroups.title.length > 0 && (
          <div className="mt-14">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#FF7800] block mb-4">
              TITLE &amp; FOUNDING PARTNERS
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tierGroups.title.map((partner, idx) => (
                <div
                  key={partner.code || idx}
                  className="partner-reveal border border-[#1A1A1A] bg-[#000000] p-8 sm:p-10 transition-all duration-300 hover:border-[#FF7800] hover:shadow-[0_0_24px_rgba(255,120,0,0.15)] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs text-[#FF7800] uppercase tracking-wider font-semibold">
                        {partner.tier}
                      </span>
                      {partner.href && (
                        <a
                          href={partner.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs text-[#737373] hover:text-[#FF7800] transition-colors"
                        >
                          ↗
                        </a>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-[#E8E8E8] tracking-tight">
                      {partner.name}
                    </h3>
                    {partner.role && (
                      <p className="mt-3 text-sm text-[#A0A0A0] leading-relaxed">
                        {partner.role}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tier Group 2: Gold Partners */}
        {tierGroups.gold.length > 0 && (
          <div className="mt-10">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#FFD21C] block mb-4">
              GOLD PARTNERS
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tierGroups.gold.map((partner, idx) => (
                <div
                  key={partner.code || idx}
                  className="partner-reveal border border-[#1A1A1A] bg-[#000000] p-6 transition-all duration-300 hover:border-[#FFD21C]/60 hover:shadow-[0_0_18px_rgba(255,210,28,0.1)] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs text-[#FFD21C] uppercase tracking-wider">
                        {partner.tier}
                      </span>
                      {partner.href && (
                        <a
                          href={partner.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs text-[#737373] hover:text-[#FFD21C] transition-colors"
                        >
                          ↗
                        </a>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-[#E8E8E8]">
                      {partner.name}
                    </h3>
                    {partner.role && (
                      <p className="mt-2 text-xs text-[#A0A0A0] leading-relaxed">
                        {partner.role}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tier Group 3: Silver & In-Kind Partners */}
        {(tierGroups.silver.length > 0 || tierGroups.other.length > 0) && (
          <div className="mt-10">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#A0A0A0] block mb-4">
              SUPPORTERS &amp; CONTRIBUTORS
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[...tierGroups.silver, ...tierGroups.other].map((partner, idx) => (
                <div
                  key={partner.code || idx}
                  className="partner-reveal border border-[#1A1A1A] bg-[#000000] p-5 transition-all duration-300 hover:border-[#FF7800]/40 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[11px] text-[#A0A0A0] uppercase tracking-wider">
                        {partner.tier}
                      </span>
                      {partner.href && (
                        <a
                          href={partner.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs text-[#737373] hover:text-[#FF7800] transition-colors"
                        >
                          ↗
                        </a>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-[#E8E8E8]">
                      {partner.name}
                    </h3>
                    {partner.role && (
                      <p className="mt-1.5 text-xs text-[#737373] leading-relaxed">
                        {partner.role}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default PartnersSection;
