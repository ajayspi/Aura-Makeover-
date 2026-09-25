"use client";

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import {
  BUDGET_BANDS,
  recommendPackage,
  recommendToPrefill,
  type PackageDef,
} from '@/lib/package-recommender';

const ROOM_OPTIONS = [
  { label: 'Living Room', value: 'living' },
  { label: 'Bedroom', value: 'bedroom' },
  { label: 'Pooja Room', value: 'pooja' },
  { label: 'Home Office', value: 'office' },
  { label: 'Full Home', value: 'full-home' },
];

const STYLE_OPTIONS = [
  { label: 'Botanical', value: 'botanical' },
  { label: 'Fluted Louver', value: 'fluted' },
  { label: 'Neo-Classical', value: 'neoclassical' },
  { label: 'Pichwai', value: 'pichwai' },
  { label: 'Minimal', value: 'minimal' },
];

const SCOPE_OPTIONS = [
  { label: 'Single accent wall', value: 'accent' },
  { label: 'Whole room', value: 'full-room' },
];

interface ChipsProps {
  options: { label: string; value: string }[];
  selected: string | null;
  onSelect: (value: string) => void;
}

function Chips({ options, selected, onSelect }: ChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = selected === o.value;
        return (
          <button
            key={o.value}
            onClick={() => onSelect(o.value)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer ${
              active
                ? 'bg-[#1C130B] text-[#C5A880] shadow-md'
                : 'bg-white border border-[#C5A880]/30 text-[#1C130B]/70 hover:border-[#C5A880]'
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export default function PackageRecommender() {
  const router = useRouter();
  const [roomType, setRoomType] = useState<string | null>(null);
  const [style, setStyle] = useState<string | null>(null);
  const [budget, setBudget] = useState<number | null>(null);
  const [scope, setScope] = useState<string | null>(null);

  const result = useMemo(
    () => recommendPackage({ roomType, style, budget, scope }),
    [roomType, style, budget, scope],
  );

  const applyPrefill = (pkg: PackageDef) => {
    const prefill = recommendToPrefill(pkg);
    try {
      sessionStorage.setItem('estimator_prefill', JSON.stringify(prefill));
    } catch {
      /* ignore */
    }
    const url = `/#estimator?prefill=${encodeURIComponent(JSON.stringify(prefill))}`;
    router.push(url);
  };

  return (
    <section id="package-recommender" className="py-24 sm:py-32 px-6 bg-[#1C130B] scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-12"
        >
          <p className="text-[#C5A880] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Package recommender
          </p>
          <h2 className="font-['Syne'] text-3xl sm:text-4xl font-bold text-[#FAF8F5] tracking-[-0.02em] leading-[1.15] mb-4">
            Tell us your space, get a package
          </h2>
          <p className="font-['Plus_Jakarta_Sans'] text-[#FAF8F5]/60 text-base leading-relaxed">
            Four quick answers — we score every AuroMakeover package against your space and serve
            the best match, with the estimate pre-filled.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3 flex flex-col gap-6"
          >
            <div className="bg-[#FAF8F5] rounded-3xl p-6 flex flex-col gap-4">
              <div>
                <p className="font-['Syne'] font-bold text-[#1C130B] text-sm mb-2">
                  Which room are we transforming?
                </p>
                <Chips options={ROOM_OPTIONS} selected={roomType} onSelect={setRoomType} />
              </div>
              <div>
                <p className="font-['Syne'] font-bold text-[#1C130B] text-sm mb-2">
                  What is your style?
                </p>
                <Chips options={STYLE_OPTIONS} selected={style} onSelect={setStyle} />
              </div>
              <div>
                <p className="font-['Syne'] font-bold text-[#1C130B] text-sm mb-2">
                  Rough budget band
                </p>
                <div className="flex flex-wrap gap-2">
                  {BUDGET_BANDS.map((b) => {
                    const active = budget === b.value;
                    return (
                      <button
                        key={b.value}
                        onClick={() => setBudget(b.value)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                          active
                            ? 'bg-[#1C130B] text-[#C5A880] shadow-md'
                            : 'bg-white border border-[#C5A880]/30 text-[#1C130B]/70 hover:border-[#C5A880]'
                        }`}
                      >
                        {b.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="font-['Syne'] font-bold text-[#1C130B] text-sm mb-2">
                  Project scope
                </p>
                <Chips options={SCOPE_OPTIONS} selected={scope} onSelect={setScope} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-[#FAF8F5] rounded-3xl p-6 flex flex-col gap-4 sm:sticky sm:top-24">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[#8A5836] text-[11px] font-bold uppercase tracking-wider bg-[#8A5836]/10 border border-[#8A5836]/25 px-2.5 py-1 rounded-full">
                  <Sparkles className="w-3 h-3" /> Best match
                </span>
                <span className="font-['Syne'] text-[#8A5836] text-xs font-bold uppercase tracking-widest">
                  {result.package.tier}
                </span>
              </div>
              <h3 className="font-['Syne'] text-2xl font-bold text-[#1C130B]">
                {result.package.name}
              </h3>
              <p className="font-['Plus_Jakarta_Sans'] text-[#1C130B]/60 text-sm leading-relaxed">
                {result.package.tagline}
              </p>
              <ul className="flex flex-col gap-2">
                {result.package.includes.map((inc) => (
                  <li key={inc} className="flex items-start gap-2 text-sm text-[#1C130B]/80">
                    <CheckCircle2 className="w-4 h-4 text-[#15803D] mt-0.5 shrink-0" />
                    {inc}
                  </li>
                ))}
              </ul>
              {result.matches.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {result.matches.map((m) => (
                    <span
                      key={m}
                      className="text-[10px] font-bold text-[#8A5836] bg-[#8A5836]/10 border border-[#8A5836]/20 px-2 py-0.5 rounded-full"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              )}
              <button
                onClick={() => applyPrefill(result.package)}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#1C130B] hover:bg-[#8A5836] text-[#FAF8F5] font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] shadow-md hover:shadow-lg cursor-pointer"
              >
                Pre-fill My Estimate
                <ArrowRight className="w-4 h-4 text-[#C5A880]" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
