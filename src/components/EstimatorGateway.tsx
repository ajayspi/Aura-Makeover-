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
import { Truck } from 'lucide-react';

interface EstimatorGatewayProps {
  city?: CityConfig;
}

export default function EstimatorGateway({ city }: EstimatorGatewayProps) {
  // Step State
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isVanModalOpen, setIsVanModalOpen] = useState(false);

  // Engine Inputs
  const [widthFt, setWidthFt] = useState(12);
  const [heightFt, setHeightFt] = useState(10);
  const [finishTier, setFinishTier] = useState<string>('base');

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

  // Compute Engine Outputs
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

  return (
    <section id="estimator" className="py-24 sm:py-32 px-6 bg-[#FAF8F5]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#8A5836] text-xs font-semibold tracking-[0.2em] uppercase mb-4 font-['Plus_Jakarta_Sans']">
            Live Pricing Engine
          </p>
          <h2 className="font-['Syne'] text-4xl sm:text-5xl font-black text-[#1C130B] mb-6">
            Calculate Your Investment
          </h2>
          <p className="font-['Plus_Jakarta_Sans'] text-[#1C130B]/70 text-lg max-w-2xl mx-auto">
            {city?.name ? `Serving ${city.name} with exact precision.` : "Get an instant, precise quote based on our proprietary roll-nesting algorithm. Zero hidden fees."}
          </p>
        </div>

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
