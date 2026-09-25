"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import AnimatedCounter from '@/components/AnimatedCounter';

export interface Review {
  name: string;
  location: string;
  rating: number;
  quote: string;
  project: string;
}

export const REVIEWS: Review[] = [
  {
    name: 'Ananya Reddy',
    location: 'Kokapet · Hyderabad',
    rating: 5,
    quote:
      'Our living-room accent wall went from beige to a statement in exactly 48 hours. The swatch van visit meant zero guesswork — colour matched perfectly in daylight.',
    project: '3BHK Botanical Wallpaper',
  },
  {
    name: 'Vikram Shetty',
    location: 'Tellapur · Hyderabad',
    rating: 5,
    quote:
      'Fluted louvers on the TV wall plus smart blinds, dust-free throughout. The 10/60/30 escrow plan let us release payment per milestone — very clean process.',
    project: 'Acoustic Fluted Louvers',
  },
  {
    name: 'Meera Krishnan',
    location: 'Financial District · Hyderabad',
    rating: 5,
    quote:
      'They measured everything with CAD from the society pre-map, so installation took a single afternoon. Two-year warranty on top — no stress at all.',
    project: 'Neo-Classical Bedroom',
  },
  {
    name: 'Rahul Menon',
    location: 'Whitefield · Bangalore',
    rating: 5,
    quote:
      'Moved floors between towers and AuroMakeover re-mapped the wall drops without a site visit. That is the kind of pre-measured service that saves weekends.',
    project: 'Temple Pichwai Pooja Room',
  },
  {
    name: 'Divya Iyer',
    location: 'OMR · Chennai',
    rating: 5,
    quote:
      'The estimator gave an honest ₹ figure before we committed, and the final bill matched it to the rupee. Rare in this industry — would recommend.',
    project: 'Motorized Blackout Blinds',
  },
  {
    name: 'Arjun Patel',
    location: 'Gachibowli · Hyderabad',
    rating: 5,
    quote:
      '48-hour promise kept, literally. Walked into a finished accent wall with zero civil work and a spotless floor. The QA handover was thorough.',
    project: '3BHK Full Living Suite',
  },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <div
      role="img"
      aria-label={`${rating} out of 5 stars`}
      className="flex items-center gap-1"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-[#C5A880] fill-[#C5A880]' : 'text-[#1C130B]/20'}`}
        />
      ))}
    </div>
  );
}

function InitialsAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <span className="w-11 h-11 rounded-full bg-[#1C130B] text-[#C5A880] flex items-center justify-center font-['Syne'] font-bold text-sm shrink-0">
      {initials}
    </span>
  );
}

export default function Reviews() {
  return (
    <section id="reviews" className="py-24 sm:py-32 px-6 bg-[#FAF8F5] scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-12"
        >
          <p className="text-[#8A5836] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Reviews
          </p>
          <h2 className="font-['Syne'] text-3xl sm:text-4xl font-bold text-[#1C130B] tracking-[-0.02em] leading-[1.15] mb-4">
            Homes we finished, people we made happy
          </h2>
          <div className="flex items-center gap-3">
            <StarRow rating={5} />
            <p className="font-['Plus_Jakarta_Sans'] text-[#1C130B]/60 text-sm">
              4.9 / 5 across <AnimatedCounter value={200} suffix="+" /> 48-hour makeovers
            </p>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {REVIEWS.map((r) => (
            <motion.article
              key={r.name}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
              }}
              className="bg-white rounded-3xl border border-[#C5A880]/25 p-6 flex flex-col gap-4 shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center justify-between">
                <StarRow rating={r.rating} />
                <span className="text-[#8A5836] text-[11px] font-bold uppercase tracking-wider bg-[#8A5836]/10 border border-[#8A5836]/25 px-2.5 py-1 rounded-full">
                  {r.project}
                </span>
              </div>
              <Quote className="w-5 h-5 text-[#C5A880]" />
              <p className="font-['Plus_Jakarta_Sans'] text-[#1C130B]/80 text-sm leading-relaxed flex-1">
                &ldquo;{r.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-[#1C130B]/10">
                <InitialsAvatar name={r.name} />
                <div>
                  <p className="font-['Syne'] font-bold text-[#1C130B] text-sm">{r.name}</p>
                  <p className="font-['Plus_Jakarta_Sans'] text-[#1C130B]/50 text-xs">
                    {r.location}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
