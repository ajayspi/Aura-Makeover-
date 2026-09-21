"use client";

import React, { useRef } from 'react';
import { Building2, ChevronLeft, ChevronRight, ArrowRight, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

export interface SocietyItem {
  id: string;
  name: string;
  flatsDone: string;
  unitType: string;
  priceEstimate: string;
  corridor: string;
  preMeasuredFeatures: string[];
  recommendedFinish: string;
  wallDimensions: string;
}

export const SOCIETIES: SocietyItem[] = [
  {
    id: "my-home-bhooja",
    name: "My Home Bhooja",
    flatsDone: "47 flats done 🔥",
    unitType: "3BHK Standard",
    priceEstimate: "Est. ₹38,000–₹55,000",
    corridor: "Silpa Gram / HITEC City Corridor",
    wallDimensions: "12ft × 9.5ft living feature wall",
    recommendedFinish: "Acoustic Smoked Walnut Louvers",
    preMeasuredFeatures: [
      "Living room 12ft feature wall pre-configured",
      "Foyer accent wall laser-measured",
      "Zero on-site trimming; zero gypsum dust",
    ],
  },
  {
    id: "aparna-sarovar-zenith",
    name: "Aparna Sarovar Zenith",
    flatsDone: "38 flats done 🔥",
    unitType: "3BHK Luxury",
    priceEstimate: "Est. ₹34,000–₹48,000",
    corridor: "Nallagandla / Gachibowli Corridor",
    wallDimensions: "11ft × 9.5ft master & foyer alcove",
    recommendedFinish: "Emerald Monstera Sanctuary",
    preMeasuredFeatures: [
      "Foyer & living dining gallery pre-configured",
      "Master bedroom accent alcove calibrated",
      "Tested for bubble-free adhesion on builder putty",
    ],
  },
  {
    id: "rajapushpa-provincia",
    name: "Rajapushpa Provincia",
    flatsDone: "52 flats done 🔥",
    unitType: "3BHK Grande",
    priceEstimate: "Est. ₹42,000–₹58,000",
    corridor: "Narsingi / Financial District West",
    wallDimensions: "13ft × 10ft double-height dining",
    recommendedFinish: "Versailles Moulding & Gold",
    preMeasuredFeatures: [
      "Double-height dining & lounge pre-mapped",
      "Living lounge TV backdrop CAD mapped",
      "Full HOA compliance; zero noise during install",
    ],
  },
  {
    id: "prestige-high-fields",
    name: "Prestige High Fields",
    flatsDone: "41 flats done 🔥",
    unitType: "3BHK Classic",
    priceEstimate: "Est. ₹36,000–₹52,000",
    corridor: "ISB Road / Financial District",
    wallDimensions: "11.5ft × 9.5ft main living wall",
    recommendedFinish: "Lotus Pond Shrinathji Pichwai",
    preMeasuredFeatures: [
      "11.5ft living room feature wall ready",
      "Pooja sanctuary Pichwai dimensions mapped",
      "Zero civil disruption; rental & owner friendly",
    ],
  },
];

export default function SocietyPreMeasured() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleSelectSociety = (societyName: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('auro:select-society', {
          detail: { society: societyName },
        })
      );
    }
    const estimatorEl = document.getElementById('estimator');
    if (estimatorEl) {
      estimatorEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="societies" className="py-24 px-6 max-w-7xl mx-auto font-['Plus_Jakarta_Sans']">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-[#8A5836] font-bold uppercase tracking-wider text-xs md:text-sm mb-3">
            <Building2 className="w-4 h-4 text-[#C5A880]" />
            <span>Precision Pre-Engineered Floor Plans</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Syne'] text-[#1C130B] tracking-tight leading-[1.1]">
            Your Society, Pre-Measured
          </h2>
          <p className="mt-3 text-[#1C130B]/70 text-sm md:text-base font-normal leading-relaxed">
            We have pre-mapped CAD dimensions for Hyderabad West marquee towers. Choose your society for verified wall nesting, guaranteed fit, and zero on-site measurement delays.
          </p>
        </div>

        {/* Scroll Controls (Desktop & Tablet) */}
        <div className="flex items-center gap-3 self-end">
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="w-11 h-11 rounded-full border border-[#C5A880]/40 flex items-center justify-center text-[#1C130B] hover:bg-[#C5A880]/20 active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 text-[#1C130B]" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="w-11 h-11 rounded-full border border-[#C5A880]/40 flex items-center justify-center text-[#1C130B] hover:bg-[#C5A880]/20 active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <ChevronRight className="w-5 h-5 text-[#1C130B]" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll of 4 Society Cards */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-8 pt-2 px-1 snap-x snap-mandatory scroll-smooth hide-scrollbar"
      >
        {SOCIETIES.map((society) => (
          <div
            key={society.id}
            className="min-w-[300px] sm:min-w-[340px] md:min-w-[380px] max-w-[400px] flex-none snap-start bg-[#FAF8F5] border border-[#C5A880]/30 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-[#C5A880] transition-all duration-300 group"
          >
            <div>
              {/* Top Row: Flats Done Fire Stat + Unit Type */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8A5836]/10 border border-[#8A5836]/25 text-[#8A5836] font-bold text-xs">
                  {society.flatsDone}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#1C130B]/5 border border-[#1C130B]/10 text-xs font-semibold text-[#1C130B]">
                  {society.unitType}
                </span>
              </div>

              {/* Society Title */}
              <h3 className="text-2xl font-black font-['Syne'] text-[#1C130B] mb-1 group-hover:text-[#8A5836] transition-colors">
                {society.name}
              </h3>

              {/* Corridor / Area */}
              <p className="text-xs text-[#1C130B]/60 font-medium mb-5">
                {society.corridor}
              </p>

              {/* Wall & Finish Badge */}
              <div className="p-3 rounded-2xl bg-white/70 border border-[#C5A880]/20 mb-5">
                <div className="text-[11px] font-bold text-[#8A5836] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Pre-Mapped Scope</span>
                </div>
                <div className="text-xs font-semibold text-[#1C130B]">
                  {society.wallDimensions}
                </div>
              </div>

              {/* Pre-Measured Features Bullet Points */}
              <ul className="space-y-2.5 mb-6 text-xs text-[#1C130B]/80">
                {society.preMeasuredFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#15803D] mt-0.5 shrink-0" />
                    <span className="leading-tight">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Card Footer: Price Estimate & Button */}
            <div className="pt-5 border-t border-[#C5A880]/20">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A5836] block">
                    Fixed Estimate
                  </span>
                  <div className="text-xl sm:text-2xl font-black font-['Syne'] text-[#1C130B]">
                    {society.priceEstimate}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#15803D] bg-[#15803D]/10 px-2.5 py-1 rounded-full">
                  <Clock className="w-3 h-3" />
                  <span>48h Ready</span>
                </div>
              </div>

              {/* Check My Flat Button */}
              <button
                onClick={() => handleSelectSociety(society.name)}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#1C130B] hover:bg-[#8A5836] text-[#FAF8F5] font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] shadow-md hover:shadow-lg cursor-pointer group/btn"
              >
                <span>Check My Flat</span>
                <ArrowRight className="w-4 h-4 text-[#C5A880] transition-transform duration-200 group-hover/btn:translate-x-1" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Corridor Coverage Sub-banner */}
      <div className="mt-8 p-4 rounded-2xl bg-[#FAF8F5] border border-[#C5A880]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs md:text-sm text-[#1C130B]/80">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#15803D] animate-pulse shrink-0" />
          <span>Don&apos;t see your tower? We also serve Aparna Zenon, My Home Tarkshya, Lansum Etania, and Jayabheri Silicon County.</span>
        </div>
        <button
          onClick={() => handleSelectSociety("Other Hyderabad High-Rise")}
          className="font-bold text-[#8A5836] hover:text-[#1C130B] underline cursor-pointer shrink-0"
        >
          Check Custom Flat →
        </button>
      </div>
    </section>
  );
}

export { SocietyPreMeasured };
