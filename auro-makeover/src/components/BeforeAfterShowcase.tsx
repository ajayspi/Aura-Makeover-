"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  SlidersHorizontal,
  Clock,
  ShieldCheck,
  Award,
  ArrowRight,
  Layers,
  Home,
  CheckCircle2,
} from 'lucide-react';

interface RoomData {
  id: string;
  name: string;
  tagline: string;
  beforeBadge: string;
  beforeFinish: string;
  beforeFeatures: string[];
  afterBadge: string;
  afterFinish: string;
  afterFeatures: string[];
}

const ROOMS: RoomData[] = [
  {
    id: "living-room",
    name: "Living Room",
    tagline: "Acoustic Fluted Walnut & Concealed 3000K Backlighting",
    beforeBadge: "Builder Finish (Bare Distemper)",
    beforeFinish: "Untextured Off-White Distemper",
    beforeFeatures: [
      "Bare builder distemper wall",
      "Harsh ceiling glare & shadows",
      "Acoustically hollow echo",
      "Visible plaster unevenness",
    ],
    afterBadge: "After AuroMakeover (Luxury Suite)",
    afterFinish: "Acoustic Louvers + Architectural Ambient Glow",
    afterFeatures: [
      "Smoked walnut acoustic louvers",
      "Integrated 3000K warm LED backlight",
      "Sound-absorbing PET backing",
      "Installed in 48 hours without dust",
    ],
  },
  {
    id: "bedroom",
    name: "Bedroom",
    tagline: "Heritage Temple Pichwai Silk Mural & Warm Sconce Accents",
    beforeBadge: "Builder Finish (Bare Distemper)",
    beforeFinish: "Cold Putty Coat & Exposed Junctions",
    beforeFeatures: [
      "Flat chalky paint finish",
      "Cold, uninspiring ambiance",
      "Bare electrical conduits",
      "Zero acoustic dampening",
    ],
    afterBadge: "After AuroMakeover (Luxury Suite)",
    afterFinish: "Shrinathji Sacred Lotus on Mineral-Woven Silk",
    afterFeatures: [
      "Authentic Pichwai mineral pigments",
      "Seamless bubble-free silk texture",
      "Warm ambient sconce reflection",
      "2-Year peel-proof German bond",
    ],
  },
];

