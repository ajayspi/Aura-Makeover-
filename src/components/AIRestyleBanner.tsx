"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import ScrollReveal from './ScrollReveal';

export default function AIRestyleBanner() {
  return (
    <section className="relative py-24 px-6 bg-[#1C130B] overflow-hidden">
      {/* Background ambient AI glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#C5A880]/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#8A5836]/20 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        
        {/* Left: Copy */}
        <div className="flex-1 text-center lg:text-left">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF8F5]/10 border border-[#C5A880]/30 mb-6">
              <Sparkles className="w-4 h-4 text-[#C5A880]" />
              <span className="text-[#C5A880] text-xs font-bold tracking-widest uppercase">Proprietary Technology</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-['Syne'] text-[#FAF8F5] mb-6 leading-[1.1] tracking-tight">
              See the Future of Your Home in <span className="text-foil">10 Seconds.</span>
            </h2>
            
            <p className="text-base sm:text-lg text-[#FAF8F5]/70 font-['Plus_Jakarta_Sans'] leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
              Upload a photo of your current builder-finish room. Our bespoke AI architectural engine will instantly generate a photorealistic luxury rendering featuring our signature materials.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link
                href="/restyle"
                className="group inline-flex items-center justify-center gap-3 bg-[#C5A880] hover:bg-[#FAF8F5] text-[#1C130B] font-bold text-sm sm:text-base px-8 py-4 rounded-2xl transition-all duration-300 shadow-[0_0_30px_rgba(197,168,128,0.2)] hover:shadow-[0_0_40px_rgba(197,168,128,0.4)]"
              >
                Try AI Restyle Studio
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            <p className="mt-6 text-[#FAF8F5]/40 text-xs font-['Plus_Jakarta_Sans'] italic">
              *No registration required. Powered in one place.
            </p>
          </ScrollReveal>
        </div>

        {/* Right: Visual Element */}
        <div className="flex-1 w-full max-w-md lg:max-w-none">
          <ScrollReveal delay={0.2}>
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#C5A880]/20 bg-[#2A1E12] shadow-2xl group">
              {/* Simulated scanning effect line */}
              <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                className="absolute left-0 right-0 h-1 bg-[#C5A880] shadow-[0_0_20px_#C5A880] z-20 opacity-50"
              />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10 bg-gradient-to-t from-[#1C130B] to-transparent">
                <div className="w-20 h-20 rounded-full bg-[#1C130B] border border-[#C5A880]/30 flex items-center justify-center mb-6 relative">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-[#C5A880]/20 blur-md"
                  />
                  <UploadCloud className="w-8 h-8 text-[#C5A880]" />
                </div>
                <h3 className="font-['Syne'] text-2xl font-bold text-[#FAF8F5] mb-2">Upload Room Photo</h3>
                <p className="font-['Plus_Jakarta_Sans'] text-sm text-[#FAF8F5]/60">Drag & drop your builder-finish photo here</p>
              </div>

              {/* Decorative grid pattern in background */}
              <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#C5A880 1px, transparent 1px), linear-gradient(90deg, #C5A880 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.05 }} />
            </div>
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
}
