"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';

/**
 * Regional corridor belt (no map dependency): the four West-Hyderabad
 * corridors as pinned nodes over a gold rail, each with a mapped-society
 * progress bar. Totals reconcile with the pinned "247 Flats Done" stat.
 */
const CORRIDORS = [
  { name: 'Silpa Gram / HITEC City', societies: 6, flats: 78, target: 100 },
  { name: 'Nallagandla / Gachibowli', societies: 5, flats: 62, target: 90 },
  { name: 'Narsingi / Financial District West', societies: 5, flats: 55, target: 80 },
  { name: 'Tellapur / ORR West', societies: 4, flats: 52, target: 80 },
];

const totalFlats = CORRIDORS.reduce((sum, c) => sum + c.flats, 0);
const totalSocieties = CORRIDORS.reduce((sum, c) => sum + c.societies, 0);

export default function SocietyRegionBand() {
  return (
    <section id="corridors" className="py-20 px-6 bg-white border-y border-[#C5A880]/25 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-10"
        >
          <p className="text-[#8A5836] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            West Hyderabad Belt
          </p>
          <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-[#1C130B] tracking-[-0.02em] leading-[1.15] mb-4">
            Pre-measured across every corridor
          </h2>
          <p className="font-['Plus_Jakarta_Sans'] text-[#1C130B]/60 text-base leading-relaxed">
            {totalSocieties} societies mapped, {totalFlats} flats finished. Your corridor likely
            already carries a CAD pre-map — no fresh survey needed.
          </p>
        </motion.div>

        {/* Corridor rail — pinned nodes punched through a gold line (desktop) */}
        <div aria-hidden="true" className="hidden lg:block relative mb-10">
          <div className="absolute left-6 right-6 top-[22px] h-0.5 bg-gradient-to-r from-[#C5A880]/30 via-[#C5A880] to-[#C5A880]/30" />
          <div className="relative flex justify-between">
            {CORRIDORS.map((c) => (
              <div key={c.name} className="flex flex-col items-center gap-2 bg-white px-5">
                <span className="w-11 h-11 rounded-full bg-[#3E2C1E] border border-[#C5A880] flex items-center justify-center shadow-sm">
                  <MapPin className="w-4 h-4 text-[#C5A880]" />
                </span>
                <span className="font-['Space_Grotesk'] text-[#1C130B] text-xs font-bold text-center max-w-[13rem]">
                  {c.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Corridor progress rows */}
        <div className="grid gap-4">
          {CORRIDORS.map((c, i) => {
            const pct = Math.round((c.flats / c.target) * 100);
            return (
              <div
                key={c.name}
                className="rounded-2xl border border-[#C5A880]/30 bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6"
              >
                <div className="sm:w-64 shrink-0 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#8A5836] lg:hidden shrink-0" />
                  <div>
                    <p className="font-['Space_Grotesk'] font-bold text-[#1C130B] text-sm">
                      {c.name}
                    </p>
                    <p className="font-['Plus_Jakarta_Sans'] text-[#1C130B]/50 text-xs">
                      {c.societies} societies mapped
                    </p>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${c.name} makeover progress`}
                    className="h-2.5 rounded-full bg-[#3E2C1E]/10 overflow-hidden"
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.1 * i }}
                      className="h-full rounded-full bg-gradient-to-r from-[#C5A880] to-[#8A5836]"
                    />
                  </div>
                </div>
                <div className="sm:w-40 shrink-0 sm:text-right">
                  <p className="font-['Space_Grotesk'] font-bold text-[#8A5836] text-sm">
                    {c.flats} flats done
                  </p>
                  <p className="font-['Plus_Jakarta_Sans'] text-[#1C130B]/50 text-xs">
                    {pct}% of mapped target
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <a
            href="#estimator"
            className="group inline-flex items-center gap-3 bg-[#1C130B] hover:bg-[#8A5836] text-[#FAF8F5] font-bold text-sm px-7 py-4 rounded-2xl transition-all shadow-lg"
          >
            Check my society
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
          <p className="font-['Plus_Jakarta_Sans'] text-[#1C130B]/60 text-sm">
            Don&rsquo;t see yours? We map new societies every week — ask the swatch van.
          </p>
        </div>
      </div>
    </section>
  );
}
