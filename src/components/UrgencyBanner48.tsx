"use client";

import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface Countdown {
  h: string;
  m: string;
  s: string;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

/** Milliseconds remaining until the next local midnight (booking-window close). */
function timeToMidnight(): Countdown {
  const end = new Date();
  end.setHours(24, 0, 0, 0);
  const diff = Math.max(0, end.getTime() - Date.now());
  return {
    h: pad(Math.floor(diff / 3_600_000)),
    m: pad(Math.floor(diff / 60_000) % 60),
    s: pad(Math.floor(diff / 1000) % 60),
  };
}

/**
 * Tonight's swatch-van slots close at midnight — a live countdown with a
 * gold shimmer rule above the CTA. The ticking digits are plain text; only
 * the shimmer bar animates, and CSS disables it under prefers-reduced-motion.
 */
export default function UrgencyBanner48() {
  const [left, setLeft] = useState<Countdown | null>(null);

  useEffect(() => {
    const id = setInterval(() => setLeft(timeToMidnight()), 1000);
    return () => clearInterval(id);
  }, []);

  const cells: Array<{ k: keyof Countdown; label: string }> = [
    { k: 'h', label: 'Hrs' },
    { k: 'm', label: 'Min' },
    { k: 's', label: 'Sec' },
  ];

  return (
    <section
      aria-label="Tonight's install slots close at midnight — reserve now"
      className="relative bg-[#1C130B] border-y border-[#C5A880]/30 overflow-hidden"
    >
      <div aria-hidden="true" className="shimmer-bar h-1 w-full" />
      <div className="max-w-6xl mx-auto px-6 py-12 sm:py-14 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        <div className="flex-1">
          <p className="text-[#C5A880] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            48-Hour Window
          </p>
          <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#FAF8F5] tracking-[-0.02em] leading-tight mb-2">
            Book by midnight, <span className="text-foil">install tomorrow.</span>
          </h2>
          <p className="font-['Plus_Jakarta_Sans'] text-[#FAF8F5]/65 text-sm leading-relaxed max-w-xl">
            Tonight&rsquo;s swatch-van slots close at midnight. Reserve yours and your 48-hour
            makeover window starts tomorrow morning — measured, cut and installed on schedule.
          </p>
        </div>

        <div className="flex items-baseline gap-2 sm:gap-3" aria-label={`Booking window closes in ${left?.h ?? '--'} hours ${left?.m ?? '--'} minutes ${left?.s ?? '--'} seconds`}>
          {cells.map(({ k, label }, i) => (
            <React.Fragment key={k}>
              {i > 0 && (
                <span aria-hidden="true" className="font-['Space_Grotesk'] text-[#C5A880] text-2xl font-bold">
                  :
                </span>
              )}
              <div className="w-16 sm:w-20 rounded-2xl bg-[#3E2C1E] border border-[#C5A880]/40 px-2 py-3 text-center">
                <p className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-black text-foil tabular-nums">
                  {left ? left[k] : '--'}
                </p>
                <p className="font-['Plus_Jakarta_Sans'] text-[#C9CDD4] text-[10px] font-semibold tracking-widest uppercase mt-1">
                  {label}
                </p>
              </div>
            </React.Fragment>
          ))}
        </div>

        <a
          href="#estimator"
          className="group inline-flex items-center gap-3 bg-[#C5A880] hover:bg-[#FAF8F5] text-[#1C130B] font-bold text-sm px-7 py-4 rounded-2xl transition-all shadow-lg shrink-0"
        >
          Reserve my 48-hour slot
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </section>
  );
}