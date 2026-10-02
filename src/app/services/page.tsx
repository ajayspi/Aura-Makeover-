"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { gsap, registerGsap } from '@/lib/gsap';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import AnimatedIcon from '@/components/animations/AnimatedIcon';
import Image from 'next/image';

const SERVICES = [
  { slug: 'luxury-wallpapers', title: 'Luxury Wallpapers', price: '₹45', img: '/images/test_before_master_1790383345060.jpg' },
  { slug: 'fluted-louvers', title: 'Fluted Acoustic Louvers', price: '₹85', img: '/images/after_office_bright_matched_1790426268258.jpg' },
  { slug: 'smart-blinds', title: 'Smart Motorized Blinds', price: '₹120', img: '/images/after_balcony_garden_matched_1790426447789.jpg' },
  { slug: 'pooja-rooms', title: 'Pooja Room Designs', price: '₹35,000/room', img: '/images/after_pooja_traditional_matched_1790426298818.jpg' },
];

export default function ServicesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    registerGsap();
    
    // Service cards stagger entrance
    gsap.from('.service-card', {
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".services-grid",
        start: "top 85%"
      }
    });

  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="min-h-screen bg-[#FAF8F5] text-[#1C130B]">
      <NavBar />
      
      {/* 1. Hero Section */}
      <section className="pt-32 pb-16 px-6 bg-[#1C130B] text-[#FAF8F5] relative overflow-hidden">
        {/* Ambient background mosaic placeholder */}
        <div className="absolute inset-0 opacity-10">
           <Image src="/images/hero.jpg" fill className="object-cover" alt="Hero background" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-[#C5A880] text-sm tracking-[0.3em] font-semibold uppercase mb-6">
            Service Catalog
          </p>
          <h1 className="font-['Syne'] text-5xl sm:text-6xl md:text-7xl font-black mb-6">
            Every Surface. Every Room.<br/>48 Hours.
          </h1>
          <p className="mt-8 text-lg text-[#FAF8F5]/70 max-w-2xl mx-auto font-['Plus_Jakarta_Sans']">
            From luxury wallpapers to smart motorized blinds — browse our complete catalog.
          </p>
        </div>
      </section>

      {/* 2. Services Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto services-grid">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES.map((srv, i) => (
            <Link 
              key={srv.slug} 
              href={`/services/${srv.slug}`}
              className="service-card group relative block overflow-hidden rounded-3xl aspect-[4/3] bg-gray-200"
            >
              <Image 
                src={srv.img} 
                alt={srv.title} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C130B]/90 via-[#1C130B]/30 to-transparent transition-opacity duration-500 group-hover:opacity-90"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end h-full">
                <h3 className="font-['Syne'] text-3xl font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{srv.title}</h3>
                <p className="text-[#C5A880] font-bold tracking-widest uppercase text-sm mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                  From {srv.price}
                </p>
                <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-150">
                  <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full font-bold text-sm">
                    View Details
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Differentiators */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-12">
          {['Zero Civil Work', '48-Hour Install', '2-Year Warranty', 'Escrow Protected'].map((diff, i) => (
            <div key={i} className="flex items-center gap-3 font-bold text-[#1C130B]">
              <AnimatedIcon icon="ShieldCheck" className="w-6 h-6 text-[#C5A880]" triggerOnScroll={true} />
              {diff}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
