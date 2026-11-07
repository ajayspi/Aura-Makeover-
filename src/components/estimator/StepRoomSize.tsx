"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Ruler, ArrowRight, Building2, Sparkles } from 'lucide-react';
import { RollNestingOutput } from '@/lib/engines';
import { Dispatch, SetStateAction } from 'react';
import { Slider } from '@/components/ui/slider';

const ROOM_PRESETS = [
  { label: 'Accent Wall', width: 10, height: 10 },
  { label: 'Master Bedroom', width: 14, height: 10 },
  { label: 'Living Lounge', width: 18, height: 10 },
  { label: 'Grand Foyer', width: 12, height: 12 },
];

const SOCIETY_FLOORPLANS = [
  { society: 'My Home Bhooja', plan: '3BHK Living Accent', width: 14, height: 10, unit: '3BHK 2680 sft' },
  { society: 'Rajapushpa Provincia', plan: '3BHK Master Bed', width: 13, height: 10, unit: '3BHK 2350 sft' },
  { society: 'Prestige High Fields', plan: '2.5BHK Lounge Wall', width: 12, height: 10, unit: '2.5BHK 1748 sft' },
  { society: 'Jayabheri The Peak', plan: '4BHK Grand Foyer', width: 16, height: 11, unit: '4BHK 4100 sft' },
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
  const [presetTab, setPresetTab] = useState<'standard' | 'society'>('standard');

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

      {/* Preset Mode Tabs */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#8A5836] font-['Plus_Jakarta_Sans']">
            Quick Sizing Presets
          </label>
          <div className="flex items-center bg-[#FAF8F5] p-1 rounded-xl border border-[#C5A880]/30 text-xs font-['Plus_Jakarta_Sans']">
            <button
              type="button"
              onClick={() => setPresetTab('standard')}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                presetTab === 'standard'
                  ? 'bg-[#1C130B] text-[#C5A880] shadow-sm'
                  : 'text-[#1C130B]/60 hover:text-[#1C130B]'
              }`}
            >
              Standard Rooms
            </button>
            <button
              type="button"
              onClick={() => setPresetTab('society')}
              className={`px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors ${
                presetTab === 'society'
                  ? 'bg-[#1C130B] text-[#C5A880] shadow-sm'
                  : 'text-[#1C130B]/60 hover:text-[#1C130B]'
              }`}
            >
              <Building2 className="w-3 h-3 text-[#C5A880]" />
              Gated Society Floorplans
            </button>
          </div>
        </div>

        {presetTab === 'standard' ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {ROOM_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setWidthFt(preset.width);
                  setHeightFt(preset.height);
                }}
                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl text-left border transition-all duration-300 font-['Plus_Jakarta_Sans'] cursor-pointer ${
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {SOCIETY_FLOORPLANS.map((item) => (
              <button
                key={item.society + item.plan}
                type="button"
                onClick={() => {
                  setWidthFt(item.width);
                  setHeightFt(item.height);
                }}
                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl text-left border transition-all duration-300 font-['Plus_Jakarta_Sans'] cursor-pointer relative overflow-hidden ${
                  widthFt === item.width && heightFt === item.height
                    ? 'bg-[#1C130B] text-[#C5A880] border-[#1C130B] shadow-lg'
                    : 'bg-white border-[#C5A880]/30 text-[#1C130B] hover:border-[#C5A880]'
                }`}
              >
                <div className="flex items-center gap-1.5 text-[9px] text-[#8A5836] font-bold uppercase tracking-wider mb-0.5">
                  <Sparkles className="w-2.5 h-2.5" />
                  {item.society}
                </div>
                <div className="font-bold text-xs sm:text-sm mb-0.5 line-clamp-1">{item.plan}</div>
                <div className="opacity-75 text-[10px]">
                  {item.width}ft × {item.height}ft ({item.unit})
                </div>
              </button>
            ))}
          </div>
        )}
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
          <div className="py-2">
            <Slider
              min={5}
              max={30}
              step={1}
              value={[widthFt]}
              onValueChange={([val]) => setWidthFt(val)}
              aria-label="Wall Width (Horizontal)"
            />
          </div>
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
          <div className="py-2">
            <Slider
              min={8}
              max={15}
              step={1}
              value={[heightFt]}
              onValueChange={([val]) => setHeightFt(val)}
              aria-label="Wall Height (Vertical Slab)"
            />
          </div>
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
          className="w-full sm:w-auto bg-[#1C130B] hover:bg-[#8A5836] text-[#FAF8F5] px-6 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold font-['Plus_Jakarta_Sans'] text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-colors duration-300 shadow-xl cursor-pointer"
        >
          Next: Choose Finish Tier
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </motion.div>
  );
}
