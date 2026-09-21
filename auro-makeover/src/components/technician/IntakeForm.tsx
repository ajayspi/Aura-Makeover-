"use client";

import React, { useState } from 'react';
import { Camera, Droplets, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function IntakeForm() {
  const [moisture, setMoisture] = useState<number>(0);
  const [dyeLot, setDyeLot] = useState('');
  const [photosUploaded, setPhotosUploaded] = useState(0);

  const isMoistureHigh = moisture > 12;

  const handleSignOff = () => {
    alert("QA Passed. Triggering 30% Escrow Release and 2-Year Warranty Activation.");
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-50 min-h-screen text-gray-900 font-['Plus_Jakarta_Sans'] pb-20">

      {/* Header */}
      <div className="bg-[#8A5836] text-white p-6 pt-12 shadow-md">
        <h1 className="text-2xl font-bold font-['Syne']">TechOps Workspace</h1>
        <p className="text-sm opacity-90">Site: My Home Bhooja, Tower A, 1402</p>
      </div>

      <div className="p-6 space-y-8">

        {/* Step 1: Material Verification */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-[#1C130B] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</div>
            <h2 className="font-bold text-lg font-['Syne']">Dye-Lot Scan</h2>
          </div>
          <p className="text-sm text-gray-500 mb-3">Scan roll QR or enter serial to verify batch match.</p>
          <input
            type="text"
            placeholder="e.g. DL-24-B8X"
            value={dyeLot}
            onChange={(e) => setDyeLot(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#8A5836] font-mono uppercase"
          />
        </div>

        {/* Step 2: Wall QA & Moisture */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-[#1C130B] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</div>
            <h2 className="font-bold text-lg font-['Syne']">Moisture Pin Check</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Reading (%)</label>
              <input
                type="number"
                value={moisture}
                onChange={(e) => setMoisture(Number(e.target.value))}
                className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#8A5836] text-lg font-bold"
              />
            </div>
            <Droplets className={`w-10 h-10 ${isMoistureHigh ? 'text-red-500' : 'text-blue-500'}`} />
          </div>

          {isMoistureHigh && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800 font-medium">
                Moisture &gt;12%. Anti-fungal moisture blocker primer is MANDATORY before proceeding.
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Installation Sign-Off */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-[#1C130B] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">3</div>
            <h2 className="font-bold text-lg font-['Syne']">QA Sign-Off</h2>
          </div>

          <div className="space-y-3 mb-6">
            <button
              onClick={() => setPhotosUploaded(p => p + 1)}
              className="w-full border-2 border-dashed border-gray-300 p-4 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-[#8A5836] hover:bg-[#8A5836]/5 transition-colors"
            >
              <Camera className="w-6 h-6" />
              <span className="text-sm font-medium">Upload Seam & Trim Photos ({photosUploaded}/3)</span>
            </button>
          </div>

          <button
            disabled={photosUploaded < 3 || dyeLot === '' || isMoistureHigh}
            onClick={handleSignOff}
            className="w-full bg-[#1C130B] disabled:bg-gray-300 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <ShieldCheck className="w-5 h-5" />
            Complete & Activate Warranty
          </button>
        </div>

      </div>
    </div>
  );
}
