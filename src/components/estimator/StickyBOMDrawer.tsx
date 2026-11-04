"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Layers, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { PricingOutput, RollNestingOutput } from '@/lib/engines';

export interface StickyBOMDrawerProps {
  widthFt: number;
  heightFt: number;
  finishTier: string;
  isSmartMotorized: boolean;
  pricingDetails: PricingOutput;
  nesting: RollNestingOutput;
  onProceedToReview?: () => void;
  currentStep: number;
}

export default function StickyBOMDrawer({
  widthFt,
  heightFt,
  finishTier,
  isSmartMotorized,
  pricingDetails,
  nesting,
  onProceedToReview,
  currentStep,
}: StickyBOMDrawerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const exactWallArea = widthFt * heightFt;
  const tierName = finishTier === 'luxury' 
    ? 'Presidential Acoustic Slats + Smart Blinds' 
    : finishTier === 'premium' 
    ? 'Executive Fluted Louver' 
    : 'Architectural Textured Canvas';

  const ratePerSqFt = finishTier === 'base' ? 180 : finishTier === 'premium' ? 320 : 450;

  return (
    <div className="mt-8 border-t border-[#C5A880]/30 pt-6">
      {/* Floating Sticky Dock Trigger Bar */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer bg-[#1C130B] hover:bg-[#2A1E12] transition-colors duration-300 rounded-2xl p-4 sm:p-5 border border-[#C5A880]/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C5A880]/10 border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[#FAF8F5] font-bold text-sm sm:text-base font-['Syne']">
                Live Bill of Materials (BOM)
              </span>
              <span className="bg-[#C5A880]/20 text-[#C5A880] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-['Plus_Jakarta_Sans']">
                Deterministic
              </span>
            </div>
            <p className="text-[#FAF8F5]/60 text-xs font-['Plus_Jakarta_Sans']">
              {widthFt}ft × {heightFt}ft wall • {nesting.totalVerticalDrops} Drops ({nesting.totalSqFtWithBuffer} sq.ft with 11% buffer)
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-6">
          <div className="text-right">
            <span className="text-xs text-[#FAF8F5]/50 block font-['Plus_Jakarta_Sans']">Total (inc. GST)</span>
            <span className="text-xl sm:text-2xl font-black text-[#C5A880] font-['Syne']">
              ₹{Math.round(pricingDetails.totalRetailPrice).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-[#C5A880] text-[#1C130B] px-3.5 py-1.5 rounded-xl font-bold text-xs font-['Plus_Jakarta_Sans'] shadow-md hover:bg-[#d5ba94] transition-colors">
            <span>{isExpanded ? 'Hide Specs' : 'View Full BOM'}</span>
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Expandable Spec Tray */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="bg-[#FAF8F5] border border-[#C5A880]/30 rounded-2xl p-6 mt-4 text-[#1C130B] shadow-inner">
              
              {/* Header Details */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-[#C5A880]/20 gap-2">
                <div>
                  <h4 className="font-['Syne'] font-bold text-lg text-[#1C130B]">
                    Itemized Material & Labor Breakdown
                  </h4>
                  <p className="text-xs text-[#8A5836] font-['Plus_Jakarta_Sans']">
                    Selected: {tierName} @ ₹{ratePerSqFt}/sq.ft
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#15803D] font-bold font-['Plus_Jakarta_Sans'] bg-[#15803D]/10 px-3 py-1 rounded-full">
                  <ShieldCheck className="w-4 h-4" />
                  100% Zero-Civil / Dry Mount Guaranteed
                </div>
              </div>

              {/* Grid Calculation Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 text-sm font-['Plus_Jakarta_Sans']">
                
                {/* Surface Engineering Column */}
                <div className="space-y-3 bg-white p-4 rounded-xl border border-[#C5A880]/20">
                  <h5 className="font-bold text-[#8A5836] uppercase text-xs tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A880]" />
                    Roll Nesting & Surface Math
                  </h5>
                  <div className="flex justify-between text-xs py-1 border-b border-gray-100">
                    <span className="text-gray-600">Net Wall Area:</span>
                    <span className="font-semibold">{exactWallArea} sq.ft ({widthFt}&apos; × {heightFt}&apos;)</span>
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-gray-100">
                    <span className="text-gray-600">Continuous Vertical Drops:</span>
                    <span className="font-semibold">{nesting.totalVerticalDrops} drops (21&quot; roll width)</span>
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-gray-100">
                    <span className="text-gray-600">Pattern Repeat Matching Waste:</span>
                    <span className="font-semibold">{nesting.matchingWasteInches}&quot; (linear)</span>
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-gray-100">
                    <span className="text-gray-600">Required Continuous Fabric:</span>
                    <span className="font-semibold">{nesting.requiredContinuousMeters.toFixed(2)} meters</span>
                  </div>
                  <div className="flex justify-between text-xs py-1 text-[#8A5836] font-bold">
                    <span>Buffered Billable Sq.Ft (11% Safety Margin):</span>
                    <span>{nesting.totalSqFtWithBuffer} sq.ft</span>
                  </div>
                </div>

                {/* Financial Ledger Column */}
                <div className="space-y-3 bg-white p-4 rounded-xl border border-[#C5A880]/20">
                  <h5 className="font-bold text-[#8A5836] uppercase text-xs tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#C5A880]" />
                    Financial Cost Ledger
                  </h5>
                  <div className="flex justify-between text-xs py-1 border-b border-gray-100">
                    <span className="text-gray-600">Raw Architectural Material:</span>
                    <span className="font-semibold">₹{Math.round(pricingDetails.materialCost).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-gray-100">
                    <span className="text-gray-600">Anti-Microbial Wall Primer (₹15/sq.ft):</span>
                    <span className="font-semibold">₹{Math.round(pricingDetails.primerCost).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-gray-100">
                    <span className="text-gray-600">Certified White-Glove Installation (₹25/sq.ft):</span>
                    <span className="font-semibold">₹{Math.round(pricingDetails.installationLaborCost).toLocaleString('en-IN')}</span>
                  </div>
                  {isSmartMotorized && (
                    <div className="flex justify-between text-xs py-1 border-b border-gray-100 text-[#8A5836] font-semibold">
                      <span>Smart Motorized Add-On:</span>
                      <span>+ ₹15,000</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs py-1 border-b border-gray-100">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">₹{Math.round(pricingDetails.subtotal).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-gray-100">
                    <span className="text-gray-600">Statutory GST (18%):</span>
                    <span className="font-semibold">₹{Math.round(pricingDetails.gstAmount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm py-1 font-extrabold text-[#1C130B]">
                    <span>Total Retail Price:</span>
                    <span className="text-[#8A5836]">₹{Math.round(pricingDetails.totalRetailPrice).toLocaleString('en-IN')}</span>
                  </div>
                </div>

              </div>

              {/* 10/60/30 Escrow Tranche Visualizer */}
              <div className="bg-[#1C130B] text-[#FAF8F5] p-5 rounded-xl border border-[#C5A880]/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#C5A880]" />
                    <span className="font-bold text-sm font-['Syne']">
                      Programmatic 10/60/30 Milestone Escrow Protection
                    </span>
                  </div>
                  <span className="text-xs text-[#FAF8F5]/60 font-['Plus_Jakarta_Sans'] hidden sm:inline">
                    72h Post-QA Auto-Release
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-['Plus_Jakarta_Sans']">
                  <div className="bg-[#FAF8F5]/10 p-3 rounded-lg border border-[#C5A880]/20">
                    <span className="text-[#C5A880] font-bold block mb-1">Tranche 1: Deposit (10%)</span>
                    <p className="font-black text-sm text-[#FAF8F5]">
                      ₹{Math.round(pricingDetails.escrowTranches.deposit10).toLocaleString('en-IN')}
                    </p>
                    <p className="text-[10px] text-[#FAF8F5]/60 mt-1">Locks fixed price & dispatches laser survey</p>
                  </div>

                  <div className="bg-[#FAF8F5]/10 p-3 rounded-lg border border-[#C5A880]/20">
                    <span className="text-[#C5A880] font-bold block mb-1">Tranche 2: Material (60%)</span>
                    <p className="font-black text-sm text-[#FAF8F5]">
                      ₹{Math.round(pricingDetails.escrowTranches.materialRelease60).toLocaleString('en-IN')}
                    </p>
                    <p className="text-[10px] text-[#FAF8F5]/60 mt-1">Released on QA photo of cut rolls</p>
                  </div>

                  <div className="bg-[#FAF8F5]/10 p-3 rounded-lg border border-[#C5A880]/20">
                    <span className="text-[#C5A880] font-bold block mb-1">Tranche 3: Handover (30%)</span>
                    <p className="font-black text-sm text-[#FAF8F5]">
                      ₹{Math.round(pricingDetails.escrowTranches.postQAUnlock30).toLocaleString('en-IN')}
                    </p>
                    <p className="text-[10px] text-[#FAF8F5]/60 mt-1">Unlocked following laser QA sign-off</p>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              {currentStep < 3 && onProceedToReview && (
                <div className="mt-5 text-right">
                  <button
                    onClick={onProceedToReview}
                    className="bg-[#C5A880] text-[#1C130B] font-bold font-['Plus_Jakarta_Sans'] px-6 py-2.5 rounded-xl hover:bg-[#d5ba94] transition-colors shadow-md text-sm inline-flex items-center gap-2"
                  >
                    Proceed to Review & Book →
                  </button>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
