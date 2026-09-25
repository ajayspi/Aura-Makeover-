"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Ruler, Factory, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    n: 'Step 1',
    when: 'Day 1 · Morning',
    title: 'Laser Measure',
    copy: 'Our swatch van visits with 200+ physical swatches and laser-measures every wall to the millimetre.',
    icon: Ruler,
  },
  {
    n: 'Step 2',
    when: 'Day 1 · Afternoon',
    title: 'Off-site Craft',
    copy: 'Wallpapers, louvers and blinds are cut and finished off-site to your exact dimensions — zero on-site dust.',
    icon: Factory,
  },
  {
    n: 'Step 3',
    when: 'Day 2 · Morning',
    title: 'Dust-free Install',
    copy: 'Master technicians install everything in a single day. Zero civil work, zero paint, zero debris.',
    icon: Sparkles,
  },
  {
    n: 'Step 4',
    when: 'Day 2 · Handover',
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
              className="bg-foil-card rounded-3xl p-6 flex flex-col gap-4 border border-[#C5A880]/20"
            >
              <div className="flex items-center justify-between">
                <span className="bg-[#C5A880] text-[#1C130B] font-['Syne'] text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded-full">
                  {s.when}
                </span>
                <s.icon className="w-5 h-5 text-[#C5A880]" />
              </div>
              <h3 className="font-['Syne'] text-[#FAF8F5] text-xl font-bold tracking-[-0.01em]">
                {s.title}
              </h3>
              <p className="font-['Plus_Jakarta_Sans'] text-[#FAF8F5]/60 text-sm leading-relaxed">
                {s.copy}
              </p>
              <span aria-hidden="true" className="mt-auto text-[#C5A880]/40 text-xs font-['Syne'] font-bold tracking-[0.2em] uppercase">
                {s.n}
              </span>
            </motion.li>
          ))}
        </motion.ol>

        {/* Metallic 48-hour seal strip */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-3xl bg-[#3E2C1E] border border-[#C5A880]/40 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 mb-8"
        >
          <span className="font-['Syne'] text-5xl sm:text-6xl font-black text-foil leading-none">
            48H
          </span>
          <div className="text-center sm:text-left">
            <p className="font-['Syne'] text-[#FAF8F5] text-lg font-bold tracking-[-0.01em]">
              The clock starts at first measure — and it stops at handover.
            </p>
            <p className="font-['Plus_Jakarta_Sans'] text-[#FAF8F5]/65 text-sm leading-relaxed mt-1">
              Every step above is sequenced to finish inside the 48-hour window, with a joint QA
              walkthrough before your keys come back to you.
            </p>
          </div>
          <a
            href="#estimator"
            className="group inline-flex items-center gap-2 bg-[#C5A880] hover:bg-[#FAF8F5] text-[#1C130B] font-bold text-sm px-6 py-3.5 rounded-2xl transition-all shadow-lg shrink-0"
          >
            Start my 48 hours
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>

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
