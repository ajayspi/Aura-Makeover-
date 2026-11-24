"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Box,
  Check,
  Plus,
  ArrowRight,
  ShieldCheck,
  Info,
  SlidersHorizontal,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import PlumCanvasCompositor from '@/components/styler/PlumCanvasCompositor';
import { SwatchProvider, useSwatch, Swatch } from '@/context/SwatchContext';
import PlumSwatchBar from '@/components/swatches/PlumSwatchBar';

/* =========================================================================
   TYPES & PALETTE DATA
========================================================================= */

export type FrontProfile = 'lisse' | 'cannele' | 'cadre';
export type FrontFinish = 'matte' | 'wood' | 'duo';
export type HandleStyle = 'mini-rond' | 'liseret' | 'point' | 'jpull';
export type HandleMetal = 'brass' | 'black' | 'chrome';
export type WorktopMaterial = 'calacatta' | 'basalt' | 'terrazzo' | 'oak';
export type SplashbackStyle = 'calacatta-high' | 'calacatta-low' | 'fluted' | 'mirror';
export type TapStyle = 'gooseneck' | 'monobloc';
export type TapMetal = 'brass' | 'black' | 'chrome';
export type FlooringStyle = 'parquet-droit' | 'chevron' | 'terrazzo-tile';

export interface KitchenColor {
  id: string;
  name: string;
  category: 'Earthy Greens' | 'Warm Neutrals' | 'Blues & Sky' | 'Terracotta & Spices';
  hex: string;
  description: string;
  textureNote: string;
  isNew?: boolean;
}

export const KITCHEN_COLORS: KitchenColor[] = [
  // Earthy Greens
  { id: 'argile', name: 'Argile Sand', category: 'Earthy Greens', hex: '#C8B8A6', description: 'A delicate mineral beige infused with natural sandstone undertones.', textureNote: 'Anti-fingerprint matte lacquer' },
  { id: 'sage', name: 'Sage Whisper', category: 'Earthy Greens', hex: '#9BAE9A', description: 'Subtle herb green that calms natural morning daylight.', textureNote: 'Anti-fingerprint matte lacquer' },
  { id: 'olive', name: 'Olive Grove', category: 'Earthy Greens', hex: '#5F6C55', description: 'Durable Mediterranean olive with warm earthy depth.', textureNote: 'Anti-fingerprint matte lacquer' },
  { id: 'earthen', name: 'Earthen Clay', category: 'Earthy Greens', hex: '#A88870', description: 'Unvarnished raw terracotta and terracotta silt.', textureNote: 'Anti-fingerprint matte lacquer' },
  { id: 'forest', name: 'Forest Shadow', category: 'Earthy Greens', hex: '#324636', description: 'Deep botanical evergreen inspired by high-canopy forests.', textureNote: 'Anti-fingerprint matte lacquer' },
  { id: 'vert-gris', name: 'Vert de Gris', category: 'Earthy Greens', hex: '#7D8C7C', description: 'Patinated sage with muted slate grey balance.', textureNote: 'Anti-fingerprint matte lacquer' },
  { id: 'canopee', name: 'Canopée Green', category: 'Earthy Greens', hex: '#273E2F', description: 'Architectural botanical emerald for luxury contrast.', textureNote: 'Anti-fingerprint matte lacquer', isNew: true },
  { id: 'amandier', name: 'Amandier Grisé', category: 'Earthy Greens', hex: '#8E988A', description: 'Soft frosted almond green with silver reflections.', textureNote: 'Anti-fingerprint matte lacquer' },

  // Warm Neutrals
  { id: 'linen', name: 'Linen Cream', category: 'Warm Neutrals', hex: '#EDE6DA', description: 'Warm organic raw textile hue that pairs with light woods.', textureNote: 'Anti-fingerprint matte lacquer' },
  { id: 'ivory', name: 'Ivory Silk', category: 'Warm Neutrals', hex: '#F6F3EC', description: 'Warm off-white without stark sterile glare.', textureNote: 'Anti-fingerprint matte lacquer' },
  { id: 'alabaster', name: 'Pure Alabaster', category: 'Warm Neutrals', hex: '#FAFAFA', description: 'Architectural clean white with 6% satin sheen.', textureNote: 'Anti-fingerprint matte lacquer' },
  { id: 'taupe', name: 'Warm Taupe', category: 'Warm Neutrals', hex: '#A19082', description: 'Sophisticated greige tone balancing marble veins.', textureNote: 'Anti-fingerprint matte lacquer' },
  { id: 'espresso', name: 'Espresso Deep', category: 'Warm Neutrals', hex: '#2C211B', description: 'Signature dark espresso roast with velvet depth.', textureNote: 'Anti-fingerprint matte lacquer', isNew: true },
  { id: 'biscuit', name: 'Biscuit Rosé', category: 'Warm Neutrals', hex: '#D5BFB3', description: 'Blushed warm chalk with subtle terracotta glow.', textureNote: 'Anti-fingerprint matte lacquer' },
  { id: 'sable', name: 'Sable Dune', category: 'Warm Neutrals', hex: '#D6C7B2', description: 'Desert sand warmth suited for Kokapet apartments.', textureNote: 'Anti-fingerprint matte lacquer' },
  { id: 'moka', name: 'Moka Warm', category: 'Warm Neutrals', hex: '#705A4A', description: 'Velvety roasted cocoa ground for grounding islands.', textureNote: 'Anti-fingerprint matte lacquer' },

  // Blues & Sky
  { id: 'lagoon', name: 'Lagoon Mist', category: 'Blues & Sky', hex: '#588995', description: 'Sea spray green-blue with cool contemporary air.', textureNote: 'Anti-fingerprint matte lacquer' },
  { id: 'navy', name: 'Midnight Navy', category: 'Blues & Sky', hex: '#202E3D', description: 'Deep maritime navy providing bold architectural contrast.', textureNote: 'Anti-fingerprint matte lacquer' },
  { id: 'slate', name: 'Slate Cloud', category: 'Blues & Sky', hex: '#788697', description: 'Overcast monsoon blue-grey with peaceful clarity.', textureNote: 'Anti-fingerprint matte lacquer' },
  { id: 'peacock', name: 'Peacock Indigo', category: 'Blues & Sky', hex: '#1D4150', description: 'Regal jewel-tone cyan with deep matte richness.', textureNote: 'Anti-fingerprint matte lacquer' },
  { id: 'frost', name: 'Frost Silver', category: 'Blues & Sky', hex: '#C2CACF', description: 'Crisp morning frost with pale blue-silver shimmer.', textureNote: 'Anti-fingerprint matte lacquer' },
  { id: 'ciel', name: 'Ciel Voilé', category: 'Blues & Sky', hex: '#A4B9C4', description: 'Veiled morning sky with airy, light-reflective lightness.', textureNote: 'Anti-fingerprint matte lacquer' },

  // Terracotta & Spices
  { id: 'terracotta', name: 'Terracotta Rust', category: 'Terracotta & Spices', hex: '#8A5836', description: 'Earthy baked red clay and warm sun-drenched pottery.', textureNote: 'Anti-fingerprint matte lacquer' },
  { id: 'piment', name: 'Kashmiri Piment', category: 'Terracotta & Spices', hex: '#9E3929', description: 'Vibrant spice paprika with warm velvet undertone.', textureNote: 'Anti-fingerprint matte lacquer', isNew: true },
  { id: 'amber', name: 'Warm Amber Gold', category: 'Terracotta & Spices', hex: '#C5A880', description: 'Signature AuroMakeover brass-gold metallic glow.', textureNote: 'Metallic satin architectural finish' },
  { id: 'caramel', name: 'Caramel Gold', category: 'Terracotta & Spices', hex: '#A37745', description: 'Rich toasted honeycomb glaze that radiates warmth.', textureNote: 'Anti-fingerprint matte lacquer' },
  { id: 'grenat', name: 'Grenat Crimson', category: 'Terracotta & Spices', hex: '#60212B', description: 'Deep Bordeaux burgundy wine with high dramatic luxury.', textureNote: 'Anti-fingerprint matte lacquer' },
  { id: 'saffron', name: 'Saffron Sun', category: 'Terracotta & Spices', hex: '#D69845', description: 'Golden warm Indian spice bringing sunlight to kitchens.', textureNote: 'Anti-fingerprint matte lacquer' },
];

