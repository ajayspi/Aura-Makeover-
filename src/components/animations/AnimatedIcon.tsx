"use client";

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, registerGsap } from '@/lib/gsap';
import * as LucideIcons from 'lucide-react';

interface AnimatedIconProps {
  icon: keyof typeof LucideIcons;
  triggerOnScroll?: boolean;
  className?: string;
}

export default function AnimatedIcon({ icon, triggerOnScroll = false, className }: AnimatedIconProps) {
  const IconComponent = LucideIcons[icon] as React.ElementType;
  const iconRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!iconRef.current) return;
    registerGsap();

    // Find all stroke-based elements in the icon
    const paths = iconRef.current.querySelectorAll('path, line, circle, rect, polyline, polygon');
    
    // Setup for SVG drawing effect using strokeDasharray
    // Note: We use a fixed high value that covers most icon paths
    gsap.set(paths, { strokeDasharray: 200, strokeDashoffset: 200 });
    
    const anim = gsap.to(paths, {
      strokeDashoffset: 0,
      duration: 1.2,
      ease: "power2.inOut",
      stagger: 0.1,
      paused: !triggerOnScroll,
      scrollTrigger: triggerOnScroll ? { trigger: iconRef.current, start: "top 85%" } : undefined
    });

    if (!triggerOnScroll) {
      iconRef.current.addEventListener('mouseenter', () => {
        anim.restart();
      });
    }

    return () => {
      // Clean up event listeners if needed
      if (!triggerOnScroll && iconRef.current) {
        iconRef.current.removeEventListener('mouseenter', () => anim.restart());
      }
    };
  }, { scope: iconRef, dependencies: [triggerOnScroll] });

  return (
    <div ref={iconRef} className={className}>
      <IconComponent className="w-full h-full" />
    </div>
  );
}
