"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { animate, motion, AnimatePresence } from 'framer-motion';
import {
  calculateRollNesting,
  calculateDynamicPricing,
  PricingOutput,
  RollNestingOutput,
} from '@/lib/engines';
import {
  Ruler,
  Palette,
  Sparkles,
  Truck,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Check,
  Clock,
  CheckCircle2,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { CityConfig } from '@/lib/cities';
import { isValidLeadName, isValidLeadPhone, normalizeLeadPhone } from '@/lib/lead-details';

interface EstimatorGatewayProps {
  city?: CityConfig;
}

export const QUALITIES = [
  {
    id: 'standard',
    name: 'Standard Canvas',
    rate: 120,
    smart: false,
    tagline: 'High-tensile non-woven canvas with anti-fade German pigments.',
  },
  {
    id: 'belgian',
    name: 'Belgian Luxury',
    rate: 250,
    smart: false,
    tagline: 'Rich textured Belgian linen with anti-glare museum matte finish.',
  },
  {
    id: 'motorized',
    name: 'Smart Motorized',
    rate: 300,
    smart: true,
    tagline: 'Acoustic louver textile + automated motorized track (+₹15,000 add-on).',
  },
];

export const SOCIETIES = [
  'My Home Bhooja',
  'Aparna Sarovar Zenith',
  'Rajapushpa Provincia',
  'Prestige High Fields',
  'Other (West Corridor)',
];

interface PricingState extends PricingOutput {
  sqft: number;
  nesting: RollNestingOutput;
}

// Framer Motion Animated Price Counter
function AnimatedPrice({
  value,
  className = '',
}: {
  value: number;
  className?: string;
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const from = prevValueRef.current;
    const to = value;
    if (from === to) return;

    const controls = animate(from, to, {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1], // easeOutExpo
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
      onComplete: () => {
        prevValueRef.current = to;
      },
    });

    return () => controls.stop();
  }, [value]);

  return (
    <span className={className}>
      ₹{displayValue.toLocaleString('en-IN')}
    </span>
  );
}

const ROOM_PRESETS = [
  { label: 'Accent Wall', width: 10, height: 10 },
  { label: 'Master Bedroom', width: 14, height: 10 },
  { label: 'Living Lounge', width: 18, height: 10 },
  { label: 'Grand Foyer', width: 12, height: 12 },
];

type PrefillData = {
  roomType?: string;
  finishTier?: string;
  categories?: string[];
  features?: string[];
  designId?: number;
  designTitle?: string;
};

function getPrefillFromStorage(): PrefillData | null {
  if (typeof window === 'undefined') return null;
  try {
    // 1. URL param (from quiz redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const urlPrefill = urlParams.get('prefill');
    if (urlPrefill) {
      const parsed = JSON.parse(decodeURIComponent(urlPrefill));
      sessionStorage.setItem('estimator_prefill', JSON.stringify(parsed));
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname + window.location.hash);
      return parsed;
    }
    // 2. sessionStorage (from quiz or society click)
    const stored = sessionStorage.getItem('estimator_prefill');
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return null;
}

