"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Home, 
  TrendingDown, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Building,
  UserCheck
} from 'lucide-react';
import { calculateRenovationDisruption } from '@/lib/disruption-engine';

export default function RenovationComparator() {
  const [isLivingInFlat, setIsLivingInFlat] = useState(true);
  const [roomCount, setRoomCount] = useState<number>(2);

  const delta = useMemo(() => {
    return calculateRenovationDisruption({
      roomCount,
      isLivingInFlat,
    });
  }, [roomCount, isLivingInFlat]);

  const scrollToEstimator = () => {
    document.getElementById('estimator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="comparator" className="py-24 sm:py-32 px-6 bg-[#FAF8F5] relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[#8A5836]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#8A5836]/10 text-[#8A5836] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest font-['Plus_Jakarta_Sans'] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Zero-Civil Reality Check
          </div>
          <h2 className="font-['Syne'] text-4xl sm:text-5xl font-black text-[#1C130B] mb-6">
            The True Cost of Civil Renovation
          </h2>
          <p className="font-['Plus_Jakarta_Sans'] text-[#1C130B]/70 text-lg max-w-2xl mx-auto">
            Traditional interior contractors quote low upfront and bleed you on hidden civil disruption, temporary rent, and endless delays. See the real numbers.
          </p>
        </div>

        {/* Interactive Controls Bar */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-[#C5A880]/20 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Persona Toggle */}
          <div className="w-full md:w-auto">
            <label className="text-xs font-bold text-[#8A5836] uppercase tracking-wider block mb-2 font-['Plus_Jakarta_Sans']">
              1. Your Occupancy Status:
            </label>
            <div className="inline-flex bg-[#FAF8F5] p-1.5 rounded-2xl border border-[#C5A880]/30 w-full sm:w-auto">
              <button
                onClick={() => setIsLivingInFlat(true)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm font-['Plus_Jakarta_Sans'] transition-all duration-300 ${
                  isLivingInFlat 
                    ? 'bg-[#1C130B] text-[#C5A880] shadow-md' 
                    : 'text-[#1C130B]/70 hover:text-[#1C130B]'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                Living in Flat (Live-in Friendly)
              </button>
              <button
                onClick={() => setIsLivingInFlat(false)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm font-['Plus_Jakarta_Sans'] transition-all duration-300 ${
                  !isLivingInFlat 
                    ? 'bg-[#1C130B] text-[#C5A880] shadow-md' 
                    : 'text-[#1C130B]/70 hover:text-[#1C130B]'
                }`}
              >
                <Building className="w-4 h-4" />
                Vacant Unit (Landlord / Investor)
              </button>
            </div>
          </div>

          {/* Scope Selector */}
          <div className="w-full md:w-auto">
            <label className="text-xs font-bold text-[#8A5836] uppercase tracking-wider block mb-2 font-['Plus_Jakarta_Sans']">
              2. Transformation Scope:
            </label>
            <div className="inline-flex bg-[#FAF8F5] p-1.5 rounded-2xl border border-[#C5A880]/30 w-full sm:w-auto">
              {[
                { count: 1, label: '1 Accent Wall' },
                { count: 2, label: 'Living + Dining (2 Rooms)' },
                { count: 3, label: 'Full 3BHK (3 Rooms)' },
              ].map((scope) => (
                <button
                  key={scope.count}
                  onClick={() => setRoomCount(scope.count)}
                  className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm font-['Plus_Jakarta_Sans'] transition-all duration-300 ${
                    roomCount === scope.count
                      ? 'bg-[#C5A880] text-[#1C130B] shadow-md'
                      : 'text-[#1C130B]/70 hover:text-[#1C130B]'
                  }`}
                >
                  {scope.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Side-by-Side Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Traditional Contractor Column */}
          <div className="bg-white rounded-3xl p-8 border border-red-200/80 shadow-lg relative flex flex-col justify-between">
            <div className="absolute top-6 right-6 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 border border-red-200">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              High Friction & Hidden Loss
            </div>

            <div>
              <h3 className="font-['Syne'] text-2xl font-black text-[#1C130B] mb-2">
                Traditional Civil Contractor
              </h3>
              <p className="text-xs text-[#1C130B]/60 font-['Plus_Jakarta_Sans'] mb-6">
                Civil demolition, wet plastering, contractor delays & living displacement.
              </p>

              {/* Specs & Penalties */}
              <div className="space-y-4 mb-8 font-['Plus_Jakarta_Sans'] text-sm">
                <div className="flex items-start gap-3 p-3 bg-red-50/50 rounded-2xl border border-red-100">
                  <Clock className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#1C130B] block">Duration: {delta.traditionalDays} Days of Civil Chaos</span>
                    <span className="text-xs text-[#1C130B]/70">Laborers on-site for weeks, continuous hammer drill noise, dust in air conditioning ducts.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-red-50/50 rounded-2xl border border-red-100">
                  <Home className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#1C130B] block">
                      {isLivingInFlat ? 'Temporary Relocation / Airbnb:' : 'Lost Rental Income (Vacancy):'} ₹{delta.relocationCost.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#1C130B]/70">
                      {isLivingInFlat 
                        ? `Forced to book ₹2,500/night Airbnb in Kokapet to escape noise & toxic paint fumes.` 
                        : `Apartment sits vacant and unrented during ${delta.traditionalDays} days of messy contractor work.`}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-xs py-2 border-b border-gray-100">
                  <span className="text-gray-600">Deep Dust Extraction & Post-Cleaning:</span>
                  <span className="font-bold text-red-700">+ ₹{delta.deepCleaningCost.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-xs py-2 border-b border-gray-100">
                  <span className="text-gray-600">Society Debris Disposal & NOC Hassle:</span>
                  <span className="font-bold text-red-700">+ ₹{delta.debrisDisposalNocCost.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-xs py-2 border-b border-gray-100">
                  <span className="text-gray-600">Estimated Contractor Material & Labor:</span>
                  <span className="font-bold text-gray-900">₹{delta.estimatedTraditionalInvoice.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-xs py-2 text-red-700 font-bold">
                  <span>Contractor 15% Delay & Overrun Buffer:</span>
                  <span>+ ₹{delta.contractorDelayRiskCost.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Total Traditional Outlay */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-center">
              <span className="text-xs text-gray-500 font-['Plus_Jakarta_Sans'] block">Total Real Outlay (Contractor + Hidden Disruption)</span>
              <span className="font-['Syne'] text-3xl font-black text-red-700">
                ₹{delta.totalCivilProjectOutlay.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Aura Zero-Civil Column */}
          <div className="bg-[#1C130B] text-[#FAF8F5] rounded-3xl p-8 border-2 border-[#C5A880] shadow-2xl relative flex flex-col justify-between">
            <div className="absolute top-6 right-6 bg-[#C5A880] text-[#1C130B] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              100% Zero-Civil
            </div>

            <div>
              <h3 className="font-['Syne'] text-2xl font-black text-[#C5A880] mb-2">
                Aura Makeover Method
              </h3>
              <p className="text-xs text-[#FAF8F5]/60 font-['Plus_Jakarta_Sans'] mb-6">
                Pre-engineered architectural skins mounted mechanically. Zero structural damage.
              </p>

              {/* Specs & Benefits */}
              <div className="space-y-4 mb-8 font-['Plus_Jakarta_Sans'] text-sm">
                <div className="flex items-start gap-3 p-3 bg-[#FAF8F5]/5 rounded-2xl border border-[#C5A880]/30">
                  <Clock className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#FAF8F5] block">Duration: 48-Hour Turnaround ({delta.auraDays} Days)</span>
                    <span className="text-xs text-[#FAF8F5]/70">Pre-measured panels and precision rolls arrive ready to mount. Installed in hours without vacating.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#FAF8F5]/5 rounded-2xl border border-[#C5A880]/30">
                  <Home className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#FAF8F5] block">
                      Relocation / Airbnb Cost: ₹0 (Live in Flat)
                    </span>
                    <span className="text-xs text-[#FAF8F5]/70">
                      100% dust-free, odor-free, non-toxic waterborne European adhesives. Sleep in your master bed that same night.
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-xs py-2 border-b border-[#FAF8F5]/10">
                  <span className="text-[#FAF8F5]/70">Post-Installation Cleaning:</span>
                  <span className="font-bold text-[#15803D]">Included (White-Glove Handover)</span>
                </div>

                <div className="flex justify-between text-xs py-2 border-b border-[#FAF8F5]/10">
                  <span className="text-[#FAF8F5]/70">Gated Society NOC Friction:</span>
                  <span className="font-bold text-[#C5A880]">Zero Debris / No Civil Permits Needed</span>
                </div>

                <div className="flex justify-between text-xs py-2 border-b border-[#FAF8F5]/10">
                  <span className="text-[#FAF8F5]/70">Warranty & Quality Assurance:</span>
                  <span className="font-bold text-[#FAF8F5]">2-Year Comprehensive Warranty</span>
                </div>

                <div className="flex justify-between text-xs py-2 text-[#C5A880] font-bold">
                  <span>Programmatic Milestone Protection:</span>
                  <span>10/60/30 Escrow Safeguard</span>
                </div>
              </div>
            </div>

            {/* Total Aura Price & Savings */}
            <div>
              <div className="p-4 bg-[#FAF8F5]/10 rounded-2xl border border-[#C5A880]/40 text-center mb-4">
                <span className="text-xs text-[#C5A880] font-bold font-['Plus_Jakarta_Sans'] block uppercase tracking-wider">
                  Guaranteed Fixed Price
                </span>
                <span className="font-['Syne'] text-3xl font-black text-[#FAF8F5]">
                  ₹{delta.auraMakeoverTotalEstimate.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                onClick={scrollToEstimator}
                className="w-full bg-[#C5A880] hover:bg-[#d5ba94] text-[#1C130B] font-bold font-['Plus_Jakarta_Sans'] py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-xl group text-sm"
              >
                <span>Calculate Your Exact Wall Quote</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>

        {/* Dynamic Delta Banner */}
        <div className="bg-[#1C130B] border border-[#C5A880]/40 rounded-3xl p-6 sm:p-8 text-center text-[#FAF8F5] shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-radial from-[#C5A880]/15 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <span className="text-[#8A5836] text-xs font-bold uppercase tracking-widest block font-['Plus_Jakarta_Sans'] mb-1">
                Net Disruption Savings
              </span>
              <h4 className="font-['Syne'] text-2xl sm:text-3xl font-black text-[#FAF8F5]">
                Save up to <span className="text-[#C5A880]">₹{delta.netFinancialSavings.toLocaleString('en-IN')}</span> and {delta.daysSaved} Disrupted Days
              </h4>
              <p className="text-xs text-[#FAF8F5]/70 font-['Plus_Jakarta_Sans'] mt-1">
                Based on real Kokapet & Financial District residential high-rise survey benchmarks.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <button
                onClick={scrollToEstimator}
                className="bg-[#C5A880] text-[#1C130B] px-6 py-3 rounded-2xl font-bold font-['Plus_Jakarta_Sans'] hover:bg-[#d5ba94] transition-colors text-sm shadow-lg inline-flex items-center gap-2"
              >
                <span>Book Zero-Civil Makeover</span>
                <ShieldCheck className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
