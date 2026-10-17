"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { StaggeredMenu } from "@/components/StaggeredMenu";
import { siteCollection } from "@/data/collection";

gsap.registerPlugin(ScrollTrigger);

const MENU_ITEMS = [
  { label: "Home", ariaLabel: "Go to Home section", link: "/#hero" },
  { label: "Our Team", ariaLabel: "Go to Team section", link: "/#team" },
  { label: "Departments", ariaLabel: "Go to Departments section", link: "/#departments" },
  { label: "Mission & Vision", ariaLabel: "Go to Mission & Vision section", link: "/#mission" },
  { label: "Robot", ariaLabel: "Go to Robot section", link: "/#robot" },
  { label: "Outreach", ariaLabel: "Go to Outreach section", link: "/#outreach" },
  { label: "Partners", ariaLabel: "Go to Partners section", link: "/#partners" },
  { label: "Contact", ariaLabel: "Go to Contact section", link: "/#contact" },
];

export function Navbar() {
  const headerRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();

  // Scroll-aware hide on scroll down past 80px, reveal on scroll up via GSAP ScrollTrigger
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let lastScroll = 0;

    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const currentScroll = self.scroll();
        const delta = currentScroll - lastScroll;

        if (currentScroll <= 80) {
          header.classList.remove("-translate-y-full");
        } else if (delta > 4 && self.direction === 1) {
          header.classList.add("-translate-y-full");
        } else if (delta < -4 && self.direction === -1) {
          header.classList.remove("-translate-y-full");
        }

        lastScroll = currentScroll;
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  // Hide Navbar when on /admin or any admin sub-route
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const socialItems = siteCollection.media.socials.map((s) => ({
    label: s.platform,
    link: s.href,
  }));

  const navItems =
    Array.isArray(siteCollection.navigation) && siteCollection.navigation.length > 0
      ? siteCollection.navigation.map((item) => ({
          label: item.label,
          ariaLabel: `Go to ${item.label} section`,
          link: item.href,
        }))
      : MENU_ITEMS;

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 w-full z-50 h-16 bg-[#000000]/80 backdrop-blur-md border-b border-[#1A1A1A] px-6 md:px-12 flex items-center justify-between transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
    >
      {/* Left: Phoenix Logo + ALAZ */}
      <Link
        href="/"
        className="group flex items-center gap-2.5 shrink-0 rounded-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF7800]"
        aria-label="Team ALAZ Home"
      >
        <div className="relative w-8 h-8 overflow-hidden border border-[#1A1A1A] bg-[#0A0A0A] group-hover:border-[#FF7800] transition-colors duration-200">
          <Image
            src="/medias/logo.webp"
            alt="Team ALAZ Phoenix Logo"
            width={32}
            height={32}
            priority
            className="w-8 h-8 object-cover"
          />
        </div>
        <span className="font-sans font-bold text-sm tracking-tight text-[#E8E8E8] group-hover:text-white transition-colors">
          ALAZ
        </span>
      </Link>

      {/* Desktop: Direct aesthetic navigational links (No menu opening on PC) */}
      <nav className="hidden lg:flex items-center gap-7" aria-label="Main navigation">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.link}
            aria-label={item.ariaLabel}
            className="font-mono text-xs uppercase tracking-wider text-[#A0A0A0] hover:text-[#FF7800] transition-colors relative py-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF7800]"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Mobile: Drawer Menu Trigger (Only visible on mobile) */}
      <div className="flex lg:hidden items-center">
        <StaggeredMenu
          position="right"
          colors={["#8F1B0A", "#E83A0A", "#FF7800"]}
          items={navItems}
          socialItems={socialItems}
          displaySocials={true}
          displayItemNumbering={true}
          logoUrl="/medias/logo.webp"
          menuButtonColor="#E8E8E8"
          openMenuButtonColor="#FF7800"
          accentColor="#FF7800"
        />
      </div>
    </header>
  );
}

export default Navbar;
