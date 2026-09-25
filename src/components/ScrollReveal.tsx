"use client";

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, registerGsap } from '@/lib/gsap';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  duration?: number;
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  yOffset = 40,
  duration = 0.8,
}: ScrollRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!rootRef.current) return;
      registerGsap();

      gsap.fromTo(
        rootRef.current,
        {
          opacity: 0,
          y: yOffset,
        },
        {
          opacity: 1,
          y: 0,
          duration: duration,
          delay: delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
