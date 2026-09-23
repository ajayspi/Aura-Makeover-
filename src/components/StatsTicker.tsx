"use client";

import React from 'react';
import { motion } from 'framer-motion';

const TICKER_ITEMS = [
  "Priya K., My Home Bhooja — '5 stars, done in 1 day!'",
  "247+ High-Rise Flats Transformed in Hyderabad West",
  "Rajesh M., Aparna Sarovar Zenith — 'Zero dust, flawless alignment'",
  "48-Hour Installation Guarantee • Laser-Measured",
  "Vikram S., Rajapushpa Provincia — 'Van arrived in 2 hours with 200+ physical swatches'",
  "2-Year Comprehensive Warranty Vault Included",
];

export default function StatsTicker() {
  // Duplicate the items 3 times for a seamless, unbroken infinite loop across all screen sizes
  const marqueeItems = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div
      aria-label="Client testimonials and transformation statistics"
      className="w-full bg-[#1C130B] border-y border-[#C5A880]/30 py-3.5 sm:py-4 overflow-hidden relative select-none"
    >
      {/* Subtle edge fade overlays using brand espresso */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 md:w-32 bg-gradient-to-r from-[#1C130B] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 md:w-32 bg-gradient-to-l from-[#1C130B] to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex whitespace-nowrap items-center w-max"
        animate={{ x: ["0%", "-33.333333%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 32,
        }}
      >
        {marqueeItems.map((item, idx) => (
          <div key={idx} className="flex items-center">
            <span className="text-[#FAF8F5] text-xs sm:text-sm md:text-base font-medium font-['Plus_Jakarta_Sans'] tracking-wide px-4 sm:px-6">
              {item}
            </span>
            <span
              className="text-[#C5A880] text-xs sm:text-sm px-2 sm:px-3 select-none"
              aria-hidden="true"
            >
              ✦
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export { StatsTicker };
