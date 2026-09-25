"use client";

import { motion } from 'framer-motion';
import { Ruler, ArrowRight } from 'lucide-react';
import { RollNestingOutput } from '@/lib/engines';
import { Dispatch, SetStateAction } from 'react';

const ROOM_PRESETS = [
  { label: 'Accent Wall', width: 10, height: 10 },
  { label: 'Master Bedroom', width: 14, height: 10 },
  { label: 'Living Lounge', width: 18, height: 10 },
  { label: 'Grand Foyer', width: 12, height: 12 },
];

export default function StepRoomSize({
  widthFt,
  setWidthFt,
  heightFt,
  setHeightFt,
  exactWallArea,
  nesting,
  pricingSqft,
  onNext,
}: {
  widthFt: number;
  setWidthFt: Dispatch<SetStateAction<number>>;
  heightFt: number;
  setHeightFt: Dispatch<SetStateAction<number>>;
  exactWallArea: number;
  nesting: RollNestingOutput;
  pricingSqft: number;
  onNext: () => void;
}) {
  return (
    <motion.div
      key="step-1"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 sm:space-y-8"
    >
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Ruler className="text-[#8A5836] w-5 h-5 sm:w-6 sm:h-6" />
          <h4 className="text-xl sm:text-2xl font-bold font-['Syne'] text-[#1C130B]">
            Step 1: Set Your Wall Dimensions
          </h4>
        </div>
        <p className="text-xs sm:text-sm text-[#1C130B]/70 font-['Plus_Jakarta_Sans'] leading-relaxed">
          Adjust the sliders below to your wall measurement. Our algorithm automatically calculates vertical drops and adds an 11% safety buffer for seamless luxury pattern matching.
        </p>
      </div>

      {/* Quick Presets */}
      <div>
        <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#8A5836] block mb-3 font-['Plus_Jakarta_Sans']">
          Luxury Presets
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {ROOM_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setWidthFt(preset.width);
                setHeightFt(preset.height);
              }}
              className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl text-left border transition-all duration-300 font-['Plus_Jakarta_Sans'] ${
                widthFt === preset.width && heightFt === preset.height
                  ? 'bg-[#1C130B] text-[#C5A880] border-[#1C130B] shadow-lg'
                  : 'bg-white border-[#C5A880]/30 text-[#1C130B] hover:border-[#C5A880]'
              }`}
            >
              <div className="font-bold text-xs sm:text-sm mb-1 line-clamp-1">{preset.label}</div>
              <div className="opacity-80 text-[10px] sm:text-xs">
                {preset.width}ft × {preset.height}ft
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sliders Container */}
      <div className="bg-white border-2 border-[#C5A880]/30 p-5 sm:p-8 rounded-2xl sm:rounded-3xl space-y-6 sm:space-y-8 shadow-sm">
        {/* Width Slider */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-xs sm:text-sm font-bold text-[#1C130B] uppercase tracking-wider flex items-center gap-1 sm:gap-2 font-['Plus_Jakarta_Sans']">
              Wall Width
              <span className="hidden sm:inline text-xs font-normal text-[#1C130B]/50 tracking-normal">(Horizontal)</span>
            </label>
            <span className="text-base sm:text-lg font-black font-['Syne'] text-[#8A5836] bg-[#FAF8F5] px-3 sm:px-4 py-1.5 rounded-lg border border-[#C5A880]/20">
              {widthFt} ft
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={30}
            value={widthFt}
            onChange={(e) => setWidthFt(Number(e.target.value))}
            className="w-full h-2.5 sm:h-3 bg-[#FAF8F5] rounded-full appearance-none cursor-pointer accent-[#8A5836]"
          />
          <div className="flex justify-between text-[9px] sm:text-[11px] text-[#1C130B]/40 font-bold px-1 font-['Plus_Jakarta_Sans'] uppercase tracking-wider">
            <span>5 ft</span>
            <span>15 ft</span>
            <span>30 ft</span>
          </div>
        </div>

        {/* Height Slider */}
        <div className="space-y-3 sm:space-y-4 pt-4 border-t border-[#C5A880]/20">
          <div className="flex justify-between items-center">
            <label className="text-xs sm:text-sm font-bold text-[#1C130B] uppercase tracking-wider flex items-center gap-1 sm:gap-2 font-['Plus_Jakarta_Sans']">
              Wall Height
              <span className="hidden sm:inline text-xs font-normal text-[#1C130B]/50 tracking-normal">(Vertical Slab)</span>
            </label>
            <span className="text-base sm:text-lg font-black font-['Syne'] text-[#8A5836] bg-[#FAF8F5] px-3 sm:px-4 py-1.5 rounded-lg border border-[#C5A880]/20">
              {heightFt} ft
            </span>
          </div>
          <input
            type="range"
            min={8}
            max={15}
            value={heightFt}
            onChange={(e) => setHeightFt(Number(e.target.value))}
            className="w-full h-2.5 sm:h-3 bg-[#FAF8F5] rounded-full appearance-none cursor-pointer accent-[#8A5836]"
          />
          <div className="flex justify-between text-[9px] sm:text-[11px] text-[#1C130B]/40 font-bold px-1 font-['Plus_Jakarta_Sans'] uppercase tracking-wider">
            <span>8 ft</span>
            <span>10 ft</span>
            <span>15 ft</span>
          </div>
        </div>
      </div>

      {/* Live Output Feedback Pill Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <div className="bg-white border border-[#C5A880]/40 p-4 sm:p-5 rounded-xl sm:rounded-2xl">
          <div className="text-[9px] sm:text-[10px] font-bold text-[#8A5836] uppercase tracking-widest font-['Plus_Jakarta_Sans']">
            Net Wall Area
          </div>
          <div className="text-xl sm:text-2xl font-bold font-['Syne'] text-[#1C130B] mt-1 sm:mt-2">
            {exactWallArea} <span className="text-xs font-normal font-['Plus_Jakarta_Sans'] text-[#1C130B]/60">sqft</span>
          </div>
        </div>

        <div className="bg-white border border-[#C5A880]/40 p-4 sm:p-5 rounded-xl sm:rounded-2xl">
          <div className="text-[9px] sm:text-[10px] font-bold text-[#8A5836] uppercase tracking-widest font-['Plus_Jakarta_Sans']">
            Vertical Drops
          </div>
          <div className="text-xl sm:text-2xl font-bold font-['Syne'] text-[#1C130B] mt-1 sm:mt-2">
            {nesting.totalVerticalDrops} <span className="text-xs font-normal font-['Plus_Jakarta_Sans'] text-[#1C130B]/60">strips</span>
          </div>
        </div>

        <div className="bg-white border border-[#C5A880]/40 p-4 sm:p-5 rounded-xl sm:rounded-2xl">
          <div className="text-[9px] sm:text-[10px] font-bold text-[#8A5836] uppercase tracking-widest font-['Plus_Jakarta_Sans']">
            Fabric Length
          </div>
          <div className="text-xl sm:text-2xl font-bold font-['Syne'] text-[#1C130B] mt-1 sm:mt-2">
            {nesting.requiredContinuousMeters.toFixed(1)} <span className="text-xs font-normal font-['Plus_Jakarta_Sans'] text-[#1C130B]/60">m</span>
          </div>
        </div>

        <div className="bg-[#1C130B] border border-[#C5A880]/40 p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-[0_4px_15px_rgba(28,19,11,0.2)]">
          <div className="text-[9px] sm:text-[10px] font-bold text-[#C5A880] uppercase tracking-widest font-['Plus_Jakarta_Sans']">
            Billed (11% Buffer)
          </div>
          <div className="text-xl sm:text-2xl font-bold font-['Syne'] text-[#FAF8F5] mt-1 sm:mt-2">
            {Math.round(pricingSqft)} <span className="text-xs font-normal font-['Plus_Jakarta_Sans'] text-[#FAF8F5]/60">sqft</span>
          </div>
        </div>
      </div>

      {/* Step 1 Next Button */}
      <div className="pt-4 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="w-full sm:w-auto bg-[#1C130B] hover:bg-[#8A5836] text-[#FAF8F5] px-6 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold font-['Plus_Jakarta_Sans'] text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-colors duration-300 shadow-xl"
        >
          Next: Choose Finish Tier
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </motion.div>
  );
}
