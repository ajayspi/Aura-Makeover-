"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { calculateRollNesting, calculateDynamicPricing } from '@/lib/engines';
import { CityConfig } from '@/lib/cities';
import { motion, AnimatePresence } from 'framer-motion';

import StepRoomSize from './estimator/StepRoomSize';
import StepFinishTier from './estimator/StepFinishTier';
import StepReviewBook from './estimator/StepReviewBook';
import StickyBOMDrawer from './estimator/StickyBOMDrawer';
import SwatchVanBookingModal from './SwatchVanBookingModal';
import { Truck, Home, Layers, CheckSquare, Sparkles, BadgePercent, ArrowRight } from 'lucide-react';

interface EstimatorGatewayProps {
  city?: CityConfig;
}

interface MultiRoomItem {
  id: string;
  name: string;
  width: number;
  height: number;
  recommendedFinish: 'base' | 'premium' | 'luxury';
  selected: boolean;
}

const DEFAULT_MULTI_ROOMS: MultiRoomItem[] = [
  { id: 'living', name: 'Living Room Focal Wall', width: 14, height: 10, recommendedFinish: 'premium', selected: true },
  { id: 'master', name: 'Master Bed Acoustic Accent', width: 14, height: 10, recommendedFinish: 'luxury', selected: true },
  { id: 'dining', name: 'Dining Room Louver Screen', width: 10, height: 10, recommendedFinish: 'premium', selected: true },
  { id: 'guest', name: 'Guest Bedroom Canvas', width: 12, height: 10, recommendedFinish: 'base', selected: false },
  { id: 'foyer', name: 'Grand Entrance Foyer', width: 8, height: 10, recommendedFinish: 'luxury', selected: false },
];

