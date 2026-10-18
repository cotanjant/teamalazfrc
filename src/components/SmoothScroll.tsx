"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/animations/gsapInit";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

interface SmoothScrollProps {
  children?: React.ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (mediaQuery.matches) {
      ScrollTrigger.refresh();
      return;
    }

    let isDestroyed = false;
    let updateTicker: ((time: number) => void) | null = null;
    let handleAnchorClick: ((event: MouseEvent) => void) | null = null;
    let handleMotionChange: ((event: MediaQueryListEvent) => void) | null = null;

    import("lenis").then(({ default: LenisClass }) => {
      if (isDestroyed) return;

      const lenis = new LenisClass({
        lerp: 0.08,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        syncTouch: false,
        prevent: (node) => {
          return (
            node.tagName === "INPUT" ||
            node.tagName === "TEXTAREA" ||
            node.tagName === "SELECT" ||
            node.hasAttribute("data-lenis-prevent")
          );
        },
        virtualScroll: (data) => {
          if (
            data.event.type.startsWith("touch") &&
            (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768)
          ) {
            return false;
          }
          return true;
        },
      });

      lenisRef.current = lenis;
      if (typeof window !== "undefined") {
        window.__lenis = lenis;
      }

      lenis.on("scroll", ScrollTrigger.update);

      updateTicker = (time: number) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(updateTicker);
      gsap.ticker.lagSmoothing(0);

      handleAnchorClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement | null;
        const anchor = target?.closest("a[href*='#']") as HTMLAnchorElement | null;
        if (!anchor) return;

        const href = anchor.getAttribute("href");
        if (!href) return;

        const url = new URL(href, window.location.origin);
        if (url.pathname !== window.location.pathname) return;

        const hash = url.hash;
        if (!hash || hash === "#") return;

        const targetElement = document.querySelector<HTMLElement>(hash);
        if (targetElement) {
          event.preventDefault();
          lenis.scrollTo(targetElement, { offset: -64 });
          window.history.pushState(null, "", hash);
        }
      };

      document.addEventListener("click", handleAnchorClick);

      handleMotionChange = (event: MediaQueryListEvent) => {
        if (event.matches && lenisRef.current) {
          if (updateTicker) gsap.ticker.remove(updateTicker);
          lenisRef.current.destroy();
          lenisRef.current = null;
        }
      };

      mediaQuery.addEventListener("change", handleMotionChange);
    });

    return () => {
      isDestroyed = true;
      if (handleAnchorClick) document.removeEventListener("click", handleAnchorClick);
      if (handleMotionChange) mediaQuery.removeEventListener("change", handleMotionChange);
      if (updateTicker) gsap.ticker.remove(updateTicker);
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      if (typeof window !== "undefined") {
        delete window.__lenis;
      }
    };
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const targetElement = document.querySelector<HTMLElement>(hash);
      if (targetElement) {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(targetElement, { offset: -64, immediate: false });
        } else {
          targetElement.scrollIntoView();
        }
        return;
      }
    }

    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    ScrollTrigger.refresh();
  }, [pathname]);

  return children ? <>{children}</> : null;
}

export default SmoothScroll;
