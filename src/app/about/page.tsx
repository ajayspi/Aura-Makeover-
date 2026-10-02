"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, registerGsap } from '@/lib/gsap';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const founderImageRef = useRef<HTMLDivElement>(null);
  const timelineLineRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    registerGsap();
    
    // 1. Hero Text Stagger
    if (heroTextRef.current) {
      const chars = heroTextRef.current.querySelectorAll('.char');
      gsap.fromTo(chars, 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: "power3.out", delay: 0.2 }
      );
    }

    // 2. Founder Parallax
    if (founderImageRef.current) {
      gsap.to(founderImageRef.current, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: founderImageRef.current.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }

    // 3. Timeline Draw Line
    if (timelineLineRef.current) {
      const pathLength = timelineLineRef.current.getTotalLength();
      gsap.set(timelineLineRef.current, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
      
      gsap.to(timelineLineRef.current, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: "#timeline-section",
          start: "top center",
          end: "bottom center",
          scrub: true
        }
      });
      
      // Timeline dots pop in
      gsap.utils.toArray('.timeline-dot').forEach((dot: any) => {
        gsap.from(dot, {
          scale: 0,
          opacity: 0,
          scrollTrigger: {
            trigger: dot,
            start: "top center+=100",
            toggleActions: "play none none reverse"
          }
        });
      });
    }
  }, { scope: containerRef });

  // Simple split text helper
  const splitText = (text: string) => {
    return text.split('').map((char, i) => (
      <span key={i} className="char inline-block">{char === ' ' ? '\u00A0' : char}</span>
    ));
  };

  return (
    <main ref={containerRef} className="min-h-screen bg-[#FAF8F5] text-[#1C130B]">
      <NavBar />
      
      {/* 1. Hero Section */}
      <section className="pt-40 pb-20 px-6 sm:px-10 lg:px-16 bg-[#1C130B] text-[#FAF8F5] min-h-[60vh] flex flex-col justify-center">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#C5A880] text-sm tracking-[0.3em] font-semibold uppercase mb-6">
            Our Story
          </p>
          <h1 ref={heroTextRef} className="font-['Syne'] text-5xl sm:text-6xl md:text-7xl font-black leading-[1.1] tracking-[-0.02em] overflow-hidden">
            {splitText("We Don't Renovate. We Transform.")}
          </h1>
          <p className="mt-8 text-lg text-[#FAF8F5]/70 max-w-2xl mx-auto font-['Plus_Jakarta_Sans']">
            AuroMakeover is rewriting the rules of home interiors in India. Zero civil work. Zero dust. 48 hours flat.
          </p>
        </div>
      </section>

      {/* 2. Founder Story */}
      <section className="py-24 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="overflow-hidden rounded-3xl h-[600px] relative">
            {/* The image is taller than the container to allow for parallax scrolling */}
            <div ref={founderImageRef} className="absolute inset-0 -top-[10%] h-[120%] w-full">
              <div className="w-full h-full bg-[#8A5836]/20 relative">
                <Image 
                  src="/images/hero.jpg" 
                  alt="Founder at work" 
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>
          </div>
          <div>
            <span className="text-[#C5A880] text-7xl font-['Yeseva_One'] leading-none block mb-[-20px]">"</span>
            <h2 className="font-['Syne'] text-3xl sm:text-4xl font-bold mb-6 text-[#1C130B]">
              I saw 200+ families in Hyderabad waiting 6 months for basic wallpaper installation. That's when I knew — this industry needed to be disrupted.
            </h2>
            <p className="font-bold text-[#8A5836] font-['Plus_Jakarta_Sans']">Ajay</p>
            <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold">Founder, AuroMakeover</p>
          </div>
        </div>
      </section>

      {/* 3. Timeline */}
      <section id="timeline-section" className="py-24 px-6 bg-white relative">
        <div className="max-w-3xl mx-auto relative">
          <h2 className="font-['Syne'] text-4xl font-bold text-center mb-16">The Journey So Far</h2>
          
          <div className="relative pl-8 md:pl-0">
            {/* Center Line for Desktop, Left Line for Mobile */}
            <svg className="absolute left-[31px] md:left-1/2 top-0 bottom-0 h-full w-1 -translate-x-1/2" preserveAspectRatio="none">
              <line x1="2" y1="0" x2="2" y2="100%" stroke="#E5E7EB" strokeWidth="4" />
              <path ref={timelineLineRef} d="M2,0 L2,10000" stroke="#C5A880" strokeWidth="4" fill="none" />
            </svg>

            {[
              { date: '2024 Q3', title: 'Founded in Hyderabad', text: 'First 10 flats transformed in the Kokapet corridor.' },
              { date: '2024 Q4', title: 'Mobile Swatch Van Fleet', text: 'Launched our design-on-wheels service.' },
              { date: '2025 Q1', title: '100 Flats Milestone', text: 'Expanded operations and warehouse capacity.' },
              { date: '2025 Q3', title: 'Bangalore & Chennai', text: 'Opened 2 new regional offices.' },
            ].map((milestone, i) => (
              <div key={i} className={`relative flex flex-col md:flex-row items-start md:items-center justify-between mb-16 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="hidden md:block w-5/12"></div>
                <div className="absolute left-[-39px] md:left-1/2 w-6 h-6 bg-[#C5A880] rounded-full border-4 border-white -translate-x-1/2 mt-1 md:mt-0 timeline-dot z-10 shadow-md"></div>
                <div className={`w-full md:w-5/12 bg-[#FAF8F5] p-6 rounded-2xl shadow-sm border border-gray-100 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <span className="text-[#8A5836] font-bold text-sm tracking-widest uppercase mb-2 block">{milestone.date}</span>
                  <h3 className="font-['Syne'] text-xl font-bold mb-2">{milestone.title}</h3>
                  <p className="text-gray-600 text-sm font-['Plus_Jakarta_Sans']">{milestone.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
