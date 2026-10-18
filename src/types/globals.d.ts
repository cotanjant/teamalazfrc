/**
 * Global type declarations for Team ALAZ.
 * Extends the global Window interface with runtime singletons like Lenis smooth scroll.
 */

import type Lenis from "lenis";

export interface LenisInstance {
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export {};
