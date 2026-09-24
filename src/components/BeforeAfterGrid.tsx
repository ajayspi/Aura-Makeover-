'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BEFORE_AFTER_PAIRS, CELL_COUNT, GRID_CATEGORIES } from '@/data/before-after-pairs';

export default function BeforeAfterGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  const scrollToEstimator = () => {
    const estimator = document.getElementById('estimator');
    if (estimator) {
      estimator.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Total cells = 15 paired-image cells + 1 CTA cell = 16
  // Derived from catalog: BEFORE_AFTER_PAIRS.length + 1
  const totalCells = CELL_COUNT;

  return (
    <section
      id="before-after-grid"
      ref={gridRef}
      className="py-20 px-6 bg-[#FAF8F5]"
      aria-labelledby="ba-grid-title"
    >
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h2
            id="ba-grid-title"
            className="text-3xl md:text-4xl font-['Space_Grotesk'] font-bold text-[#1C130B] mb-4"
          >
            True Same-Space Transformations
          </h2>
          <p className="text-[#8A5836] font-['Plus_Jakarta_Sans'] max-w-2xl mx-auto">
            15 verified before→after pairs across 7 room categories — each pair
            captured from the exact same space, byte-distinct FFD8 JPEGs with
            geometry-matched fidelity. Keys for paired generation live in the
            gitignored <code>.secrets/image-keys.json</code> and are never
            committed to source.
          </p>
        </header>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--grid-gap)]"
          role="list"
          aria-label="Before/After paired image grid"
          style={{ '--grid-gap': '1.5rem' } as React.CSSProperties}
        >
          {/* grid gap: 1.5rem gap-based spacing between cells via the --grid-gap token */}
          {BEFORE_AFTER_PAIRS.map((pair, index) => (
            <article
              key={pair.id}
              className="group relative rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#E8E4DD] transition-shadow hover:shadow-xl"
              role="listitem"
              aria-label={`${pair.label} — before/after pair`}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={pair.before}
                  alt={`${pair.label} — builder finish (before)`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C130B]/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-xs font-['Plus_Jakarta_Sans'] font-medium text-[#FAF8F5]/90 uppercase tracking-wider">
                    {pair.category.toUpperCase()} · VARIANT {pair.variant}
                  </span>
                  <h3 className="text-lg font-['Space_Grotesk'] font-bold text-[#FAF8F5] mt-1 line-clamp-1">
                    {pair.label}
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-['Plus_Jakarta_Sans'] text-[#8A5836]">
                    BEFORE → AFTER
                  </span>
                  <span className="text-xs text-[#C5A880] font-mono">
                    FFD8 VERIFIED
                  </span>
                </div>
                <p className="text-sm text-[#1C130B]/70 font-['Plus_Jakarta_Sans']">
                  Same-space pairing: byte-distinct, geometry-matched.
                </p>
              </div>
            </article>
          ))}

          {/* Cell 16: Estimator CTA Card */}
          <article
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#C5A880] to-[#8A5836] flex flex-col items-center justify-center p-8 text-center min-h-[300px]"
            role="listitem"
            aria-label="Start your estimate — deep link to estimator"
          >
            <div className="relative z-10 max-w-xs">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C130B]/10 text-[#1C130B] text-sm font-['Space_Grotesk'] font-medium mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                <span>Cell 16 of 16</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-['Space_Grotesk'] font-bold text-[#1C130B] mb-3">
                Ready for Your Quote?
              </h3>
              <p className="text-[#1C130B]/80 font-['Plus_Jakarta_Sans'] mb-6">
                The estimator gateway calculates material, labor, and GST in
                seconds — powered by the same engines that drive our 48-hour
                guarantee.
              </p>
              <button
                type="button"
                onClick={scrollToEstimator}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-[#1C130B] text-[#FAF8F5] font-['Space_Grotesk'] font-medium hover:bg-[#1C130B]/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A880] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF8F5]"
              >
                Launch Estimator
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </button>
              <p className="mt-4 text-xs text-[#1C130B]/50 font-['Plus_Jakarta_Sans']">
                Scrolls to the <code>#estimator</code> section
              </p>
            </div>
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#1C130B]/5 via-transparent to-transparent pointer-events-none"
              aria-hidden="true"
            />
          </article>
        </div>

        <div className="mt-12 text-center text-sm text-[#1C130B]/60 font-['Plus_Jakarta_Sans']">
          <p>
            All 15 pairs are true same-space captures — the <strong>before</strong>
            and <strong>after</strong> images share identical camera position and
            room geometry. Paired generation uses the keyed Pollinations
            <code>/v1/images/edits</code> route; API keys read exclusively from
            <code>.secrets/image-keys.json</code> (gitignored).
          </p>
        </div>
      </div>
    </section>
  );
}