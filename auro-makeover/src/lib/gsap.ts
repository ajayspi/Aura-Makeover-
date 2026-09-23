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

/** Register GSAP plugins exactly once. Safe to call from every client mount. */
export function registerGsap(): boolean {
  if (typeof window === 'undefined') return false;
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return registered;
}

export { gsap, ScrollTrigger, useGSAP };