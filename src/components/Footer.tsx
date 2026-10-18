"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUp, ArrowRight } from "lucide-react";
import { siteCollection } from "@/data/collection";

const NAVIGATION_LINKS = [
  { label: "Home", href: "/#hero" },
  { label: "Our Team", href: "/#team" },
  { label: "Mission & Vision", href: "/#mission" },
  { label: "Robot", href: "/#robot" },
  { label: "Outreach", href: "/#outreach" },
  { label: "Partners", href: "/#partners" },
  { label: "Contact", href: "/#contact" },
];

export function Footer() {
  const pathname = usePathname();

  // Hide footer on /admin
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const socials = siteCollection.media.socials;

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-[#000000] text-[#E8E8E8] pt-20 border-t border-[#1A1A1A]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Floating Hero Card (Top of Footer) */}
        <div className="relative z-10 -mb-20">
          <div className="relative overflow-hidden min-h-[22rem] sm:min-h-[24rem] border border-[#1A1A1A] border-t-2 border-t-[#FF7800] bg-[#0A0A0A] shadow-2xl group">
            <Image
              src="/medias/hero-full.webp"
              alt="Team ALAZ Crew"
              fill
              sizes="(max-width: 1400px) 100vw, 1400px"
              priority={false}
              className="object-cover object-center opacity-40 transition-transform duration-700 group-hover:scale-105"
            />
            {/* Dark gradient & ember overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/90 via-[#0A0A0A]/60 to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col justify-between min-h-[22rem] sm:min-h-[24rem] p-8 sm:p-12 md:p-16 gap-8">
              <div>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FFFFFF] max-w-2xl leading-tight">
                  {siteCollection.contact.tagline || "Join the Team & Support Our Mission"}
                </h2>
              </div>

              <div>
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-3 bg-[#FF7800] hover:bg-[#FFD21C] text-[#000000] font-sans font-semibold text-sm px-6 py-3.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF7800]"
                >
                  <span>Get in Touch / Contact</span>
                  <div className="w-5 h-5 bg-[#000000] text-[#FF7800] flex items-center justify-center">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Black Footer Section */}
      <div className="w-full bg-[#050505] border-t border-[#1A1A1A] pt-32 pb-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 pb-14 border-b border-[#1A1A1A]">
            {/* Column 1: Team Identity */}
            <div className="md:col-span-5 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <Link
                  href="/#hero"
                  className="inline-flex items-center gap-3 group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF7800]"
                >
                  <div className="w-10 h-10 border border-[#1A1A1A] bg-[#0A0A0A] group-hover:border-[#FF7800] transition-colors relative">
                    <Image
                      src="/medias/logo.webp"
                      alt="Team ALAZ Logo"
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover"
                    />
                  </div>
                  <span className="font-sans font-bold text-lg tracking-tight text-[#E8E8E8]">
                    TEAM ALAZ
                  </span>
                </Link>

                <p className="font-sans text-sm text-[#888888] leading-relaxed max-w-[44ch]">
                  FIRST Robotics Competition team bringing together science, engineering, and teamwork to develop the technologies of tomorrow.
                </p>
              </div>

              <div className="space-y-1.5 pt-4 border-t border-[#1A1A1A] max-w-sm">
                <p className="font-mono text-xs uppercase tracking-[0.05em] text-[#A0A0A0]">
                  Location
                </p>
                <p className="font-sans text-sm text-[#E8E8E8]">
                  {siteCollection.contact?.locationLabel || siteCollection.teamInfo?.location || "Izmir, Turkiye"}
                </p>
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="md:col-span-3 space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-[0.05em] text-[#FF7800]">
                Navigation
              </h3>
              <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2.5">
                {(Array.isArray(siteCollection.navigation) && siteCollection.navigation.length > 0
                  ? siteCollection.navigation
                  : NAVIGATION_LINKS
                ).map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center min-h-[28px] font-sans text-sm text-[#888888] hover:text-[#FF7800] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF7800]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Direct Contact & Connect Social Channels */}
            <div className="md:col-span-4 space-y-6">
              <div className="space-y-2">
                <h3 className="font-mono text-xs uppercase tracking-[0.05em] text-[#FF7800]">
                  Direct Contact
                </h3>
                {(() => {
                  const contactEmail = siteCollection.contact?.email || siteCollection.teamInfo?.email || "alazfrc@gmail.com";
                  return (
                    <a
                      href={`mailto:${contactEmail}`}
                      className="inline-block font-mono text-base sm:text-lg text-[#E8E8E8] hover:text-[#FFD21C] underline underline-offset-4 decoration-[#1A1A1A] hover:decoration-[#FFD21C] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF7800]"
                    >
                      {contactEmail}
                    </a>
                  );
                })()}
              </div>

              <div className="space-y-3">
                <h3 className="font-mono text-xs uppercase tracking-[0.05em] text-[#A0A0A0]">
                  Connect & Socials
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {socials.map((social) => (
                    <a
                      key={social.id}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col justify-between p-3 border border-[#1A1A1A] bg-[#0A0A0A] hover:border-[#FF7800] hover:bg-[#121212] transition-colors min-h-[48px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF7800]"
                    >
                      <span className="font-sans text-xs font-medium text-[#E8E8E8] group-hover:text-[#FF7800] transition-colors">
                        {social.platform}
                      </span>
                      <span className="font-mono text-[11px] text-[#A0A0A0] truncate mt-0.5">
                        {social.handle}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Legal, Copyright & Back to Top Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-mono text-xs text-[#A0A0A0]">
                © Team ALAZ. All rights reserved.
              </p>
              <p className="font-mono text-xs text-[#949494]">
                FIRST Robotics Competition · {siteCollection.contact?.locationLabel || siteCollection.teamInfo?.location || "Izmir, Turkiye"}
              </p>
              <p className="font-mono text-xs text-[#A0A0A0]">
                Made by{" "}
                <a
                  href="https://xn--efearabac-3pb.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#888888] hover:text-[#FF7800] underline underline-offset-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF7800]"
                >
                  Efe Arabaci
                </a>{" "}
                ve{" "}
                <a
                  href="https://github.com/cotanjant"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#888888] hover:text-[#FF7800] underline underline-offset-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF7800]"
                >
                  Deniz Dayan
                </a>
              </p>
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 font-mono text-xs text-[#888888] hover:text-[#E8E8E8] transition-colors cursor-pointer p-2 border border-[#1A1A1A] hover:border-[#FF7800] bg-[#0A0A0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF7800]"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <div className="w-5 h-5 bg-[#141414] text-[#E8E8E8] flex items-center justify-center">
                <ArrowUp className="w-3 h-3" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
