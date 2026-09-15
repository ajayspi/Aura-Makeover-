"use client";

import React from 'react';
import { Truck, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function HeroSection() {
  const scrollToEstimator = () => {
    document.getElementById('estimator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-[#1C130B] text-[#FAF8F5] py-20 px-6 font-['Plus_Jakarta_Sans'] relative overflow-hidden rounded-b-[3rem]">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8A5836]/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C5A880]/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8A5836]/20 border border-[#8A5836]/30 text-[#C5A880] text-sm font-bold tracking-wide uppercase mb-6">
          <Truck className="w-4 h-4" />
          <span>Now serving Hyderabad West</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black font-['Syne'] leading-tight mb-6">
          Premium Home Makeovers in <span className="text-[#C5A880]">48 Hours</span>.
        </h1>

        <p className="text-lg md:text-xl text-gray-300 font-medium mb-10 max-w-2xl mx-auto">
          No civil work. No dust. We bring the design studio to your sofa and install luxury wallpapers and smart blinds seamlessly.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={scrollToEstimator}
            className="w-full sm:w-auto bg-[#C5A880] hover:bg-[#b09571] text-[#1C130B] px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg"
          >
            Get Instant Quote
            <ArrowRight className="w-5 h-5" />
          </button>

          <button className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-colors border border-white/10">
            View Lookbook
          </button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="max-w-4xl mx-auto mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10 border-t border-white/10 pt-10">
        <div className="flex flex-col items-center text-center">
          <Clock className="w-8 h-8 text-[#C5A880] mb-3" />
          <h3 className="font-bold text-lg mb-1 font-['Syne']">48-Hour Install</h3>
          <p className="text-sm text-gray-400">From measurement to final QA sign-off.</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <ShieldCheck className="w-8 h-8 text-[#C5A880] mb-3" />
          <h3 className="font-bold text-lg mb-1 font-['Syne']">Zero Civil Work</h3>
          <p className="text-sm text-gray-400">100% dust-free, non-invasive, rental-safe.</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <Truck className="w-8 h-8 text-[#C5A880] mb-3" />
          <h3 className="font-bold text-lg mb-1 font-['Syne']">Design-on-Wheels</h3>
          <p className="text-sm text-gray-400">Mobile swatch vans come to your door.</p>
        </div>
      </div>
    </section>
  );
}
