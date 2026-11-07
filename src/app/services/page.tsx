"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { gsap, registerGsap } from '@/lib/gsap';
import Footer from '@/components/Footer';
import AnimatedIcon from '@/components/animations/AnimatedIcon';
import Image from 'next/image';

const SERVICES = [
  {
    slug: 'architectural-louvers-and-panels',
    title: 'Architectural Louvers & Panels',
    subtitle: 'Smoked oak, fluted slats & NRC 0.85 acoustic dampening',
    price: '₹85 / sq.ft',
    img: '/images/showcase-slats.jpg',
  },
  {
    slug: 'premium-wallcoverings',
    title: 'Premium Wallcoverings & Murals',
    subtitle: 'European non-woven linens, Pichwai temple art & metallic leafing',
    price: '₹45 / sq.ft',
    img: '/images/showcase-wallpaper.jpg',
  },
  {
    slug: 'smart-blinds-and-acoustics',
    title: 'Smart Blinds & Acoustics',
    subtitle: 'Voice & app Somfy motorized shading with 78% heat rejection',
    price: '₹120 / sq.ft',
    img: '/images/showcase-blinds.jpg',
  },
  {
    slug: 'concealed-lighting-upgrades',
    title: 'Concealed Cove Lighting',
    subtitle: '3000K warm halo architectural LED extrusions without trenching',
    price: '₹65 / running ft',
    img: '/images/after-living-arch.jpg',
  },
  {
    slug: 'pooja-rooms',
    title: 'Sacred Mandir & Pooja Sanctums',
    subtitle: 'Translucent backlit onyx, brass latticework & Pichwai backdrops',
    price: '₹35,000 / room',
    img: '/images/after-pooja-traditional.jpg',
  },
  {
    slug: 'luxury-wallpapers',
    title: 'Luxury Bespoke Wallpapers',
    subtitle: 'Zero-VOC German adhesives with sub-0.2mm laser seam alignment',
    price: '₹45 / sq.ft',
    img: '/images/after-master-pichwai.jpg',
  },
];

export default function ServicesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    registerGsap();
    
    gsap.from('.service-card', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".services-grid",
        start: "top 85%"
      }
    });

  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="min-h-screen bg-[#FAF8F5] text-[#1C130B]">
      {/* 1. Hero Section */}
      <section className="pt-32 pb-16 px-6 bg-[#1C130B] text-[#FAF8F5] relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
           <Image src="/images/hero.jpg" fill className="object-cover" alt="Hero background" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-[#C5A880] text-xs font-bold tracking-[0.3em] uppercase mb-4 font-['Plus_Jakarta_Sans']">
            HUB 1 · ARCHITECTURAL SERVICES
          </p>
          <h1 className="font-['Syne'] text-4xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight">
            Every Surface. Every Room.<br /><span className="text-[#C5A880]">48 Hours.</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-[#FAF8F5]/80 max-w-2xl mx-auto font-['Plus_Jakarta_Sans'] leading-relaxed">
            Zero civil demolition, zero dust, and 100% pre-engineered finishes tailored for Hyderabad's premier high-rises.
          </p>
        </div>
      </section>

      {/* 2. Services Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto services-grid">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((srv) => (
            <Link 
              key={srv.slug} 
              href={`/services/${srv.slug}`}
              className="service-card group relative block overflow-hidden rounded-3xl aspect-[4/3] bg-[#3E2C1E]/20 border border-[#C5A880]/20 hover:border-[#C5A880] transition-all shadow-md hover:shadow-2xl"
            >
              <Image 
                src={srv.img} 
                alt={srv.title} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C130B] via-[#1C130B]/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 flex flex-col justify-end h-full">
                <span className="text-[#C5A880] font-bold tracking-widest uppercase text-xs mb-1 font-['Plus_Jakarta_Sans']">
                  From {srv.price}
                </span>
                <h3 className="font-['Syne'] text-2xl font-bold text-white mb-2 leading-snug">{srv.title}</h3>
                <p className="text-white/70 text-xs sm:text-sm line-clamp-2 mb-4 font-['Plus_Jakarta_Sans']">
                  {srv.subtitle}
                </p>
                <div>
                  <span className="inline-flex items-center gap-2 bg-[#FAF8F5]/15 backdrop-blur-md text-[#FAF8F5] group-hover:bg-[#C5A880] group-hover:text-[#1C130B] px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all">
                    Explore Silo →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Differentiators */}
      <section className="py-12 bg-white border-y border-[#C5A880]/15">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-8 sm:gap-14">
          {['Zero Civil Work', '48-Hour Turnaround', '2-Year Warranty', 'Escrow Protected'].map((diff, i) => (
            <div key={i} className="flex items-center gap-3 font-bold text-[#1C130B] text-sm">
              <AnimatedIcon icon="ShieldCheck" className="w-5 h-5 text-[#C5A880]" triggerOnScroll={true} />
              {diff}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
