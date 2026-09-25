"use client";

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CityConfig } from '@/lib/cities';

interface BeforeAfterShowcaseProps {
  city?: CityConfig;
}

const DEFAULT_ROOMS = [
  {
    id: 'living',
    label: 'Living Room',
    before: '/images/before.jpg',
    after: '/images/after.jpg',
    caption: 'Acoustic fluted walnut louvers + botanical wallpaper',
  },
  {
    id: 'bedroom',
    label: 'Bedroom',
    before: '/images/before.jpg',
    after: '/images/neoclassical.jpg',
    caption: 'Neo-classical moulding panels + concealed lighting',
  },
];

export default function BeforeAfterShowcase({ city }: BeforeAfterShowcaseProps) {
  const ROOMS = city?.societies?.length 
    ? [
        {
          id: 'living',
          label: 'Living Room',
          before: '/images/before.jpg',
          after: '/images/after.jpg',
          caption: `Acoustic fluted walnut louvers + botanical wallpaper in ${city.name}`,
        },
        {
          id: 'bedroom',
          label: 'Bedroom',
          before: '/images/before.jpg',
          after: '/images/neoclassical.jpg',
          caption: `Neo-classical moulding panels + concealed lighting in ${city.name}`,
        },
      ]
    : DEFAULT_ROOMS;

  const [activeRoom, setActiveRoom] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const room = ROOMS[activeRoom];

  const updateSlider = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateSlider(e.clientX);
  }, [updateSlider]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updateSlider(e.clientX);
  }, [updateSlider]);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const scrollToEstimator = () => {
    document.getElementById('estimator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="transformation" className="py-24 sm:py-32 px-6 bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto">
        {/* Section header — minimal */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mb-12"
        >
          <p className="text-[#8A5836] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Before & after
          </p>
          <h2 className="font-['Syne'] text-3xl sm:text-4xl font-bold text-[#1C130B] tracking-[-0.02em] leading-[1.15] mb-4">
            The AuroMakeover Difference
          </h2>
          <p className="font-['Plus_Jakarta_Sans'] text-[#1C130B]/60 text-base leading-relaxed">
            Builder finish to luxury suite. <span className="text-[#8A5836] font-semibold">One weekend.</span>
          </p>
        </motion.div>

        {/* Room tabs — slider position is independent of the active room */}
        <div className="flex gap-2 mb-6">
          {ROOMS.map((r, i) => (
            <button
              key={r.id}
              onClick={() => setActiveRoom(i)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                i === activeRoom
                  ? 'bg-[#1C130B] text-[#FAF8F5]'
                  : 'bg-[#1C130B]/5 text-[#1C130B]/60 hover:text-[#1C130B]'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Slider */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden cursor-ew-resize select-none touch-none shadow-xl"
          >
            {/* After image (full background) */}
            <Image
              src={room.after}
              alt={`After AuroMakeover — ${room.label}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
            />

            {/* Before image (clipped) */}
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <Image
                src={room.before}
                alt={`Builder Finish — ${room.label}`}
                fill
                className="object-cover grayscale-[0.35]"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
              {/* Builder distemper tint — flat grey/white builder tones */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-100/40 via-gray-200/25 to-gray-300/40 pointer-events-none" />
              {/* Before label */}
              <div className="absolute top-5 left-5">
                <span className="bg-[#1C130B]/80 text-[#FAF8F5] text-xs font-semibold px-3 py-1.5 rounded-2xl backdrop-blur-sm">
                  Builder Finish
                </span>
              </div>
            </div>

            {/* After label */}
            <div className="absolute top-5 right-5">
              <span className="bg-[#C5A880] text-[#1C130B] text-xs font-semibold px-3 py-1.5 rounded-2xl">
                After AuroMakeover
              </span>
            </div>

            {/* Slider handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white/90 z-10 pointer-events-none"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M5 3L2 8L5 13" stroke="#1C130B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M11 3L14 8L11 13" stroke="#1C130B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Caption */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-[#1C130B]/50 font-medium">
              {room.caption}
            </p>
            <button
              onClick={scrollToEstimator}
              className="text-sm text-[#8A5836] font-semibold flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
            >
              Get a quote <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
