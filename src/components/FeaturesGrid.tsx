"use client";

import React from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

const FEATURES = [
  { icon: '👑', title: 'Luxury Tier', desc: '400+ Transformed' },
  { icon: '⚙️', title: 'Precision', desc: '±2mm Tolerance' },
  { icon: '🌟', title: 'Warranty', desc: '2-Year Regal' },
  { icon: '⏱️', title: '48-Hour SLA', desc: 'Guaranteed Handover' },
  { icon: '🧱', title: 'Zero Civil Work', desc: '100% Dust-Free' },
  { icon: '🚚', title: 'Swatch Van', desc: 'Design At Your Door' },
  { icon: '📏', title: 'Laser Mapped', desc: 'Pre-scanned Societies' },
  { icon: '🛡️', title: 'Escrow Pricing', desc: '10/60/30 Tranches' },
  { icon: '🤫', title: 'Acoustic Louvers', desc: 'NRC 0.8 Soundproofing' },
  { icon: '📱', title: 'Smart Blinds', desc: 'Somfy Motorized' },
  { icon: '🌿', title: 'Washable Vinyl', desc: 'High-Rise Anti-Fungal' },
  { icon: '🪵', title: 'Authentic Grain', desc: 'Nordic Fluted Teak' },
  { icon: '🧲', title: 'Invisible Seams', desc: 'Edge-Matched Paneling' },
  { icon: '✨', title: 'Gold Foiling', desc: 'Metallic Accents' },
  { icon: '📐', title: 'Floor-to-Ceiling', desc: 'Custom 10ft Heights' },
  { icon: '🤝', title: 'Dedicated PM', desc: 'Single Contact Point' },
  { icon: '🎨', title: 'Pichwai Murals', desc: 'Hand-Finished Art' },
  { icon: '🧼', title: 'Low Maintenance', desc: 'Wipe-Clean Surfaces' },
];

export default function FeaturesGrid() {
  return (
    <section className="py-24 px-6 bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black font-['Syne'] text-[#1C130B] mb-4 tracking-tight">
              The AuroMakeover Standard
            </h2>
            <p className="text-[#1C130B]/70 font-['Plus_Jakarta_Sans'] max-w-2xl mx-auto font-medium leading-relaxed">
              Every installation is executed with absolute precision, zero dust, and guaranteed timelines. Discover why Hyderabad's finest societies choose us.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {FEATURES.map((feat, i) => (
            <ScrollReveal key={i} delay={i * 0.05} yOffset={20}>
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C5A880]/20 shadow-[0_4px_20px_rgba(197,168,128,0.05)] hover:border-[#C5A880]/60 transition-all duration-300 h-full flex flex-col justify-center items-start group">
                <span className="text-3xl sm:text-4xl mb-4 grayscale-[0.2] group-hover:grayscale-0 transition-all group-hover:scale-110 origin-bottom-left">
                  {feat.icon}
                </span>
                <h3 className="font-['Syne'] font-bold text-lg sm:text-xl text-[#1C130B] mb-1">
                  {feat.title}
                </h3>
                <p className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#8A5836] font-semibold tracking-wide uppercase">
                  {feat.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