/* Camera angles */
export interface CameraAngle {
  id: number;
  name: string;
  subtitle: string;
  defaultImage: string;
  maskImage: string;
}

export const KITCHEN_VIEWS: CameraAngle[] = [
  {
    id: 0,
    name: 'Frontal Wide Perspective',
    subtitle: 'Full Linear Run & Integrated Appliances',
    defaultImage: '/images/styler/kitchen_5/view_0.jpg',
    maskImage: '/images/styler/kitchen_5/mask_view_0.png',
  },
  {
    id: 1,
    name: '3/4 Perspective Angle',
    subtitle: 'Side Relief & Architectural Shadow Play',
    defaultImage: '/images/styler/kitchen_5/view_1.jpg',
    maskImage: '/images/styler/kitchen_5/mask_view_1.png',
  },
  {
    id: 2,
    name: 'Intimate Detail View',
    subtitle: 'Brass Hardware, Drawer Relining & Marble Edge',
    defaultImage: '/images/styler/kitchen_5/view_2.jpg',
    maskImage: '/images/styler/kitchen_5/mask_view_2.png',
  },
];

/* =========================================================================
   MAIN KITCHEN STYLER COMPONENT
========================================================================= */

function KitchenStylerContent() {
  const { addSwatch, swatches } = useSwatch();

  // Active customizer selections
  const [activeAngleIndex, setActiveAngleIndex] = useState<number>(0);
  const [selectedColorId, setSelectedColorId] = useState<string>('argile');
  const [selectedProfile, setSelectedProfile] = useState<FrontProfile>('lisse');
  const [selectedFinish, setSelectedFinish] = useState<FrontFinish>('matte');
  const [selectedHandleStyle, setSelectedHandleStyle] = useState<HandleStyle>('mini-rond');
  const [selectedHandleMetal, setSelectedHandleMetal] = useState<HandleMetal>('brass');
  const [selectedWorktop, setSelectedWorktop] = useState<WorktopMaterial>('calacatta');
  const [selectedSplashback, setSelectedSplashback] = useState<SplashbackStyle>('calacatta-high');
  const [selectedTapStyle, setSelectedTapStyle] = useState<TapStyle>('gooseneck');
  const [selectedTapMetal, setSelectedTapMetal] = useState<TapMetal>('brass');
  const [selectedFlooring, setSelectedFlooring] = useState<FlooringStyle>('parquet-droit');

  // Conversion Modals
  const [isSampleBoxOpen, setIsSampleBoxOpen] = useState(false);
  const [isBOMOpen, setIsBOMOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quoteSociety, setQuoteSociety] = useState('My Home Bhooja (Tower 4)');
  const [quoteName, setQuoteName] = useState('');
  const [quotePhone, setQuotePhone] = useState('');
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  // Active color lookup
  const currentColor = useMemo(() => {
    return KITCHEN_COLORS.find((c) => c.id === selectedColorId) || KITCHEN_COLORS[0];
  }, [selectedColorId]);

  // Current camera angle
  const currentView = useMemo(() => {
    return KITCHEN_VIEWS[activeAngleIndex] || KITCHEN_VIEWS[0];
  }, [activeAngleIndex]);

  // Dynamic image and tint resolver for authentic photorealism
  const activeSceneConfig = useMemo(() => {
    const isBlueFamily = ['lagoon', 'navy', 'slate', 'peacock', 'frost', 'ciel'].includes(selectedColorId);
    const isTerracottaFamily = ['argile', 'terracotta', 'piment'].includes(selectedColorId);

    let activeImage = currentView.defaultImage;
    let effectiveTint = currentColor.hex;

    if (activeAngleIndex === 0) {
      if (isBlueFamily) {
        activeImage = '/images/styler/kitchen_5/view_4.jpg';
        if (selectedColorId === 'lagoon') effectiveTint = '';
      } else if (isTerracottaFamily) {
        activeImage = '/images/styler/kitchen_5/view_0.jpg';
        if (selectedColorId === 'terracotta' || selectedColorId === 'piment' || selectedColorId === 'argile') {
          effectiveTint = '';
        }
      }
    } else if (activeAngleIndex === 2) {
      if (isBlueFamily) {
        activeImage = '/images/styler/kitchen_5/view_3.jpg';
        if (selectedColorId === 'lagoon') effectiveTint = '';
      } else if (isTerracottaFamily) {
        activeImage = '/images/styler/kitchen_5/view_2.jpg';
        if (selectedColorId === 'terracotta' || selectedColorId === 'piment' || selectedColorId === 'argile') {
          effectiveTint = '';
        }
      }
    } else if (activeAngleIndex === 1) {
      if (isTerracottaFamily) {
        activeImage = '/images/styler/kitchen_5/view_1.jpg';
        if (selectedColorId === 'terracotta' || selectedColorId === 'piment' || selectedColorId === 'argile') {
          effectiveTint = '';
        }
      }
    }

    return {
      activeImage,
      effectiveTint,
      maskImage: effectiveTint ? currentView.maskImage : undefined,
    };
  }, [selectedColorId, activeAngleIndex, currentView, currentColor.hex]);

  // Pricing & BOM Calculations
  const pricing = useMemo(() => {
    let baseFronts = 138000;
    if (selectedProfile === 'cannele') baseFronts = 175000;
    if (selectedProfile === 'cadre') baseFronts = 158000;

    let finishAddon = 0;
    if (selectedFinish === 'wood') finishAddon = 28000;
    if (selectedFinish === 'duo') finishAddon = 19000;

    let handlesCost = 14500;
    if (selectedHandleStyle === 'point') handlesCost = 9800;
    if (selectedHandleStyle === 'liseret') handlesCost = 18000;
    if (selectedHandleStyle === 'jpull') handlesCost = 0;

    let worktopCost = 48000;
    if (selectedWorktop === 'basalt') worktopCost = 42000;
    if (selectedWorktop === 'terrazzo') worktopCost = 38000;
    if (selectedWorktop === 'oak') worktopCost = 34000;

    let splashbackCost = 32000;
    if (selectedSplashback === 'calacatta-low') splashbackCost = 14000;
    if (selectedSplashback === 'fluted') splashbackCost = 24000;
    if (selectedSplashback === 'mirror') splashbackCost = 19000;

    let tapCost = 16500;
    if (selectedTapStyle === 'monobloc') tapCost = 12500;

    const installationLabor = 18500;
    const subtotal =
      baseFronts + finishAddon + handlesCost + worktopCost + splashbackCost + tapCost + installationLabor;
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + gst;

    // Escrow Tranches (10 / 60 / 30)
    const tranche1 = Math.round(total * 0.10);
    const tranche2 = Math.round(total * 0.60);
    const tranche3 = total - tranche1 - tranche2;

    return {
      baseFronts,
      finishAddon,
      handlesCost,
      worktopCost,
      splashbackCost,
      tapCost,
      installationLabor,
      subtotal,
      gst,
      total,
      tranche1,
      tranche2,
      tranche3,
    };
  }, [
    selectedProfile,
    selectedFinish,
    selectedHandleStyle,
    selectedWorktop,
    selectedSplashback,
    selectedTapStyle,
  ]);

  // Handler for adding active swatch to Plum Swatch Bar
  const handleAddActiveSwatch = () => {
    const swatchItem: Swatch = {
      id: `kitchen-${currentColor.id}`,
      name: currentColor.name,
      frenchName: currentColor.name,
      category: 'wall',
      colorHex: currentColor.hex,
      pricePerSqFt: Math.round(pricing.baseFronts / 120),
      tagline: `${selectedProfile.toUpperCase()} · ${currentColor.description}`,
      thumbnailUrl: activeSceneConfig.activeImage,
    };
    addSwatch(swatchItem);
  };

  const isCurrentSwatchSaved = swatches.some((s) => s.id === `kitchen-${currentColor.id}`);

  return (
    <div className="relative min-h-screen bg-[#1C130B] text-[#FAF8F5] flex flex-col font-['Plus_Jakarta_Sans']">
      {/* 1. COMPACT STICKY HEADER */}
      <header className="sticky top-0 z-30 bg-[#1C130B]/95 backdrop-blur-md border-b border-[#C5A880]/25 px-4 sm:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/collections"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#FAF8F5]/70 hover:text-[#C5A880] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Kits & Collections</span>
          </Link>
          <span className="text-[#C5A880]/40">/</span>
          <span className="text-xs sm:text-sm font-bold text-[#FAF8F5] tracking-wide">
            Line : Kitchen 3D Styler
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSampleBoxOpen(true)}
            aria-haspopup="dialog"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#C5A880]/40 text-xs font-semibold text-[#C5A880] hover:bg-[#C5A880]/10 transition-colors cursor-pointer"
          >
            <Box className="w-3.5 h-3.5" />
            <span>Sample Box ({swatches.length}/3)</span>
          </button>

          <Dialog open={isBOMOpen} onOpenChange={setIsBOMOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF8F5]/10 hover:bg-[#FAF8F5]/15 text-xs font-medium text-[#FAF8F5] transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A880]" />
                <span className="hidden sm:inline">Itemized</span> BOM
              </button>
            </DialogTrigger>
            <DialogContent className="bg-[#1C130B] border-2 border-[#C5A880]/60 text-[#FAF8F5] max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl p-6">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold font-['Syne'] text-[#C5A880] flex items-center gap-2">
                  <Box className="w-5 h-5" />
                  Itemized Bill of Materials (BOM)
                </DialogTitle>
                <DialogDescription className="text-xs text-[#FAF8F5]/70">
                  Engineering breakdown of the Line Kitchen envelope tailored for Hyderabad apartments.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-4 text-xs font-mono">
                <div className="p-3 rounded-2xl bg-[#FAF8F5]/5 border border-[#C5A880]/20 space-y-2">
                  <div className="flex justify-between font-bold text-[#C5A880]">
                    <span>1. FRONT FAÇADES & PANELS ({selectedProfile.toUpperCase()})</span>
                    <span>₹{pricing.baseFronts.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-[11px] text-[#FAF8F5]/70 font-sans">
                    Precision 18mm MR-grade polyurethane substrate with {currentColor.name} finish.
                  </p>
                  {pricing.finishAddon > 0 && (
                    <div className="flex justify-between text-[#FAF8F5]/80 pt-1">
                      <span>• Finish Tier Upgrade ({selectedFinish.toUpperCase()})</span>
                      <span>₹{pricing.finishAddon.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF8F5]/5 border border-[#C5A880]/20 space-y-1">
                  <div className="flex justify-between font-bold text-[#C5A880]">
                    <span>2. HARDWARE & PULLS ({selectedHandleStyle.toUpperCase()})</span>
                    <span>₹{pricing.handlesCost.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-[11px] text-[#FAF8F5]/70 font-sans">
                    Milled solid brass in {selectedHandleMetal.toUpperCase()} finish (12 units + damping hinges).
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF8F5]/5 border border-[#C5A880]/20 space-y-1">
                  <div className="flex justify-between font-bold text-[#C5A880]">
                    <span>3. WORKTOP & COUNTERTOP ({selectedWorktop.toUpperCase()})</span>
                    <span>₹{pricing.worktopCost.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-[11px] text-[#FAF8F5]/70 font-sans">
                    20mm precision chamfered edge with antimicrobial nano-coating.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF8F5]/5 border border-[#C5A880]/20 space-y-1">
                  <div className="flex justify-between font-bold text-[#C5A880]">
                    <span>4. SPLASHBACK WALL UPSTAND</span>
                    <span>₹{pricing.splashbackCost.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-[11px] text-[#FAF8F5]/70 font-sans">
                    Custom fitted seamless moisture barrier ({selectedSplashback}).
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF8F5]/5 border border-[#C5A880]/20 space-y-1">
                  <div className="flex justify-between font-bold text-[#C5A880]">
                    <span>5. ARCHITECTURAL TAPWARE</span>
                    <span>₹{pricing.tapCost.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-[11px] text-[#FAF8F5]/70 font-sans">
                    High-arc pull-out sprayer in {selectedTapMetal} finish.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF8F5]/5 border border-[#C5A880]/20 space-y-1">
                  <div className="flex justify-between font-bold text-[#C5A880]">
                    <span>6. 48-HR RAPID INSTALLATION & FITOUT</span>
                    <span>₹{pricing.installationLabor.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-[11px] text-[#FAF8F5]/70 font-sans">
                    Trained master carpenters, zero civil dust, laser alignment.
                  </p>
                </div>

                {/* Subtotal & Escrow */}
                <div className="pt-3 border-t border-[#C5A880]/30 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>₹{pricing.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#FAF8F5]/70">
                    <span>GST (18%):</span>
                    <span>₹{pricing.gst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#C5A880]">
                    <span>Total Estimated Price:</span>
                    <span>₹{pricing.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* 10 / 60 / 30 Escrow Tranche Visual */}
                <div className="p-3 rounded-2xl bg-[#C5A880]/10 border border-[#C5A880]/40 space-y-2 font-sans">
                  <div className="text-xs font-bold text-[#C5A880] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    10 / 60 / 30 Escrow Protection Guarantee
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="p-2 rounded-xl bg-[#1C130B]/80 border border-[#C5A880]/20">
                      <span className="block font-bold text-[#C5A880]">Tranche 1 (10%)</span>
                      <span className="block text-white font-mono mt-0.5">₹{pricing.tranche1.toLocaleString('en-IN')}</span>
                      <span className="text-[#FAF8F5]/60">Booking & Laser Scan</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#1C130B]/80 border border-[#C5A880]/20">
                      <span className="block font-bold text-[#C5A880]">Tranche 2 (60%)</span>
                      <span className="block text-white font-mono mt-0.5">₹{pricing.tranche2.toLocaleString('en-IN')}</span>
                      <span className="text-[#FAF8F5]/60">Materials Gate Arrival</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#1C130B]/80 border border-[#C5A880]/20">
                      <span className="block font-bold text-[#C5A880]">Tranche 3 (30%)</span>
                      <span className="block text-white font-mono mt-0.5">₹{pricing.tranche3.toLocaleString('en-IN')}</span>
                      <span className="text-[#FAF8F5]/60">48h Sign-Off & Warranty</span>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* 2. SPLIT STAGE & CONFIGURATOR CONTAINER */}
      <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden lg:h-[calc(100vh-56px)]">
        {/* LEFT / CENTER VIEWPORT (The Visualizer Stage) */}
        <div className="relative flex-1 bg-[#150E07] flex items-center justify-center min-h-[50vh] lg:h-full overflow-hidden">
          {/* Composited Canvas Viewport */}
          <div className="relative w-full h-full flex items-center justify-center">
            <PlumCanvasCompositor
              baseImage={activeSceneConfig.activeImage}
              tintColor={activeSceneConfig.effectiveTint}
              maskImage={activeSceneConfig.maskImage}
              className="w-full h-full"
              alt={`Line Kitchen in ${currentColor.name}`}
            />

            {/* Top Overlay Badge */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#1C130B]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C5A880]/40 text-xs">
              <span
                className="w-3 h-3 rounded-full border border-white/40 shadow-sm"
                style={{ backgroundColor: currentColor.hex }}
              />
              <span className="font-semibold text-[#FAF8F5]">{currentColor.name}</span>
              <span className="text-[#C5A880]/70">• {selectedProfile.toUpperCase()}</span>
            </div>

            {/* View Indicators / Pagination Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-[#1C130B]/85 backdrop-blur-md px-4 py-2 rounded-full border border-[#C5A880]/40 shadow-lg">
              <button
                type="button"
                aria-label="Previous Camera Angle"
                onClick={() =>
                  setActiveAngleIndex((prev) => (prev === 0 ? KITCHEN_VIEWS.length - 1 : prev - 1))
                }
                className="p-1 text-[#FAF8F5]/70 hover:text-[#C5A880] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 px-2">
                {KITCHEN_VIEWS.map((v, idx) => (
                  <button
                    key={v.id}
                    type="button"
                    aria-label={`View angle ${idx + 1}: ${v.name}`}
                    onClick={() => setActiveAngleIndex(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      activeAngleIndex === idx
                        ? 'w-6 bg-[#C5A880]'
                        : 'w-2.5 bg-white/30 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                aria-label="Next Camera Angle"
                onClick={() =>
                  setActiveAngleIndex((prev) => (prev === KITCHEN_VIEWS.length - 1 ? 0 : prev + 1))
                }
                className="p-1 text-[#FAF8F5]/70 hover:text-[#C5A880] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Perspective Subtitle */}
          <div className="hidden lg:block absolute bottom-3 left-6 text-xs text-[#FAF8F5]/50 pointer-events-none">
            <span>{currentView.name} — {currentView.subtitle}</span>
          </div>
        </div>

        {/* RIGHT CONFIGURATOR PANEL (Plum Floating Card UX) */}
        <aside
          aria-label="Kitchen Customizer Panel"
          className="w-full lg:w-[420px] xl:w-[460px] bg-[#1C130B] border-t lg:border-t-0 lg:border-l border-[#C5A880]/30 flex flex-col h-auto lg:h-full z-20"
        >
          {/* Scrollable Options Stack */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
            {/* Title & Collection Badge */}
            <div className="space-y-1 pb-4 border-b border-[#C5A880]/20">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wider text-[#C5A880] uppercase">
                  Line Collection · 48h Makeover
                </span>
                <span className="text-[11px] text-[#FAF8F5]/60 bg-[#FAF8F5]/5 px-2 py-0.5 rounded-full border border-[#C5A880]/20">
                  Ready in 48 Hours
                </span>
              </div>
              <h1 className="text-2xl font-bold font-['Syne'] text-[#FAF8F5]">
                Customizable Kitchen Envelope
              </h1>
              <p className="text-xs text-[#FAF8F5]/70">
                Upgrade standard builder carcasses to luxury European finishes without civil demolition.
              </p>
            </div>

            {/* TABBED OPTIONS SECTIONS */}
            <TabsPrimitive.Root defaultValue="facades" className="space-y-5">
              <TabsPrimitive.List className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-[#FAF8F5]/5 border border-[#C5A880]/20 text-xs">
                <TabsPrimitive.Trigger
                  value="facades"
                  className="py-2 rounded-xl font-semibold data-[state=active]:bg-[#C5A880] data-[state=active]:text-[#1C130B] text-[#FAF8F5]/70 hover:text-white transition-all cursor-pointer text-center"
                >
                  Fronts
                </TabsPrimitive.Trigger>
                <TabsPrimitive.Trigger
                  value="handles"
                  className="py-2 rounded-xl font-semibold data-[state=active]:bg-[#C5A880] data-[state=active]:text-[#1C130B] text-[#FAF8F5]/70 hover:text-white transition-all cursor-pointer text-center"
                >
                  Handles
                </TabsPrimitive.Trigger>
                <TabsPrimitive.Trigger
                  value="worktop"
                  className="py-2 rounded-xl font-semibold data-[state=active]:bg-[#C5A880] data-[state=active]:text-[#1C130B] text-[#FAF8F5]/70 hover:text-white transition-all cursor-pointer text-center"
                >
                  Worktop
                </TabsPrimitive.Trigger>
                <TabsPrimitive.Trigger
                  value="extras"
                  className="py-2 rounded-xl font-semibold data-[state=active]:bg-[#C5A880] data-[state=active]:text-[#1C130B] text-[#FAF8F5]/70 hover:text-white transition-all cursor-pointer text-center"
                >
                  Details
                </TabsPrimitive.Trigger>
              </TabsPrimitive.List>

              {/* TAB 1: FRONTS & CABINET DOORS (Façades) */}
              <TabsPrimitive.Content value="facades" className="space-y-6 focus:outline-none">
                {/* 1. Profile / Design */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#C5A880] uppercase tracking-wider text-[11px]">
                      1. Profile Style
                    </span>
                    <span className="text-[#FAF8F5]/60 text-[11px]">
                      {selectedProfile === 'lisse' && 'Sleek Smooth Slab'}
                      {selectedProfile === 'cannele' && 'Architectural Fluted Louver'}
                      {selectedProfile === 'cadre' && 'Modern Shaker Frame'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#FAF8F5]/5 border border-[#C5A880]/20">
                    <button
                      type="button"
                      onClick={() => setSelectedProfile('lisse')}
                      className={`h-9 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer truncate ${
                        selectedProfile === 'lisse'
                          ? 'bg-[#C5A880] text-[#1C130B] shadow-sm'
                          : 'text-[#FAF8F5]/70 hover:text-white'
                      }`}
                    >
                      Lisse
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedProfile('cannele')}
                      className={`h-9 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer truncate ${
                        selectedProfile === 'cannele'
                          ? 'bg-[#C5A880] text-[#1C130B] shadow-sm'
                          : 'text-[#FAF8F5]/70 hover:text-white'
                      }`}
                    >
                      Cannelé
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedProfile('cadre')}
                      className={`h-9 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer truncate ${
                        selectedProfile === 'cadre'
                          ? 'bg-[#C5A880] text-[#1C130B] shadow-sm'
                          : 'text-[#FAF8F5]/70 hover:text-white'
                      }`}
                    >
                      À Cadre
                    </button>
                  </div>
                </div>

                {/* 2. Finish Tier */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#C5A880] uppercase tracking-wider text-[11px]">
                      2. Finish Quality
                    </span>
                    <span className="text-[#FAF8F5]/60 text-[11px]">
                      {selectedFinish === 'matte' && 'Anti-Fingerprint Velvet'}
                      {selectedFinish === 'wood' && 'Quarter-Cut Oak (+₹28k)'}
                      {selectedFinish === 'duo' && 'Two-Tone Split (+₹19k)'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#FAF8F5]/5 border border-[#C5A880]/20">
                    <button
                      type="button"
                      onClick={() => setSelectedFinish('matte')}
                      className={`h-9 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer truncate ${
                        selectedFinish === 'matte'
                          ? 'bg-[#C5A880] text-[#1C130B] shadow-sm'
                          : 'text-[#FAF8F5]/70 hover:text-white'
                      }`}
                    >
                      Matte Lacquer
                    </button>
                    <button
                      type="button"
                      aria-label="Natural Oak (+₹28k)"
                      onClick={() => setSelectedFinish('wood')}
                      className={`h-9 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer truncate ${
                        selectedFinish === 'wood'
                          ? 'bg-[#C5A880] text-[#1C130B] shadow-sm'
                          : 'text-[#FAF8F5]/70 hover:text-white'
                      }`}
                    >
                      Oak (+₹28k)
                    </button>
                    <button
                      type="button"
                      aria-label="Duo Tone (+₹19k)"
                      onClick={() => setSelectedFinish('duo')}
                      className={`h-9 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer truncate ${
                        selectedFinish === 'duo'
                          ? 'bg-[#C5A880] text-[#1C130B] shadow-sm'
                          : 'text-[#FAF8F5]/70 hover:text-white'
                      }`}
                    >
                      Duo (+₹19k)
                    </button>
                  </div>
                </div>

                {/* 3. Colorama Swatches (34 Designer Shades) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#C5A880] uppercase tracking-wider text-[11px]">
                      3. Color Palette ({currentColor.name})
                    </span>
                    {isCurrentSwatchSaved ? (
                      <button
                        type="button"
                        onClick={() => setIsSampleBoxOpen(true)}
                        className="text-[11px] text-[#C5A880] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3 h-3 text-[#15803D]" />
                        <span>Saved in Box</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleAddActiveSwatch}
                        className="text-[11px] text-[#C5A880] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add to Swatch Box</span>
                      </button>
                    )}
                  </div>

                  {/* Swatches categorized by mood */}
                  {(['Earthy Greens', 'Warm Neutrals', 'Blues & Sky', 'Terracotta & Spices'] as const).map(
                    (category) => {
                      const categoryColors = KITCHEN_COLORS.filter((c) => c.category === category);
                      return (
                        <div key={category} className="space-y-1.5">
                          <span className="text-[10px] font-semibold text-[#FAF8F5]/50 tracking-wider uppercase">
                            {category}
                          </span>
                          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                            {categoryColors.map((color) => {
                              const isSelected = selectedColorId === color.id;
                              return (
                                <button
                                  key={color.id}
                                  type="button"
                                  onClick={() => setSelectedColorId(color.id)}
                                  title={`${color.name} — ${color.description}`}
                                  className={`relative group w-10 h-10 rounded-2xl border-2 transition-transform duration-200 cursor-pointer flex items-center justify-center ${
                                    isSelected
                                      ? 'scale-110 border-white shadow-[0_0_12px_rgba(197,168,128,0.8)] z-10'
                                      : 'border-black/30 hover:scale-105'
                                  }`}
                                  style={{ backgroundColor: color.hex }}
                                >
                                  {isSelected && (
                                    <Check className="w-4 h-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
                                  )}
                                  {color.isNew && (
                                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#C5A880] border border-[#1C130B]" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                  )}

                  {/* Selected Color Detail Note */}
                  <div className="p-3 rounded-2xl bg-[#FAF8F5]/5 border border-[#C5A880]/20 text-xs flex items-start gap-2.5">
                    <span
                      className="w-5 h-5 rounded-full shrink-0 border border-white/30 shadow-sm mt-0.5"
                      style={{ backgroundColor: currentColor.hex }}
                    />
                    <div>
                      <span className="font-bold text-[#FAF8F5]">{currentColor.name}</span>
                      <p className="text-[11px] text-[#FAF8F5]/70 mt-0.5">{currentColor.description}</p>
                    </div>
                  </div>
                </div>
              </TabsPrimitive.Content>

              {/* TAB 2: HANDLES & HARDWARE (Poignées) */}
              <TabsPrimitive.Content value="handles" className="space-y-5 focus:outline-none">
                <div className="space-y-2.5">
                  <span className="block text-xs font-bold text-[#C5A880] uppercase tracking-wider">
                    Handle Model
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedHandleStyle('mini-rond')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedHandleStyle === 'mini-rond'
                          ? 'border-[#C5A880] bg-[#C5A880]/15'
                          : 'border-[#C5A880]/20 bg-[#FAF8F5]/5'
                      }`}
                    >
                      <span className="block font-bold text-[#FAF8F5]">Mini-Rond</span>
                      <span className="text-[11px] text-[#FAF8F5]/60">30mm Circular Knob</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedHandleStyle('liseret')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedHandleStyle === 'liseret'
                          ? 'border-[#C5A880] bg-[#C5A880]/15'
                          : 'border-[#C5A880]/20 bg-[#FAF8F5]/5'
                      }`}
                    >
                      <span className="block font-bold text-[#FAF8F5]">Liseret</span>
                      <span className="text-[11px] text-[#FAF8F5]/60">Linear Edge Pull</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedHandleStyle('point')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedHandleStyle === 'point'
                          ? 'border-[#C5A880] bg-[#C5A880]/15'
                          : 'border-[#C5A880]/20 bg-[#FAF8F5]/5'
                      }`}
                    >
                      <span className="block font-bold text-[#FAF8F5]">Point</span>
                      <span className="text-[11px] text-[#FAF8F5]/60">Tactile Stud Pin</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedHandleStyle('jpull')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedHandleStyle === 'jpull'
                          ? 'border-[#C5A880] bg-[#C5A880]/15'
                          : 'border-[#C5A880]/20 bg-[#FAF8F5]/5'
                      }`}
                    >
                      <span className="block font-bold text-[#FAF8F5]">J-Pull</span>
                      <span className="text-[11px] text-[#FAF8F5]/60">Handleless Groove</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <span className="block text-xs font-bold text-[#C5A880] uppercase tracking-wider">
                    Metal Finish
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedHandleMetal('brass')}
                      className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        selectedHandleMetal === 'brass'
                          ? 'border-[#C5A880] bg-[#C5A880]/20 text-[#C5A880] font-bold'
                          : 'border-[#C5A880]/20 bg-[#FAF8F5]/5 text-[#FAF8F5]/70'
                      }`}
                    >
                      Brushed Brass
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedHandleMetal('black')}
                      className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        selectedHandleMetal === 'black'
                          ? 'border-[#C5A880] bg-[#C5A880]/20 text-[#C5A880] font-bold'
                          : 'border-[#C5A880]/20 bg-[#FAF8F5]/5 text-[#FAF8F5]/70'
                      }`}
                    >
                      Matte Black
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedHandleMetal('chrome')}
                      className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        selectedHandleMetal === 'chrome'
                          ? 'border-[#C5A880] bg-[#C5A880]/20 text-[#C5A880] font-bold'
                          : 'border-[#C5A880]/20 bg-[#FAF8F5]/5 text-[#FAF8F5]/70'
                      }`}
                    >
                      Satin Chrome
                    </button>
                  </div>
                </div>
              </TabsPrimitive.Content>

              {/* TAB 3: WORKTOP & COUNTERTOP (Plan de travail) */}
              <TabsPrimitive.Content value="worktop" className="space-y-5 focus:outline-none">
                <div className="space-y-2.5">
                  <span className="block text-xs font-bold text-[#C5A880] uppercase tracking-wider">
                    Countertop Stone
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedWorktop('calacatta')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedWorktop === 'calacatta'
                          ? 'border-[#C5A880] bg-[#C5A880]/15'
                          : 'border-[#C5A880]/20 bg-[#FAF8F5]/5'
                      }`}
                    >
                      <span className="block font-bold text-[#FAF8F5]">Calacatta Gold</span>
                      <span className="text-[11px] text-[#FAF8F5]/60">Italian Veined Marble</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedWorktop('basalt')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedWorktop === 'basalt'
                          ? 'border-[#C5A880] bg-[#C5A880]/15'
                          : 'border-[#C5A880]/20 bg-[#FAF8F5]/5'
                      }`}
                    >
                      <span className="block font-bold text-[#FAF8F5]">Volcanic Basalt</span>
                      <span className="text-[11px] text-[#FAF8F5]/60">Matte Slate Quartz</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedWorktop('terrazzo')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedWorktop === 'terrazzo'
                          ? 'border-[#C5A880] bg-[#C5A880]/15'
                          : 'border-[#C5A880]/20 bg-[#FAF8F5]/5'
                      }`}
                    >
                      <span className="block font-bold text-[#FAF8F5]">Smoked Terrazzo</span>
                      <span className="text-[11px] text-[#FAF8F5]/60">Venetian Aggregates</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedWorktop('oak')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedWorktop === 'oak'
                          ? 'border-[#C5A880] bg-[#C5A880]/15'
                          : 'border-[#C5A880]/20 bg-[#FAF8F5]/5'
                      }`}
                    >
                      <span className="block font-bold text-[#FAF8F5]">Solid Oak Block</span>
                      <span className="text-[11px] text-[#FAF8F5]/60">Hardwood Butcherblock</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <span className="block text-xs font-bold text-[#C5A880] uppercase tracking-wider">
                    Crédence (Splashback)
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedSplashback('calacatta-high')}
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedSplashback === 'calacatta-high'
                          ? 'border-[#C5A880] bg-[#C5A880]/15'
                          : 'border-[#C5A880]/20 bg-[#FAF8F5]/5'
                      }`}
                    >
                      <span className="block font-bold text-[#FAF8F5]">Full Height (600mm)</span>
                      <span className="text-[10px] text-[#FAF8F5]/60">Full Slab Cladding</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSplashback('calacatta-low')}
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedSplashback === 'calacatta-low'
                          ? 'border-[#C5A880] bg-[#C5A880]/15'
                          : 'border-[#C5A880]/20 bg-[#FAF8F5]/5'
                      }`}
                    >
                      <span className="block font-bold text-[#FAF8F5]">Low Upstand (100mm)</span>
                      <span className="text-[10px] text-[#FAF8F5]/60">Minimalist Strip</span>
                    </button>
                  </div>
                </div>
              </TabsPrimitive.Content>

              {/* TAB 4: DETAILS & TAPWARE (Mitigeur & Sol) */}
              <TabsPrimitive.Content value="extras" className="space-y-5 focus:outline-none">
                <div className="space-y-2.5">
                  <span className="block text-xs font-bold text-[#C5A880] uppercase tracking-wider">
                    Mitigeur (Tap & Faucet)
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedTapStyle('gooseneck')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedTapStyle === 'gooseneck'
                          ? 'border-[#C5A880] bg-[#C5A880]/15'
                          : 'border-[#C5A880]/20 bg-[#FAF8F5]/5'
                      }`}
                    >
                      <span className="block font-bold text-[#FAF8F5]">Line Gooseneck</span>
                      <span className="text-[11px] text-[#FAF8F5]/60">Pull-Out High-Arc</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTapStyle('monobloc')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedTapStyle === 'monobloc'
                          ? 'border-[#C5A880] bg-[#C5A880]/15'
                          : 'border-[#C5A880]/20 bg-[#FAF8F5]/5'
                      }`}
                    >
                      <span className="block font-bold text-[#FAF8F5]">Monobloc Classic</span>
                      <span className="text-[11px] text-[#FAF8F5]/60">Architectural Minimal</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <span className="block text-xs font-bold text-[#C5A880] uppercase tracking-wider">
                    Tapware Metal
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedTapMetal('brass')}
                      className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        selectedTapMetal === 'brass'
                          ? 'border-[#C5A880] bg-[#C5A880]/20 text-[#C5A880] font-bold'
                          : 'border-[#C5A880]/20 bg-[#FAF8F5]/5 text-[#FAF8F5]/70'
                      }`}
                    >
                      Brushed Brass
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTapMetal('black')}
                      className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        selectedTapMetal === 'black'
                          ? 'border-[#C5A880] bg-[#C5A880]/20 text-[#C5A880] font-bold'
                          : 'border-[#C5A880]/20 bg-[#FAF8F5]/5 text-[#FAF8F5]/70'
                      }`}
                    >
                      Matte Black
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTapMetal('chrome')}
                      className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        selectedTapMetal === 'chrome'
                          ? 'border-[#C5A880] bg-[#C5A880]/20 text-[#C5A880] font-bold'
                          : 'border-[#C5A880]/20 bg-[#FAF8F5]/5 text-[#FAF8F5]/70'
                      }`}
                    >
                      Steel Chrome
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <span className="block text-xs font-bold text-[#C5A880] uppercase tracking-wider">
                    Sol (Flooring Environment)
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedFlooring('parquet-droit')}
                      className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        selectedFlooring === 'parquet-droit'
                          ? 'border-[#C5A880] bg-[#C5A880]/20 text-[#C5A880] font-bold'
                          : 'border-[#C5A880]/20 bg-[#FAF8F5]/5 text-[#FAF8F5]/70'
                      }`}
                    >
                      Straight Oak
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedFlooring('chevron')}
                      className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        selectedFlooring === 'chevron'
                          ? 'border-[#C5A880] bg-[#C5A880]/20 text-[#C5A880] font-bold'
                          : 'border-[#C5A880]/20 bg-[#FAF8F5]/5 text-[#FAF8F5]/70'
                      }`}
                    >
                      Chevron
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedFlooring('terrazzo-tile')}
                      className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        selectedFlooring === 'terrazzo-tile'
                          ? 'border-[#C5A880] bg-[#C5A880]/20 text-[#C5A880] font-bold'
                          : 'border-[#C5A880]/20 bg-[#FAF8F5]/5 text-[#FAF8F5]/70'
                      }`}
                    >
                      Terrazzo
                    </button>
                  </div>
                </div>
              </TabsPrimitive.Content>
            </TabsPrimitive.Root>
          </div>

          {/* FIXED BOTTOM PRICING & CONVERSION ACTION BAR */}
          <div className="p-4 sm:p-5 border-t border-[#C5A880]/30 bg-[#150E07] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#FAF8F5]/60 tracking-wider">
                  Total Makeover Estimate
                </span>
                <div className="text-xl sm:text-2xl font-bold font-['Syne'] text-[#C5A880]">
                  ₹{pricing.total.toLocaleString('en-IN')}
                  <span className="text-xs font-normal text-[#FAF8F5]/60 font-sans ml-1">
                    (incl. 18% GST)
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsBOMOpen(true)}
                className="text-xs text-[#C5A880] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" />
                <span>View Details</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={isCurrentSwatchSaved ? () => setIsSampleBoxOpen(true) : handleAddActiveSwatch}
                className="py-3 px-4 rounded-2xl border-2 border-[#C5A880]/50 hover:bg-[#C5A880]/15 text-[#C5A880] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Box className="w-4 h-4" />
                <span>{isCurrentSwatchSaved ? 'Saved in Swatch Box' : 'Sample Finish (Free)'}</span>
              </button>

              <Dialog open={isQuoteOpen} onOpenChange={setIsQuoteOpen}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="py-3 px-4 rounded-2xl bg-[#C5A880] hover:bg-[#b8996f] text-[#1C130B] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(197,168,128,0.4)] cursor-pointer"
                  >
                    <span>Get Instant Quote</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-[#1C130B] border-2 border-[#C5A880]/60 text-[#FAF8F5] max-w-lg rounded-3xl p-6 sm:p-8">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold font-['Syne'] text-[#C5A880]">
                      Ready to Transform Your Kitchen?
                    </DialogTitle>
                    <DialogDescription className="text-xs text-[#FAF8F5]/80">
                      Zero civil demolition. 48-Hour rapid installation for high-rise gated societies in Hyderabad.
                    </DialogDescription>
                  </DialogHeader>

                  {quoteSuccess ? (
                    <div className="py-8 text-center space-y-4">
                      <div className="w-14 h-14 mx-auto rounded-full bg-[#15803D]/20 border-2 border-[#15803D] flex items-center justify-center text-[#15803D]">
                        <Check className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold font-['Syne'] text-[#FAF8F5]">
                        Measurement Van Dispatched!
                      </h3>
                      <p className="text-xs text-[#FAF8F5]/70 max-w-sm mx-auto">
                        Our laser measurement specialist will contact you via WhatsApp for your MyGate entry pass at {quoteSociety}.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setIsQuoteOpen(false);
                          setQuoteSuccess(false);
                        }}
                        className="mt-4 px-6 py-2.5 rounded-2xl bg-[#C5A880] text-[#1C130B] font-bold text-xs cursor-pointer"
                      >
                        Back to 3D Styler
                      </button>
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setQuoteSuccess(true);
                      }}
                      className="space-y-4 mt-2"
                    >
                      <div className="p-3.5 rounded-2xl bg-[#FAF8F5]/5 border border-[#C5A880]/20 space-y-1 text-xs">
                        <span className="font-bold text-[#C5A880]">Configured Specification:</span>
                        <p className="text-[11px] text-[#FAF8F5]/80">
                          {currentColor.name} ({selectedProfile.toUpperCase()} · {selectedFinish.toUpperCase()}) +{' '}
                          {selectedHandleStyle.toUpperCase()} in {selectedHandleMetal} +{' '}
                          {selectedWorktop.toUpperCase()} Worktop.
                        </p>
                        <p className="text-sm font-bold text-[#C5A880] pt-1">
                          Estimated Total: ₹{pricing.total.toLocaleString('en-IN')} (incl. GST)
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#FAF8F5]">
                          High-Rise Community / Society
                        </label>
                        <select
                          value={quoteSociety}
                          onChange={(e) => setQuoteSociety(e.target.value)}
                          className="w-full bg-[#1C130B] border border-[#C5A880]/40 rounded-2xl px-3.5 py-2.5 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
                        >
                          <option>My Home Bhooja (Kokapet)</option>
                          <option>Rajapushpa Provincia (Narsingi)</option>
                          <option>Prestige High Fields (Financial District)</option>
                          <option>Aparna Sarovar Zenith (Nallagandla)</option>
                          <option>Jayabheri The Peak (Financial District)</option>
                          <option>My Home Avatar (Puppalguda)</option>
                          <option>Other Luxury High-Rise (Hyderabad)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#FAF8F5]">Full Name</label>
                        <input
                          type="text"
                          required
                          value={quoteName}
                          onChange={(e) => setQuoteName(e.target.value)}
                          placeholder="e.g. Ramesh Varma"
                          className="w-full bg-[#1C130B] border border-[#C5A880]/40 rounded-2xl px-3.5 py-2.5 text-xs text-[#FAF8F5] placeholder-[#FAF8F5]/30 focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#FAF8F5]">
                          WhatsApp Number (for MyGate entry pass)
                        </label>
                        <input
                          type="tel"
                          required
                          value={quotePhone}
                          onChange={(e) => setQuotePhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full bg-[#1C130B] border border-[#C5A880]/40 rounded-2xl px-3.5 py-2.5 text-xs text-[#FAF8F5] placeholder-[#FAF8F5]/30 focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-2xl bg-[#C5A880] hover:bg-[#b8996f] text-[#1C130B] font-bold text-xs transition-colors cursor-pointer mt-2"
                      >
                        Confirm Slot & Dispatch 3D Laser Measurement
                      </button>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </aside>
      </div>

      {/* 4. PLUM SAMPLE BOX DIALOG (Controlled, no floating tray covering stage) */}
      <PlumSwatchBar
        open={isSampleBoxOpen}
        onOpenChange={setIsSampleBoxOpen}
        hideFloatingBar={true}
      />
    </div>
  );
}

export default function PlumKitchenStyler() {
  return (
    <SwatchProvider>
      <KitchenStylerContent />
    </SwatchProvider>
  );
}
