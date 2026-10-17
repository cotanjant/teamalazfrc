'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';

export interface StaggeredMenuItem {
  label: string;
  ariaLabel: string;
  link: string;
}

export interface StaggeredMenuSocialItem {
  label: string;
  link: string;
}

export interface StaggeredMenuProps {
  position?: 'left' | 'right';
  colors?: string[];
  items?: StaggeredMenuItem[];
  socialItems?: StaggeredMenuSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  logoUrl?: string;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  isFixed?: boolean;
  changeMenuColorOnOpen?: boolean;
  closeOnClickAway?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
}

export const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
  position = 'right',
  colors = ['#8F1B0A', '#E83A0A', '#FF7800'],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  menuButtonColor = '#E8E8E8',
  openMenuButtonColor = '#FF7800',
  changeMenuColorOnOpen = true,
  accentColor = '#FF7800',
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose,
}: StaggeredMenuProps) => {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const preLayersRef = useRef<HTMLDivElement | null>(null);
  const preLayerElsRef = useRef<HTMLElement[]>([]);

  const plusHRef = useRef<HTMLSpanElement | null>(null);
  const plusVRef = useRef<HTMLSpanElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);

  const textInnerRef = useRef<HTMLSpanElement | null>(null);
  const textWrapRef = useRef<HTMLSpanElement | null>(null);
  const [textLines, setTextLines] = useState<string[]>(['Menu', 'Close']);

  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  const spinTweenRef = useRef<gsap.core.Timeline | null>(null);
  const textCycleAnimRef = useRef<gsap.core.Tween | null>(null);
  const colorTweenRef = useRef<gsap.core.Tween | null>(null);

  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const busyRef = useRef(false);
  const itemEntranceTweenRef = useRef<gsap.core.Tween | null>(null);

  // Mount detection for client portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll lock & Lenis pause/resume
  useEffect(() => {
    if (open) {
      document.body.classList.add('overflow-hidden');
      document.documentElement.style.overflow = 'hidden';
      if (typeof window !== 'undefined' && (window as any).__lenis) {
        (window as any).__lenis.stop();
      }
    } else {
      document.body.classList.remove('overflow-hidden');
      document.documentElement.style.overflow = '';
      if (typeof window !== 'undefined' && (window as any).__lenis) {
        (window as any).__lenis.start();
      }
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
      document.documentElement.style.overflow = '';
      if (typeof window !== 'undefined' && (window as any).__lenis) {
        (window as any).__lenis.start();
      }
    };
  }, [open]);

  // Initial GSAP setup once portal is mounted
  useEffect(() => {
    if (!mounted) return;

    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;

      if (!panel || !plusH || !plusV || !icon || !textInner) return;

      let preLayers: HTMLElement[] = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer')) as HTMLElement[];
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === 'left' ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen, opacity: 1 });
      if (preContainer) {
        gsap.set(preContainer, { xPercent: 0, opacity: 1 });
      }

      gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
      gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });

      gsap.set(textInner, { yPercent: 0 });

      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });

    return () => ctx.revert();
  }, [mounted, menuButtonColor, position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }
    itemEntranceTweenRef.current?.kill();

    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel')) as HTMLElement[];
    const numberEls = Array.from(
      panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')
    ) as HTMLElement[];
    const socialTitle = panel.querySelector('.sm-socials-title') as HTMLElement | null;
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link')) as HTMLElement[];

    const offscreen = position === 'left' ? -100 : 100;
    const layerStates = layers.map((el) => ({ el, start: offscreen }));
    const panelStart = offscreen;

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity' as any]: 0 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
    });

    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
      panelInsertTime
    );

    if (itemEls.length) {
      const itemsStartRatio = 0.15;
      const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;

      tl.to(
        itemEls,
        { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: { each: 0.1, from: 'start' } },
        itemsStart
      );

      if (numberEls.length) {
        tl.to(
          numberEls,
          { duration: 0.6, ease: 'power2.out', ['--sm-num-opacity' as any]: 1, stagger: { each: 0.08, from: 'start' } },
          itemsStart + 0.1
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;

      if (socialTitle) tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart);
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'power3.out',
            stagger: { each: 0.08, from: 'start' },
            onComplete: () => {
              gsap.set(socialLinks, { clearProps: 'opacity' });
            },
          },
          socialsStart + 0.04
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, [position]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    itemEntranceTweenRef.current?.kill();

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all: HTMLElement[] = [...layers, panel];
    closeTweenRef.current?.kill();

    const offscreen = position === 'left' ? -100 : 100;

    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel')) as HTMLElement[];
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });

        const numberEls = Array.from(
          panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')
        ) as HTMLElement[];
        if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity' as any]: 0 });

        const socialTitle = panel.querySelector('.sm-socials-title') as HTMLElement | null;
        const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link')) as HTMLElement[];
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

        busyRef.current = false;
      },
    });
  }, [position]);

  const animateIcon = useCallback((opening: boolean) => {
    const icon = iconRef.current;
    const h = plusHRef.current;
    const v = plusVRef.current;
    if (!icon || !h || !v) return;

    spinTweenRef.current?.kill();

    if (opening) {
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .to(h, { rotate: 45, duration: 0.5 }, 0)
        .to(v, { rotate: -45, duration: 0.5 }, 0);
    } else {
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: 'power3.inOut' } })
        .to(h, { rotate: 0, duration: 0.35 }, 0)
        .to(v, { rotate: 90, duration: 0.35 }, 0)
        .to(icon, { rotate: 0, duration: 0.001 }, 0);
    }
  }, []);

  const animateColor = useCallback(
    (opening: boolean) => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();
      if (changeMenuColorOnOpen) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, { color: targetColor, delay: 0.18, duration: 0.3, ease: 'power2.out' });
      } else {
        gsap.set(btn, { color: menuButtonColor });
      }
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
  );

  useEffect(() => {
    if (toggleBtnRef.current) {
      if (changeMenuColorOnOpen) {
        const targetColor = openRef.current ? openMenuButtonColor : menuButtonColor;
        gsap.set(toggleBtnRef.current, { color: targetColor });
      } else {
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
      }
    }
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

  const animateText = useCallback((opening: boolean) => {
    const inner = textInnerRef.current;
    if (!inner) return;

    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? 'Menu' : 'Close';
    const targetLabel = opening ? 'Close' : 'Menu';
    const cycles = 3;

    const seq: string[] = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === 'Menu' ? 'Close' : 'Menu';
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);

    setTextLines(seq);
    gsap.set(inner, { yPercent: 0 });

    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;

    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: 'power4.out',
    });
  }, []);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);

    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }

    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose]);

  const closeMenu = useCallback(() => {
    if (openRef.current) {
      openRef.current = false;
      setOpen(false);
      onMenuClose?.();
      playClose();
      animateIcon(false);
      animateColor(false);
      animateText(false);
    }
  }, [playClose, animateIcon, animateColor, animateText, onMenuClose]);

  // Click outside to close
  useEffect(() => {
    if (!closeOnClickAway || !open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeOnClickAway, open, closeMenu]);

  // Escape key closes menu
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, closeMenu]);

  const drawerPortal = mounted
    ? createPortal(
        <div
          className="staggered-menu-portal-root"
          style={accentColor ? ({ ['--sm-accent' as any]: accentColor } as React.CSSProperties) : undefined}
          data-position={position}
          data-open={open || undefined}
        >
          {/* Backdrop on desktop/tablet to dismiss */}
          <div
            className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 z-[45] ${
              open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Staggered prelayers */}
          <div
            ref={preLayersRef}
            className="sm-prelayers fixed top-0 right-0 bottom-0 pointer-events-none z-[47]"
            aria-hidden="true"
          >
            {(() => {
              const raw = colors && colors.length ? colors.slice(0, 4) : ['#8F1B0A', '#E83A0A', '#FF7800'];
              let arr = [...raw];
              if (arr.length >= 3) {
                const mid = Math.floor(arr.length / 2);
                arr.splice(mid, 1);
              }
              return arr.map((c, i) => (
                <div
                  key={i}
                  className="sm-prelayer absolute top-0 right-0 h-full w-full translate-x-0"
                  style={{ background: c }}
                />
              ));
            })()}
          </div>

          {/* Drawer Aside */}
          <aside
            id="staggered-menu-panel"
            ref={panelRef}
            className="staggered-menu-panel fixed top-0 right-0 bottom-0 h-full bg-[#0A0A0A] border-l border-[#1A1A1A] flex flex-col p-[5.5em_2em_2em_2em] overflow-y-auto z-[48] backdrop-blur-[16px] pointer-events-auto shadow-2xl"
            style={{ WebkitBackdropFilter: 'blur(16px)' }}
            aria-hidden={!open}
            inert={!open}
          >
            <div className="sm-panel-inner flex-1 flex flex-col gap-6">
              <ul
                className="sm-panel-list list-none m-0 p-0 flex flex-col gap-3"
                role="list"
                data-numbering={displayItemNumbering || undefined}
              >
                {items && items.length ? (
                  items.map((it, idx) => (
                    <li className="sm-panel-itemWrap relative overflow-hidden leading-none" key={it.label + idx}>
                      <a
                        className="sm-panel-item relative text-[#E8E8E8] hover:text-[#FF7800] font-bold text-3xl sm:text-4xl cursor-pointer leading-tight tracking-tight uppercase transition-colors duration-150 inline-block no-underline pr-[2em]"
                        href={it.link}
                        aria-label={it.ariaLabel}
                        data-index={idx + 1}
                        onClick={() => {
                          closeMenu();
                        }}
                      >
                        <span className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">
                          {it.label}
                        </span>
                      </a>
                    </li>
                  ))
                ) : (
                  <li className="sm-panel-itemWrap relative overflow-hidden leading-none" aria-hidden="true">
                    <span className="sm-panel-item relative text-[#E8E8E8] font-semibold text-2xl uppercase inline-block no-underline">
                      <span className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">
                        No items
                      </span>
                    </span>
                  </li>
                )}
              </ul>

              {displaySocials && socialItems && socialItems.length > 0 && (
                <div
                  className="sm-socials mt-auto pt-8 border-t border-[#1A1A1A] flex flex-col gap-3"
                  aria-label="Social links"
                >
                  <h3 className="sm-socials-title m-0 text-xs font-mono uppercase tracking-[0.14em] text-[#FF7800]">
                    Socials
                  </h3>
                  <ul
                    className="sm-socials-list list-none m-0 p-0 flex flex-row items-center gap-4 flex-wrap"
                    role="list"
                  >
                    {socialItems.map((s, i) => (
                      <li key={s.label + i} className="sm-socials-item">
                        <a
                          href={s.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="sm-socials-link font-mono text-xs uppercase tracking-wider text-[#A0A0A0] hover:text-[#FFD21C] no-underline relative inline-block py-[2px] transition-colors duration-200"
                        >
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>,
        document.body
      )
    : null;

  return (
    <div className={`sm-scope relative inline-flex items-center ${className || ''}`}>
      <button
        ref={toggleBtnRef}
        className={`sm-toggle relative min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-[0.4rem] bg-transparent border-0 cursor-pointer font-mono text-xs font-semibold uppercase tracking-[0.12em] leading-none overflow-visible pointer-events-auto px-2 py-1.5 transition-colors select-none ${
          open ? 'text-[#FF7800]' : 'text-[#E8E8E8] hover:text-[#FF7800]'
        }`}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="staggered-menu-panel"
        onClick={toggleMenu}
        type="button"
      >
        <span
          ref={textWrapRef}
          className="sm-toggle-textWrap relative inline-block h-[1em] overflow-hidden whitespace-nowrap w-[var(--sm-toggle-width,auto)] min-w-[var(--sm-toggle-width,auto)]"
          aria-hidden="true"
        >
          <span ref={textInnerRef} className="sm-toggle-textInner flex flex-col leading-none">
            {textLines.map((l, i) => (
              <span className="sm-toggle-line block h-[1em] leading-none" key={i}>
                {l}
              </span>
            ))}
          </span>
        </span>

        <span
          ref={iconRef}
          className="sm-icon relative w-[14px] h-[14px] shrink-0 inline-flex items-center justify-center [will-change:transform]"
          aria-hidden="true"
        >
          <span
            ref={plusHRef}
            className="sm-icon-line absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[1px] -translate-x-1/2 -translate-y-1/2 [will-change:transform]"
          />
          <span
            ref={plusVRef}
            className="sm-icon-line sm-icon-line-v absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[1px] -translate-x-1/2 -translate-y-1/2 [will-change:transform]"
          />
        </span>
      </button>

      {drawerPortal}

      <style>{`
        .sm-scope .sm-toggle { position: relative; min-height: 44px; min-width: 44px; display: inline-flex; align-items: center; justify-content: center; gap: 0.35rem; background: transparent; border: none; cursor: pointer; line-height: 1; overflow: visible; }
        .sm-scope .sm-toggle:focus-visible { outline: 2px solid #FF7800; outline-offset: 4px; border-radius: 0; }
        .sm-scope .sm-toggle-textWrap { position: relative; margin-right: 0.4em; display: inline-block; height: 1em; overflow: hidden; white-space: nowrap; width: var(--sm-toggle-width, auto); min-width: var(--sm-toggle-width, auto); }
        .sm-scope .sm-toggle-textInner { display: flex; flex-direction: column; line-height: 1; }
        .sm-scope .sm-toggle-line { display: block; height: 1em; line-height: 1; }
        .sm-scope .sm-icon { position: relative; width: 14px; height: 14px; flex: 0 0 14px; display: inline-flex; align-items: center; justify-content: center; will-change: transform; }
        .sm-scope .sm-icon-line { position: absolute; left: 50%; top: 50%; width: 100%; height: 2px; background: currentColor; border-radius: 1px; transform: translate(-50%, -50%); will-change: transform; }

        .staggered-menu-portal-root .staggered-menu-panel {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: clamp(320px, 42vw, 480px);
          height: 100%;
          background: #0A0A0A;
          border-left: 1px solid #1A1A1A;
          display: flex;
          flex-direction: column;
          padding: 6em 2em 2em 2em;
          overflow-y: auto;
          z-index: 48;
          box-shadow: -10px 0 40px rgba(0, 0, 0, 0.9);
        }
        .staggered-menu-portal-root[data-position='left'] .staggered-menu-panel {
          right: auto;
          left: 0;
          border-left: none;
          border-right: 1px solid #1A1A1A;
        }
        .staggered-menu-portal-root .sm-prelayers {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: clamp(320px, 42vw, 480px);
          pointer-events: none;
          z-index: 47;
        }
        .staggered-menu-portal-root[data-position='left'] .sm-prelayers {
          right: auto;
          left: 0;
        }
        .staggered-menu-portal-root .sm-prelayer {
          position: absolute;
          top: 0;
          right: 0;
          height: 100%;
          width: 100%;
          transform: translateX(0);
        }
        .staggered-menu-portal-root .sm-panel-inner {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .staggered-menu-portal-root .sm-socials {
          margin-top: auto;
          padding-top: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .staggered-menu-portal-root .sm-socials-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .staggered-menu-portal-root .sm-socials-list .sm-socials-link {
          opacity: 0.85;
          transition: opacity 0.2s ease, color 0.2s ease;
        }
        .staggered-menu-portal-root .sm-socials-list:hover .sm-socials-link:not(:hover) {
          opacity: 0.4;
        }
        .staggered-menu-portal-root .sm-socials-list .sm-socials-link:hover,
        .staggered-menu-portal-root .sm-socials-list .sm-socials-link:focus-visible {
          opacity: 1;
          color: #FFD21C;
        }
        .staggered-menu-portal-root .sm-panel-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .staggered-menu-portal-root .sm-panel-itemWrap {
          position: relative;
          overflow: hidden;
          line-height: 1;
        }
        .staggered-menu-portal-root .sm-panel-item {
          position: relative;
          color: #E8E8E8;
          font-weight: 700;
          font-size: clamp(1.75rem, 3.5vw, 3.25rem);
          cursor: pointer;
          line-height: 1.1;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          transition: color 0.2s ease;
          display: inline-block;
          text-decoration: none;
          padding-right: 1.6em;
        }
        .staggered-menu-portal-root .sm-panel-itemLabel {
          display: inline-block;
          will-change: transform;
          transform-origin: 50% 100%;
        }
        .staggered-menu-portal-root .sm-panel-item:hover {
          color: #FF7800;
        }
        .staggered-menu-portal-root .sm-panel-list[data-numbering] {
          counter-reset: smItem;
        }
        .staggered-menu-portal-root .sm-panel-list[data-numbering] .sm-panel-item::after {
          counter-increment: smItem;
          content: counter(smItem, decimal-leading-zero);
          position: absolute;
          top: 0.15em;
          right: 0.2em;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 13px;
          font-weight: 500;
          color: #FF7800;
          letter-spacing: 0;
          pointer-events: none;
          user-select: none;
          opacity: var(--sm-num-opacity, 0);
        }

        /* Mobile Fullscreen with 0 offset or gaps */
        @media (max-width: 1024px) {
          .staggered-menu-portal-root .staggered-menu-panel {
            width: 100vw !important;
            left: 0 !important;
            right: 0 !important;
            top: 0 !important;
            bottom: 0 !important;
            max-width: 100% !important;
            border-left: none !important;
            padding: 5.5em 1.5em 2em 1.5em !important;
          }
          .staggered-menu-portal-root .sm-prelayers {
            width: 100vw !important;
            left: 0 !important;
            right: 0 !important;
            top: 0 !important;
            bottom: 0 !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default StaggeredMenu;
