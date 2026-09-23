"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface Finish {
  n: string;
  title: string;
  copy: string;
  image: string;
  tag: string;
}

const FINISHES: Finish[] = [
  {
    n: '01',
    title: 'Wallcoverings & Wallpaper',
    copy: 'Hand-finished damask, textured vinyl and custom murals — bubble-free adhesion or we redo it.',
    image: '/images/showcase-wallpaper.jpg',
    tag: 'Wall finish',
  },
  {
    n: '02',
    title: 'Fluted Louvers & Slats',
    copy: 'Walnut, oak and smoked-teak vertical grain panels with acoustic felt backing.',
    image: '/images/showcase-slats.jpg',
    tag: 'Panelling',
  },
  {
    n: '03',
    title: 'Smart Blinds & Shades',
    copy: 'Motorised day-night rollers, zebra bands and honeycomb cells — app plus remote.',
    image: '/images/showcase-blinds.jpg',
    tag: 'Windows',
  },
  {
    n: '04',
    title: 'Drapes & Curtains',
    copy: 'Floor-to-ceiling pleats in silk, linen and 100% blackout — weighted and steamed on site.',
    image: '/images/showcase-drapes.jpg',
    tag: 'Windows',
  },
  {
    n: '05',
    title: 'Pooja Rooms',
    copy: 'Pichwai murals, brass-finish mandir backdrops and warm backlighting for the sacred corner.',
    image: '/images/showcase-pooja.jpg',
    tag: 'Devotional',
  },
  {
    n: '06',
    title: 'Full Living Suites',
    copy: 'Walls, windows, louvers and lights planned as one look — installed by one crew in 48 hours.',
    image: '/images/showcase-living.jpg',
    tag: 'Whole room',
  },
];

export default function ProductShowcase() {
  return (
    <section id="showcase" className="relative py-24 sm:py-32 px-6 bg-[#3E2C1E] overflow-hidden scroll-mt-20">
      {/* ambient gold glows */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#C5A880]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -right-20 w-[28rem] h-[28rem] rounded-full bg-[#C5A880]/10 blur-3xl"
      />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-12"
        >
          <p className="text-[#C5A880] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            The Showroom
          </p>
          <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-[#FAF8F5] tracking-[-0.02em] leading-[1.15] mb-4">
            Six finishes. <span className="text-foil">One 48-hour crew.</span>
          </h2>
          <p className="font-['Plus_Jakarta_Sans'] text-[#FAF8F5]/70 text-base leading-relaxed">
            Every finish below is pre-measured for your wall, cut off-site and installed dust-free —
            pick a single category or stack them into a full suite.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FINISHES.map((f, i) => (
            <motion.article
              key={f.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
              className="group relative bg-foil-card rounded-3xl overflow-hidden border border-[#C5A880]/25 hover:border-[#C5A880]/70 transition-colors duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={f.image}
                  alt={`${f.title} — premium finish by AuroMakeover`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C130B] via-[#1C130B]/20 to-transparent" />
                <span className="absolute top-4 left-4 font-['Space_Grotesk'] text-[#C5A880] text-xs font-bold tracking-widest uppercase bg-[#1C130B]/70 border border-[#C5A880]/40 rounded-full px-3 py-1">
                  {f.tag}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute top-4 right-4 font-['Space_Grotesk'] text-[#C9CDD4] text-xs font-bold tracking-widest"
                >
                  {f.n}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-['Space_Grotesk'] text-[#FAF8F5] text-lg font-bold tracking-[-0.01em] mb-2">
                  {f.title}
                </h3>
                <p className="font-['Plus_Jakarta_Sans'] text-[#FAF8F5]/60 text-sm leading-relaxed">
                  {f.copy}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <a
            href="#estimator"
            className="group inline-flex items-center gap-3 bg-[#C5A880] hover:bg-[#FAF8F5] text-[#1C130B] font-bold text-sm px-7 py-4 rounded-2xl transition-all shadow-lg"
          >
            Price my finishes
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
          <p className="font-['Plus_Jakarta_Sans'] text-[#FAF8F5]/60 text-sm">
            Free swatch-van visit · 200+ physical swatches · zero-obligation quote
          </p>
        </div>
      </div>
    </section>
  );
}
