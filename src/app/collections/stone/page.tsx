"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, Box, ChevronRight } from 'lucide-react';
import Footer from '@/components/Footer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';

interface StoneFinish {
  id: string;
  name: string;
  frenchName: string;
  tagline: string;
  colorHex: string;
  previewImg: string;
  texturePattern: string;
  description: string;
  thickness: string;
  mohsHardness: string;
  finishType: string;
  origin: string;
  bestFor: string;
}

const STONE_FINISHES: StoneFinish[] = [
  {
    id: 'travertine-romano',
    name: 'Travertine Romano',
    frenchName: 'Travertin Romano Brut',
    tagline: 'Warm honey porous limestone with delicate amber mineral bands',
    colorHex: '#D7C4A5',
    previewImg: '/images/after-pooja-marble.jpg',
    texturePattern: 'Linear microporous mineral grain with honed soft matte polish',
    description: 'Directly sourced from classical quarries, this honed travertine slab delivers an authentic Mediterranean tactile warmth. Each 8mm architectural veneer is moisture-sealed with invisible breathable nano-coatings.',
    thickness: '8mm Ultra-Slim Slab',
    mohsHardness: 'Mohs 4.5 Honed',
    finishType: 'Matte Tactile Micro-Porous',
    origin: 'Tivoli Mineral Formations',
    bestFor: 'Living Room TV Niches & Sacred Mandir Backdrops',
  },
  {
    id: 'volcanic-basalt',
    name: 'Basalte Volcanique',
    frenchName: 'Basalte Volcanique Anthracite',
    tagline: 'Deep charcoal igneous stone with light-absorbing micro-crystalline relief',
    colorHex: '#3A3837',
    previewImg: '/images/fluted-louver.jpg',
    texturePattern: 'Vesicular fine-grained volcanic crust with zero glare sheen',
    description: 'Forged under volcanic pressures, this dark matte basalt absorbs incident light, creating dramatic shadows behind 3000K indirect LED extrusions. Completely scratch-proof and impervious to moisture.',
    thickness: '8mm Ultra-Slim Slab',
    mohsHardness: 'Mohs 6.5 Scratch-Resistant',
    finishType: 'Deep Matte Anti-Reflective',
    origin: 'Active Volcanic Terranes',
    bestFor: 'Acoustic Media Rooms & Executive Study Feature Walls',
  },
  {
    id: 'smoked-terrazzo',
    name: 'Terrazzo Fumé',
    frenchName: 'Terrazzo Fumé Vénitien',
    tagline: 'Venetian mineral aggregate with river pebble inclusions and warm brass flecks',
    colorHex: '#A29688',
    previewImg: '/images/after-living-fluted.jpg',
    texturePattern: 'Multi-aggregate river pebble mosaic embedded in warm earthen cementitious matrix',
    description: 'A contemporary reimagining of historic Venetian terrazzo. Slabs feature rounded river quartz, travertine fragments, and microscopic brass flecks that subtly shimmer when grazed by sunlight.',
    thickness: '10mm Reinforced Composite',
    mohsHardness: 'Mohs 6.0 Dense Composite',
    finishType: 'Honed Silk Touch',
    origin: 'Veneto Terrazzo Slabs',
    bestFor: 'Dining Room Accent Slabs & Kitchen Breakfast Bars',
  },
  {
    id: 'sandstone-dore',
    name: 'Sandstone Doré',
    frenchName: 'Grès Cérame Doré',
    tagline: 'Sun-drenched desert sediment with undulating dune stratum lines',
    colorHex: '#CCA978',
    previewImg: '/images/after-living-arch.jpg',
    texturePattern: 'Fluid wind-swept sandstone ridges with warm golden terracotta undertones',
    description: 'Captures the organic topography of sunlit sandstone canyons. The warm ochre and terracotta minerals harmonize effortlessly with AuroMakeover warm gold hardware and smoked oak louvers.',
    thickness: '8mm Ultra-Slim Slab',
    mohsHardness: 'Mohs 5.5 Mineral Quartz',
    finishType: 'Micro-Relief Brushed',
    origin: 'Deccan Sandstone Beds',
    bestFor: 'Entrance Foyers & Master Suite Headboards',
  },
  {
    id: 'calacatta-gold',
    name: 'Calacatta Gold',
    frenchName: 'Marbre Calacatta Ambré',
    tagline: 'Sculptural warm bronze and amber veins flowing across warm bone-white porcelain',
    colorHex: '#EAE5DB',
    previewImg: '/images/after-pooja-traditional.jpg',
    texturePattern: 'Continuous continuous-vein ribboning with crystalline gold highlights',
    description: 'The pinnacle of high-rise luxury. Ultra-compact sintered stone mimicking natural Calacatta marble with zero porosity, eliminating the staining risks of raw marble while preserving tactile opulence.',
    thickness: '6mm Featherweight Sintered',
    mohsHardness: 'Mohs 7.0 Indestructible Sintered',
    finishType: 'Velvet Satin Smooth',
    origin: 'Carrara Mineral Vein Replica',
    bestFor: 'High-Impact Living Hall Accent Slabs & Mandir Sanctums',
  },
];

