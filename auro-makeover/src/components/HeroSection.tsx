"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Clock, ShieldCheck, ArrowRight, Star, Building2 } from 'lucide-react';

const HEADLINE_WORDS = [
  { text: "Premium", highlight: false },
  { text: "Home", highlight: false },
  { text: "Makeovers", highlight: false },
  { text: "in", highlight: false },
  { text: "48", highlight: true },
  { text: "Hours.", highlight: true },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const wordVariants = {
  hidden: {
    opacity: 0,
    y: 28,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const STAT_PILLS = [
  {
    id: "flats",
    icon: Building2,
    label: "247 Flats Done",
    sub: "Hyderabad West",
    delay: 0.8,
    duration: 5.2,
    yOffset: [-4, 4, -4],
  },
  {
    id: "rating",
    icon: Star,
    label: "4.9★ Rating",
    sub: "Verified Residents",
    delay: 1.0,
    duration: 6.0,
    yOffset: [4, -4, 4],
  },
  {
    id: "guarantee",
    icon: ShieldCheck,
    label: "48hr Guarantee",
    sub: "Zero Civil Work",
    delay: 1.2,
    duration: 5.6,
    yOffset: [-3, 5, -3],
  },
];

const TRUST_BADGES = [
  {
    icon: Clock,
    title: "48-Hour Install",
    desc: "From measurement to final QA sign-off.",
  },
  {
    icon: ShieldCheck,
    title: "Zero Civil Work",
    desc: "100% dust-free, non-invasive, rental-safe.",
  },
  {
    icon: Truck,
    title: "Design-on-Wheels",
    desc: "Mobile swatch vans come to your door.",
  },
];

export default function HeroSection() {
  const scrollToEstimator = () => {
    document.getElementById('estimator')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToGallery = () => {
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#1C130B] text-[#FAF8F5] pt-24 pb-14 px-6 font-['Plus_Jakarta_Sans'] rounded-b-[2.5rem] md:rounded-b-[3.5rem]">
      {/* Animated Ambient Gold & Terracotta Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Top-Right Warm Gold Ambient Blob */}
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -35, 25, 0],
            scale: [1, 1.18, 0.95, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-32 -right-32 w-[520px] md:w-[680px] h-[520px] md:h-[680px] rounded-full bg-[#C5A880]/20 blur-[120px]"
        />

        {/* Bottom-Left Terracotta Ambient Blob */}
        <motion.div
          animate={{
            x: [0, -35, 30, 0],
            y: [0, 40, -20, 0],
            scale: [1.1, 0.9, 1.15, 1.1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-32 -left-32 w-[480px] md:w-[620px] h-[480px] md:h-[620px] rounded-full bg-[#8A5836]/25 blur-[110px]"
        />

        {/* Center Subtle Gold Ambient Shimmer */}
        <motion.div
          animate={{
            opacity: [0.25, 0.55, 0.25],
            scale: [0.92, 1.1, 0.92],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] md:w-[480px] h-[340px] md:h-[480px] rounded-full bg-[#C5A880]/10 blur-[95px]"
        />
      </div>

      {/* Hero Core Content */}
      <div className="max-w-4xl mx-auto text-center relative z-10 my-auto">
        {/* Service Corridor Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#8A5836]/20 border border-[#8A5836]/40 text-[#C5A880] text-xs sm:text-sm font-bold tracking-wide uppercase mb-8 backdrop-blur-sm"
        >
          <Truck className="w-4 h-4 text-[#C5A880]" />
          <span>Now Serving Hyderabad West · Kokapet · Tellapur · Financial District</span>
        </motion.div>

        {/* Staggered Word-by-Word Reveal Headline */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-['Syne'] leading-[1.08] tracking-tight mb-8"
        >
          {HEADLINE_WORDS.map((item, index) => (
            <motion.span
              key={`${item.text}-${index}`}
              variants={wordVariants}
              className={`inline-block mr-2.5 sm:mr-3.5 last:mr-0 ${
                item.highlight ? 'text-[#C5A880]' : 'text-[#FAF8F5]'
              }`}
            >
              {item.text}
            </motion.span>
          ))}
        </motion.h1>

        {/* Narrative Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3, ease: "easeOut" }}
          className="text-base sm:text-lg md:text-xl text-[#FAF8F5]/80 font-medium mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          No civil work. No dust. We bring the design studio to your sofa and install luxury wallpapers, acoustic louvers, and smart blinds in 48 Hours.
        </motion.p>

        {/* Floating Stat Pills with Stagger Delay */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
          {STAT_PILLS.map((pill) => {
            const Icon = pill.icon;
            return (
              <motion.div
                key={pill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: pill.delay, ease: "easeOut" }}
              >
                <motion.div
                  animate={{ y: pill.yOffset }}
                  transition={{
                    duration: pill.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="bg-[#FAF8F5]/10 border border-[#C5A880]/30 rounded-2xl px-4 py-2.5 backdrop-blur-md flex items-center gap-2.5 shadow-lg shadow-[#1C130B]/50 hover:border-[#C5A880] transition-colors"
                >
                  <div className="w-7 h-7 rounded-2xl bg-[#C5A880]/20 flex items-center justify-center text-[#C5A880]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs sm:text-sm font-bold text-[#FAF8F5] leading-tight">
                      {pill.label}
                    </div>
                    <div className="text-[10px] text-[#FAF8F5]/60 font-medium leading-tight">
                      {pill.sub}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={scrollToEstimator}
            className="w-full sm:w-auto bg-[#C5A880] hover:bg-[#8A5836] text-[#1C130B] hover:text-[#FAF8F5] px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-[#C5A880]/20 cursor-pointer"
          >
            <span>Get Instant Quote</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={scrollToGallery}
            className="w-full sm:w-auto bg-[#FAF8F5]/10 hover:bg-[#FAF8F5]/20 text-[#FAF8F5] px-8 py-4 rounded-2xl font-bold text-lg transition-all border border-[#C5A880]/30 backdrop-blur-sm active:scale-95 cursor-pointer"
          >
            View Lookbook
          </button>
        </motion.div>
      </div>

      {/* 3 Trust Badges in rounded-2xl Containers */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.5, ease: "easeOut" }}
        className="max-w-5xl mx-auto w-full mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 relative z-10 border-t border-[#FAF8F5]/10 pt-8"
      >
        {TRUST_BADGES.map((badge, idx) => {
          const BadgeIcon = badge.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-[#FAF8F5]/5 border border-[#C5A880]/20 p-5 flex flex-col items-center text-center backdrop-blur-sm transition-all hover:border-[#C5A880]/40 hover:bg-[#FAF8F5]/10"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#C5A880]/15 flex items-center justify-center mb-3">
                <BadgeIcon className="w-6 h-6 text-[#C5A880]" />
              </div>
              <h3 className="font-bold text-lg mb-1 font-['Syne'] text-[#FAF8F5]">
                {badge.title}
              </h3>
              <p className="text-sm text-[#FAF8F5]/70">
                {badge.desc}
              </p>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}
