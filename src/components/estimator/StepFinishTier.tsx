"use client";

import { motion } from 'framer-motion';
import { Layers, ArrowRight, ArrowLeft } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';

const FINISH_TIERS = [
  {
    id: 'base',
    label: 'Standard Wallpaper',
    desc: '3D printed vinyl, washable, seamless joints.',
    pricePerSqft: 180,
    image: '/images/hero.jpg'
  },
  {
    id: 'premium',
    label: 'Acoustic Louvers',
    desc: 'Walnut fluted panels with sound dampening core.',
    pricePerSqft: 320,
    image: '/images/fluted-louver.jpg'
  },
  {
    id: 'luxury',
    label: 'Smart Blinds + Paneling',
    desc: 'Motorized blackout + veneer wall panelling.',
    pricePerSqft: 450,
    image: '/images/neoclassical.jpg'
  },
];

export default function StepFinishTier({
  finishTier,
  setFinishTier,
  onNext,
  onBack,
}: {
  finishTier: string;
  setFinishTier: Dispatch<SetStateAction<string>>;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      key="step-2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 sm:space-y-8"
    >
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Layers className="text-[#8A5836] w-5 h-5 sm:w-6 sm:h-6" />
          <h4 className="text-xl sm:text-2xl font-bold font-['Syne'] text-[#1C130B]">
            Step 2: Select Finish Tier
          </h4>
        </div>
        <p className="text-xs sm:text-sm text-[#1C130B]/70 font-['Plus_Jakarta_Sans'] leading-relaxed">
          Choose the material grade for your wall. Pricing scales dynamically based on the exact cut logic calculated in Step 1.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {FINISH_TIERS.map((tier) => {
          const isSelected = finishTier === tier.id;
          return (
            <button
              key={tier.id}
              onClick={() => setFinishTier(tier.id)}
              className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 text-left h-full flex flex-col group ${
                isSelected 
                  ? 'border-[#1C130B] shadow-xl' 
                  : 'border-[#C5A880]/30 hover:border-[#C5A880]/70'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10 bg-[#1C130B] text-[#C5A880] text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                  Selected
                </div>
              )}
              
              <div className="relative w-full aspect-[4/3] sm:aspect-video overflow-hidden">
                <Image
                  src={tier.image}
                  alt={tier.label}
                  fill
                  className={`object-cover transition-transform duration-700 ${isSelected ? 'scale-105' : 'group-hover:scale-105'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C130B] via-[#1C130B]/40 to-transparent opacity-80" />
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
                  <div className="text-[#FAF8F5] font-['Syne'] font-bold text-lg sm:text-xl">
                    ₹{tier.pricePerSqft}
                  </div>
                  <div className="text-[#C5A880] font-['Plus_Jakarta_Sans'] text-[10px] sm:text-xs uppercase tracking-wider font-bold">
                    per sqft
                  </div>
                </div>
              </div>

              <div className={`p-4 sm:p-5 flex-1 transition-colors ${isSelected ? 'bg-[#1C130B]' : 'bg-white'}`}>
                <h5 className={`font-bold font-['Syne'] text-base sm:text-lg mb-2 ${isSelected ? 'text-[#FAF8F5]' : 'text-[#1C130B]'}`}>
                  {tier.label}
                </h5>
                <p className={`font-['Plus_Jakarta_Sans'] text-xs sm:text-sm leading-relaxed ${isSelected ? 'text-[#FAF8F5]/70' : 'text-[#1C130B]/70'}`}>
                  {tier.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Step 2 Actions */}
      <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-between items-center">
        <button
          onClick={onBack}
          className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold font-['Plus_Jakarta_Sans'] text-xs sm:text-sm uppercase tracking-wider text-[#1C130B] hover:bg-[#C5A880]/20 flex items-center justify-center gap-2 transition-colors order-2 sm:order-1"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Back
        </button>
        <button
          onClick={onNext}
          className="w-full sm:w-auto bg-[#1C130B] hover:bg-[#8A5836] text-[#FAF8F5] px-6 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold font-['Plus_Jakarta_Sans'] text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-colors duration-300 shadow-xl order-1 sm:order-2"
        >
          Final Review & Book
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </motion.div>
  );
}