export default function EstimatorGateway({ city }: EstimatorGatewayProps) {
  // Initialize state from prefill to avoid setState in effect
  const initialPrefill = typeof window !== 'undefined' ? getPrefillFromStorage() : null;
  
  const roomPresets: Record<string, { width: number; height: number }> = {
    'living': { width: 18, height: 10 },
    'bedroom': { width: 14, height: 10 },
    'dining': { width: 12, height: 10 },
    'office': { width: 12, height: 10 },
    'pooja': { width: 10, height: 10 },
    'full-home': { width: 24, height: 12 },
  };
  
  const tierMap: Record<string, string> = {
    'essential': 'standard',
    'premium': 'belgian',
    'luxury': 'motorized',
  };
  
  const initialWidth = initialPrefill?.roomType && roomPresets[initialPrefill.roomType] 
    ? roomPresets[initialPrefill.roomType].width : 10;
  const initialHeight = initialPrefill?.roomType && roomPresets[initialPrefill.roomType] 
    ? roomPresets[initialPrefill.roomType].height : 10;
  const initialQuality = initialPrefill?.finishTier && tierMap[initialPrefill.finishTier]
    ? QUALITIES.find(q => q.id === tierMap[initialPrefill.finishTier!]) || QUALITIES[0]
    : QUALITIES[0];

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [widthFt, setWidthFt] = useState(initialWidth);
  const [heightFt, setHeightFt] = useState(initialHeight);
  const [quality, setQuality] = useState(initialQuality);
  const [society, setSociety] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [assignedAgentNumber, setAssignedAgentNumber] = useState<string | null>(null);

  // R11: contact details must be valid before the WhatsApp handoff unlocks
  const detailsValid = isValidLeadName(customerName) && isValidLeadPhone(phone);

  // City-specific data
  const citySocieties = city?.societies?.map(s => s.name) || SOCIETIES;
  const whatsappNumber = city?.whatsappNumber || '919700675637';
  const cityRegion = city?.region || 'West Corridor';
  const cityName = city?.name || 'Hyderabad';

  // Listen for custom event from Society Cards or other sections
  useEffect(() => {
    const handleSelectSociety = (e: Event) => {
      const customEvent = e as CustomEvent<{ society?: string }>;
      if (customEvent.detail?.society) {
        setSociety(customEvent.detail.society);
      }
    };

    window.addEventListener('auro:select-society', handleSelectSociety);
    return () => {
      window.removeEventListener('auro:select-society', handleSelectSociety);
    };
  }, []);

  // Compute nesting & dynamic pricing synchronously using pure engines.ts logic
  const { nesting, pricing } = useMemo(() => {
    const nestingResult = calculateRollNesting({
      wallWidthFt: widthFt,
      wallHeightFt: heightFt,
      rollWidthInches: 42,
      patternRepeatInches: 24,
    });

    const priceResult = calculateDynamicPricing({
      rawMaterialBasePerSqFt: quality.rate,
      totalSqFtRequired: nestingResult.totalSqFtWithBuffer,
      isSmartMotorized: quality.smart,
    });

    const pricingState: PricingState = {
      ...priceResult,
      sqft: nestingResult.totalSqFtWithBuffer,
      nesting: nestingResult,
    };

    return { nesting: nestingResult, pricing: pricingState };
  }, [widthFt, heightFt, quality]);

  const exactWallArea = widthFt * heightFt;

  const buildWhatsAppUrl = (numberOverride?: string) => {
    const targetNumber = numberOverride || assignedAgentNumber || whatsappNumber;
    const priceFormatted = Math.round(pricing.totalRetailPrice).toLocaleString('en-IN');
    const depositFormatted = Math.round(pricing.escrowTranches.deposit10).toLocaleString('en-IN');
    const billedSqFt = Math.round(pricing.sqft);

    const messageLines = [
      'Hi AuroMakeover! 👋',
      '',
      `I would like to book a Free Swatch Van Visit to *${society || cityName}*.`,
      '',
      '*Configured Estimate Summary:*',
      `• Target Location: ${society || cityName}`,
      `• Customer Name: ${customerName}`,
      `• Contact Number: +91 ${normalizeLeadPhone(phone) ?? ''}`,
      `• Wall Dimensions: ${widthFt}ft (W) × ${heightFt}ft (H)`,
      `• Net Wall Area: ${exactWallArea} sqft`,
      `• Billed Material Area (incl. 11% safety buffer & pattern repeat): ${billedSqFt} sqft`,
      `• Vertical Wall Drops: ${nesting.totalVerticalDrops} drops (${nesting.requiredContinuousMeters.toFixed(1)}m continuous fabric)`,
      `• Selected Finish Tier: ${quality.name} (@ ₹${quality.rate}/sqft)${quality.smart ? ' + Smart Motorized Automation (₹15,000)' : ''}`,
      `• Total Estimated Price: ₹${priceFormatted} (incl. 18% GST)`,
      `• 10% Escrow Booking Deposit: ₹${depositFormatted}`,
      '',
      'Please confirm the earliest slot for your mobile swatch van!',
    ];

    return `https://wa.me/${targetNumber}?text=${encodeURIComponent(messageLines.join('\n'))}`;
  };

  const handleWhatsAppBooking = async () => {
    // R11: never hand off to WhatsApp without captured contact details
    if (!detailsValid) return;
    let assigned: string | null = null;
    try {
      const res = await fetch('/api/leads/estimator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          society: society || undefined,
          citySlug: city?.slug ?? null,
          widthFt,
          heightFt,
          quality: quality.id,
          total: Math.round(pricing.totalRetailPrice),
          customerName: customerName.trim(),
          phone: normalizeLeadPhone(phone) ?? '',
        }),
      });
      const data = await res.json();
      if (data?.assignedWhatsapp) {
        assigned = data.assignedWhatsapp as string;
        setAssignedAgentNumber(assigned);
      }
    } catch {
      /* fall through to default number */
    }
    window.open(buildWhatsAppUrl(assigned || undefined), '_blank');
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      {/* Main Glassmorphic/Luxury Container */}
      <div className="bg-[#FAF8F5] border border-[#C5A880]/30 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Wizard Header & Step Progress Bar */}
        <div className="bg-[#1C130B] text-[#FAF8F5] p-6 sm:p-8 rounded-b-3xl relative overflow-hidden border-b border-[#C5A880]/20">
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none translate-x-1/4 -translate-y-1/4">
            <Sparkles size={220} className="text-[#C5A880]" />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-[#C5A880] text-xs font-bold uppercase tracking-widest block mb-1">
                  Step {currentStep} of 3 • 48-Hour Price Architect
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-['Syne'] tracking-tight">
                  Instant Custom Estimator
                </h3>
              </div>

              {/* Running Price Preview Pill */}
              <div className="bg-[#FAF8F5]/10 border border-[#C5A880]/30 px-4 py-2.5 rounded-2xl flex items-center gap-3 backdrop-blur-md self-start sm:self-auto">
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-[#C5A880] tracking-wider">
                    Live Total (GST Incl.)
                  </div>
                  <div className="text-lg sm:text-xl font-bold font-['Syne'] text-[#FAF8F5]">
                    <AnimatedPrice value={pricing.totalRetailPrice} />
                  </div>
                </div>
              </div>
            </div>

            {/* Step Progress Indicators */}
            <nav aria-label="Estimator Progress" className="grid grid-cols-3 gap-2 sm:gap-4 pt-2">
              {[
                { step: 1, title: 'Room Size', subtitle: 'Wall Dimensions' },
                { step: 2, title: 'Finish Tier', subtitle: 'Fabric & Motor' },
                { step: 3, title: 'Review & Book', subtitle: 'Van Booking' },
              ].map((item) => {
                const isCurrent = currentStep === item.step;
                const isCompleted = currentStep > item.step;

                return (
                  <button
                    key={item.step}
                    onClick={() => {
                      if (isCompleted || item.step < currentStep) {
                        setCurrentStep(item.step as 1 | 2 | 3);
                      }
                    }}
                    disabled={!isCompleted && !isCurrent}
                    className={`text-left p-3 sm:p-4 rounded-2xl transition-all border relative flex flex-col justify-between ${
                      isCurrent
                        ? 'bg-[#C5A880]/15 border-[#C5A880] shadow-md'
                        : isCompleted
                        ? 'bg-[#FAF8F5]/5 border-[#C5A880]/40 hover:bg-[#FAF8F5]/10 cursor-pointer'
                        : 'bg-[#FAF8F5]/5 border-transparent opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isCompleted
                            ? 'bg-[#C5A880] text-[#1C130B]'
                            : isCurrent
                            ? 'bg-[#FAF8F5] text-[#1C130B]'
                            : 'bg-[#FAF8F5]/20 text-[#FAF8F5]'
                        }`}
                      >
                        {isCompleted ? <Check className="w-3.5 h-3.5" /> : item.step}
                      </span>
                      {isCurrent && (
                        <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-[#C5A880] animate-ping" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold font-['Syne'] text-[#FAF8F5]">
                        {item.title}
                      </div>
                      <div className="hidden sm:block text-[11px] text-[#FAF8F5]/70">
                        {item.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Wizard Step Body */}
        <div className="p-6 sm:p-8 md:p-10">
          <AnimatePresence mode="wait">
            {/* ================= STEP 1: ROOM SIZE ================= */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Ruler className="text-[#8A5836] w-5 h-5" />
                    <h4 className="text-xl font-bold font-['Syne'] text-[#1C130B]">
                      Step 1: Set Your Wall Dimensions
                    </h4>
                  </div>
                  <p className="text-sm text-[#1C130B]/70 font-medium">
                    Adjust the sliders below to your wall measurement. Our nesting algorithm automatically calculates vertical drops and adds an 11% safety buffer for seamless pattern matching.
                  </p>
                </div>

                {/* Quick Presets */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#8A5836] block mb-2.5">
                    Quick High-Rise Presets
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {ROOM_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setWidthFt(preset.width);
                          setHeightFt(preset.height);
                        }}
                        className={`p-3 rounded-2xl text-left border transition-all text-xs font-medium ${
                          widthFt === preset.width && heightFt === preset.height
                            ? 'bg-[#8A5836] text-[#FAF8F5] border-[#8A5836] shadow-sm'
                            : 'bg-[#FAF8F5] border-[#C5A880]/40 text-[#1C130B] hover:border-[#8A5836]'
                        }`}
                      >
                        <div className="font-bold">{preset.label}</div>
                        <div className="opacity-80 mt-0.5">
                          {preset.width}ft × {preset.height}ft
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sliders Container */}
                <div className="bg-[#FAF8F5] border border-[#C5A880]/30 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
                  {/* Width Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-[#1C130B] uppercase tracking-wider flex items-center gap-2">
                        Wall Width
                        <span className="text-xs font-normal text-[#1C130B]/60">(Horizontal)</span>
                      </label>
                      <span className="text-lg font-black font-['Syne'] text-[#8A5836] bg-[#8A5836]/10 px-3 py-1 rounded-2xl">
                        {widthFt} ft
                      </span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={30}
                      value={widthFt}
                      onChange={(e) => setWidthFt(Number(e.target.value))}
                      className="w-full h-2.5 bg-[#C5A880]/30 rounded-full appearance-none cursor-pointer accent-[#8A5836]"
                    />
                    <div className="flex justify-between text-[11px] text-[#1C130B]/60 font-semibold px-0.5">
                      <span>5 ft (Compact Foyer)</span>
                      <span>15 ft (Standard)</span>
                      <span>30 ft (Great Hall)</span>
                    </div>
                  </div>

                  {/* Height Slider */}
                  <div className="space-y-2 pt-2 border-t border-[#C5A880]/20">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-[#1C130B] uppercase tracking-wider flex items-center gap-2">
                        Wall Height
                        <span className="text-xs font-normal text-[#1C130B]/60">(Vertical Slab)</span>
                      </label>
                      <span className="text-lg font-black font-['Syne'] text-[#8A5836] bg-[#8A5836]/10 px-3 py-1 rounded-2xl">
                        {heightFt} ft
                      </span>
                    </div>
                    <input
                      type="range"
                      min={8}
                      max={15}
                      value={heightFt}
                      onChange={(e) => setHeightFt(Number(e.target.value))}
                      className="w-full h-2.5 bg-[#C5A880]/30 rounded-full appearance-none cursor-pointer accent-[#8A5836]"
                    />
                    <div className="flex justify-between text-[11px] text-[#1C130B]/60 font-semibold px-0.5">
                      <span>8 ft (Standard Flat)</span>
                      <span>10 ft (Luxury High-Rise)</span>
                      <span>15 ft (Penthouse Duplex)</span>
                    </div>
                  </div>
                </div>

                {/* Live Output Feedback Pill Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-[#FAF8F5] border border-[#C5A880]/30 p-4 rounded-2xl">
                    <div className="text-[11px] font-bold text-[#8A5836] uppercase tracking-wider">
                      Net Wall Area
                    </div>
                    <div className="text-xl font-bold font-['Syne'] text-[#1C130B] mt-1">
                      {exactWallArea} <span className="text-xs font-normal">sqft</span>
                    </div>
                  </div>

                  <div className="bg-[#FAF8F5] border border-[#C5A880]/30 p-4 rounded-2xl">
                    <div className="text-[11px] font-bold text-[#8A5836] uppercase tracking-wider">
                      Vertical Drops
                    </div>
                    <div className="text-xl font-bold font-['Syne'] text-[#1C130B] mt-1">
                      {nesting.totalVerticalDrops} <span className="text-xs font-normal">strips (42&quot;)</span>
                    </div>
                  </div>

                  <div className="bg-[#FAF8F5] border border-[#C5A880]/30 p-4 rounded-2xl">
                    <div className="text-[11px] font-bold text-[#8A5836] uppercase tracking-wider">
                      Fabric Length
                    </div>
                    <div className="text-xl font-bold font-['Syne'] text-[#1C130B] mt-1">
                      {nesting.requiredContinuousMeters.toFixed(1)} <span className="text-xs font-normal">m</span>
                    </div>
                  </div>

                  <div className="bg-[#FAF8F5] border border-[#C5A880]/30 p-4 rounded-2xl">
                    <div className="text-[11px] font-bold text-[#8A5836] uppercase tracking-wider">
                      Billed (11% Buffer)
                    </div>
                    <div className="text-xl font-bold font-['Syne'] text-[#1C130B] mt-1">
                      {Math.round(pricing.sqft)} <span className="text-xs font-normal">sqft</span>
                    </div>
                  </div>
                </div>

                {/* Step 1 Next Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="w-full sm:w-auto bg-[#1C130B] hover:bg-[#8A5836] text-[#FAF8F5] px-8 py-4 rounded-2xl font-bold font-['Syne'] text-base flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95"
                  >
                    Next: Choose Finish Tier
                    <ArrowRight className="w-5 h-5 text-[#C5A880]" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ================= STEP 2: FINISH TIER & BREAKDOWN ================= */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Palette className="text-[#8A5836] w-5 h-5" />
                    <h4 className="text-xl font-bold font-['Syne'] text-[#1C130B]">
                      Step 2: Select Finish Tier & Review Cost Breakdown
                    </h4>
                  </div>
                  <p className="text-sm text-[#1C130B]/70 font-medium">
                    All tiers include anti-fungal primer prep, German zero-peel adhesive bonding, and master technician installation.
                  </p>
                </div>

                {/* Finish Tier Selection Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {QUALITIES.map((q) => {
                    const isSelected = quality.id === q.id;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setQuality(q)}
                        className={`text-left p-5 rounded-3xl border-2 transition-all flex flex-col justify-between relative ${
                          isSelected
                            ? 'border-[#8A5836] bg-[#8A5836]/10 shadow-lg'
                            : 'border-[#C5A880]/30 bg-[#FAF8F5] hover:border-[#C5A880]'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-4 right-4 bg-[#8A5836] text-[#FAF8F5] p-1 rounded-full">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-[#8A5836] mb-1">
                            {q.smart ? 'Smart Motorized' : 'Handcrafted Wall'}
                          </div>
                          <div className="text-lg font-black font-['Syne'] text-[#1C130B] mb-1">
                            {q.name}
                          </div>
                          <p className="text-xs text-[#1C130B]/75 font-medium leading-relaxed mb-4">
                            {q.tagline}
                          </p>
                        </div>
                        <div className="pt-3 border-t border-[#C5A880]/20 flex items-baseline justify-between">
                          <div>
                            <span className="text-2xl font-black font-['Syne'] text-[#1C130B]">
                              ₹{q.rate}
                            </span>
                            <span className="text-xs text-[#1C130B]/60 font-semibold ml-1">/sqft</span>
                          </div>
                          {q.smart && (
                            <span className="text-[10px] font-bold text-[#8A5836] bg-[#8A5836]/15 px-2 py-0.5 rounded-full">
                              +₹15k Motor
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Complete Cost Breakdown Card */}
                <div className="bg-[#1C130B] text-[#FAF8F5] p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-[#C5A880]/30">
                  <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-[#C5A880]/15 rounded-full blur-3xl pointer-events-none" />

                  <div className="relative z-10 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#FAF8F5]/10 pb-4">
                      <div>
                        <span className="text-[#C5A880] text-xs font-bold uppercase tracking-wider block">
                          Transparent Cost Architecture
                        </span>
                        <h5 className="text-xl font-bold font-['Syne'] text-[#FAF8F5]">
                          Full Price Breakdown ({Math.round(pricing.sqft)} sqft Billed)
                        </h5>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-[#FAF8F5]/60 font-medium block">Total Retail Price</span>
                        <div className="text-3xl font-black font-['Syne'] text-[#C5A880]">
                          <AnimatedPrice value={pricing.totalRetailPrice} />
                        </div>
                      </div>
                    </div>

                    {/* Cost Line Items */}
                    <div className="space-y-2.5 text-xs sm:text-sm font-medium">
                      <div className="flex justify-between items-center py-1 border-b border-[#FAF8F5]/5">
                        <span className="text-[#FAF8F5]/80">
                          1. Raw Material Substrate ({quality.name} @ ₹{quality.rate}/sqft)
                        </span>
                        <span className="font-semibold text-[#FAF8F5]">
                          ₹{Math.round(pricing.materialCost).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-1 border-b border-[#FAF8F5]/5">
                        <span className="text-[#FAF8F5]/80">
                          2. Wall Primer & Anti-Fungal Prep (@ ₹15/sqft)
                        </span>
                        <span className="font-semibold text-[#FAF8F5]">
                          ₹{Math.round(pricing.primerCost).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-1 border-b border-[#FAF8F5]/5">
                        <span className="text-[#FAF8F5]/80">
                          3. Master Technician Laser Installation (@ ₹25/sqft)
                        </span>
                        <span className="font-semibold text-[#FAF8F5]">
                          ₹{Math.round(pricing.installationLaborCost).toLocaleString('en-IN')}
                        </span>
                      </div>

                      {quality.smart && (
                        <div className="flex justify-between items-center py-1 border-b border-[#FAF8F5]/5 text-[#C5A880]">
                          <span className="font-semibold">
                            4. Smart Motorized Automation Track & Remote Add-On
                          </span>
                          <span className="font-bold">₹15,000</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center py-1.5 border-t border-[#FAF8F5]/10 text-sm font-bold">
                        <span className="text-[#FAF8F5]/90">Subtotal</span>
                        <span>₹{Math.round(pricing.subtotal).toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex justify-between items-center py-1 text-xs text-[#FAF8F5]/70">
                        <span>GST (18% Statutory)</span>
                        <span>₹{Math.round(pricing.gstAmount).toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Escrow Tranches (10 / 60 / 30) */}
                    <div className="bg-[#FAF8F5]/5 border border-[#C5A880]/20 p-4 rounded-2xl mt-4">
                      <div className="text-xs font-bold uppercase tracking-wider text-[#C5A880] mb-2.5 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4" />
                        10 / 60 / 30 Escrow Protection Schedule
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="bg-[#1C130B] p-3 rounded-xl border border-[#C5A880]/20">
                          <div className="text-[#C5A880] font-bold">Tranche 1: 10% Deposit</div>
                          <div className="text-sm font-bold text-[#FAF8F5] mt-0.5">
                            <AnimatedPrice value={pricing.escrowTranches.deposit10} />
                          </div>
                          <div className="text-[10px] text-[#FAF8F5]/60 mt-0.5">Locks production slot</div>
                        </div>

                        <div className="bg-[#1C130B] p-3 rounded-xl border border-[#FAF8F5]/10">
                          <div className="text-[#FAF8F5]/80 font-bold">Tranche 2: 60% Material</div>
                          <div className="text-sm font-bold text-[#FAF8F5] mt-0.5">
                            ₹{Math.round(pricing.escrowTranches.materialRelease60).toLocaleString('en-IN')}
                          </div>
                          <div className="text-[10px] text-[#FAF8F5]/60 mt-0.5">On inventory dispatch</div>
                        </div>

                        <div className="bg-[#1C130B] p-3 rounded-xl border border-[#FAF8F5]/10">
                          <div className="text-[#FAF8F5]/80 font-bold">Tranche 3: 30% Final</div>
                          <div className="text-sm font-bold text-[#FAF8F5] mt-0.5">
                            ₹{Math.round(pricing.escrowTranches.postQAUnlock30).toLocaleString('en-IN')}
                          </div>
                          <div className="text-[10px] text-[#FAF8F5]/60 mt-0.5">Post customer QA sign-off</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2 Navigation Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="order-2 sm:order-1 bg-[#FAF8F5] hover:bg-[#8A5836]/10 text-[#1C130B] border border-[#C5A880]/40 px-6 py-4 rounded-2xl font-bold font-['Syne'] text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#8A5836]" />
                    Back: Room Size
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="order-1 sm:order-2 bg-[#1C130B] hover:bg-[#8A5836] text-[#FAF8F5] px-8 py-4 rounded-2xl font-bold font-['Syne'] text-base flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95"
                  >
                    Next: Finalize & Book Swatch Van
                    <ArrowRight className="w-5 h-5 text-[#C5A880]" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ================= STEP 3: REVIEW & BOOK ================= */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="text-[#8A5836] w-5 h-5" />
                    <h4 className="text-xl font-bold font-['Syne'] text-[#1C130B]">
                      Step 3: Select Your Society & Dispatch Swatch Van
                    </h4>
                  </div>
                  <p className="text-sm text-[#1C130B]/70 font-medium">
                    Our mobile design showroom arrives with 200+ physical swatches and laser alignment rigs. No commitment required.
                  </p>
                </div>

                {/* Society Selection */}
                <div className="bg-[#FAF8F5] border border-[#C5A880]/30 p-6 rounded-3xl space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#8A5836] block">
                    Your High-Rise Society ({cityName} {cityRegion})
                  </label>
                  <select
                    value={society}
                    onChange={(e) => setSociety(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-[#FAF8F5] border-2 border-[#C5A880]/40 outline-none focus:border-[#8A5836] font-bold text-base text-[#1C130B] transition-all cursor-pointer"
                  >
                    {citySocieties.map((soc) => (
                      <option key={soc} value={soc}>
                        {soc}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-[#1C130B]/60 font-medium">
                    Pre-measured floor plans available for My Home Bhooja, Aparna Sarovar, Rajapushpa, and Prestige High Fields.
                  </p>
                </div>

                {/* Contact Details Capture (R11): required before WhatsApp handoff */}
                <div className="bg-[#FAF8F5] border border-[#C5A880]/30 p-6 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2">
                    <Phone className="text-[#8A5836] w-4 h-4" />
                    <label className="text-xs font-bold uppercase tracking-wider text-[#8A5836]">
                      Your Contact Details
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="estimator-name" className="text-xs font-bold text-[#1C130B] uppercase tracking-wider block">
                        Your Name
                      </label>
                      <input
                        id="estimator-name"
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        className="w-full p-4 rounded-2xl bg-[#FAF8F5] border-2 border-[#C5A880]/40 outline-none focus:border-[#8A5836] font-bold text-base text-[#1C130B] transition-all"
                      />
                      {customerName !== '' && !isValidLeadName(customerName) && (
                        <p className="text-xs text-[#8A5836] font-semibold">Please enter your name (2+ characters)</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="estimator-phone" className="text-xs font-bold text-[#1C130B] uppercase tracking-wider block">
                        Phone Number
                      </label>
                      <input
                        id="estimator-phone"
                        type="tel"
                        inputMode="numeric"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 98765 43210"
                        className="w-full p-4 rounded-2xl bg-[#FAF8F5] border-2 border-[#C5A880]/40 outline-none focus:border-[#8A5836] font-bold text-base text-[#1C130B] transition-all"
                      />
                      {phone !== '' && !isValidLeadPhone(phone) && (
                        <p className="text-xs text-[#8A5836] font-semibold">Enter a valid 10-digit Indian mobile (e.g. 98765 43210)</p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-[#1C130B]/60 font-medium">
                    We only use this to call you about your swatch van slot — no spam, no card needed.
                  </p>
                </div>

                {/* Executive Review Card */}
                <div className="bg-[#FAF8F5] border-2 border-[#C5A880]/40 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
                  <div className="flex justify-between items-center border-b border-[#C5A880]/20 pb-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A5836]">
                        Executive Configuration Review
                      </span>
                      <h5 className="text-xl font-bold font-['Syne'] text-[#1C130B]">
                        {society}
                      </h5>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-[#1C130B]/60 font-semibold block">Total Investment</span>
                      <div className="text-2xl sm:text-3xl font-black font-['Syne'] text-[#8A5836]">
                        <AnimatedPrice value={pricing.totalRetailPrice} />
                      </div>
                    </div>
                  </div>

                  {/* Summary Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                    <div>
                      <div className="text-[#1C130B]/60 font-semibold">Dimensions:</div>
                      <div className="font-bold text-[#1C130B]">
                        {widthFt}ft (W) × {heightFt}ft (H)
                      </div>
                    </div>

                    <div>
                      <div className="text-[#1C130B]/60 font-semibold">Wall Area:</div>
                      <div className="font-bold text-[#1C130B]">
                        {exactWallArea} sqft ({Math.round(pricing.sqft)} sqft Billed)
                      </div>
                    </div>

                    <div>
                      <div className="text-[#1C130B]/60 font-semibold">Finish Selection:</div>
                      <div className="font-bold text-[#1C130B]">
                        {quality.name} (₹{quality.rate}/sqft)
                      </div>
                    </div>

                    <div>
                      <div className="text-[#1C130B]/60 font-semibold">Vertical Drops:</div>
                      <div className="font-bold text-[#1C130B]">
                        {nesting.totalVerticalDrops} drops (42&quot; rolls)
                      </div>
                    </div>

                    <div>
                      <div className="text-[#1C130B]/60 font-semibold">10% Escrow Deposit:</div>
                      <div className="font-bold text-[#8A5836]">
                        <AnimatedPrice value={pricing.escrowTranches.deposit10} />
                      </div>
                    </div>

                    <div>
                      <div className="text-[#1C130B]/60 font-semibold">Timeline Guarantee:</div>
                      <div className="font-bold text-[#15803D] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        48-Hour Handover
                      </div>
                    </div>
                  </div>

                  {/* Trust Guarantee Badges */}
                  <div className="pt-4 border-t border-[#C5A880]/20 flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="bg-[#FAF8F5] border border-[#C5A880]/30 px-3 py-1.5 rounded-2xl text-[#1C130B] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#8A5836]" />
                      Zero Civil Work & Dust-Free
                    </span>
                    <span className="bg-[#FAF8F5] border border-[#C5A880]/30 px-3 py-1.5 rounded-2xl text-[#1C130B] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#8A5836]" />
                      2-Year Comprehensive Warranty
                    </span>
                    <span className="bg-[#FAF8F5] border border-[#C5A880]/30 px-3 py-1.5 rounded-2xl text-[#1C130B] flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#8A5836]" />
                      Mobile Swatch Van Dispatched in 2 Hrs
                    </span>
                  </div>
                </div>

                {/* Primary WhatsApp CTA Action */}
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={handleWhatsAppBooking}
                    disabled={!detailsValid}
                    className="w-full bg-[#15803D] hover:bg-[#166534] text-white p-5 sm:p-6 rounded-2xl font-bold font-['Syne'] text-base sm:text-lg flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-xl shadow-[#15803D]/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#15803D]"
                  >
                    <MessageCircle className="w-6 h-6 text-white" />
                    Confirm & Book Swatch Van on WhatsApp
                  </button>

                  <p className="text-center text-xs text-[#1C130B]/70 font-medium">
                    {!detailsValid ? (
                      <>Enter your <span className="font-bold">name</span> & <span className="font-bold">10-digit phone</span> above to unlock booking.</>
                    ) : (
                      <>Direct line to concierge hotline <span className="font-bold">+91 97006 75637</span>. No card needed. We verify exact apartment wall condition in person.</>
                    )}
                  </p>
                </div>

                {/* Step 3 Navigation Buttons */}
                <div className="pt-2 flex justify-start">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="bg-[#FAF8F5] hover:bg-[#8A5836]/10 text-[#1C130B] border border-[#C5A880]/40 px-6 py-4 rounded-2xl font-bold font-['Syne'] text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#8A5836]" />
                    Back: Finish & Cost Breakdown
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export { EstimatorGateway };
