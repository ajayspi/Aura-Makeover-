"use client";

import React, { useId, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, registerGsap } from '@/lib/gsap';

/**
 * Self-drawing gold divider rule. The SVG line (Warm Gold → Terracotta,
 * fading at the edges) draws itself in when scrolled into view via
 * stroke-dashoffset, with a slowly pulsing gold orb at its center.
 * Mount between major sections as a brand seam.
 */
export default function GoldDivider({ className = '' }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');

  useGSAP(
    () => {
      if (!rootRef.current || !lineRef.current) return;
      registerGsap();

      const len = lineRef.current.getTotalLength?.() ?? 600;
      gsap.set(lineRef.current, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(lineRef.current, {
        strokeDashoffset: 0,
        duration: 1.4,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 92%',
          once: true,
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={`flex justify-center select-none pointer-events-none px-6 py-3 ${className}`}
    >
      <svg viewBox="0 0 600 20" className="w-full max-w-4xl h-5" fill="none" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`gd-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#C5A880" stopOpacity="0" />
            <stop offset="35%" stopColor="#C5A880" />
            <stop offset="65%" stopColor="#8A5836" />
            <stop offset="100%" stopColor="#C5A880" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line
          ref={lineRef}
          x1="0"
          y1="10"
          x2="600"
          y2="10"
          stroke={`url(#gd-${uid})`}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="300" cy="10" r="2.5" fill="#C5A880" className="opacity-70">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2.8s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}