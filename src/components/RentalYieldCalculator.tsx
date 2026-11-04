"use client";

import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Coins, 
  Sparkles, 
  PhoneCall, 
  CheckCircle,
  HelpCircle,
  Truck
} from 'lucide-react';
import { 
  calculateWestHydRentalROI, 
  WEST_HYDERABAD_SOCIETIES, 
  SocietyKey, 
  UnitType, 
  MakeoverTier,
  TIER_CAPEX 
} from '@/lib/roi-engine';
import SwatchVanBookingModal from './SwatchVanBookingModal';

export default function RentalYieldCalculator() {
  const [societyKey, setSocietyKey] = useState<SocietyKey>('my-home-bhooja');
  const [unitType, setUnitType] = useState<UnitType>('3BHK');
  const [tier, setTier] = useState<MakeoverTier>('EXECUTIVE_LOUVER');
  const [isVanModalOpen, setIsVanModalOpen] = useState(false);

  const roi = useMemo(() => {
    return calculateWestHydRentalROI({
      societyKey,
      unitType,
      tier,
    });
  }, [societyKey, unitType, tier]);

  const whatsappMessage = encodeURIComponent(
    `Hello AuroMakeover, I am an investor with a ${unitType} at ${roi.societyName}. I calculated a projected rental lift of ₹${roi.monthlyRentalLift.toLocaleString('en-IN')}/mo with the ${roi.tierName} package. I would like to book a Turnkey Investor Consultation.`
  );

  // Official Investor WhatsApp: 918555069441 (Fallback: 919700675637)
  const whatsappUrl = `https://wa.me/918555069441?text=${whatsappMessage}`;

  return (
    <section id="roi-calculator" className="py-24 sm:py-32 px-6 bg-[#1C130B] text-[#FAF8F5] relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 -left-48 w-96 h-96 bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-48 w-96 h-96 bg-[#8A5836]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#C5A880]/15 text-[#C5A880] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest font-['Plus_Jakarta_Sans'] mb-4 border border-[#C5A880]/30">
            <Coins className="w-3.5 h-3.5" />
            Landlord & NRI Investor Telemetry
          </div>
          <h2 className="font-['Syne'] text-4xl sm:text-5xl font-black text-[#FAF8F5] mb-6">
            West Hyderabad Rental Yield & Payback Model
          </h2>
          <p className="font-['Plus_Jakarta_Sans'] text-[#FAF8F5]/70 text-lg max-w-2xl mx-auto">
            High-rise luxury tenants in Kokapet, Tellapur, and the Financial District pay up to ₹25,000/month more for architectural accent skins over plain builder distemper. Calculate your payback.
          </p>
        </div>

        {/* 3-Step Configurator Bar */}
        <div className="bg-[#FAF8F5]/5 border border-[#C5A880]/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md mb-12 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. Society Dropdown */}
            <div>
              <label className="text-xs font-bold text-[#C5A880] uppercase tracking-wider block mb-2 font-['Plus_Jakarta_Sans']">
                1. Select Gated Community:
              </label>
              <select
                value={societyKey}
                onChange={(e) => setSocietyKey(e.target.value as SocietyKey)}
                aria-label="1. Select Gated Community"
                className="w-full bg-[#1C130B] text-[#FAF8F5] border border-[#C5A880]/40 rounded-2xl px-4 py-3 font-['Plus_Jakarta_Sans'] text-sm focus:outline-none focus:border-[#C5A880] transition-colors cursor-pointer"
              >
                {Object.entries(WEST_HYDERABAD_SOCIETIES).map(([key, data]) => (
                  <option key={key} value={key}>
                    {data.name} ({data.locality})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Unit Configuration */}
            <div>
              <label className="text-xs font-bold text-[#C5A880] uppercase tracking-wider block mb-2 font-['Plus_Jakarta_Sans']">
                2. Flat Configuration:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['2BHK', '3BHK', '4BHK'] as UnitType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setUnitType(type)}
                    className={`py-3 rounded-2xl font-bold text-xs sm:text-sm font-['Plus_Jakarta_Sans'] transition-all duration-300 border ${
                      unitType === type
                        ? 'bg-[#C5A880] text-[#1C130B] border-[#C5A880] shadow-md'
                        : 'bg-[#1C130B]/60 text-[#FAF8F5]/70 border-[#C5A880]/20 hover:border-[#C5A880]/50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Makeover Package Tier */}
            <div>
              <label className="text-xs font-bold text-[#C5A880] uppercase tracking-wider block mb-2 font-['Plus_Jakarta_Sans']">
                3. Architectural Finish:
              </label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as MakeoverTier)}
                aria-label="3. Architectural Finish"
                className="w-full bg-[#1C130B] text-[#FAF8F5] border border-[#C5A880]/40 rounded-2xl px-4 py-3 font-['Plus_Jakarta_Sans'] text-sm focus:outline-none focus:border-[#C5A880] transition-colors cursor-pointer"
              >
                {Object.entries(TIER_CAPEX).map(([key, data]) => (
                  <option key={key} value={key}>
                    {data.name}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Telemetry Output Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Card 1: Monthly Rental Lift */}
          <div className="bg-[#FAF8F5]/5 border border-[#C5A880]/30 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="text-xs text-[#C5A880] font-bold uppercase tracking-wider block mb-2 font-['Plus_Jakarta_Sans']">
                Monthly Rent Premium
              </span>
              <div className="font-['Syne'] text-3xl sm:text-4xl font-black text-[#FAF8F5] mb-2">
                + ₹{roi.monthlyRentalLift.toLocaleString('en-IN')}
                <span className="text-xs text-[#FAF8F5]/50 block font-normal font-['Plus_Jakarta_Sans'] mt-1">/ month above distemper flat</span>
              </div>
            </div>
            <div className="text-xs text-[#FAF8F5]/60 pt-4 border-t border-[#FAF8F5]/10 font-['Plus_Jakarta_Sans']">
              Baseline: ₹{roi.baseMonthlyRent.toLocaleString('en-IN')} → Projected: <strong className="text-[#C5A880]">₹{roi.postMakeoverMonthlyRent.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          {/* Card 2: Capex Payback Horizon */}
          <div className="bg-[#FAF8F5]/5 border border-[#C5A880]/30 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="text-xs text-[#C5A880] font-bold uppercase tracking-wider block mb-2 font-['Plus_Jakarta_Sans']">
                Capex Payback Horizon
              </span>
              <div className="font-['Syne'] text-3xl sm:text-4xl font-black text-[#C5A880] mb-2">
                {roi.paybackDurationMonths} Months
                <span className="text-xs text-[#FAF8F5]/50 block font-normal font-['Plus_Jakarta_Sans'] mt-1">100% capex recovery time</span>
              </div>
            </div>
            <div className="text-xs text-[#FAF8F5]/60 pt-4 border-t border-[#FAF8F5]/10 font-['Plus_Jakarta_Sans']">
              One-Time Capex: <strong className="text-[#FAF8F5]">₹{roi.makeoverCapexOutlay.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          {/* Card 3: 3-Year Wealth Appreciation */}
          <div className="bg-[#FAF8F5]/5 border border-[#C5A880]/30 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="text-xs text-[#C5A880] font-bold uppercase tracking-wider block mb-2 font-['Plus_Jakarta_Sans']">
                3-Year Net Wealth Gain
              </span>
              <div className="font-['Syne'] text-3xl sm:text-4xl font-black text-[#15803D] mb-2">
                + ₹{roi.threeYearNetWealthGain.toLocaleString('en-IN')}
                <span className="text-xs text-[#FAF8F5]/50 block font-normal font-['Plus_Jakarta_Sans'] mt-1">Net profit after full capex return</span>
              </div>
            </div>
            <div className="text-xs text-[#FAF8F5]/60 pt-4 border-t border-[#FAF8F5]/10 font-['Plus_Jakarta_Sans']">
              Annual Lift: <strong className="text-[#FAF8F5]">₹{roi.annualRentalLift.toLocaleString('en-IN')}/year</strong>
            </div>
          </div>

          {/* Card 4: Vacancy Reduction */}
          <div className="bg-[#FAF8F5]/5 border border-[#C5A880]/30 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="text-xs text-[#C5A880] font-bold uppercase tracking-wider block mb-2 font-['Plus_Jakarta_Sans']">
                Vacancy Days Saved
              </span>
              <div className="font-['Syne'] text-3xl sm:text-4xl font-black text-[#FAF8F5] mb-2">
                ~45 Days
                <span className="text-xs text-[#FAF8F5]/50 block font-normal font-['Plus_Jakarta_Sans'] mt-1">Faster tenant signing</span>
              </div>
            </div>
            <div className="text-xs text-[#FAF8F5]/60 pt-4 border-t border-[#FAF8F5]/10 font-['Plus_Jakarta_Sans']">
              Yield Lift: <strong className="text-[#C5A880]">+{roi.annualGrossYieldLift}%</strong> over asset valuation
            </div>
          </div>

        </div>

        {/* Turnkey Call to Action Banner */}
        <div className="bg-[#FAF8F5] text-[#1C130B] rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-[#8A5836] text-xs font-bold uppercase tracking-wider mb-2 font-['Plus_Jakarta_Sans']">
              <Sparkles className="w-4 h-4 text-[#C5A880]" />
              Turnkey NRI & Landlord Service
            </div>
            <h4 className="font-['Syne'] text-2xl sm:text-3xl font-black text-[#1C130B] mb-2">
              Maximize Your {roi.societyName} Rental Asset
            </h4>
            <p className="text-xs sm:text-sm text-[#1C130B]/70 font-['Plus_Jakarta_Sans']">
              Located out of Hyderabad or overseas? We coordinate with your tenant or broker, handle pre-measured wall installation in 48 hours, and provide photo QA handover. Zero effort required from you.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => setIsVanModalOpen(true)}
              className="w-full sm:w-auto bg-[#FAF8F5] text-[#1C130B] border-2 border-[#C5A880] hover:bg-[#C5A880]/10 px-6 py-4 rounded-2xl font-bold font-['Plus_Jakarta_Sans'] flex items-center justify-center gap-3 transition-all duration-300 shadow-md text-sm cursor-pointer"
            >
              <Truck className="w-4 h-4 text-[#8A5836]" />
              <span>Book Swatch Van at Gate</span>
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-[#15803D] hover:bg-[#126e34] text-white px-8 py-4 rounded-2xl font-bold font-['Plus_Jakarta_Sans'] flex items-center justify-center gap-3 transition-all duration-300 shadow-xl text-sm"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Book Turnkey Investor Consultation</span>
            </a>
          </div>
        </div>

        {/* Swatch Van Booking Modal */}
        <SwatchVanBookingModal
          isOpen={isVanModalOpen}
          onClose={() => setIsVanModalOpen(false)}
          initialSociety={roi.societyName}
          finishTier={roi.tierName}
          wallDimensions={`${unitType} Living & Master Walls`}
        />

      </div>
    </section>
  );
}
