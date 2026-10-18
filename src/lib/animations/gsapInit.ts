import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Centralized GSAP plugin registration
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
export default gsap;
