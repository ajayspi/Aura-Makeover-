"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Palette, Clock, ShieldCheck, Truck } from 'lucide-react';

const HEADLINE = 'Premium Home Makeovers in 48 Hours.';

const headlineContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const headlineWord: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const STAT_PILLS = ['247 Flats Done', '4.9★ Rating', '48hr Guarantee'];

export default function HeroSection() {
  const router = useRouter();

  const scrollToEstimator = () => {
    document.getElementById('estimator')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToGallery = () => {
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#1C130B]">
      {/* Full-bleed background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero.jpg"
          alt="Luxury apartment living room with fluted walnut louvers and botanical wallpaper"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C130B]/90 via-[#1C130B]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C130B]/80 via-transparent to-[#1C130B]/30" />
      </div>

      {/* Ambient gold gradient blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-32 w-[520px] h-[520px] rounded-full bg-[#C5A880]/25 blur-[110px] animate-pulse"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 left-1/4 w-[420px] h-[420px] rounded-full bg-[#8A5836]/30 blur-[90px] animate-pulse"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-32">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[#C5A880] text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-6"
          >
            Now serving Hyderabad West
          </motion.p>

          {/* Headline — word-by-word stagger reveal */}
          <motion.h1
            variants={headlineContainer}
            initial="hidden"
            animate="show"
            className="font-['Syne'] text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#FAF8F5] leading-[1.08] tracking-[-0.03em] mb-6"
          >
            {HEADLINE.split(' ').map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                variants={headlineWord}
                className={`inline-block mr-[0.3em] ${
                  word === '48' || word.startsWith('Hours') ? 'text-[#C5A880]' : ''
                }`}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subtext — one line, not a paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-['Plus_Jakarta_Sans'] text-base sm:text-lg text-[#FAF8F5]/70 font-normal leading-relaxed mb-10 max-w-md"
          >
            Wallpapers, acoustic louvers &amp; smart blinds — installed with zero civil work and zero dust.
          </motion.p>

          {/* CTA — primary + lookbook + quiz */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-start gap-4 mb-16"
          >
            <button
              onClick={scrollToEstimator}
              className="bg-[#C5A880] hover:bg-[#b8996f] text-[#1C130B] px-8 py-4 rounded-2xl font-semibold text-sm sm:text-base flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
            >
              Get Instant Quote
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => router.push('/quiz')}
              className="bg-[#FAF8F5]/10 hover:bg-[#FAF8F5]/20 text-[#FAF8F5] border border-[#C5A880]/30 px-8 py-4 rounded-2xl font-semibold text-sm sm:text-base flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Palette className="w-4 h-4" />
              Take Style Quiz
            </button>
            <button
              onClick={scrollToGallery}
              className="text-[#FAF8F5]/60 hover:text-[#FAF8F5] px-4 py-4 font-medium text-sm sm:text-base transition-colors cursor-pointer"
            >
              View Lookbook →
            </button>
          </motion.div>

          {/* Trust badges — responsive grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[#FAF8F5]/50 text-xs sm:text-sm font-medium"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]/60" />
              Zero Civil Work
            </span>
            <span className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-[#C5A880]/60" />
              Design-on-Wheels Swatch Van
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#C5A880]/60" />
              2-Year Warranty
            </span>
          </motion.div>

          {/* Floating stat pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="flex flex-wrap gap-3 mt-10"
          >
            {STAT_PILLS.map((pill, i) => (
              <motion.span
                key={pill}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.1 + i * 0.1 }}
                className="bg-[#FAF8F5]/10 border border-[#C5A880]/30 text-[#FAF8F5]/90 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full backdrop-blur-sm"
              >
                {pill}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