export default function BeforeAfterShowcase() {
  const [activeRoomId, setActiveRoomId] = useState<string>("living-room");
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeRoom = ROOMS.find((r) => r.id === activeRoomId) || ROOMS[0];

  const handlePointerMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  // Global mouse event listeners for drag smoothness
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      handlePointerMove(e.clientX);
    };

    const onMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, handlePointerMove]);

  const scrollToEstimator = () => {
    document.getElementById('estimator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="transformation"
      className="py-20 md:py-28 px-6 bg-[#FAF8F5] text-[#1C130B] font-['Plus_Jakarta_Sans'] relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-[#8A5836]/10 border border-[#8A5836]/25 text-[#8A5836] text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-4 h-4 text-[#8A5836]" />
            <span>Before & After Transformation</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Syne'] text-[#1C130B] tracking-tight mb-4">
            The AuroMakeover Difference
          </h2>

          <p className="text-base sm:text-lg text-[#1C130B]/75 font-medium leading-relaxed">
            Drag the slider to reveal how we turn blank builder distemper into high-end curated living spaces in 48 hours — with zero civil work and zero dust.
          </p>
        </div>

        {/* Room Switcher Tabs with Animated Pill Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#1C130B]/5 border border-[#C5A880]/30 p-1.5 rounded-2xl inline-flex gap-2 relative">
            {ROOMS.map((room) => {
              const isActive = room.id === activeRoomId;
              return (
                <button
                  key={room.id}
                  onClick={() => setActiveRoomId(room.id)}
                  className={`relative px-5 sm:px-7 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-2 ${
                    isActive ? 'text-[#FAF8F5]' : 'text-[#1C130B]/70 hover:text-[#1C130B]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeRoomPill"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute inset-0 bg-[#1C130B] rounded-2xl shadow-md -z-10"
                    />
                  )}
                  {room.id === "living-room" ? (
                    <Home className="w-4 h-4" />
                  ) : (
                    <Layers className="w-4 h-4" />
                  )}
                  <span>{room.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Room Spec Subtitle */}
        <div className="text-center mb-6">
          <span className="text-xs sm:text-sm font-semibold text-[#8A5836] bg-[#8A5836]/10 px-4 py-1.5 rounded-2xl border border-[#8A5836]/20 inline-block">
            {activeRoom.tagline}
          </span>
        </div>

        {/* Interactive Draggable Slider Container */}
        <div
          ref={containerRef}
          tabIndex={0}
          role="slider"
          aria-label="Interactive before and after comparison slider"
          aria-valuenow={Math.round(sliderPosition)}
          aria-valuemin={0}
          aria-valuemax={100}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              setSliderPosition((prev) => Math.max(0, prev - 3));
            } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              setSliderPosition((prev) => Math.min(100, prev + 3));
            }
          }}
          onMouseDown={(e) => {
            setIsDragging(true);
            handlePointerMove(e.clientX);
          }}
          onTouchStart={(e) => {
            setIsDragging(true);
            if (e.touches[0]) handlePointerMove(e.touches[0].clientX);
          }}
          onTouchMove={(e) => {
            if (e.touches[0]) handlePointerMove(e.touches[0].clientX);
          }}
          onTouchEnd={() => setIsDragging(false)}
          className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl border border-[#C5A880]/30 select-none touch-none cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
        >
          {/* BASE LAYER: "AFTER" (Warm Luxury Suite) */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#1C130B] via-[#361F14] to-[#8A5836] flex flex-col justify-between p-6 sm:p-10 overflow-hidden">
            {/* Background Luxury Illumination & Louvers Graphics */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              {activeRoomId === "living-room" ? (
                /* Acoustic Louver Slats Graphic */
                <div className="w-full h-full flex justify-end">
                  <div className="w-2/3 h-full flex gap-3 sm:gap-4 pr-6 opacity-30">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-b from-[#C5A880] via-[#8A5836] to-[#1C130B] rounded-2xl shadow-inner border-r border-[#FAF8F5]/10"
                      />
                    ))}
                  </div>
                </div>
              ) : (
                /* Heritage Pichwai Decorative Shimmer Graphic */
                <div className="w-full h-full flex items-center justify-end pr-8 sm:pr-16">
                  <div className="w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-[#C5A880]/20 blur-[80px]" />
                  <div className="absolute right-12 top-1/2 -translate-y-1/2 w-48 sm:w-72 h-48 sm:h-72 border border-[#C5A880]/30 rounded-3xl rotate-12 flex items-center justify-center">
                    <div className="w-36 sm:w-56 h-36 sm:h-56 border border-[#C5A880]/40 rounded-3xl -rotate-6" />
                  </div>
                </div>
              )}
            </div>

            {/* Top Right "After" Badge */}
            <div className="relative z-10 flex justify-end">
              <div className="bg-[#C5A880] text-[#1C130B] border border-[#FAF8F5]/30 text-xs sm:text-sm font-bold px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-[#1C130B]" />
                <span>{activeRoom.afterBadge}</span>
              </div>
            </div>

            {/* Bottom Right "After" Specifications */}
            <div className="relative z-10 text-right max-w-sm ml-auto">
              <div className="text-xs font-semibold uppercase tracking-widest text-[#C5A880] mb-1">
                Curated Luxury Finish
              </div>
              <h4 className="text-lg sm:text-2xl font-black font-['Syne'] text-[#FAF8F5] mb-2 leading-tight">
                {activeRoom.afterFinish}
              </h4>
              <div className="flex flex-wrap justify-end gap-2 text-[11px] sm:text-xs text-[#FAF8F5]/80 font-medium">
                {activeRoom.afterFeatures.slice(0, 2).map((feat, idx) => (
                  <span
                    key={idx}
                    className="bg-[#1C130B]/60 border border-[#C5A880]/30 px-3 py-1 rounded-2xl backdrop-blur-sm flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>{feat}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CLIPPED TOP LAYER: "BEFORE" (Builder Finish Bare Distemper) */}
          <div
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#E7E5E4] via-[#D6D3D1] to-[#A8A29E] flex flex-col justify-between p-6 sm:p-10 overflow-hidden"
          >
            {/* Distemper & Wireframe Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-25">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern
                    id="grid-pattern"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="#1C130B"
                      strokeWidth="0.8"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />
              </svg>
              {/* Unfinished Wall Conduits Wireframe */}
              <div className="absolute top-1/4 left-10 w-24 h-32 border-2 border-dashed border-[#1C130B]/40 rounded-2xl" />
              <div className="absolute bottom-1/3 left-1/4 w-12 h-12 border border-[#1C130B]/50 rounded-2xl" />
            </div>

            {/* Top Left "Before" Badge */}
            <div className="relative z-10 flex justify-start">
              <div className="bg-[#1C130B]/85 text-[#FAF8F5] border border-[#FAF8F5]/20 text-xs sm:text-sm font-bold px-4 py-2 rounded-2xl backdrop-blur-md shadow-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#8A5836] animate-pulse" />
                <span>{activeRoom.beforeBadge}</span>
              </div>
            </div>

            {/* Bottom Left "Before" Specifications */}
            <div className="relative z-10 text-left max-w-sm mr-auto">
              <div className="text-xs font-semibold uppercase tracking-widest text-[#1C130B]/70 mb-1">
                Typical Builder Handover
              </div>
              <h4 className="text-lg sm:text-2xl font-black font-['Syne'] text-[#1C130B] mb-2 leading-tight">
                {activeRoom.beforeFinish}
              </h4>
              <div className="flex flex-wrap gap-2 text-[11px] sm:text-xs text-[#1C130B]/80 font-medium">
                {activeRoom.beforeFeatures.slice(0, 2).map((feat, idx) => (
                  <span
                    key={idx}
                    className="bg-[#FAF8F5]/75 border border-[#1C130B]/15 px-3 py-1 rounded-2xl backdrop-blur-sm"
                  >
                    ✕ {feat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Draggable Divider Line & Knob Handle */}
          <div
            style={{ left: `${sliderPosition}%` }}
            className="absolute top-0 bottom-0 w-1 bg-[#FAF8F5] shadow-[0_0_20px_rgba(197,168,128,0.9)] z-30 pointer-events-none -translate-x-1/2"
          >
            {/* Grab Handle */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#1C130B] border-2 border-[#C5A880] text-[#C5A880] flex items-center justify-center shadow-2xl cursor-ew-resize transition-transform pointer-events-auto ${
                isDragging ? 'scale-115 ring-4 ring-[#C5A880]/30' : 'hover:scale-105'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5 text-[#C5A880]" />
            </div>
          </div>
        </div>

        {/* Drag Hint */}
        <div className="flex items-center justify-center gap-2 mt-4 text-xs font-semibold text-[#1C130B]/60">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#8A5836]" />
          <span>Click & drag slider or use left/right arrow keys to compare</span>
        </div>

        {/* 3 Transformation Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-[#FAF8F5] border border-[#C5A880]/30 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-2xl bg-[#C5A880]/20 flex items-center justify-center text-[#8A5836] mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-['Syne'] text-[#1C130B] mb-1">
              Installed in 48 Hours
            </h3>
            <p className="text-xs sm:text-sm text-[#1C130B]/70 leading-relaxed">
              From precision 3D digital measurement to final QA hand-over, completed in a single weekend.
            </p>
          </div>

          <div className="bg-[#FAF8F5] border border-[#C5A880]/30 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-2xl bg-[#8A5836]/20 flex items-center justify-center text-[#8A5836] mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-['Syne'] text-[#1C130B] mb-1">
              Zero Civil Work & Zero Dust
            </h3>
            <p className="text-xs sm:text-sm text-[#1C130B]/70 leading-relaxed">
              No wall chipping, no wet plaster, no debris. 100% compliant with gated high-rise HOA bylaws.
            </p>
          </div>

          <div className="bg-[#FAF8F5] border border-[#C5A880]/30 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-2xl bg-[#C5A880]/20 flex items-center justify-center text-[#8A5836] mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-['Syne'] text-[#1C130B] mb-1">
              2-Year Complete Warranty
            </h3>
            <p className="text-xs sm:text-sm text-[#1C130B]/70 leading-relaxed">
              Guaranteed peel-proof, bubble-free German polymer bond with instant mobile QA support.
            </p>
          </div>
        </div>

        {/* CTA to Estimator */}
        <div className="text-center mt-12">
          <button
            onClick={scrollToEstimator}
            className="inline-flex items-center gap-2 bg-[#1C130B] hover:bg-[#8A5836] text-[#FAF8F5] px-8 py-4 rounded-2xl font-bold text-base sm:text-lg transition-all shadow-xl active:scale-95 cursor-pointer"
          >
            <span>Get Instant Quote for Your Flat</span>
            <ArrowRight className="w-5 h-5 text-[#C5A880]" />
          </button>
        </div>
      </div>
    </section>
  );
}
