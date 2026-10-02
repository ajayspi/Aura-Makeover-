"use client";

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, registerGsap } from '@/lib/gsap';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import AnimatedIcon from '@/components/animations/AnimatedIcon';
import EstimatorGateway from '@/components/EstimatorGateway';
import { ShieldCheck, Lock, Clock, Info } from 'lucide-react';

export default function PricingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    registerGsap();
    
    // Escrow Chart Animation
    const bars = gsap.utils.toArray('.escrow-bar');
    gsap.fromTo(bars, 
      { width: '0%' },
      { 
        width: (i, target) => target.dataset.width,
        duration: 1.5,
        ease: "power3.out",
        stagger: 0.3,
        scrollTrigger: {
          trigger: "#escrow-section",
          start: "top center+=100",
        }
      }
    );

    // Packages stagger
    gsap.from('.package-card', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".package-grid",
        start: "top 80%"
      }
    });

  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="min-h-screen bg-[#FAF8F5] text-[#1C130B]">
      <NavBar />
      
      {/* 1. Hero Section */}
      <section className="pt-32 pb-16 px-6 text-center">
        <p className="text-[#8A5836] text-sm tracking-[0.2em] font-semibold uppercase mb-4">
          Transparent Pricing
        </p>
        <h1 className="font-['Syne'] text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
          Radical Transparency.<br />No Hidden Costs.
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto font-['Plus_Jakarta_Sans']">
          We publish our pricing because we believe you deserve to know exactly what you're paying for.
        </p>
      </section>

      {/* 2. Escrow Section */}
      <section id="escrow-section" className="py-20 px-6 max-w-5xl mx-auto">
        <div className="bg-[#1C130B] rounded-3xl p-8 sm:p-12 text-[#FAF8F5] shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A880]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

          <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
            <div className="md:w-1/3">
              <h2 className="font-['Syne'] text-3xl font-bold mb-4">10 / 60 / 30<br/>Escrow Protection</h2>
              <p className="text-[#FAF8F5]/70 text-sm mb-6 leading-relaxed">
                Your money sits in a secure escrow account. We don't unlock the final payment until you've signed off on the quality.
              </p>
              <div className="flex items-center gap-2 text-[#C5A880] text-sm font-bold">
                <ShieldCheck className="w-5 h-5" />
                Your Money is Safe
              </div>
            </div>

            <div className="md:w-2/3 w-full space-y-6">
              {[
                { label: 'Booking Deposit', pct: '10%', desc: 'Locks your slot & starts design.', color: 'bg-green-500' },
                { label: 'Material Release', pct: '60%', desc: 'Paid when custom materials ship.', color: 'bg-amber-500' },
                { label: 'QA Unlock', pct: '30%', desc: 'Released ONLY after you inspect.', color: 'bg-gray-400' },
              ].map((tranche, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span>{tranche.label}</span>
                    <span className="text-[#C5A880]">{tranche.pct}</span>
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${tranche.color} escrow-bar`} 
                      data-width={tranche.pct}
                      style={{ width: '0%' }}
                    ></div>
                  </div>
                  <p className="text-xs text-[#FAF8F5]/50 mt-1">{tranche.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Packages */}
      <section className="py-20 px-6 max-w-7xl mx-auto package-grid">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {[
            { 
              name: 'Essential', price: '₹35-45', 
              features: ['Premium vinyl wallpapers', '1-2 rooms coverage', '24-hour install', '1-Year Warranty', 'Primer & GST Included'],
              highlight: false
            },
            { 
              name: 'Signature', price: '₹55-75', 
              features: ['Designer non-woven + louvers', 'Full flat coverage', '48-hour install', '2-Year Warranty', 'Solar analysis & reco'],
              highlight: true
            },
            { 
              name: 'Bespoke', price: '₹90-150', 
              features: ['Italian imports & smart blinds', 'Full flat + custom', '72-hour install', '3-Year Warranty', 'Dedicated Project Manager'],
              highlight: false
            }
          ].map((pkg, i) => (
            <div key={i} className={`package-card rounded-3xl p-8 border ${pkg.highlight ? 'bg-[#FAF8F5] border-[#C5A880] shadow-[0_8px_30px_rgba(197,168,128,0.2)] relative' : 'bg-white border-gray-100 shadow-sm'}`}>
              {pkg.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#C5A880] text-white text-xs font-bold uppercase tracking-widest py-1 px-4 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="font-['Syne'] text-2xl font-bold mb-2">{pkg.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold font-['Plus_Jakarta_Sans']">{pkg.price}</span>
                <span className="text-gray-500 text-sm">/sq.ft</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                {pkg.features.map((feat, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-gray-700">
                    <AnimatedIcon icon="ShieldCheck" className="w-5 h-5 text-[#8A5836] shrink-0" triggerOnScroll={true} />
                    {feat}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${pkg.highlight ? 'bg-[#1C130B] text-white hover:bg-[#8A5836]' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                Calculate My Price
              </button>
            </div>
          ))}

        </div>
      </section>

      {/* 4. Interactive Estimator */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-['Syne'] text-3xl font-bold text-center mb-12">Get an Instant Estimate</h2>
          <EstimatorGateway />
        </div>
      </section>

      <Footer />
    </main>
  );
}
