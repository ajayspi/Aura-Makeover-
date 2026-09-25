"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'How can a full makeover really take 48 hours?',
    a: 'Day 1: the swatch van laser-measures every wall and we cut your finishes off-site to the millimetre. Day 2: master technicians install everything in a single visit — zero civil work, zero painting, zero debris.',
  },
  {
    q: 'What exactly is the 10/60/30 escrow protection?',
    a: 'You pay 10% to confirm the booking, 60% when materials are released for your walls, and the final 30% only after the joint quality walkthrough at the 48-hour mark.',
  },
  {
    q: 'Is my society already pre-measured?',
    a: 'Societies like My Home Bhooja, Aparna Sarovar Zenith, Rajapushpa Provincia and Prestige High Fields carry CAD pre-maps — so your install needs no fresh survey. Not listed? We map yours within a week.',
  },
  {
    q: 'Which areas do you serve?',
    a: 'All of Hyderabad West: Kokapet, Tellapur, Financial District, Nallagandla and Gachibowli — with dedicated crews stationed per corridor.',
  },
  {
    q: 'What does the warranty cover?',
    a: 'A 2-year comprehensive warranty on materials and workmanship: wallpaper adhesion, louver alignment and motorised blind mechanisms are all covered.',
  },
  {
    q: 'How do I know the price before committing?',
    a: 'The instant estimator returns a live ₹ figure from your dimensions and finish tier — the same number our team quotes. No site-visit fee, no surprise line items.',
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 sm:py-32 px-6 bg-[#FAF8F5] scroll-mt-20">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-10"
        >
          <p className="text-[#8A5836] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Questions, answered
          </p>
          <h2 className="font-['Syne'] text-3xl sm:text-4xl font-bold text-[#1C130B] tracking-[-0.02em] leading-[1.15] mb-4">
            Everything you&rsquo;d ask the site supervisor
          </h2>
          <p className="font-['Plus_Jakarta_Sans'] text-[#1C130B]/60 text-base leading-relaxed">
            Straight answers on timelines, escrow, warranties and pricing — before you book the van.
          </p>
        </motion.div>

        <div className="grid gap-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={f.q}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(i, 4) * 0.05 }}
                className={`rounded-2xl bg-white border transition-colors duration-300 ${
                  isOpen ? 'border-[#C5A880]' : 'border-[#C5A880]/30 hover:border-[#C5A880]/70'
                }`}
              >
                <button
                  type="button"
                  id={`faq-btn-${i}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 text-left cursor-pointer"
                >
                  <span className="font-['Syne'] font-bold text-[#1C130B] text-sm sm:text-base">
                    {f.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-[#8A5836] transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-btn-${i}`}
                    className="px-5 sm:px-6 pb-5"
                  >
                    <p className="font-['Plus_Jakarta_Sans'] text-[#1C130B]/70 text-sm leading-relaxed border-l-2 border-[#C5A880] pl-4">
                      {f.a}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
