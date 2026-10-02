/**
 * Client-safe GSAP singleton.
 *
 * Single import point for all GSAP consumers in the app: registers
 * ScrollTrigger exactly once (idempotent) and re-exports `gsap`,
 * `ScrollTrigger` and the `useGSAP` hook. All GSAP DOM work must happen
 * inside `useGSAP` (client components only) — this module guards the
 * registration so nothing touches `window` during SSR.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

let registered = false;

export function registerGsap(): boolean {
  if (typeof window === 'undefined') return false;
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    // Setup default easing for the whole app
    gsap.defaults({ ease: 'power3.out', duration: 0.8 });
    registered = true;
  }
  return registered;
}

// Create responsive contexts for heavy animations
export const mediaQs = {
  desktop: "(min-width: 1024px)",
  mobile: "(max-width: 1023px)",
  reducedMotion: "(prefers-reduced-motion: reduce)"
};

export { gsap, ScrollTrigger, useGSAP };
