"use client";

import React, { useState, useEffect } from 'react';
import { calculateRollNesting, calculateDynamicPricing, PricingOutput } from '@/lib/engines';
import { Ruler, Palette, Loader2, Sparkles, Truck } from 'lucide-react';

const QUALITIES = [
  { id: 'standard', name: 'Standard Canvas', rate: 120, smart: false },
  { id: 'belgian', name: 'Belgian Luxury', rate: 250, smart: false },
  { id: 'motorized', name: 'Smart Motorized', rate: 300, smart: true },
];

const SOCIETIES = [
  "My Home Bhooja",
  "Aparna Sarovar Zenith",
  "Rajapushpa Provincia",
  "Prestige High Fields",
  "Other (West Corridor)"
];

interface PricingState extends PricingOutput {
  sqft: number;
}

export default function EstimatorGateway() {
  const [widthFt, setWidthFt] = useState(10);
  const [heightFt, setHeightFt] = useState(10);
  const [quality, setQuality] = useState(QUALITIES[0]);
  const [society, setSociety] = useState(SOCIETIES[0]);
  const [pricing, setPricing] = useState<PricingState | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    let active = true;

    // Instead of setting synchronously in the effect, trigger calculation via timeout.
    const startTimer = setTimeout(() => {
      if (active) setIsCalculating(true);
    }, 0);

    const calcTimer = setTimeout(() => {
      if (!active) return;

      const nesting = calculateRollNesting({
        wallWidthFt: widthFt,
        wallHeightFt: heightFt,
        rollWidthInches: 42,
        patternRepeatInches: 24
      });

      const price = calculateDynamicPricing({
        rawMaterialBasePerSqFt: quality.rate,
        totalSqFtRequired: nesting.totalSqFtWithBuffer,
        isSmartMotorized: quality.smart
      });

      setPricing({ ...price, sqft: nesting.totalSqFtWithBuffer });
      setIsCalculating(false);
    }, 300);

    return () => {
      active = false;
      clearTimeout(startTimer);
      clearTimeout(calcTimer);
    };
  }, [widthFt, heightFt, quality]);

  const handleWhatsAppBooking = () => {
    const text = `Hi AuroMakeover! 👋\n\nI'm from *${society}* and I'd like to book a Free Swatch Van Visit.\n\n*Rough Estimate Details:*\n- Wall Size: ${widthFt}ft x ${heightFt}ft\n- Preferred Quality: ${quality.name}\n- Est. Amount: ₹${Math.round(pricing?.totalRetailPrice || 0).toLocaleString()}\n\nPlease confirm slot availability!`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/919999999999?text=${encoded}`, '_blank');
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#FAF8F5] min-h-screen text-[#1C130B] font-['Plus_Jakarta_Sans'] pb-20">

      {/* Header */}
      <div className="bg-[#1C130B] text-[#FAF8F5] p-6 pt-12 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <Sparkles size={120} />
        </div>
        <h1 className="text-3xl font-bold font-['Syne'] tracking-tight mb-2 relative z-10">
          Auro<span className="text-[#C5A880]">Makeover</span>
        </h1>
        <p className="text-sm opacity-90 relative z-10 font-medium tracking-wide">
          48-Hour Micro-Makeovers for High-Rises.
        </p>
      </div>

      <div className="p-6 space-y-8 mt-4">

        {/* Dimension Sliders */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#C5A880]/20 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Ruler className="text-[#8A5836] w-5 h-5" />
            <h2 className="text-lg font-bold font-['Syne']">Wall Dimensions</h2>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Width</label>
                <span className="font-bold text-[#8A5836]">{widthFt} ft</span>
              </div>
              <input
                type="range" min="5" max="30" value={widthFt}
                onChange={(e) => setWidthFt(Number(e.target.value))}
                className="w-full accent-[#8A5836]"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Height</label>
                <span className="font-bold text-[#8A5836]">{heightFt} ft</span>
              </div>
              <input
                type="range" min="8" max="15" value={heightFt}
                onChange={(e) => setHeightFt(Number(e.target.value))}
                className="w-full accent-[#8A5836]"
              />
            </div>
          </div>
        </div>

        {/* Quality Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2 px-1">
            <Palette className="text-[#8A5836] w-5 h-5" />
            <h2 className="text-lg font-bold font-['Syne']">Finish Tier</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 snap-x hide-scrollbar">
            {QUALITIES.map((q) => (
              <button
                key={q.id}
                onClick={() => setQuality(q)}
                className={`flex-none w-[140px] p-4 rounded-2xl border-2 text-left transition-all snap-start ${
                  quality.id === q.id
                    ? 'border-[#8A5836] bg-[#8A5836]/5'
                    : 'border-gray-200 bg-white hover:border-[#8A5836]/30'
                }`}
              >
                <div className="font-bold text-sm mb-1">{q.name}</div>
                <div className="text-xs text-gray-500 font-medium">₹{q.rate}/sqft</div>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Estimate Card */}
        <div className="bg-[#1C130B] text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
           <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#C5A880]/20 rounded-full blur-2xl"></div>

           <div className="relative z-10">
              <p className="text-sm text-[#C5A880] font-semibold uppercase tracking-wider mb-1">Estimated Quote</p>

              <div className="flex items-end gap-2 mb-4">
                {isCalculating ? (
                  <Loader2 className="w-8 h-8 animate-spin text-[#C5A880]" />
                ) : (
                  <span className="text-4xl font-black font-['Syne'] tracking-tight">
                    ₹{Math.round(pricing?.totalRetailPrice || 0).toLocaleString()}
                  </span>
                )}
                <span className="text-xs text-gray-400 mb-2 font-medium">incl. GST</span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-gray-400">Total Area required:</span>
                  <span className="font-medium">{Math.round(pricing?.sqft || 0)} sqft</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-gray-400">Tranche 1 (10% Deposit):</span>
                  <span className="font-bold text-[#C5A880]">
                    ₹{Math.round(pricing?.escrowTranches.deposit10 || 0).toLocaleString()}
                  </span>
                </div>
              </div>
           </div>
        </div>

        {/* Dispatch Action */}
        <div className="pt-2">
          <div className="mb-4">
             <label className="text-sm font-semibold text-gray-600 mb-2 block px-1">Your Society (Hyderabad West)</label>
             <select
                value={society}
                onChange={(e) => setSociety(e.target.value)}
                className="w-full p-4 rounded-2xl bg-white border border-gray-200 outline-none focus:border-[#8A5836] font-medium"
             >
                {SOCIETIES.map(s => <option key={s} value={s}>{s}</option>)}
             </select>
          </div>

          <button
            onClick={handleWhatsAppBooking}
            className="w-full bg-[#15803D] hover:bg-[#166534] text-white p-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-lg shadow-[#15803D]/20"
          >
            <Truck className="w-5 h-5" />
            Book Swatch Van via WhatsApp
          </button>
          <p className="text-center text-xs text-gray-500 mt-4 font-medium">
            No commitment. We bring physical catalogs & laser rigs to you.
          </p>
        </div>

      </div>
    </div>
  );
}
