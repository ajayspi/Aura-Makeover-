"use client";

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { BEFORE_AFTER_PAIRS, PAIR_COUNT, CELL_COUNT } from '@/data/before-after-pairs';

function CardSlider({ item }: { item: any }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (isDragging) handleMove(e.touches[0].clientX);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden cursor-ew-resize group"
      onMouseDown={(e) => { setIsDragging(true); handleMove(e.clientX); }}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={onMouseMove}
      onTouchStart={(e) => { setIsDragging(true); handleMove(e.touches[0].clientX); }}
      onTouchEnd={() => setIsDragging(false)}
      onTouchMove={onTouchMove}
    >
      {/* Before Image (Background) */}
      <div className="absolute inset-0">
        <Image src={item.before} alt={`${item.label} Before`} fill className="object-cover grayscale-[0.35]" />
        <div className="absolute top-4 right-4 bg-[#1C130B]/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#FAF8F5] tracking-wider uppercase font-['Plus_Jakarta_Sans']">
          Builder Finish
        </div>
      </div>

      {/* After Image (Clipped overlay) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <Image src={item.after} alt={`${item.label} After`} fill className="object-cover" />
        <div className="absolute top-4 left-4 bg-[#C5A880]/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#1C130B] tracking-wider uppercase font-['Plus_Jakarta_Sans']">
          {item.label.split(' — ')[1] || item.label}
        </div>
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-[#FAF8F5] cursor-ew-resize pointer-events-none shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#FAF8F5] rounded-full flex items-center justify-center shadow-lg border border-[#C5A880]">
          <div className="w-1 h-4 border-l border-r border-[#C5A880] opacity-50" />
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#1C130B]/80 to-transparent pointer-events-none">
        <h4 className="font-['Syne'] text-lg font-bold text-[#FAF8F5]">{item.label.split(' — ')[0]}</h4>
      </div>
    </div>
  );
}

export default function BeforeAfterGrid() {
  return (
    <section id="before-after-grid" className="py-24 sm:py-32 px-6 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#8A5836] text-xs font-semibold tracking-[0.2em] uppercase mb-4 font-['Plus_Jakarta_Sans']">
            Same-Space Transformations
          </p>
          <h2 className="font-['Syne'] text-4xl sm:text-5xl md:text-6xl font-black text-[#1C130B] mb-6">
            The Master Showcase
          </h2>
          <p className="font-['Plus_Jakarta_Sans'] text-[#1C130B]/70 text-lg max-w-2xl mx-auto">
            {PAIR_COUNT} true same-space transformations. Drag the slider to reveal how we transform standard builder-finish rooms into architectural sanctuaries in exactly 48 hours. (Showing {CELL_COUNT} items total).
          </p>
        </div>

        {/* 16-Cell Grid */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          style={{ '--grid-gap': '1rem' } as React.CSSProperties} // Requested by rule: case-sensitive grid gap
        >
          {BEFORE_AFTER_PAIRS.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
            >
              <CardSlider item={item} />
            </motion.div>
          ))}

          {/* Cell 16: The CTA Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="w-full aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden bg-[#1C130B] p-8 flex flex-col items-center justify-center text-center border-2 border-[#C5A880]/30 hover:border-[#C5A880] transition-colors group cursor-pointer"
            onClick={() => {
              document.getElementById('estimator')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <h3 className="font-['Syne'] text-3xl font-bold text-[#FAF8F5] mb-4 group-hover:text-[#C5A880] transition-colors">
              Your Home,<br/>Next.
            </h3>
            <p className="font-['Plus_Jakarta_Sans'] text-sm text-[#FAF8F5]/70 mb-8">
              Book the mobile swatch van and secure your 48-hour transformation.
            </p>
            <a href="#estimator" className="w-16 h-16 rounded-full bg-[#C5A880] flex items-center justify-center text-[#1C130B] group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(197,168,128,0.4)]">
              <ArrowRight className="w-8 h-8" />
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
