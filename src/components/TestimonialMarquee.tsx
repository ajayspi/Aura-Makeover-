"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { REVIEWS } from './Reviews';

/**
 * Auto-scrolling wall-of-love strip. Reuses the single REVIEWS catalog
 * from Reviews.tsx (no duplicated data — same source, different surface).
 */
const TRIPLE = [...REVIEWS, ...REVIEWS, ...REVIEWS];

export default function TestimonialMarquee() {
  return (
    <div
      aria-label="Wall of love — client testimonials"
      className="w-full bg-[#1C130B] border-y border-[#C5A880]/30 py-8 overflow-hidden relative select-none"
    >
      {/* Subtle edge fade overlays using brand espresso */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 md:w-32 bg-gradient-to-r from-[#1C130B] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 md:w-32 bg-gradient-to-l from-[#1C130B] to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex whitespace-nowrap items-center w-max"
        animate={{ x: ['0%', '-33.333333%'] }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: 48,
        }}
      >
        {TRIPLE.map((r, idx) => (
          <figure
            key={`${r.name}-${idx}`}
            className="flex items-center gap-4 px-5 sm:px-6 py-2"
          >
            <Quote className="w-4 h-4 text-[#C5A880] shrink-0" />
            <div>
              <p className="font-['Plus_Jakarta_Sans'] text-[#FAF8F5]/85 text-xs sm:text-sm font-medium max-w-[20rem] truncate">
                &ldquo;{r.quote}&rdquo;
              </p>
              <figcaption className="mt-1 flex items-center gap-2">
                <Star className="w-3 h-3 text-[#C5A880] fill-[#C5A880]" aria-hidden="true" />
                <span className="font-['Space_Grotesk'] text-[#C5A880] text-[11px] font-bold tracking-wide">
                  {r.name} · {r.project}
                </span>
              </figcaption>
            </div>
            <span className="hidden sm:block w-px h-8 bg-[#C5A880]/25 mx-2" aria-hidden="true" />
          </figure>
        ))}
      </motion.div>
    </div>
  );
}