"use client";

import React, { useState, useMemo } from 'react';
import { 
  Sun, 
  Compass, 
  Wifi, 
  Lightbulb, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Flame,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { analyzeSolarLux } from '@/lib/engines';

export type SmartProtocol = 'Matter (Apple/Google)' | 'Zigbee 3.0' | 'Somfy RTS';

export default function SmartLightingConfigurator() {
  const [windowCount, setWindowCount] = useState<number>(2);
  const [compassAngle, setCompassAngle] = useState<number>(270); // Default West
  const [floorNumber, setFloorNumber] = useState<number>(14); // High rise default
  const [protocol, setProtocol] = useState<SmartProtocol>('Matter (Apple/Google)');
  const [hasCoveLighting, setHasCoveLighting] = useState<boolean>(true);
  const [coveLengthFt, setCoveLengthFt] = useState<number>(24);

  // Run pure solar lux engine
  const solarAnalysis = useMemo(() => {
    return analyzeSolarLux({
      compassAngleDegrees: compassAngle,
      floorNumber: floorNumber,
    });
  }, [compassAngle, floorNumber]);

  // Compute pricing
  const motorCost = windowCount * 15000;
  const coveCost = hasCoveLighting ? coveLengthFt * 450 : 0; // ₹450/running ft for warm architectural extrusion
  const subtotal = motorCost + coveCost;
  const gst = subtotal * 0.18;
  const totalRetail = subtotal + gst;

  const scrollToEstimator = () => {
    // Prefill estimator with smart add-on state
    window.dispatchEvent(new CustomEvent('auro:estimator-prefill', {
      detail: { tier: 'luxury' }
    }));
    document.getElementById('estimator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="smart-lighting" className="py-24 sm:py-32 px-6 bg-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#8A5836]/10 text-[#8A5836] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest font-['Plus_Jakarta_Sans'] mb-4">
            <Wifi className="w-3.5 h-3.5" />
            Matter & Zigbee Integrated Shading
          </div>
          <h2 className="font-['Syne'] text-4xl sm:text-5xl font-black text-[#1C130B] mb-6">
            Smart Shading & Cove Lighting Configurator
          </h2>
          <p className="font-['Plus_Jakarta_Sans'] text-[#1C130B]/70 text-lg max-w-2xl mx-auto">
            Engineered for high-rise glass balconies and sun-drenched West penthouses. Solar lux optimization paired with zero-false-ceiling 3000K warm ambient cove extrusions.
          </p>
        </div>

        {/* Configurator Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-[#C5A880]/30 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Controls (8 cols) */}
            <div className="lg:col-span-7 space-y-8 font-['Plus_Jakarta_Sans']">
              
              {/* Window Count Stepper */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-bold text-[#8A5836] uppercase tracking-wider block">
                    1. Number of Motorized Windows:
                  </label>
                  <span className="font-['Syne'] font-black text-lg text-[#1C130B]">
                    {windowCount} {windowCount === 1 ? 'Window' : 'Windows'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setWindowCount(Math.max(1, windowCount - 1))}
                    className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#C5A880]/30 font-bold text-lg text-[#1C130B] hover:bg-[#C5A880] hover:text-[#1C130B] transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={windowCount}
                    onChange={(e) => setWindowCount(Number(e.target.value))}
                    aria-label="Number of Motorized Windows"
                    className="w-full accent-[#C5A880] cursor-pointer h-2 bg-[#FAF8F5] rounded-lg"
                  />
                  <button
                    onClick={() => setWindowCount(Math.min(6, windowCount + 1))}
                    className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#C5A880]/30 font-bold text-lg text-[#1C130B] hover:bg-[#C5A880] hover:text-[#1C130B] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Sun & Orientation Selector */}
              <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#C5A880]/20 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#8A5836] uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-[#C5A880]" />
                    2. Sun Orientation & Building Height:
                  </span>
                  <span className="text-xs font-bold text-[#1C130B]">
                    Floor {floorNumber} • {compassAngle}° ({compassAngle === 270 ? 'West' : compassAngle === 90 ? 'East' : compassAngle === 180 ? 'South' : 'North'})
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'North (0°)', angle: 0 },
                    { label: 'East (90°)', angle: 90 },
                    { label: 'South (180°)', angle: 180 },
                    { label: 'West (270°)', angle: 270 },
                  ].map((dir) => (
                    <button
                      key={dir.angle}
                      onClick={() => setCompassAngle(dir.angle)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                        compassAngle === dir.angle
                          ? 'bg-[#1C130B] text-[#C5A880] shadow-sm'
                          : 'bg-white text-[#1C130B]/70 hover:text-[#1C130B] border border-[#C5A880]/20'
                      }`}
                    >
                      {dir.label}
                    </button>
                  ))}
                </div>

                {/* Floor slider */}
                <div>
                  <div className="flex justify-between text-xs text-[#1C130B]/60 mb-1">
                    <span>Low Floor (1-9)</span>
                    <span>High-Rise Exposure (10-45th Floor)</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="45"
                    value={floorNumber}
                    onChange={(e) => setFloorNumber(Number(e.target.value))}
                    aria-label="Floor Number"
                    className="w-full accent-[#C5A880] cursor-pointer h-2 bg-white rounded-lg"
                  />
                </div>
              </div>

              {/* Protocol Selector */}
              <div>
                <label className="text-xs font-bold text-[#8A5836] uppercase tracking-wider block mb-2">
                  3. Wireless Smart Home Protocol:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(['Matter (Apple/Google)', 'Zigbee 3.0', 'Somfy RTS'] as SmartProtocol[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setProtocol(p)}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                        protocol === p
                          ? 'bg-[#1C130B] text-[#C5A880] border-[#C5A880] shadow-md'
                          : 'bg-[#FAF8F5] text-[#1C130B]/70 border-[#C5A880]/20 hover:border-[#C5A880]/50'
                      }`}
                    >
                      <span>{p}</span>
                      {protocol === p && <CheckCircle2 className="w-4 h-4 text-[#C5A880]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Zero-Ceiling Cove Lighting Extrusion */}
              <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#C5A880]/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-[#C5A880]" />
                    <span className="font-bold text-xs sm:text-sm text-[#1C130B]">
                      Zero-Ceiling 3000K Warm LED Cove Extrusion
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasCoveLighting}
                    onChange={(e) => setHasCoveLighting(e.target.checked)}
                    aria-label="Zero-Ceiling 3000K Warm LED Cove Extrusion"
                    className="w-5 h-5 accent-[#C5A880] rounded cursor-pointer"
                  />
                </div>
                <p className="text-xs text-[#1C130B]/70 mb-3">
                  Surface-mounted architectural aluminum channel with diffused silicone lens. Requires no false ceiling or height loss.
                </p>
                {hasCoveLighting && (
                  <div className="flex items-center justify-between text-xs pt-3 border-t border-[#C5A880]/20">
                    <span className="text-[#8A5836] font-bold">Linear Length: {coveLengthFt} Running Feet</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setCoveLengthFt(Math.max(10, coveLengthFt - 4))}
                        className="px-2.5 py-1 bg-white rounded border border-[#C5A880]/30 font-bold"
                      >
                        -
                      </button>
                      <button 
                        onClick={() => setCoveLengthFt(Math.min(60, coveLengthFt + 4))}
                        className="px-2.5 py-1 bg-white rounded border border-[#C5A880]/30 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Right Summary & Solar Intelligence (5 cols) */}
            <div className="lg:col-span-5 bg-[#1C130B] text-[#FAF8F5] p-6 sm:p-8 rounded-3xl border border-[#C5A880]/40 flex flex-col justify-between shadow-2xl">
              <div>
                
                {/* Solar Lux Detection Card */}
                <div className={`p-4 rounded-2xl border mb-6 ${
                  solarAnalysis.highSolarHeatRadiation
                    ? 'bg-amber-950/40 border-[#C5A880] text-[#FAF8F5]'
                    : 'bg-[#FAF8F5]/10 border-[#FAF8F5]/20 text-[#FAF8F5]'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {solarAnalysis.highSolarHeatRadiation ? (
                      <Flame className="w-5 h-5 text-[#C5A880]" />
                    ) : (
                      <Sun className="w-5 h-5 text-[#C5A880]" />
                    )}
                    <span className="font-['Syne'] font-bold text-sm text-[#C5A880]">
                      {solarAnalysis.highSolarHeatRadiation ? 'High Solar Radiation Flagged' : 'Standard Sun Exposure'}
                    </span>
                  </div>
                  <p className="text-xs text-[#FAF8F5]/80 font-['Plus_Jakarta_Sans'] mb-2">
                    {solarAnalysis.highSolarHeatRadiation
                      ? `14th+ floor West/SW exposure in Hyderabad generates up to 680 W/m² ambient radiant heat.`
                      : `Orientation receives balanced indirect daylight.`}
                  </p>
                  <div className="text-xs bg-[#1C130B] px-3 py-1.5 rounded-xl border border-[#C5A880]/30 inline-block font-bold text-[#C5A880]">
                    Recommended: {solarAnalysis.recommendedBlindType}
                  </div>
                </div>

                {/* Ledger Breakdown */}
                <h4 className="font-['Syne'] font-bold text-lg text-[#FAF8F5] mb-4 pb-2 border-b border-[#FAF8F5]/10">
                  Smart Shading Ledger
                </h4>
                <div className="space-y-2.5 text-xs font-['Plus_Jakarta_Sans'] mb-6">
                  <div className="flex justify-between text-[#FAF8F5]/70">
                    <span>{windowCount} × Motorized Motors ({protocol}):</span>
                    <span className="font-semibold text-[#FAF8F5]">₹{motorCost.toLocaleString('en-IN')}</span>
                  </div>
                  {hasCoveLighting && (
                    <div className="flex justify-between text-[#FAF8F5]/70">
                      <span>{coveLengthFt}ft Architectural 3000K Cove LED:</span>
                      <span className="font-semibold text-[#FAF8F5]">₹{coveCost.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#FAF8F5]/70">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-[#FAF8F5]">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[#FAF8F5]/70">
                    <span>Statutory GST (18%):</span>
                    <span className="font-semibold text-[#FAF8F5]">₹{Math.round(gst).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-[#C5A880] pt-2 border-t border-[#FAF8F5]/10">
                    <span>Total Upgrade:</span>
                    <span>₹{Math.round(totalRetail).toLocaleString('en-IN')}</span>
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <div>
                <button
                  onClick={scrollToEstimator}
                  className="w-full bg-[#C5A880] hover:bg-[#d5ba94] text-[#1C130B] font-bold font-['Plus_Jakarta_Sans'] py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl text-sm"
                >
                  <span>Apply to Full Room Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
