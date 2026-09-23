"use client";

import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import BeforeAfterShowcase from '@/components/BeforeAfterShowcase';
import DesignGallery from '@/components/DesignGallery';
import SocietyPreMeasured from '@/components/SocietyPreMeasured';
import StatsTicker from '@/components/StatsTicker';
import EstimatorGateway from '@/components/EstimatorGateway';
import Footer from '@/components/Footer';
import { CityConfig } from '@/lib/cities';

interface CityLandingProps {
  city: CityConfig;
}

export default function CityLanding({ city }: CityLandingProps) {
  return (
    <>
      {/* Hero with city-specific content */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#1C130B]">
        {/* Full-bleed background image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C130B]/90 via-[#1C130B]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C130B]/80 via-transparent to-[#1C130B]/30" />
        </div>

        {/* Ambient gold gradient blobs */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 -right-32 w-[520px] h-[520px] rounded-full bg-[#C5A880]/25 blur-[110px] animate-pulse" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 left-1/4 w-[420px] h-[420px] rounded-full bg-[#8A5836]/30 blur-[90px] animate-pulse" />

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
              {city.hero.eyebrow}
            </motion.p>

            {/* Headline — word-by-word stagger reveal */}
            <motion.h1
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.08 } },
              }}
              className="font-['Syne'] text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#FAF8F5] leading-[1.08] tracking-[-0.03em] mb-6"
            >
              {city.hero.headline.split(' ').map((word, i) => (
                <motion.span
                  key={`${word}-${i}`}
                  variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } }}}
                  className={`inline-block mr-[0.3em] ${word === '48' || word.startsWith('Hours') ? 'text-[#C5A880]' : ''}`}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="font-['Plus_Jakarta_Sans'] text-base sm:text-lg text-[#FAF8F5]/70 font-normal leading-relaxed mb-10 max-w-md"
            >
              {city.hero.subtext}
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-start gap-4 mb-16"
            >
              <button
                onClick={() => document.getElementById('estimator')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-[#C5A880] hover:bg-[#b8996f] text-[#1C130B] px-8 py-4 rounded-2xl font-semibold text-sm sm:text-base flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                Get Instant Quote
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-[#FAF8F5]/60 hover:text-[#FAF8F5] px-4 py-4 font-medium text-sm sm:text-base transition-colors cursor-pointer"
              >
                View Lookbook →
              </button>
              <button
                onClick={() => window.location.href = '/quiz'}
                className="bg-[#FAF8F5]/10 hover:bg-[#FAF8F5]/20 text-[#FAF8F5] border border-[#C5A880]/30 px-8 py-4 rounded-2xl font-semibold text-sm sm:text-base flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v8M8 12h8" />
                </svg>
                Take Style Quiz
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
                <svg className="w-3.5 h-3.5 text-[#C5A880]/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Zero Civil Work
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-[#C5A880]/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-4c0-.6-.4-1-1-1h-2" />
                  <path d="M5 17H3c-.6 0-1-.4-1-1v-4c0-.6.4-1 1-1h2" />
                  <path d="M12 17v-7" />
                  <path d="M7 10l5-5 5 5" />
                </svg>
                Design-on-Wheels Swatch Van
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-[#C5A880]/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
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
              {city.hero.statPills.map((pill, i) => (
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

      {/* Before/After Showcase */}
      <BeforeAfterShowcase city={city} />

      {/* Design Gallery */}
      <DesignGallery city={city} />

      {/* Society Pre-Measured */}
      <SocietyPreMeasured city={city} />

      {/* Stats Ticker */}
      <StatsTicker />

      {/* Estimator Gateway */}
      <EstimatorGateway city={city} />

      {/* Footer */}
      <Footer city={city} />
    </>
  );
}