export default function EstimatorGateway({ city }: EstimatorGatewayProps) {
  // Mode: single-room wizard vs whole-home bundle
  const [mode, setMode] = useState<'single' | 'bundle'>('single');

  // Step State
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isVanModalOpen, setIsVanModalOpen] = useState(false);

  // Engine Inputs (Single Room)
  const [widthFt, setWidthFt] = useState(12);
  const [heightFt, setHeightFt] = useState(10);
  const [finishTier, setFinishTier] = useState<string>('base');

  // Multi-room bundle state
  const [bundleRooms, setBundleRooms] = useState<MultiRoomItem[]>(DEFAULT_MULTI_ROOMS);
  const [selectedBundleTier, setSelectedBundleTier] = useState<'premium' | 'luxury'>('premium');

  // Listen for Pre-fill and Society Selection events
  useEffect(() => {
    const handlePrefill = (e: CustomEvent) => {
      const { tier } = e.detail;
      if (tier) setFinishTier(tier);
      setStep(1); // Reset to step 1 to confirm dimensions
      // Smooth scroll to estimator
      document.getElementById('estimator')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSocietySelect = () => {
      setStep(1);
      document.getElementById('estimator')?.scrollIntoView({ behavior: 'smooth' });
    };

    window.addEventListener('auro:estimator-prefill' as any, handlePrefill);
    window.addEventListener('auro:select-society' as any, handleSocietySelect);
    
    return () => {
      window.removeEventListener('auro:estimator-prefill' as any, handlePrefill);
      window.removeEventListener('auro:select-society' as any, handleSocietySelect);
    };
  }, []);

  // Compute Engine Outputs (Single Room)
  const exactWallArea = widthFt * heightFt;
  
  const nesting = useMemo(() => calculateRollNesting({
    wallWidthFt: widthFt,
    wallHeightFt: heightFt,
    rollWidthInches: 21,
    patternRepeatInches: 18,
  }), [widthFt, heightFt]);

  // V2 uses 'smart' boolean for pricing engine, which adds a surcharge
  const isSmart = finishTier === 'luxury';

  const pricingDetails = useMemo(() => calculateDynamicPricing({
    rawMaterialBasePerSqFt: finishTier === 'base' ? 180 : finishTier === 'premium' ? 320 : 450,
    totalSqFtRequired: nesting.totalSqFtWithBuffer,
    isSmartMotorized: isSmart,
  }), [nesting.totalSqFtWithBuffer, finishTier, isSmart]);

  // Multi-Room Bundle Calculations
  const activeRooms = useMemo(() => bundleRooms.filter(r => r.selected), [bundleRooms]);
  
  const bundleAggregateSqft = useMemo(() => {
    return activeRooms.reduce((acc, r) => acc + (r.width * r.height), 0);
  }, [activeRooms]);

  const bundleNesting = useMemo(() => {
    // Equivalent roll nesting for composite wall width
    const totalWidth = activeRooms.reduce((acc, r) => acc + r.width, 0);
    const avgHeight = activeRooms.length > 0 
      ? Math.round(activeRooms.reduce((acc, r) => acc + r.height, 0) / activeRooms.length)
      : 10;
    return calculateRollNesting({
      wallWidthFt: totalWidth || 10,
      wallHeightFt: avgHeight || 10,
      rollWidthInches: 21,
      patternRepeatInches: 18,
    });
  }, [activeRooms]);

  const bundlePricing = useMemo(() => {
    const rawRate = selectedBundleTier === 'premium' ? 320 : 450;
    const basePricing = calculateDynamicPricing({
      rawMaterialBasePerSqFt: rawRate,
      totalSqFtRequired: bundleNesting.totalSqFtWithBuffer,
      isSmartMotorized: selectedBundleTier === 'luxury',
    });

    // 12% whole-home package discount
    const discountAmount = Math.round(basePricing.totalRetailPrice * 0.12);
    const discountedTotal = basePricing.totalRetailPrice - discountAmount;
    
    return {
      ...basePricing,
      originalTotal: basePricing.totalRetailPrice,
      discountAmount,
      discountedTotal,
      deposit10: Math.round(discountedTotal * 0.10),
      material60: Math.round(discountedTotal * 0.60),
      qa30: Math.round(discountedTotal * 0.30),
    };
  }, [bundleNesting.totalSqFtWithBuffer, selectedBundleTier]);

  const toggleRoom = (id: string) => {
    setBundleRooms(prev => prev.map(r => r.id === id ? { ...r, selected: !r.selected } : r));
  };

  const handleApplyPresetBundle = (type: '3BHK' | '4BHK') => {
    if (type === '3BHK') {
      setBundleRooms(prev => prev.map(r => ({
        ...r,
        selected: ['living', 'master', 'dining'].includes(r.id),
      })));
    } else {
      setBundleRooms(prev => prev.map(r => ({
        ...r,
        selected: ['living', 'master', 'dining', 'guest', 'foyer'].includes(r.id),
      })));
    }
  };

  // WhatsApp concierge handoff URL for bundle
  const bundleWhatsAppUrl = useMemo(() => {
    const targetPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918555069441';
    // Fallback: 919700675637
    const roomList = activeRooms.map(r => `${r.name} (${r.width}x${r.height}ft)`).join(', ');
    const text = encodeURIComponent(
      `Hi AuroMakeover! I'm interested in the Whole-Home Makeover Bundle in ${city?.name || 'Hyderabad'}.\n\n` +
      `🏠 Selected Rooms: ${roomList}\n` +
      `📐 Total Area: ${bundleAggregateSqft} sq.ft\n` +
      `💎 Tier: ${selectedBundleTier.toUpperCase()}\n` +
      `💰 Discounted Package Total: ₹${bundlePricing.discountedTotal.toLocaleString()} (Includes 12% Whole-Home Savings)\n\n` +
      `Please book my priority concierge slot for Swatch Van dispatch.`
    );
    return `https://wa.me/${targetPhone}?text=${text}`;
  }, [activeRooms, bundleAggregateSqft, selectedBundleTier, bundlePricing.discountedTotal, city?.name]);

  return (
    <section id="estimator" className="py-24 sm:py-32 px-6 bg-[#FAF8F5]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[#8A5836] text-xs font-semibold tracking-[0.2em] uppercase mb-4 font-['Plus_Jakarta_Sans']">
            Live Pricing Engine
          </p>
          <h2 className="font-['Syne'] text-4xl sm:text-5xl font-black text-[#1C130B] mb-6">
            Calculate Your Investment
          </h2>
          <p className="font-['Plus_Jakarta_Sans'] text-[#1C130B]/70 text-lg max-w-2xl mx-auto mb-8">
            {city?.name ? `Serving ${city.name} with exact precision.` : "Get an instant, precise quote based on our proprietary roll-nesting algorithm. Zero hidden fees."}
          </p>

          {/* Mode Switcher: Single Room vs Whole-Home Bundle */}
          <div className="inline-flex flex-col sm:flex-row w-full sm:w-auto p-1.5 bg-white border border-[#C5A880]/40 rounded-2xl shadow-sm gap-1 sm:gap-0">
            <button
              type="button"
              onClick={() => setMode('single')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-['Plus_Jakarta_Sans'] text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                mode === 'single'
                  ? 'bg-[#1C130B] text-[#C5A880] shadow-md'
                  : 'text-[#1C130B]/70 hover:text-[#1C130B]'
              }`}
            >
              <Home className="w-4 h-4 text-[#C5A880]" />
              Single Room / Accent Wall
            </button>
            <button
              type="button"
              onClick={() => setMode('bundle')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-['Plus_Jakarta_Sans'] text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer relative ${
                mode === 'bundle'
                  ? 'bg-[#1C130B] text-[#C5A880] shadow-md'
                  : 'text-[#1C130B]/70 hover:text-[#1C130B]'
              }`}
            >
              <Layers className="w-4 h-4 text-[#C5A880]" />
              Whole-Home 3BHK/4BHK Bundle
              <span className="hidden sm:inline-block bg-[#8A5836] text-[#FAF8F5] text-[10px] font-black px-2 py-0.5 rounded-full ml-1 animate-pulse">
                Save 12%
              </span>
            </button>
          </div>
        </div>

        {mode === 'single' ? (
          <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-[#C5A880]/20">
            
            {/* Progress Header */}
            <div className="bg-[#1C130B] p-6 sm:p-8 flex justify-between items-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[url('/images/botanical.jpg')] bg-cover bg-center mix-blend-overlay" />
              
              <div className="relative z-10 flex w-full justify-between items-center">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="flex flex-col items-center gap-2 relative z-10">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold font-['Syne'] transition-colors duration-500 ${
                      step >= num 
                        ? 'bg-[#C5A880] text-[#1C130B] shadow-[0_0_15px_rgba(197,168,128,0.5)]' 
                        : 'bg-[#FAF8F5]/10 text-[#FAF8F5]/50'
                    }`}>
                      {num}
                    </div>
                    <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider hidden sm:block transition-colors duration-500 font-['Plus_Jakarta_Sans'] ${
                      step >= num ? 'text-[#C5A880]' : 'text-[#FAF8F5]/50'
                    }`}>
                      {num === 1 ? 'Dimensions' : num === 2 ? 'Finishes' : 'Review'}
                    </span>
                  </div>
                ))}
                
                {/* Progress Line */}
                <div className="absolute top-4 sm:top-5 left-10 right-10 h-0.5 bg-[#FAF8F5]/10 -z-0">
                  <motion.div 
                    className="h-full bg-[#C5A880]"
                    initial={{ width: '0%' }}
                    animate={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-6 sm:p-10">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <StepRoomSize 
                    widthFt={widthFt}
                    setWidthFt={setWidthFt}
                    heightFt={heightFt}
                    setHeightFt={setHeightFt}
                    exactWallArea={exactWallArea}
                    nesting={nesting}
                    pricingSqft={nesting.totalSqFtWithBuffer}
                    onNext={() => setStep(2)}
                  />
                )}
                {step === 2 && (
                  <StepFinishTier 
                    finishTier={finishTier}
                    setFinishTier={setFinishTier}
                    onNext={() => setStep(3)}
                    onBack={() => setStep(1)}
                  />
                )}
                {step === 3 && (
                  <StepReviewBook 
                    pricingDetails={pricingDetails}
                    widthFt={widthFt}
                    heightFt={heightFt}
                    finishTier={finishTier}
                    onBack={() => setStep(2)}
                  />
                )}
              </AnimatePresence>

              {/* Live Bill of Materials (BOM) Sticky Drawer */}
              <StickyBOMDrawer 
                widthFt={widthFt}
                heightFt={heightFt}
                finishTier={finishTier}
                isSmartMotorized={isSmart}
                pricingDetails={pricingDetails}
                nesting={nesting}
                currentStep={step}
                onProceedToReview={() => setStep(3)}
              />

              {/* Mobile Swatch Van Gate Dispatch Prompt */}
              <div className="mt-8 pt-6 border-t border-[#C5A880]/20 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FAF8F5] p-5 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C5A880]/20 flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5 text-[#8A5836]" />
                  </div>
                  <div>
                    <h5 className="font-['Syne'] font-bold text-sm text-[#1C130B]">
                      Want Tactile Samples at Your Gated Society?
                    </h5>
                    <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#1C130B]/70">
                      Our mobile Mercedes-Benz Sprinter carries physical European textile & louver swatches to your gate.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsVanModalOpen(true)}
                  className="w-full sm:w-auto bg-[#1C130B] hover:bg-[#3E2C1E] text-[#C5A880] px-5 py-2.5 rounded-xl font-bold font-['Plus_Jakarta_Sans'] text-xs shrink-0 transition-colors shadow-md cursor-pointer"
                >
                  Book Swatch Van at Gate
                </button>
              </div>
            </div>

          </div>
        ) : (
          /* Whole-Home 3BHK/4BHK Bundle Configurator */
          <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-[#C5A880]/20">
            {/* Bundle Header */}
            <div className="bg-[#1C130B] p-6 sm:p-8 text-[#FAF8F5] relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-[#C5A880]" />
                    <span className="text-xs font-bold text-[#C5A880] uppercase tracking-widest font-['Plus_Jakarta_Sans']">
                      Whole-Home Complete Makeover
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-['Syne']">
                    Multi-Room Turnkey Suite
                  </h3>
                  <p className="text-xs sm:text-sm text-[#FAF8F5]/70 font-['Plus_Jakarta_Sans'] mt-1">
                    Select your rooms. Enjoy simultaneous 48-hour execution + automatic 12% bundle discount.
                  </p>
                </div>

                {/* Quick Bundle Selector Pills */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleApplyPresetBundle('3BHK')}
                    className="bg-[#C5A880]/20 hover:bg-[#C5A880]/30 text-[#C5A880] px-4 py-2 rounded-xl text-xs font-bold font-['Plus_Jakarta_Sans'] transition-colors border border-[#C5A880]/30 cursor-pointer"
                  >
                    Preset 3BHK
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetBundle('4BHK')}
                    className="bg-[#8A5836]/30 hover:bg-[#8A5836]/40 text-[#FAF8F5] px-4 py-2 rounded-xl text-xs font-bold font-['Plus_Jakarta_Sans'] transition-colors border border-[#8A5836]/50 cursor-pointer"
                  >
                    Preset 4BHK
                  </button>
                </div>
              </div>
            </div>

            {/* Bundle Body */}
            <div className="p-6 sm:p-10 space-y-8">
              {/* Room Checkbox Grid */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#8A5836] block mb-4 font-['Plus_Jakarta_Sans']">
                  Configure Included Spaces ({activeRooms.length} of {bundleRooms.length} Selected)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bundleRooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => toggleRoom(room.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        room.selected
                          ? 'bg-[#FAF8F5] border-[#8A5836] shadow-md ring-1 ring-[#8A5836]'
                          : 'bg-white border-gray-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <CheckSquare className={`w-5 h-5 ${room.selected ? 'text-[#8A5836]' : 'text-gray-300'}`} />
                          <h4 className="font-bold text-sm text-[#1C130B] font-['Syne']">{room.name}</h4>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-[#1C130B]/70 font-['Plus_Jakarta_Sans']">
                        <span>Dimensions: {room.width}ft × {room.height}ft</span>
                        <span className="font-bold text-[#8A5836]">{room.width * room.height} sqft</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Finish Specification Selection */}
              <div className="pt-4 border-t border-[#C5A880]/20">
                <label className="text-xs font-bold uppercase tracking-wider text-[#8A5836] block mb-4 font-['Plus_Jakarta_Sans']">
                  Whole-Home Finish Specification
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedBundleTier('premium')}
                    className={`p-5 rounded-2xl text-left border transition-all cursor-pointer ${
                      selectedBundleTier === 'premium'
                        ? 'bg-[#1C130B] text-[#FAF8F5] border-[#1C130B] shadow-lg'
                        : 'bg-white border-[#C5A880]/30 text-[#1C130B] hover:border-[#C5A880]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#C5A880]">Premium Artisan</span>
                      <span className="font-mono text-xs font-bold">₹320 / sq.ft</span>
                    </div>
                    <p className="text-sm font-bold font-['Syne'] mb-1">Textured Linen + Solid Oak Louvers</p>
                    <p className="text-xs opacity-75 font-['Plus_Jakarta_Sans']">Zero VOC, German adhesive, precision 48-hr execution.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedBundleTier('luxury')}
                    className={`p-5 rounded-2xl text-left border transition-all cursor-pointer ${
                      selectedBundleTier === 'luxury'
                        ? 'bg-[#1C130B] text-[#FAF8F5] border-[#1C130B] shadow-lg'
                        : 'bg-white border-[#C5A880]/30 text-[#1C130B] hover:border-[#C5A880]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#C5A880]">Imperial Luxury</span>
                      <span className="font-mono text-xs font-bold">₹450 / sq.ft</span>
                    </div>
                    <p className="text-sm font-bold font-['Syne'] mb-1">Silk Jacquard + Smart Motorized Shading</p>
                    <p className="text-xs opacity-75 font-['Plus_Jakarta_Sans']">Includes motorized blinds integration and acoustic backing.</p>
                  </button>
                </div>
              </div>

              {/* Pricing & Escrow Breakdown */}
              <div className="bg-[#FAF8F5] border-2 border-[#C5A880]/40 p-6 sm:p-8 rounded-2xl sm:rounded-3xl space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#C5A880]/20 pb-6">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8A5836] uppercase tracking-wider mb-1">
                      <BadgePercent className="w-4 h-4 text-green-600" />
                      12% Whole-Home Bundle Savings Applied
                    </span>
                    <h4 className="text-2xl sm:text-3xl font-black font-['Syne'] text-[#1C130B]">
                      ₹{bundlePricing.discountedTotal.toLocaleString()}
                    </h4>
                    <p className="text-xs text-[#1C130B]/60 font-['Plus_Jakarta_Sans']">
                      Original: <span className="line-through">₹{bundlePricing.originalTotal.toLocaleString()}</span> · You save ₹{bundlePricing.discountAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right sm:border-l sm:border-[#C5A880]/30 sm:pl-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#1C130B]/60">Total Billable Area</p>
                    <p className="text-xl font-bold font-['Syne'] text-[#8A5836] mt-0.5">{bundleAggregateSqft} sq.ft</p>
                    <p className="text-[11px] text-[#1C130B]/60 font-['Plus_Jakarta_Sans']">{bundleNesting.totalVerticalDrops} vertical drops needed</p>
                  </div>
                </div>

                {/* 3 Escrow Tranches */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-white border border-[#C5A880]/30">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A5836]">10% Booking Deposit</p>
                    <p className="text-lg font-bold font-['Syne'] text-[#1C130B] mt-1">₹{bundlePricing.deposit10.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Locks 48-hr crew & laser survey</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-[#C5A880]/30">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A5836]">60% Custom Milling</p>
                    <p className="text-lg font-bold font-['Syne'] text-[#1C130B] mt-1">₹{bundlePricing.material60.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Held in escrow until gate arrival</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-[#C5A880]/30">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A5836]">30% Post-QA Signoff</p>
                    <p className="text-lg font-bold font-['Syne'] text-[#1C130B] mt-1">₹{bundlePricing.qa30.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Released only after zero-bubble QA</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setMode('single')}
                    className="w-full sm:w-auto text-xs font-bold text-[#8A5836] hover:underline font-['Plus_Jakarta_Sans'] cursor-pointer"
                  >
                    ← Back to Single Room Estimator
                  </button>
                  <a
                    href={bundleWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-[#15803D] hover:bg-green-700 text-[#FAF8F5] px-8 py-4 rounded-xl font-bold font-['Plus_Jakarta_Sans'] text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-lg cursor-pointer"
                  >
                    Book Whole-Home Consultation on WhatsApp
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Swatch Van Booking Modal */}
      <SwatchVanBookingModal
        isOpen={isVanModalOpen}
        onClose={() => setIsVanModalOpen(false)}
        initialSociety="My Home Bhooja"
        finishTier={finishTier}
        wallDimensions={`${widthFt}ft x ${heightFt}ft`}
      />
    </section>
  );
}
