"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, Box, Sun, Moon, Layers, ShieldCheck, Clock, Award } from 'lucide-react';
import Footer from '@/components/Footer';
import PlumCanvasCompositor, { Point2D } from '@/components/styler/PlumCanvasCompositor';
import { SwatchProvider, useSwatch, Swatch } from '@/context/SwatchContext';
import PlumSwatchBar from '@/components/swatches/PlumSwatchBar';

/* =========================================================================
   COLORAMA PALETTE & HARMONY CATALOG (Exact Plum Living Spec)
========================================================================= */

const COLORAMA_PALETTE: Swatch[] = [
  {
    id: 'g05-stone',
    name: 'Green 05 - Stone',
    frenchName: 'Vert Kaki Sourde',
    colorHex: '#7D8471',
    category: 'wall',
    pricePerSqFt: 85,
    tagline: "Un gris relevé d'une touche de vert, sourd et intemporel",
    thumbnailUrl: '/images/fluted-louver.jpg',
  },
  {
    id: 'a01-argile',
    name: 'Argile',
    frenchName: 'Argile Naturelle',
    colorHex: '#B69E87',
    category: 'wall',
    pricePerSqFt: 80,
    tagline: 'Teinte minérale douce inspirée des terres cuites et argiles brutes',
    thumbnailUrl: '/images/after-living-arch.jpg',
  },
  {
    id: 't03-terre-cuite',
    name: 'Terre Cuite',
    frenchName: 'Terracotta Toscane',
    colorHex: '#8A5836',
    category: 'wall',
    pricePerSqFt: 82,
    tagline: 'Ocre chaleureux et enveloppant créant une atmosphère solaire',
    thumbnailUrl: '/images/botanical.jpg',
  },
  {
    id: 'i02-ivoire',
    name: 'Ivoire',
    frenchName: 'Blanc Ivoire Chaud',
    colorHex: '#ECE7DC',
    category: 'wall',
    pricePerSqFt: 75,
    tagline: 'Blanc légèrement cassé captant délicatement la lumière naturelle',
    thumbnailUrl: '/images/after-master-linen.jpg',
  },
  {
    id: 'b04-bleu-paon',
    name: 'Bleu Paon',
    frenchName: 'Bleu Paon Profond',
    colorHex: '#2B444B',
    category: 'wall',
    pricePerSqFt: 88,
    tagline: 'Pigment profond créant un contraste feutré et cinématique',
    thumbnailUrl: '/images/after-office-wood.jpg',
  },
  {
    id: 'o06-smoked-oak',
    name: 'Smoked Oak',
    frenchName: 'Chêne Fumé Véritable',
    colorHex: '#3E2C1E',
    category: 'wall',
    pricePerSqFt: 95,
    tagline: 'Bois noble teinté dans la masse avec relief acoustique',
    thumbnailUrl: '/images/after-living-fluted.jpg',
  },
];

const COMPANION_HARMONIES: Swatch[] = [
  {
    id: 'smoked-oak-harmony',
    name: 'Chêne Fumé',
    frenchName: 'Chêne Fumé Véritable',
    colorHex: '#3E2C1E',
    category: 'wall',
    pricePerSqFt: 95,
    tagline: 'Apporte de la profondeur et un contraste architectural chaud.',
    thumbnailUrl: '/images/after-living-fluted.jpg',
  },
  {
    id: 'brushed-brass-harmony',
    name: 'Laiton Brossé',
    frenchName: 'Laiton Brossé Doré',
    colorHex: '#C5A880',
    category: 'hardware',
    pricePerSqFt: 120,
    tagline: 'Illumine le vert sourd par des touches métalliques raffinées.',
    thumbnailUrl: '/images/hero.jpg',
  },
  {
    id: 'travertine-romano-harmony',
    name: 'Travertin Romano',
    frenchName: 'Travertin Romano Brut',
    colorHex: '#D7C4A5',
    category: 'stone',
    pricePerSqFt: 110,
    tagline: 'Texture minérale poreuse pour équilibrer la laque mate velours.',
    thumbnailUrl: '/images/after-pooja-marble.jpg',
  },
];

