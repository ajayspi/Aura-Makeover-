"use client";

import React from 'react';
import { MapPin } from 'lucide-react';

interface RegionSelectorProps {
  selectedTier: 'tier1' | 'tier2' | 'tier3';
  onChange: (tier: 'tier1' | 'tier2' | 'tier3') => void;
}

export default function RegionSelector({ selectedTier, onChange }: RegionSelectorProps) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-6 font-['Plus_Jakarta_Sans']">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="text-[#8A5836] w-4 h-4" />
        <h3 className="text-sm font-bold text-gray-700">Select Region for Accurate Pricing</h3>
      </div>
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
        <button
          onClick={() => onChange('tier1')}
          className={`flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedTier === 'tier1' ? 'bg-[#1C130B] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Metros (Tier 1)
        </button>
        <button
          onClick={() => onChange('tier2')}
          className={`flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedTier === 'tier2' ? 'bg-[#1C130B] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Emerging (Tier 2)
        </button>
        <button
          onClick={() => onChange('tier3')}
          className={`flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedTier === 'tier3' ? 'bg-[#1C130B] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Towns (Tier 3)
        </button>
      </div>
    </div>
  );
}
