"use client";

import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, registerGsap } from '@/lib/gsap';

export interface AnimatedCounterProps {
  /** Target number to count up to */
  value: number;
  /** Text rendered before the digits (e.g. "₹") */
  prefix?: string;
  /** Text rendered after the digits (e.g. "+" or "%") */
  suffix?: string;
  /** Decimal places to display */
  decimals?: number;
  /** Tween duration in seconds */
  duration?: number;
  className?: string;
}

function formatValue(n: number, decimals: number): string {
  if (decimals > 0) return n.toFixed(decimals);
  return Math.round(n).toLocaleString('en-IN');
}

/**
 * GSAP-powered count-up figure. Renders the final value immediately
 * (SSR/no-JS safe) and, when scrolled into view, tweens a numeric object
 * up to `value` with Warm Gold digits in Space Grotesk.
 */
export default function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1.6,
  className = '',
}: AnimatedCounterProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef({ n: 0 });
  const [display, setDisplay] = useState(() => formatValue(value, decimals));

  useGSAP(
    () => {
      if (!rootRef.current) return;
      registerGsap();

      const counter = counterRef.current;
      counter.n = 0;

      const tween = gsap.to(counter, {
        n: value,
        duration,
        ease: 'power2.out',
        onUpdate: () => setDisplay(formatValue(counter.n, decimals)),
      });
      tween.pause();

      const trigger = ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top 92%',
        once: true,
        onEnter: () => tween.play(),
      });

      return () => {
        trigger.kill();
        tween.kill();
      };
    },
    { scope: rootRef, dependencies: [value, decimals, duration] },
  );

  return (
    <span
      ref={rootRef}
      aria-label={`${prefix}${value}${suffix}`}
      className={`inline-block tabular-nums font-['Syne'] font-bold text-[#C5A880] ${className}`}
    >
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