interface ApplicationView {
  id: 'fluted' | 'smooth';
  name: string;
  frenchLabel: string;
  baseImage: string;
  polygon: Point2D[];
  description: string;
}

const APPLICATION_VIEWS: ApplicationView[] = [
  {
    id: 'fluted',
    name: 'Panneaux Cannelés',
    frenchLabel: 'Agencement Cannelé',
    baseImage: '/images/after-living-fluted.jpg',
    polygon: [
      { x: 18, y: 10 },
      { x: 82, y: 10 },
      { x: 82, y: 88 },
      { x: 18, y: 88 },
    ],
    description: 'Profilés verticaux 3D créant un jeu d\'ombres rythmé et absorbant les échos.',
  },
  {
    id: 'smooth',
    name: 'Revêtement Mural Continu',
    frenchLabel: 'Peinture & Mur',
    baseImage: '/images/after-living-arch.jpg',
    polygon: [
      { x: 22, y: 8 },
      { x: 78, y: 8 },
      { x: 78, y: 92 },
      { x: 22, y: 92 },
    ],
    description: 'Finition mate poudrée continue, ultra-résistante et lavable.',
  },
];

function CollectionStoneContent() {
  const { addSwatch, swatches, setActiveColor } = useSwatch();
  const [selectedColor, setSelectedColor] = useState<Swatch>(COLORAMA_PALETTE[0]);
  const [activeAppView, setActiveAppView] = useState<ApplicationView>(APPLICATION_VIEWS[0]);
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleColorSelect = (swatch: Swatch) => {
    setSelectedColor(swatch);
    setActiveColor(swatch.colorHex);
  };

  const handleAddSample = (swatch: Swatch) => {
    const success = addSwatch(swatch);
    if (success) {
      showToast(`Échantillon "${swatch.name}" ajouté à votre boîte !`);
    } else {
      showToast(`Votre boîte d'échantillons est pleine (3/3).`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C130B] font-['Plus_Jakarta_Sans'] pb-36">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-[#1C130B] text-[#FAF8F5] border border-[#C5A880] px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <Check className="w-4 h-4 text-[#C5A880]" />
          <span className="text-xs font-bold">{notification}</span>
        </div>
      )}

      {/* 1. Header Navigation Bar */}
      <header className="bg-[#1C130B] px-6 py-4 border-b border-[#C5A880]/20 sticky top-0 z-30 backdrop-blur-md bg-[#1C130B]/95">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-bold text-[#C5A880] uppercase tracking-widest hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              ← AuroMakeover
            </Link>
            <span className="text-white/20">/</span>
            <Link
              href="/collections"
              className="text-xs font-medium text-white/60 hover:text-white transition-colors"
            >
              Collections
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Stone
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/studio?color=g05-stone"
              className="px-4 py-2 rounded-full text-xs font-bold bg-[#C5A880] text-[#1C130B] hover:bg-[#d5b992] transition-all flex items-center gap-1.5 shadow-md"
            >
              <span>Configurer dans le Styler 3D</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Editorial Hero Section (Exact Plum Living Layout) */}
      <section className="pt-16 pb-12 px-6 bg-[#1C130B] text-[#FAF8F5] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image src="/images/hero.jpg" fill className="object-cover" alt="Collection Stone" priority />
        </div>

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-[#C5A880]/30 text-xs font-bold tracking-widest uppercase text-[#C5A880] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#7D8471] border border-white/60" />
            <span>NUANCIER PLUM LIVING FRANCE</span>
          </div>

          <h1 className="font-['Syne'] text-4xl sm:text-6xl md:text-7xl font-black mb-4 tracking-tight leading-tight">
            Green 05 - <span className="text-[#C5A880]">Stone</span>
          </h1>

          <p className="font-['Plus_Jakarta_Sans'] italic text-lg sm:text-2xl text-[#FAF8F5]/90 max-w-2xl mx-auto font-light leading-relaxed mb-6">
            « Un gris relevé d&apos;une touche de vert, sourd et intemporel. »
          </p>

          <p className="text-sm sm:text-base text-white/70 max-w-3xl mx-auto leading-relaxed mb-8">
            Inspirée des minéraux anciens et des argiles patinées, la teinte Stone métamorphose les volumes des appartements de prestige en 48 heures sans démolition.
          </p>

          {/* Dual Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => handleAddSample(selectedColor)}
              className="px-7 py-3.5 rounded-2xl bg-[#C5A880] text-[#1C130B] font-bold text-sm hover:bg-[#d5b992] transition-all shadow-xl flex items-center gap-2 cursor-pointer"
            >
              <Box className="w-4 h-4" />
              <span>Commander l&apos;échantillon (Offert)</span>
            </button>

            <Link
              href="/studio?color=g05-stone"
              className="px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all flex items-center gap-2 backdrop-blur-md"
            >
              <span>Projeter dans mon salon 3D</span>
              <ArrowRight className="w-4 h-4 text-[#C5A880]" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. In-Situ Single-Image Canvas Compositor Viewport */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Controls Bar Above Viewport */}
        <div className="bg-[#1C130B] rounded-t-3xl p-4 sm:p-6 border-t border-x border-[#C5A880]/30 flex flex-col md:flex-row items-center justify-between gap-4 text-white">
          {/* Dual Application Switcher (Fluted vs Smooth) */}
          <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-full border border-white/10">
            {APPLICATION_VIEWS.map((app) => {
              const isActive = activeAppView.id === app.id;
              return (
                <button
                  key={app.id}
                  onClick={() => setActiveAppView(app)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#C5A880] text-[#1C130B] shadow-md'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {app.name}
                </button>
              );
            })}
          </div>

          {/* Colorama Palette Selector */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
            <span className="text-xs uppercase font-bold text-[#C5A880] tracking-wider hidden lg:inline mr-1">
              Colorama :
            </span>
            {COLORAMA_PALETTE.map((color) => {
              const isSelected = selectedColor.id === color.id;
              return (
                <button
                  key={color.id}
                  onClick={() => handleColorSelect(color)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-white/20 border-[#C5A880] text-white scale-105 shadow-md'
                      : 'bg-black/30 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                  title={`${color.name} (${color.frenchName})`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/50 shrink-0"
                    style={{ backgroundColor: color.colorHex }}
                  />
                  <span className="hidden sm:inline">{color.name.split(' - ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Day / Night 3000K Cove Lighting Toggle */}
          <button
            onClick={() => setIsNightMode(!isNightMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border shrink-0 ${
              isNightMode
                ? 'bg-[#8A5836] border-[#C5A880] text-white shadow-lg'
                : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'
            }`}
          >
            {isNightMode ? (
              <>
                <Moon className="w-3.5 h-3.5 text-yellow-300" />
                <span>Cove Halo 3000K</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-yellow-400" />
                <span>Lumière du Jour</span>
              </>
            )}
          </button>
        </div>

        {/* Dynamic Canvas Container with Interactive Hotspots */}
        <div className="relative w-full h-[500px] sm:h-[620px] rounded-b-3xl overflow-hidden border-b border-x border-[#C5A880]/30 shadow-2xl bg-black">
          {/* HTML5 Canvas Multi-Pass Compositor (Single Image Recoloring Engine) */}
          <PlumCanvasCompositor
            baseImage={activeAppView.baseImage}
            tintColor={selectedColor.colorHex}
            wallPolygon={activeAppView.polygon}
            isNightMode={isNightMode}
            alt="Collection Stone In-Situ Compositor Viewport"
          />

          {/* Interactive Hotspot 1: Wall Finish */}
          <div className="absolute top-[38%] left-[45%] -translate-x-1/2 -translate-y-1/2 z-20">
            <button
              onClick={() => setActiveHotspot(activeHotspot === 'wall' ? null : 'wall')}
              className="relative flex h-8 w-8 items-center justify-center cursor-pointer group"
              aria-label="Hotspot Wall Finish"
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A880] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-7 w-7 bg-[#1C130B] border-2 border-[#C5A880] items-center justify-center text-xs font-bold text-white shadow-2xl group-hover:scale-110 transition-transform">
                ●
              </span>
            </button>

            {/* Hotspot Floating Popover Card */}
            {activeHotspot === 'wall' && (
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 bg-[#1C130B]/95 text-white p-4 rounded-2xl border border-[#C5A880] shadow-2xl backdrop-blur-xl z-30">
                <span className="text-[10px] font-bold text-[#C5A880] uppercase tracking-wider block mb-1">
                  Revêtement Mural
                </span>
                <h4 className="font-['Syne'] text-sm font-bold text-white mb-1">
                  {selectedColor.name} ({activeAppView.name})
                </h4>
                <p className="text-[11px] text-white/70 mb-3 leading-snug">
                  {selectedColor.tagline} · ₹{selectedColor.pricePerSqFt}/sq.ft
                </p>
                <button
                  onClick={() => handleAddSample(selectedColor)}
                  className="w-full py-2 rounded-xl bg-[#C5A880] text-[#1C130B] text-xs font-bold hover:bg-[#d5b992] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>+ Ajouter l&apos;échantillon</span>
                </button>
              </div>
            )}
          </div>

          {/* Interactive Hotspot 2: Marble/Stone Bench */}
          <div className="absolute top-[72%] left-[28%] -translate-x-1/2 -translate-y-1/2 z-20">
            <button
              onClick={() => setActiveHotspot(activeHotspot === 'stone' ? null : 'stone')}
              className="relative flex h-8 w-8 items-center justify-center cursor-pointer group"
              aria-label="Hotspot Stone Bench"
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A880] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-7 w-7 bg-[#1C130B] border-2 border-[#C5A880] items-center justify-center text-xs font-bold text-white shadow-2xl group-hover:scale-110 transition-transform">
                ●
              </span>
            </button>

            {activeHotspot === 'stone' && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 bg-[#1C130B]/95 text-white p-4 rounded-2xl border border-[#C5A880] shadow-2xl backdrop-blur-xl z-30">
                <span className="text-[10px] font-bold text-[#C5A880] uppercase tracking-wider block mb-1">
                  Assise & Niche
                </span>
                <h4 className="font-['Syne'] text-sm font-bold text-white mb-1">
                  Travertin Romano Brut
                </h4>
                <p className="text-[11px] text-white/70 mb-3 leading-snug">
                  Pierre naturelle adoucie aux pores ouverts. Harmonisation minérale idéale.
                </p>
                <button
                  onClick={() => handleAddSample(COMPANION_HARMONIES[2])}
                  className="w-full py-2 rounded-xl bg-[#C5A880] text-[#1C130B] text-xs font-bold hover:bg-[#d5b992] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>+ Ajouter l&apos;échantillon</span>
                </button>
              </div>
            )}
          </div>

          {/* Interactive Hotspot 3: 3000K Cove Lighting Halo */}
          <div className="absolute top-[15%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20">
            <button
              onClick={() => setIsNightMode(!isNightMode)}
              className="relative flex h-8 w-8 items-center justify-center cursor-pointer group"
              aria-label="Hotspot Cove Halo"
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-7 w-7 bg-[#1C130B] border-2 border-yellow-400 items-center justify-center text-xs font-bold text-yellow-300 shadow-2xl group-hover:scale-110 transition-transform">
                💡
              </span>
            </button>
          </div>

          {/* Bottom Left Live Spec Pill */}
          <div className="absolute bottom-4 left-4 z-10 bg-[#1C130B]/90 backdrop-blur-md border border-[#C5A880]/40 rounded-2xl p-3 text-xs max-w-sm hidden sm:block text-white shadow-xl">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/50"
                style={{ backgroundColor: selectedColor.colorHex }}
              />
              <span className="font-bold text-white">{selectedColor.name}</span>
              <span className="text-[#C5A880] font-semibold">₹{selectedColor.pricePerSqFt}/sq.ft</span>
            </div>
            <p className="text-[11px] text-white/70">
              {activeAppView.name} · {selectedColor.frenchName}
            </p>
          </div>
        </div>
      </section>

      {/* 4. "Avec quoi l'associer ?" (Palette Harmonies Section - Exact Plum Port) */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#8A5836] uppercase tracking-[0.25em] block mb-2 font-['Plus_Jakarta_Sans']">
            HARMONIES DE MATIÈRES
          </span>
          <h2 className="font-['Syne'] text-3xl sm:text-4xl md:text-5xl font-black text-[#1C130B] mb-4">
            Avec quoi l&apos;associer ?
          </h2>
          <p className="text-sm sm:text-base text-[#1C130B]/70 leading-relaxed font-['Plus_Jakarta_Sans']">
            Pour sublimer la profondeur sourde de Green 05 - Stone, nos architectes d&apos;intérieur ont sélectionné ces trois textures complémentaires.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {COMPANION_HARMONIES.map((harmony) => {
            const isAlreadyInTray = swatches.some((s) => s.id === harmony.id);
            return (
              <div
                key={harmony.id}
                className="bg-white rounded-3xl border border-[#C5A880]/30 shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 group"
              >
                <div>
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-5 bg-[#1C130B]">
                    <Image
                      src={harmony.thumbnailUrl || '/images/hero.jpg'}
                      alt={harmony.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-[#1C130B]/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-[#C5A880] border border-[#C5A880]/30">
                      {harmony.frenchName}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="w-5 h-5 rounded-full border border-black/20 shrink-0 shadow-sm"
                      style={{ backgroundColor: harmony.colorHex }}
                    />
                    <h3 className="font-['Syne'] text-xl font-bold text-[#1C130B]">
                      {harmony.name}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[#1C130B]/70 leading-relaxed mb-6">
                    {harmony.tagline}
                  </p>
                </div>

                <button
                  onClick={() => handleAddSample(harmony)}
                  disabled={isAlreadyInTray}
                  className={`w-full py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isAlreadyInTray
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-[#1C130B] hover:bg-[#3E2C1E] text-white shadow-md'
                  }`}
                >
                  {isAlreadyInTray ? (
                    <>
                      <Check className="w-4 h-4 text-green-700" />
                      <span>Ajouté au panier d&apos;échantillons</span>
                    </>
                  ) : (
                    <>
                      <Box className="w-4 h-4 text-[#C5A880]" />
                      <span>+ Ajouter à ma sélection</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Architectural Quality Guarantees & Technical Specs */}
      <section className="py-14 px-6 bg-[#1C130B] text-[#FAF8F5]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <Clock className="w-8 h-8 text-[#C5A880] shrink-0" />
            <div>
              <h4 className="font-['Syne'] text-base font-bold text-white mb-1">
                Pose en 48 Heures
              </h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Fixation mécanique sèche sur rails invisibles. 0% gravats ni poussière de plâtre.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <Award className="w-8 h-8 text-[#C5A880] shrink-0" />
            <div>
              <h4 className="font-['Syne'] text-base font-bold text-white mb-1">
                Garantie 2 Ans
              </h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Certificat de garantie numérique assurant la tenue des laques et la stabilité dimensionnelle.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <Layers className="w-8 h-8 text-[#C5A880] shrink-0" />
            <div>
              <h4 className="font-['Syne'] text-base font-bold text-white mb-1">
                Confort Acoustique NRC 0.85
              </h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Feutre PET recyclé 9mm intégré absorbant les réverbérations des baies vitrées.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <ShieldCheck className="w-8 h-8 text-[#C5A880] shrink-0" />
            <div>
              <h4 className="font-['Syne'] text-base font-bold text-white mb-1">
                Escrow 10/60/30
              </h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Seulement 10% d&apos;acompte à la réservation, 60% à la livraison du van, 30% après réception.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Persistent Floating Swatch Bar (3-Slot Plum Tray) */}
      <PlumSwatchBar />

      {/* 7. Global Footer */}
      <Footer />
    </div>
  );
}

export default function StoneCollectionPage() {
  return (
    <SwatchProvider>
      <CollectionStoneContent />
    </SwatchProvider>
  );
}
