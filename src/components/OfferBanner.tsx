"use client";

import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';

const DISMISS_KEY = 'auro:offer-banner-dismissed';

export default function OfferBanner() {
  const [dismissed, setDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      return false;
    }
  });

  const dismiss = () => {
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* ignore */
    }
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="relative z-50 bg-[#1C130B] border-b border-[#C5A880]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-center gap-3 sm:gap-4">
        <p className="font-['Plus_Jakarta_Sans'] text-[#FAF8F5]/90 text-xs sm:text-sm font-medium truncate">
          <span className="text-[#C5A880] font-bold">48-hour slots open</span>
          <span className="hidden sm:inline"> — free swatch van visit this week, zero civil work</span>
        </p>
        <a
          href="#estimator"
          className="shrink-0 bg-[#C5A880] hover:bg-[#b8996f] text-[#1C130B] text-xs sm:text-sm font-bold px-4 py-2 rounded-2xl flex items-center gap-1.5 transition-all active:scale-[0.98]"
        >
          Get Instant Quote
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
        <button
          onClick={dismiss}
          aria-label="Dismiss offer banner"
          className="shrink-0 text-[#FAF8F5]/50 hover:text-[#FAF8F5] p-2 -m-1 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
