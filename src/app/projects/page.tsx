"use client";

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import { gsap, registerGsap } from '@/lib/gsap';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import BeforeAfterGrid from '@/components/BeforeAfterGrid';

// Reusing the BeforeAfterGrid from the existing codebase for the Masonry gallery
// The grid internally fetches `src/data/before-after-pairs.ts`.

export default function ProjectsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    registerGsap();
    
    // Stats Counter Animation
    const counters = gsap.utils.toArray('.stat-counter');
    counters.forEach((counter: any) => {
      const target = parseInt(counter.dataset.target, 10);
      gsap.to(counter, {
        innerHTML: target,
        duration: 2,
        ease: "power2.out",
        snap: { innerHTML: 1 },
        scrollTrigger: {
          trigger: ".stats-section",
          start: "top 80%"
        }
      });
    });

  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="min-h-screen bg-[#FAF8F5] text-[#1C130B]">
      <NavBar />
      
      {/* 1. Hero Section */}
      <section className="pt-32 pb-16 px-6 bg-[#3E2C1E] text-[#FAF8F5]">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[#C5A880] text-sm tracking-[0.2em] font-semibold uppercase mb-4">
            Our Portfolio
          </p>
          <h1 className="font-['Syne'] text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
            247+ Transformations.<br />Zero Complaints.
          </h1>
          <p className="text-[#FAF8F5]/70 max-w-2xl mx-auto font-['Plus_Jakarta_Sans']">
            Browse real projects from real homes across Hyderabad, Bangalore, and Chennai. Slide to see the before and after.
          </p>
        </div>

        {/* Impact Stats */}
        <div className="stats-section max-w-5xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-12">
          {[
            { label: 'Flats Transformed', val: 247, suffix: '+' },
            { label: 'Societies Served', val: 13, suffix: '' },
            { label: 'Sq.Ft Installed', val: 15000, suffix: '+' },
            { label: 'Avg Rating', val: 4.9, suffix: '★' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-['Syne'] text-4xl font-bold text-[#C5A880] mb-2 flex items-center justify-center">
                <span className="stat-counter" data-target={stat.val}>0</span>
                <span>{stat.suffix}</span>
              </div>
              <div className="text-sm text-white/50 font-bold uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Masonry Grid (Reusing BeforeAfterGrid) */}
      <section className="py-20 bg-[#FAF8F5]">
        <BeforeAfterGrid />
      </section>

      <Footer />
    </main>
  );
}
