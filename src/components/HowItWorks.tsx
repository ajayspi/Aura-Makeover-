"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Ruler, Factory, Sparkles, ShieldCheck } from 'lucide-react';

const STEPS = [
  {
    n: 'Step 1',
    title: 'Laser Measure',
    copy: 'Our swatch van visits with 200+ physical swatches and laser-measures every wall to the millimetre.',
    icon: Ruler,
  },
  {
    n: 'Step 2',
    title: 'Off-site Craft',
    copy: 'Wallpapers, louvers and blinds are cut and finished off-site to your exact dimensions — zero on-site dust.',
    icon: Factory,
  },
  {
    n: 'Step 3',
    title: 'Dust-free Install',
    copy: 'Master technicians install everything in a single day. Zero civil work, zero paint, zero debris.',
    icon: Sparkles,
  },
  {
    n: 'Step 4',
    title: 'QA + Warranty',
    copy: 'Joint quality walkthrough at the 48-hour mark, then a 2-year comprehensive warranty kicks in.',
    icon: ShieldCheck,
  },
];

const DIFFERENTIATORS = ['Zero civil work', '10/60/30 escrow protection', '2-year warranty'];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 px-6 bg-[#FAF8F5] scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mb-12"
        >
          <p className="text-[#8A5836] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            How it works
          </p>
          <h2 className="font-['Syne'] text-3xl sm:text-4xl font-bold text-[#1C130B] tracking-[-0.02em] leading-[1.15] mb-4">
            The 48-Hour Method
          </h2>
          <p className="font-['Plus_Jakarta_Sans'] text-[#1C130B]/60 text-base leading-relaxed">
            Four steps. Two days. One hand-over. This is the exact process behind every AuroMakeover.
          </p>
        </motion.div>

        <motion.ol
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10"
        >
          {STEPS.map((s) => (
            <motion.li
              key={s.n}
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }}
              className="bg-[#1C130B] rounded-3xl p-6 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-['Syne'] text-[#C5A880] text-sm font-bold tracking-widest uppercase">
                  {s.n}
                </span>
                <s.icon className="w-5 h-5 text-[#C5A880]" />
              </div>
              <h3 className="font-['Syne'] text-[#FAF8F5] text-xl font-bold tracking-[-0.01em]">
                {s.title}
              </h3>
              <p className="font-['Plus_Jakarta_Sans'] text-[#FAF8F5]/60 text-sm leading-relaxed">
                {s.copy}
              </p>
            </motion.li>
          ))}
        </motion.ol>

        <div className="flex flex-wrap gap-3">
          {DIFFERENTIATORS.map((d) => (
            <span
              key={d}
              className="bg-[#8A5836]/10 border border-[#8A5836]/25 text-[#8A5836] text-xs font-bold px-4 py-2 rounded-full"
            >
              {d}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