export default function StoneCollectionPage() {
  const [activeStone, setActiveStone] = useState<StoneFinish>(STONE_FINISHES[0]);
  const [sampleOrdered, setSampleOrdered] = useState(false);
  const [customerFlat, setCustomerFlat] = useState('My Home Bhooja');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const handleOrderSample = (e: React.FormEvent) => {
    e.preventDefault();
    setSampleOrdered(true);
  };

  const bookingText = encodeURIComponent(
    `Hi AuroMakeover! I'd like to inspect the Stone Collection sample box (${activeStone.name}) for my flat in ${customerFlat}. Please confirm Swatch Van schedule.`
  );

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#1C130B]">
      {/* 1. Header Navigation Pill */}
      <div className="bg-[#1C130B] px-6 py-4 border-b border-[#C5A880]/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/collections"
            className="text-xs font-bold text-[#C5A880] uppercase tracking-widest hover:text-white transition-colors font-['Plus_Jakarta_Sans'] inline-flex items-center gap-1.5"
          >
            ← Back to Master Collections
          </Link>
          <span className="text-xs font-bold uppercase tracking-widest text-white/60 font-['Plus_Jakarta_Sans'] hidden sm:inline">
            Plum-Inspired Tactile Materials
          </span>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="pt-20 pb-14 px-6 bg-[#1C130B] text-[#FAF8F5] relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <Image src="/images/hero.jpg" fill className="object-cover" alt="Stone Collection" priority />
        </div>
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <p className="text-[#C5A880] text-xs font-bold tracking-[0.3em] uppercase mb-4 font-['Plus_Jakarta_Sans']">
            ARCHITECTURAL MINERAL FINISHES
          </p>
          <h1 className="font-['Syne'] text-4xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight">
            La Collection <span className="text-[#C5A880]">Stone</span>
          </h1>
          <p className="text-[#FAF8F5]/80 text-base sm:text-xl max-w-2xl mx-auto font-['Plus_Jakarta_Sans'] leading-relaxed">
            Raw minerals, tactile limestone relief, and sintered architectural slabs. Engineered for high-rise living rooms, TV credenzas, and serene sanctuaries.
          </p>

          {/* Quick Swatch Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8">
            {STONE_FINISHES.map((stone) => {
              const isSelected = activeStone.id === stone.id;
              return (
                <button
                  key={stone.id}
                  onClick={() => setActiveStone(stone)}
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer font-['Plus_Jakarta_Sans'] ${
                    isSelected
                      ? 'bg-[#C5A880] text-[#1C130B] shadow-lg scale-105'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-inner"
                    style={{ backgroundColor: stone.colorHex }}
                  />
                  <span>{stone.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Interactive Tactile Showcase & Spec Sheet */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Visual Display (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] border-2 border-[#C5A880]/30 shadow-2xl bg-[#1C130B]">
              <Image
                src={activeStone.previewImg}
                alt={activeStone.name}
                fill
                className="object-cover transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C130B]/90 via-transparent to-black/20"></div>

              <div className="absolute top-6 left-6 flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#1C130B]/80 backdrop-blur-md text-[#C5A880] border border-[#C5A880]/30 font-['Plus_Jakarta_Sans']">
                  {activeStone.frenchName}
                </span>
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white font-['Plus_Jakarta_Sans']">
                  {activeStone.finishType}
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="font-['Syne'] text-2xl sm:text-3xl font-bold text-white mb-2">
                  {activeStone.name}
                </h3>
                <p className="text-white/80 text-sm font-['Plus_Jakarta_Sans']">
                  {activeStone.tagline}
                </p>
              </div>
            </div>

            {/* Tactile Texture Micro-Card */}
            <div className="p-6 bg-white rounded-3xl border border-[#1C130B]/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl border-2 border-[#C5A880] shadow-md shrink-0"
                  style={{ backgroundColor: activeStone.colorHex }}
                />
                <div>
                  <h4 className="font-['Syne'] text-base font-bold text-[#1C130B]">
                    Surface Micro-Relief Profile
                  </h4>
                  <p className="text-xs text-[#1C130B]/70 font-['Plus_Jakarta_Sans']">
                    {activeStone.texturePattern}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-[#FAF8F5] text-[#8A5836] border border-[#C5A880]/30 shrink-0 font-['Plus_Jakarta_Sans']">
                0% Civil Demolition
              </span>
            </div>
          </div>

          {/* Interactive Specification & Order Panel (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#C5A880]/30 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold tracking-widest uppercase text-[#8A5836] font-['Plus_Jakarta_Sans']">
                  Architectural Specifications
                </span>
                <span className="text-xs font-semibold text-[#15803D] bg-green-50 px-2.5 py-1 rounded-full font-['Plus_Jakarta_Sans']">
                  In Stock for 48hr Dispatch
                </span>
              </div>

              <h2 className="font-['Syne'] text-3xl font-bold text-[#1C130B] mb-2">
                {activeStone.name}
              </h2>
              <p className="text-xs text-[#8A5836] italic mb-6 font-['Plus_Jakarta_Sans']">
                {activeStone.frenchName} — {activeStone.origin}
              </p>

              <p className="text-sm text-[#1C130B]/80 leading-relaxed mb-6 font-['Plus_Jakarta_Sans']">
                {activeStone.description}
              </p>

              {/* Technical Spec List */}
              <div className="space-y-3.5 mb-8 border-y border-[#1C130B]/10 py-5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-['Plus_Jakarta_Sans']">
                  <span className="text-[#1C130B]/60">Slab Profile</span>
                  <span className="font-bold text-[#1C130B]">{activeStone.thickness}</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm font-['Plus_Jakarta_Sans']">
                  <span className="text-[#1C130B]/60">Surface Scratch Index</span>
                  <span className="font-bold text-[#1C130B]">{activeStone.mohsHardness}</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm font-['Plus_Jakarta_Sans']">
                  <span className="text-[#1C130B]/60">Surface Finish</span>
                  <span className="font-bold text-[#1C130B]">{activeStone.finishType}</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm font-['Plus_Jakarta_Sans']">
                  <span className="text-[#1C130B]/60">Recommended Placement</span>
                  <span className="font-bold text-[#8A5836] text-right">{activeStone.bestFor}</span>
                </div>
              </div>
            </div>

            {/* Radix Dialog: Sample Box Ordering */}
            <div className="space-y-3 pt-2">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="w-full py-4 bg-[#1C130B] hover:bg-[#3E2C1E] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer font-['Plus_Jakarta_Sans']">
                    <Box className="w-4 h-4 text-[#C5A880]" />
                    Commandez un Échantillon (Order Sample Box)
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="font-['Syne'] text-2xl font-bold text-[#1C130B]">
                      Request Free Swatch Van Visit
                    </DialogTitle>
                    <DialogDescription className="text-[#1C130B]/70 font-['Plus_Jakarta_Sans'] text-sm">
                      Inspect 300+ physical finishes including <strong>{activeStone.name}</strong> directly in your flat&apos;s ambient lighting.
                    </DialogDescription>
                  </DialogHeader>

                  {sampleOrdered ? (
                    <div className="py-8 text-center space-y-4">
                      <div className="w-14 h-14 bg-green-100 text-[#15803D] rounded-full mx-auto flex items-center justify-center">
                        <Check className="w-7 h-7" />
                      </div>
                      <h4 className="font-['Syne'] text-xl font-bold text-[#1C130B]">
                        Swatch Box Reserved!
                      </h4>
                      <p className="text-xs text-[#1C130B]/70 font-['Plus_Jakarta_Sans'] max-w-sm mx-auto">
                        Our Swatch Van driver will coordinate arrival at {customerFlat}. You can also confirm immediately via WhatsApp.
                      </p>
                      <a
                        href={`https://wa.me/919700675637?text=${bookingText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#15803D] text-white rounded-2xl text-xs font-bold uppercase tracking-wider font-['Plus_Jakarta_Sans'] shadow"
                      >
                        Confirm on WhatsApp (919700675637)
                      </a>
                    </div>
                  ) : (
                    <form onSubmit={handleOrderSample} className="space-y-4 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-[#1C130B] uppercase tracking-wider mb-1 font-['Plus_Jakarta_Sans']">
                          Target High-Rise Society
                        </label>
                        <select
                          value={customerFlat}
                          onChange={(e) => setCustomerFlat(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border border-[#1C130B]/20 bg-white text-sm font-['Plus_Jakarta_Sans'] text-[#1C130B] focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                        >
                          <option value="My Home Bhooja">My Home Bhooja (Kokapet)</option>
                          <option value="Rajapushpa Provincia">Rajapushpa Provincia (Narsingi)</option>
                          <option value="Prestige High Fields">Prestige High Fields (Financial District)</option>
                          <option value="Aparna Sarovar Zenith">Aparna Sarovar Zenith (Nallagandla)</option>
                          <option value="Lanco Hills">Lanco Hills (Manikonda)</option>
                          <option value="Other Society">Other West Hyderabad Society</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1C130B] uppercase tracking-wider mb-1 font-['Plus_Jakarta_Sans']">
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="e.g. Vikram Rao"
                          className="w-full px-4 py-3 rounded-2xl border border-[#1C130B]/20 bg-white text-sm font-['Plus_Jakarta_Sans'] text-[#1C130B] focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1C130B] uppercase tracking-wider mb-1 font-['Plus_Jakarta_Sans']">
                          WhatsApp Mobile Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="9876543210"
                          className="w-full px-4 py-3 rounded-2xl border border-[#1C130B]/20 bg-white text-sm font-['Plus_Jakarta_Sans'] text-[#1C130B] focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 bg-[#C5A880] hover:bg-[#b0936d] text-[#1C130B] font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md cursor-pointer font-['Plus_Jakarta_Sans']"
                      >
                        Dispatch Free Van Samples to My Society
                      </button>
                    </form>
                  )}
                </DialogContent>
              </Dialog>

              <a
                href={`https://wa.me/919700675637?text=${bookingText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-[#C5A880] hover:bg-[#b0936d] text-[#1C130B] font-bold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 font-['Plus_Jakarta_Sans']"
              >
                Inquire on WhatsApp Directly
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Plum Living Comparison Bar */}
      <section className="py-14 bg-white border-y border-[#C5A880]/20 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8A5836] font-['Plus_Jakarta_Sans']">
              Engineered In France & Milled In Hyderabad
            </span>
            <h3 className="font-['Syne'] text-2xl font-bold text-[#1C130B] mt-1">
              Zero Demolition Architectural Surfaces
            </h3>
          </div>
          <div className="flex items-center gap-4 mx-auto sm:mx-0">
            <Link
              href="/studio"
              className="px-6 py-3 bg-[#1C130B] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#3E2C1E] transition-colors font-['Plus_Jakarta_Sans'] inline-flex items-center gap-2"
            >
              Open in 3D Styler Canvas <ChevronRight className="w-4 h-4 text-[#C5A880]" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
