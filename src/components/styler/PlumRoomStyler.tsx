"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Sun,
  Moon,
  Box,
  Check,
  ArrowRight,
  Plus
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
import * as SliderPrimitive from '@radix-ui/react-slider';
import { calculateRollNesting, calculateDynamicPricing } from '@/lib/engines';
import PlumCanvasCompositor, { Point2D } from '@/components/styler/PlumCanvasCompositor';
import { SwatchProvider, useSwatch, Swatch } from '@/context/SwatchContext';
import PlumSwatchBar from '@/components/swatches/PlumSwatchBar';

/* =========================================================================
   SCENE DATA & PRESETS (Plum Living Inspired)
========================================================================= */

interface RoomScene {
  id: string;
  name: string;
  society: string;
  roomType: string;
  baseImage: string;
  dimensions: { widthFt: number; heightFt: number };
  wallPolygon: Point2D[];
  hotspots: {
    id: string;
    label: string;
    x: number; // % from left
    y: number; // % from top
    category: 'wall' | 'stone' | 'blinds' | 'lighting';
  }[];
}

const ROOM_SCENES: RoomScene[] = [
  {
    id: 'kokapet-living',
    name: 'Kokapet Living & Media Wall',
    society: 'My Home Bhooja (Tower 4)',
    roomType: 'Living Hall & TV Credenza',
    baseImage: '/images/after-living-fluted.jpg',
    dimensions: { widthFt: 18, heightFt: 10.5 },
    wallPolygon: [
      { x: 18, y: 10 },
      { x: 82, y: 10 },
      { x: 82, y: 88 },
      { x: 18, y: 88 },
    ],
    hotspots: [
      { id: 'h-wall', label: 'Acoustic Fluted Wall Slat', x: 42, y: 46, category: 'wall' },
      { id: 'h-stone', label: 'Travertine Romano Niche', x: 26, y: 68, category: 'stone' },
      { id: 'h-light', label: '3000K Warm Cove Halo', x: 50, y: 14, category: 'lighting' },
      { id: 'h-blind', label: 'Somfy Motorized Blinds', x: 84, y: 42, category: 'blinds' },
    ],
  },
  {
    id: 'provincia-master',
    name: 'Provincia Master Bed Sanctuary',
    society: 'Rajapushpa Provincia (Tower B)',
    roomType: 'Master Suite & Headboard',
    baseImage: '/images/after-master-pichwai.jpg',
    dimensions: { widthFt: 15, heightFt: 10 },
    wallPolygon: [
      { x: 15, y: 8 },
      { x: 85, y: 8 },
      { x: 85, y: 82 },
      { x: 15, y: 82 },
    ],
    hotspots: [
      { id: 'h-wall', label: 'Pichwai Temple Mural', x: 48, y: 40, category: 'wall' },
      { id: 'h-stone', label: 'Calacatta Gold Slabs', x: 22, y: 64, category: 'stone' },
      { id: 'h-light', label: 'Indirect Amber Backlight', x: 52, y: 16, category: 'lighting' },
      { id: 'h-blind', label: '100% Blackout Blinds', x: 82, y: 38, category: 'blinds' },
    ],
  },
  {
    id: 'highfields-study',
    name: 'High Fields Acoustic Study & Den',
    society: 'Prestige High Fields (Tower 7)',
    roomType: 'Executive Office & Cinema',
    baseImage: '/images/after-office-bright.jpg',
    dimensions: { widthFt: 14, heightFt: 9.5 },
    wallPolygon: [
      { x: 20, y: 10 },
      { x: 80, y: 10 },
      { x: 80, y: 85 },
      { x: 20, y: 85 },
    ],
    hotspots: [
      { id: 'h-wall', label: 'Smoked Oak Acoustic Slat', x: 56, y: 44, category: 'wall' },
      { id: 'h-stone', label: 'Basalte Volcanique Slate', x: 28, y: 58, category: 'stone' },
      { id: 'h-light', label: '3000K Profile Diffuser', x: 50, y: 15, category: 'lighting' },
      { id: 'h-blind', label: 'Solar Lux Shading', x: 88, y: 45, category: 'blinds' },
    ],
  },
  {
    id: 'mandir-sanctum',
    name: 'Bespoke Sacred Mandir Corner',
    society: 'Aparna Sarovar Zenith',
    roomType: 'Pooja Sanctum Niche',
    baseImage: '/images/after-pooja-traditional.jpg',
    dimensions: { widthFt: 12, heightFt: 10 },
    wallPolygon: [
      { x: 22, y: 8 },
      { x: 78, y: 8 },
      { x: 78, y: 88 },
      { x: 22, y: 88 },
    ],
    hotspots: [
      { id: 'h-wall', label: 'Pichwai Gold Canvas', x: 50, y: 38, category: 'wall' },
      { id: 'h-stone', label: 'Translucent Backlit Onyx', x: 50, y: 68, category: 'stone' },
      { id: 'h-light', label: '3000K Sanctuary Halo', x: 50, y: 12, category: 'lighting' },
      { id: 'h-blind', label: 'Motorized Sacred Drape', x: 80, y: 50, category: 'blinds' },
    ],
  },
];

/* =========================================================================
   MATERIAL FINISHES CATALOG
========================================================================= */

interface FinishItem {
  id: string;
  name: string;
  frenchName: string;
  category: 'wall' | 'stone' | 'blinds' | 'lighting';
  pricePerSqFt: number;
  colorHex: string;
  tagline: string;
  specs: string;
  badge?: string;
  overlayImage?: string;
}

const FINISH_CATALOG: FinishItem[] = [
  // 1. Wall Surfaces
  {
    id: 'g05-stone',
    name: 'Green 05 - Stone',
    frenchName: 'Muted Sage Green',
    category: 'wall',
    pricePerSqFt: 85,
    colorHex: '#7D8471',
    tagline: 'Velvet matte lacquer & fluted oak joinery',
    specs: 'Plum Living Signature · NRC 0.85',
    badge: 'Flagship Finish',
    overlayImage: '/images/after-living-fluted.jpg',
  },
  {
    id: 'a01-argile',
    name: 'Natural Earthen Clay',
    frenchName: 'Natural Earthen Clay',
    category: 'wall',
    pricePerSqFt: 80,
    colorHex: '#B69E87',
    tagline: 'Soft mineral hue inspired by raw terracotta and clay',
    specs: 'Matte Powder Finish · Washable',
    overlayImage: '/images/after-living-arch.jpg',
  },
  {
    id: 'slat-smoked-oak',
    name: 'Acoustic Smoked Oak Louver',
    frenchName: 'Smoked Oak Slat',
    category: 'wall',
    pricePerSqFt: 85,
    colorHex: '#3E2C1E',
    tagline: 'High-density composite slats with charcoal PET felt',
    specs: 'NRC 0.85 Acoustic · 48hr Turnaround',
    badge: 'Best Seller',
    overlayImage: '/images/showcase-slats.jpg',
  },
  {
    id: 'slat-natural-walnut',
    name: 'Natural American Walnut Slat',
    frenchName: 'American Walnut Slat',
    category: 'wall',
    pricePerSqFt: 95,
    colorHex: '#4A3324',
    tagline: 'Deep rich walnut grain with concealed clips',
    specs: 'Anti-Warping Guarantee · Zero Civil Work',
    overlayImage: '/images/after-office-wood.jpg',
  },
  {
    id: 'mural-temple-pichwai',
    name: 'Royal Temple Pichwai Mural',
    frenchName: 'Gold Leaf Temple Art',
    category: 'wall',
    pricePerSqFt: 45,
    colorHex: '#C5A880',
    tagline: 'Hand-embossed sacred temple art with metallic leaf',
    specs: 'Zero-VOC Henkel Metylan Adhesive',
    badge: 'Devotional Luxury',
    overlayImage: '/images/after-master-pichwai.jpg',
  },
  {
    id: 'linen-belgian-texture',
    name: 'Belgian Textured Linen Wallcovering',
    frenchName: 'Belgian Textured Linen',
    category: 'wall',
    pricePerSqFt: 45,
    colorHex: '#D6C8B4',
    tagline: 'Breathable organic woven fabric on non-woven backing',
    specs: '< 0.2mm Laser Seam Alignment',
    overlayImage: '/images/after-master-linen.jpg',
  },
  {
    id: 'moulding-neoclassical',
    name: 'Neo-Classical Architectural Mouldings',
    frenchName: 'Neo-Classical Profiles',
    category: 'wall',
    pricePerSqFt: 65,
    colorHex: '#FAF8F5',
    tagline: 'High-density polymer profiles in warm ivory',
    specs: 'Symmetrical Architectural Wall Paneling',
    overlayImage: '/images/after-living-arch.jpg',
  },

  // 2. Natural Stone Collection
  {
    id: 'stone-travertine-romano',
    name: 'Travertine Romano Slabs',
    frenchName: 'Travertine Limestone',
    category: 'stone',
    pricePerSqFt: 110,
    colorHex: '#D7C4A5',
    tagline: 'Honed limestone with warm amber veins',
    specs: '8mm Ultra-Slim · Moisture Sealed',
    badge: 'Mineral Luxury',
    overlayImage: '/images/after-pooja-marble.jpg',
  },
  {
    id: 'stone-volcanic-basalt',
    name: 'Volcanic Basalt Slate',
    frenchName: 'Volcanic Basalt Stone',
    category: 'stone',
    pricePerSqFt: 125,
    colorHex: '#3A3837',
    tagline: 'Dark igneous stone with light-absorbing micro-relief',
    specs: 'Mohs 6.5 Scratch Proof · Zero Glare',
    overlayImage: '/images/fluted-louver.jpg',
  },
  {
    id: 'stone-terrazzo-fume',
    name: 'Venetian Smoked Terrazzo',
    frenchName: 'Venetian Terrazzo',
    category: 'stone',
    pricePerSqFt: 115,
    colorHex: '#A29688',
    tagline: 'Venetian aggregate with river quartz and brass flecks',
    specs: '10mm Composite · Honed Silk Touch',
    overlayImage: '/images/after-living-fluted.jpg',
  },
  {
    id: 'stone-calacatta-gold',
    name: 'Calacatta Gold Marble',
    frenchName: 'Calacatta Gold Slabs',
    category: 'stone',
    pricePerSqFt: 145,
    colorHex: '#EAE5DB',
    tagline: 'Sculptural bronze veins on warm bone-white porcelain',
    specs: 'Indestructible Sintered Slabs',
    badge: 'Ultra Luxury',
    overlayImage: '/images/after-pooja-traditional.jpg',
  },

  // 3. Smart Shading & Blinds
  {
    id: 'blind-somfy-blackout',
    name: 'Somfy Motorized Blackout Blinds',
    frenchName: 'Somfy Motorized Blackout',
    category: 'blinds',
    pricePerSqFt: 120,
    colorHex: '#2C2A29',
    tagline: 'Matter & Alexa automated whisper motor (< 35dB)',
    specs: '100% Total Sleep Blackout',
    badge: 'App Automated',
    overlayImage: '/images/showcase-blinds.jpg',
  },
  {
    id: 'blind-solarlux-cellular',
    name: 'Solar Lux Dual-Cell Honeycomb',
    frenchName: 'Solar Lux Honeycomb',
    category: 'blinds',
    pricePerSqFt: 135,
    colorHex: '#8A5836',
    tagline: 'Rejects 78% West solar heat radiation',
    specs: 'Thermal Barrier · Lowers Temp 4°C',
    overlayImage: '/images/after-master-smart.jpg',
  },
  {
    id: 'blind-linen-sheer',
    name: 'Architectural Sheer Day Shading',
    frenchName: 'Architectural Sheer Fabric',
    category: 'blinds',
    pricePerSqFt: 85,
    colorHex: '#E8E1D5',
    tagline: 'Diffuses harsh afternoon skyline glare',
    specs: 'Preserves Panoramic View',
    overlayImage: '/images/showcase-drapes.jpg',
  },

  // 4. Concealed Cove Lighting
  {
    id: 'light-3000k-cove',
    name: '3000K Warm Architectural Cove LED',
    frenchName: '3000K Cove Strip',
    category: 'lighting',
    pricePerSqFt: 65,
    colorHex: '#FFDF9E',
    tagline: 'Zero-trenching anodized aluminum extrusion with frosted diffuser',
    specs: 'CRI > 92 Museum Grade Warmth',
    badge: 'Zero Civil',
  },
  {
    id: 'light-2700k-sunset',
    name: '2700K Sunset Amber Indirect Halo',
    frenchName: '2700K Amber Halo',
    category: 'lighting',
    pricePerSqFt: 75,
    colorHex: '#FFA852',
    tagline: 'Ultra-warm golden hour dimming profile',
    specs: 'Smart Dimmer · Evening Relaxation',
  },
];

function PlumRoomStylerContent() {
  const { swatches, addSwatch, removeSwatch } = useSwatch();

  // Active Scene
  const [activeScene, setActiveScene] = useState<RoomScene>(ROOM_SCENES[0]);

  // Selections
  const [selectedWall, setSelectedWall] = useState<FinishItem>(
    FINISH_CATALOG.find((f) => f.id === 'g05-stone') || FINISH_CATALOG[0]
  );
  const [selectedStone, setSelectedStone] = useState<FinishItem>(
    FINISH_CATALOG.find((f) => f.id === 'stone-travertine-romano') || FINISH_CATALOG[7]
  );
  const [selectedBlind, setSelectedBlind] = useState<FinishItem>(
    FINISH_CATALOG.find((f) => f.id === 'blind-somfy-blackout') || FINISH_CATALOG[11]
  );
  const [selectedLight, setSelectedLight] = useState<FinishItem>(
    FINISH_CATALOG.find((f) => f.id === 'light-3000k-cove') || FINISH_CATALOG[14]
  );
  
  // Dimensions & Controls
  const [wallWidth, setWallWidth] = useState<number>(activeScene.dimensions.widthFt);
  const [wallHeight, setWallHeight] = useState<number>(activeScene.dimensions.heightFt);
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('wall');
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);

  // Modal State
  const [isSampleModalOpen, setIsSampleModalOpen] = useState<boolean>(false);
  const [sampleSuccess, setSampleSuccess] = useState<boolean>(false);
  const [userFlat, setUserFlat] = useState<string>(activeScene.society);
  const [userName, setUserName] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');

  const toSwatch = (item: FinishItem): Swatch => ({
    id: item.id,
    name: item.name,
    frenchName: item.frenchName,
    colorHex: item.colorHex,
    category: item.category,
    pricePerSqFt: item.pricePerSqFt,
    tagline: item.tagline,
    thumbnailUrl: item.overlayImage,
  });

  const toggleSwatchInTray = (item: FinishItem) => {
    if (swatches.some((s) => s.id === item.id)) {
      removeSwatch(item.id);
    } else {
      addSwatch(toSwatch(item));
    }
  };

  // Sizing Calculation via pure engine
  const nestingResult = useMemo(() => {
    return calculateRollNesting({
      wallWidthFt: wallWidth,
      wallHeightFt: wallHeight,
      rollWidthInches: 42,
      patternRepeatInches: 18,
    });
  }, [wallWidth, wallHeight]);

  // Dynamic Pricing Calculation via pure engine
  const pricingResult = useMemo(() => {
    const isMotorized = selectedBlind.id.includes('somfy') || selectedBlind.id.includes('solarlux');
    const baseRate = selectedWall.pricePerSqFt;
    return calculateDynamicPricing({
      rawMaterialBasePerSqFt: baseRate,
      totalSqFtRequired: Math.round(nestingResult.totalSqFtWithBuffer),
      isSmartMotorized: isMotorized,
    });
  }, [selectedWall, nestingResult, selectedBlind]);


  // Change scene handler
  const handleSceneChange = (scene: RoomScene) => {
    setActiveScene(scene);
    setWallWidth(scene.dimensions.widthFt);
    setWallHeight(scene.dimensions.heightFt);
    setUserFlat(scene.society);
  };

  // Hotspot click handler
  const handleHotspotClick = (category: 'wall' | 'stone' | 'blinds' | 'lighting', id: string) => {
    setActiveTab(category);
    setActiveHotspotId(id);
    setTimeout(() => setActiveHotspotId(null), 1500);
  };

  const bookingText = encodeURIComponent(
    `Hi AuroMakeover! I configured the ${activeScene.name} in the 3D Styler:\n` +
    `• Wall Surface: ${selectedWall.name} (₹${selectedWall.pricePerSqFt}/sq.ft)\n` +
    `• Stone Accent: ${selectedStone.name}\n` +
    `• Shading: ${selectedBlind.name}\n` +
    `• Lighting: ${selectedLight.name}\n` +
    `• Total Est.: ₹${pricingResult.totalRetailPrice.toLocaleString('en-IN')} (10% Booking: ₹${pricingResult.escrowTranches.deposit10.toLocaleString('en-IN')})\n` +
    `Please dispatch the Swatch Van to ${userFlat}.`
  );

  return (
    <div className="w-full bg-[#1C130B] text-[#FAF8F5] min-h-screen flex flex-col font-['Plus_Jakarta_Sans']">
      {/* =========================================================================
          1. STYLER TOP CONTROL BAR (Plum Living Inspired Header)
      ========================================================================= */}
      <header className="w-full bg-[#1C130B] border-b border-[#C5A880]/20 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs font-bold text-[#C5A880] uppercase tracking-widest hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            ← Homepage
          </Link>
          <span className="text-[#C5A880]/30 hidden sm:inline">|</span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-wider font-['Syne']">
              3D Room Styler v3.0 | Hyderabad High-Rises
            </span>
          </div>
        </div>

        {/* Scene Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
          {ROOM_SCENES.map((scene) => {
            const isCurrent = activeScene.id === scene.id;
            return (
              <button
                key={scene.id}
                onClick={() => handleSceneChange(scene)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#C5A880] text-[#1C130B] shadow-md scale-105'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {scene.name.split(' ')[0]} {scene.name.split(' ')[1]}
              </button>
            );
          })}
        </div>

        {/* Lighting & Swatch Tray Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/kit/styler/kitchen_5"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C5A880]/15 hover:bg-[#C5A880]/25 border border-[#C5A880]/40 text-xs font-bold text-[#C5A880] transition-colors"
          >
            <span>Line Kitchen Styler →</span>
          </Link>

          {/* Day / Night Toggle */}
          <button
            onClick={() => setIsNightMode(!isNightMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
              isNightMode
                ? 'bg-[#8A5836] border-[#C5A880] text-white shadow-lg'
                : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'
            }`}
            title="Toggle Day / Night Lighting Simulation"
          >
            {isNightMode ? (
              <>
                <Moon className="w-3.5 h-3.5 text-yellow-300" />
                <span>3000K Cove Halo</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-yellow-400" />
                <span>Natural Daylight</span>
              </>
            )}
          </button>

          {/* Persistent Swatch Tray Button */}
          <button
            onClick={() => setIsSampleModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF8F5]/10 hover:bg-[#FAF8F5]/20 border border-[#C5A880]/30 text-xs font-bold text-[#C5A880] transition-colors cursor-pointer"
          >
            <Box className="w-3.5 h-3.5" />
            <span>Van Tray ({swatches.length}/3)</span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          2. MAIN SPLIT VIEWPORT (Left Stage + Right Controls Drawer)
      ========================================================================= */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* -------------------------------------------------------------
            LEFT / CENTER: 3D PHOTOREALISTIC CANVAS STAGE (7 or 8 cols)
        ------------------------------------------------------------- */}
        <div className="lg:col-span-8 bg-[#140D07] relative flex flex-col justify-between p-4 sm:p-6 overflow-hidden min-h-[480px] lg:min-h-full">
          {/* Active Society & Preset Pill */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#C5A880]">
                {activeScene.society}
              </span>
              <h2 className="font-['Syne'] text-2xl sm:text-3xl font-black text-white">
                {activeScene.name}
              </h2>
            </div>
            <span className="text-xs bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white/80 border border-white/10">
              {wallWidth} ft × {wallHeight} ft · {Math.round(wallWidth * wallHeight)} sq.ft
            </span>
          </div>

          {/* Interactive Room Canvas Viewport */}
          <div className="relative w-full flex-1 rounded-3xl overflow-hidden border-2 border-[#C5A880]/30 shadow-2xl bg-black min-h-[380px] sm:min-h-[460px]">
            {/* HTML5 Canvas Multi-Pass Compositor (Single Image Recoloring Engine) */}
            <PlumCanvasCompositor
              baseImage={activeScene.baseImage}
              tintColor={selectedWall.colorHex}
              wallPolygon={activeScene.wallPolygon}
              isNightMode={isNightMode}
              alt={activeScene.name}
              className="w-full h-full"
            />

            {/* Interactive Hotspot Pins (Plum Living Inspired) */}
            {activeScene.hotspots.map((pin) => {
              const isPulsing = activeHotspotId === pin.id;
              return (
                <button
                  key={pin.id}
                  onClick={() => handleHotspotClick(pin.category, pin.id)}
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer transition-transform duration-300 ${
                    isPulsing ? 'scale-125' : 'hover:scale-110'
                  }`}
                  aria-label={pin.label}
                >
                  <span className="relative flex h-8 w-8 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A880] opacity-60"></span>
                    <span className="relative inline-flex rounded-full h-6 w-6 bg-[#1C130B] border-2 border-[#C5A880] items-center justify-center text-[10px] font-bold text-white shadow-xl">
                      ●
                    </span>
                  </span>

                  {/* Hotspot Hover Card */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:flex flex-col items-center pointer-events-none whitespace-nowrap z-30">
                    <div className="bg-[#1C130B]/95 text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-[#C5A880] shadow-2xl backdrop-blur-md">
                      {pin.label}
                    </div>
                    <div className="w-2 h-2 bg-[#1C130B] rotate-45 -mt-1 border-r border-b border-[#C5A880]"></div>
                  </div>
                </button>
              );
            })}

            {/* Bottom-Left Live Texture Spec Pill */}
            <div className="absolute bottom-4 left-4 z-10 bg-[#1C130B]/85 backdrop-blur-md border border-[#C5A880]/40 rounded-2xl p-3 text-xs max-w-sm hidden sm:block">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-3 h-3 rounded-full border border-white/50"
                  style={{ backgroundColor: selectedWall.colorHex }}
                />
                <span className="font-bold text-white">{selectedWall.name}</span>
                <span className="text-[#C5A880] font-semibold">₹{selectedWall.pricePerSqFt}/sq.ft</span>
              </div>
              <p className="text-[11px] text-white/70">
                {selectedStone.name} · {selectedBlind.name.split(' ')[0]} {selectedBlind.name.split(' ')[1]}
              </p>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------
            RIGHT SIDEBAR: RADIX UI CONTROLS & FINISH PALETTES (4 or 5 cols)
        ------------------------------------------------------------- */}
        <div className="lg:col-span-4 bg-[#1C130B] border-l border-[#C5A880]/20 flex flex-col h-full overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Top Title & Sizing Sliders */}
          <div className="pb-4 border-b border-[#C5A880]/15 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C5A880] font-['Syne']">
                1. Architectural Sizing
              </span>
              <span className="text-[11px] font-semibold text-[#15803D] bg-green-950/60 border border-green-800 px-2.5 py-0.5 rounded-full">
                11% Pattern Buffer Added
              </span>
            </div>

            {/* Radix Sliders for Wall Width & Height */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-white/70">Wall Width</span>
                  <span className="font-bold text-[#C5A880]">{wallWidth} ft</span>
                </div>
                <SliderPrimitive.Root
                  className="relative flex items-center select-none touch-none w-full h-5"
                  value={[wallWidth]}
                  max={28}
                  min={8}
                  step={0.5}
                  onValueChange={(val) => setWallWidth(val[0])}
                >
                  <SliderPrimitive.Track className="bg-[#FAF8F5]/20 relative grow rounded-full h-2">
                    <SliderPrimitive.Range className="absolute bg-gradient-to-r from-[#C5A880] to-[#8A5836] rounded-full h-full" />
                  </SliderPrimitive.Track>
                  <SliderPrimitive.Thumb className="block w-5 h-5 bg-[#FAF8F5] border-2 border-[#C5A880] shadow-lg rounded-full focus:outline-none focus:ring-2 focus:ring-[#8A5836] cursor-grab" />
                </SliderPrimitive.Root>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-white/70">Wall Slab Height</span>
                  <span className="font-bold text-[#C5A880]">{wallHeight} ft</span>
                </div>
                <SliderPrimitive.Root
                  className="relative flex items-center select-none touch-none w-full h-5"
                  value={[wallHeight]}
                  max={14}
                  min={8}
                  step={0.5}
                  onValueChange={(val) => setWallHeight(val[0])}
                >
                  <SliderPrimitive.Track className="bg-[#FAF8F5]/20 relative grow rounded-full h-2">
                    <SliderPrimitive.Range className="absolute bg-gradient-to-r from-[#C5A880] to-[#8A5836] rounded-full h-full" />
                  </SliderPrimitive.Track>
                  <SliderPrimitive.Thumb className="block w-5 h-5 bg-[#FAF8F5] border-2 border-[#C5A880] shadow-lg rounded-full focus:outline-none focus:ring-2 focus:ring-[#8A5836] cursor-grab" />
                </SliderPrimitive.Root>
              </div>
            </div>
          </div>

          {/* Radix Tabs for Surface Customizer */}
          <TabsPrimitive.Root value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col space-y-4">
            <TabsPrimitive.List className="grid grid-cols-4 bg-white/5 p-1 rounded-2xl border border-[#C5A880]/20">
              <TabsPrimitive.Trigger
                value="wall"
                className="py-2 text-[11px] font-bold uppercase rounded-xl transition-all data-[state=active]:bg-[#C5A880] data-[state=active]:text-[#1C130B] text-white/70 cursor-pointer"
              >
                Walls
              </TabsPrimitive.Trigger>
              <TabsPrimitive.Trigger
                value="stone"
                className="py-2 text-[11px] font-bold uppercase rounded-xl transition-all data-[state=active]:bg-[#C5A880] data-[state=active]:text-[#1C130B] text-white/70 cursor-pointer"
              >
                Stone
              </TabsPrimitive.Trigger>
              <TabsPrimitive.Trigger
                value="blinds"
                className="py-2 text-[11px] font-bold uppercase rounded-xl transition-all data-[state=active]:bg-[#C5A880] data-[state=active]:text-[#1C130B] text-white/70 cursor-pointer"
              >
                Blinds
              </TabsPrimitive.Trigger>
              <TabsPrimitive.Trigger
                value="lighting"
                className="py-2 text-[11px] font-bold uppercase rounded-xl transition-all data-[state=active]:bg-[#C5A880] data-[state=active]:text-[#1C130B] text-white/70 cursor-pointer"
              >
                Cove
              </TabsPrimitive.Trigger>
            </TabsPrimitive.List>

            {/* TAB 1: WALL SURFACES */}
            <TabsPrimitive.Content value="wall" className="space-y-3 focus:outline-none">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#C5A880] uppercase tracking-wider">
                  Select Architectural Surface
                </span>
                <span className="text-[11px] text-white/60">Zero Demolition</span>
              </div>
              <div className="space-y-2.5">
                {FINISH_CATALOG.filter((f) => f.category === 'wall').map((item) => {
                  const isSelected = selectedWall.id === item.id;
                  const inTray = swatches.some((s) => s.id === item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedWall(item)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#FAF8F5]/15 border-[#C5A880] shadow-lg scale-[1.01]'
                          : 'bg-white/5 border-white/10 hover:border-[#C5A880]/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl border border-white/30 shrink-0 shadow-inner"
                          style={{ backgroundColor: item.colorHex }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-['Syne'] text-xs font-bold text-white">{item.name}</h4>
                            {item.badge && (
                              <span className="text-[9px] bg-[#C5A880] text-[#1C130B] px-1.5 py-0.5 rounded font-bold uppercase">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-white/60 line-clamp-1">{item.tagline}</p>
                          <span className="text-[10px] text-[#C5A880] font-semibold">{item.specs}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="text-xs font-bold text-[#C5A880]">₹{item.pricePerSqFt}/sqft</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSwatchInTray(item);
                          }}
                          className={`p-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors flex items-center gap-1 ${
                            inTray ? 'bg-green-700 text-white' : 'bg-white/10 hover:bg-white/20 text-white/80'
                          }`}
                          title={inTray ? 'In Van Tray' : 'Add to Free Swatch Van'}
                        >
                          {inTray ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                          <span className="hidden sm:inline">{inTray ? 'In Tray' : '+ Swatch'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsPrimitive.Content>

            {/* TAB 2: NATURAL STONE COLLECTION */}
            <TabsPrimitive.Content value="stone" className="space-y-3 focus:outline-none">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#C5A880] uppercase tracking-wider">
                  Natural Stone & Marble Collection
                </span>
                <Link href="/collections/stone" className="text-[11px] text-[#C5A880] hover:underline">
                  Full Catalog →
                </Link>
              </div>
              <div className="space-y-2.5">
                {FINISH_CATALOG.filter((f) => f.category === 'stone').map((item) => {
                  const isSelected = selectedStone.id === item.id;
                  const inTray = swatches.some((s) => s.id === item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedStone(item)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#FAF8F5]/15 border-[#C5A880] shadow-lg scale-[1.01]'
                          : 'bg-white/5 border-white/10 hover:border-[#C5A880]/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl border border-white/30 shrink-0 shadow-inner"
                          style={{ backgroundColor: item.colorHex }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-['Syne'] text-xs font-bold text-white">{item.name}</h4>
                            {item.badge && (
                              <span className="text-[9px] bg-[#8A5836] text-white px-1.5 py-0.5 rounded font-bold uppercase">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-white/60">{item.tagline}</p>
                          <span className="text-[10px] text-[#C5A880] font-semibold">{item.specs}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="text-xs font-bold text-[#C5A880]">₹{item.pricePerSqFt}/sqft</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSwatchInTray(item);
                          }}
                          className={`p-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors flex items-center gap-1 ${
                            inTray ? 'bg-green-700 text-white' : 'bg-white/10 hover:bg-white/20 text-white/80'
                          }`}
                        >
                          {inTray ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                          <span className="hidden sm:inline">{inTray ? 'In Tray' : '+ Swatch'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsPrimitive.Content>

            {/* TAB 3: SMART BLINDS */}
            <TabsPrimitive.Content value="blinds" className="space-y-3 focus:outline-none">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#C5A880] uppercase tracking-wider">
                  Motorized Solar Shading
                </span>
                <span className="text-[11px] text-white/60">Somfy Automation</span>
              </div>
              <div className="space-y-2.5">
                {FINISH_CATALOG.filter((f) => f.category === 'blinds').map((item) => {
                  const isSelected = selectedBlind.id === item.id;
                  const inTray = swatches.some((s) => s.id === item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedBlind(item)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#FAF8F5]/15 border-[#C5A880] shadow-lg scale-[1.01]'
                          : 'bg-white/5 border-white/10 hover:border-[#C5A880]/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl border border-white/30 shrink-0 shadow-inner"
                          style={{ backgroundColor: item.colorHex }}
                        />
                        <div>
                          <h4 className="font-['Syne'] text-xs font-bold text-white">{item.name}</h4>
                          <p className="text-[11px] text-white/60">{item.tagline}</p>
                          <span className="text-[10px] text-[#C5A880] font-semibold">{item.specs}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="text-xs font-bold text-[#C5A880]">₹{item.pricePerSqFt}/sqft</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSwatchInTray(item);
                          }}
                          className={`p-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors flex items-center gap-1 ${
                            inTray ? 'bg-green-700 text-white' : 'bg-white/10 hover:bg-white/20 text-white/80'
                          }`}
                        >
                          {inTray ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                          <span className="hidden sm:inline">{inTray ? 'In Tray' : '+ Swatch'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsPrimitive.Content>

            {/* TAB 4: COVE LIGHTING */}
            <TabsPrimitive.Content value="lighting" className="space-y-3 focus:outline-none">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#C5A880] uppercase tracking-wider">
                  Architectural Cove LED
                </span>
                <span className="text-[11px] text-white/60">Zero False Ceiling</span>
              </div>
              <div className="space-y-2.5">
                {FINISH_CATALOG.filter((f) => f.category === 'lighting').map((item) => {
                  const isSelected = selectedLight.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedLight(item);
                        setIsNightMode(true);
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#FAF8F5]/15 border-[#C5A880] shadow-lg scale-[1.01]'
                          : 'bg-white/5 border-white/10 hover:border-[#C5A880]/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl border border-white/30 shrink-0 shadow-inner"
                          style={{ backgroundColor: item.colorHex }}
                        />
                        <div>
                          <h4 className="font-['Syne'] text-xs font-bold text-white">{item.name}</h4>
                          <p className="text-[11px] text-white/60">{item.tagline}</p>
                          <span className="text-[10px] text-[#C5A880] font-semibold">{item.specs}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="text-xs font-bold text-[#C5A880]">₹{item.pricePerSqFt}/ft</span>
                        <span className="text-[10px] text-white/60">Auto-Night</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsPrimitive.Content>
          </TabsPrimitive.Root>
        </div>
      </div>

      {/* =========================================================================
          3. STICKY BOTTOM BILL OF MATERIALS (BOM) BAR (Plum Living Styler Style)
      ========================================================================= */}
      <footer className="w-full bg-[#140D07] border-t-2 border-[#C5A880]/40 p-4 sm:px-8 sm:py-4 z-30 sticky bottom-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Active Skin Summary & Total Price */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-center sm:text-left w-full md:w-auto">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A880]">
                Live BOM Calculation ({Math.round(nestingResult.totalSqFtWithBuffer)} sq.ft with buffer)
              </span>
              <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                <span className="font-['Syne'] text-2xl sm:text-3xl font-black text-white">
                  ₹{pricingResult.totalRetailPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-white/60">(Incl. GST 18% + Labor)</span>
              </div>
            </div>

            {/* Escrow Tranches Micro Pills */}
            <div className="hidden lg:flex items-center gap-2 text-[11px] border-l border-[#C5A880]/20 pl-4 font-['Plus_Jakarta_Sans']">
              <div className="bg-white/5 px-2.5 py-1 rounded-lg">
                <span className="text-white/60">10% Booking:</span>{' '}
                <strong className="text-[#C5A880]">₹{pricingResult.escrowTranches.deposit10.toLocaleString('en-IN')}</strong>
              </div>
              <div className="bg-white/5 px-2.5 py-1 rounded-lg">
                <span className="text-white/60">60% Milled:</span>{' '}
                <strong className="text-white">₹{pricingResult.escrowTranches.materialRelease60.toLocaleString('en-IN')}</strong>
              </div>
              <div className="bg-white/5 px-2.5 py-1 rounded-lg">
                <span className="text-white/60">30% Post-QA:</span>{' '}
                <strong className="text-white">₹{pricingResult.escrowTranches.postQAUnlock30.toLocaleString('en-IN')}</strong>
              </div>
            </div>
          </div>

          {/* Action Buttons: Sample Box + WhatsApp Quote Lock */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {/* Free Swatch Van Dispatch Dialog */}
            <Dialog open={isSampleModalOpen} onOpenChange={setIsSampleModalOpen}>
              <DialogTrigger asChild>
                <button className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-[#C5A880]/40 text-[#FAF8F5] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer font-['Plus_Jakarta_Sans']">
                  <Box className="w-4 h-4 text-[#C5A880]" />
                  <span>Order Swatch Box ({swatches.length}/3)</span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-lg bg-[#FAF8F5] text-[#1C130B]">
                <DialogHeader>
                  <DialogTitle className="font-['Syne'] text-2xl font-bold text-[#1C130B]">
                    Dispatch Swatch Van (3 Free Samples)
                  </DialogTitle>
                  <DialogDescription className="text-sm text-[#1C130B]/70 font-['Plus_Jakarta_Sans']">
                    Our laser-equipped Swatch Van visits {activeScene.society} daily. Inspect your 3 selected physical samples in your apartment&apos;s natural lighting.
                  </DialogDescription>
                </DialogHeader>

                {sampleSuccess ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-14 h-14 bg-green-100 text-[#15803D] rounded-full mx-auto flex items-center justify-center">
                      <Check className="w-7 h-7" />
                    </div>
                    <h4 className="font-['Syne'] text-xl font-bold text-[#1C130B]">
                      Swatch Van Dispatched!
                    </h4>
                    <p className="text-xs text-[#1C130B]/70 font-['Plus_Jakarta_Sans'] max-w-sm mx-auto">
                      Our driver will coordinate gate entry at {userFlat} with your 3 curated tactile materials.
                    </p>
                    <a
                      href={`https://wa.me/919700675637?text=${bookingText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#15803D] text-white rounded-2xl text-xs font-bold uppercase tracking-wider font-['Plus_Jakarta_Sans'] shadow"
                    >
                      Confirm Gate Pass on WhatsApp (919700675637)
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4 pt-2">
                    {/* Selected Swatches Preview */}
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#8A5836] block mb-2 font-['Plus_Jakarta_Sans']">
                        Curated Swatches in Van Box:
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {swatches.map((swatch) => (
                          <div
                            key={swatch.id}
                            className="p-2.5 rounded-xl border border-[#1C130B]/15 bg-white text-center flex flex-col items-center justify-between"
                          >
                            <span
                              className="w-6 h-6 rounded-lg mb-1 border border-black/20"
                              style={{ backgroundColor: swatch.colorHex }}
                            />
                            <span className="text-[10px] font-bold text-[#1C130B] line-clamp-1">{swatch.name}</span>
                            <span className="text-[9px] text-[#8A5836]">₹{swatch.pricePerSqFt}/sqft</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setSampleSuccess(true);
                      }}
                      className="space-y-3 pt-2"
                    >
                      <div>
                        <label className="block text-xs font-bold text-[#1C130B] uppercase tracking-wider mb-1 font-['Plus_Jakarta_Sans']">
                          Your Society / High-Rise Tower
                        </label>
                        <select
                          value={userFlat}
                          onChange={(e) => setUserFlat(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-2xl border border-[#1C130B]/20 bg-white text-sm font-['Plus_Jakarta_Sans'] text-[#1C130B]"
                        >
                          <option value="My Home Bhooja">My Home Bhooja (Kokapet)</option>
                          <option value="Rajapushpa Provincia">Rajapushpa Provincia (Narsingi)</option>
                          <option value="Prestige High Fields">Prestige High Fields (Financial District)</option>
                          <option value="Aparna Sarovar Zenith">Aparna Sarovar Zenith (Nallagandla)</option>
                          <option value="Lanco Hills">Lanco Hills (Manikonda)</option>
                          <option value="Other West Hyderabad Society">Other West Hyderabad Society</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1C130B] uppercase tracking-wider mb-1 font-['Plus_Jakarta_Sans']">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="e.g. Ananya Reddy"
                          className="w-full px-4 py-2.5 rounded-2xl border border-[#1C130B]/20 bg-white text-sm font-['Plus_Jakarta_Sans'] text-[#1C130B]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1C130B] uppercase tracking-wider mb-1 font-['Plus_Jakarta_Sans']">
                          WhatsApp Mobile Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={userPhone}
                          onChange={(e) => setUserPhone(e.target.value)}
                          placeholder="9876543210"
                          className="w-full px-4 py-2.5 rounded-2xl border border-[#1C130B]/20 bg-white text-sm font-['Plus_Jakarta_Sans'] text-[#1C130B]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 bg-[#C5A880] hover:bg-[#b0936d] text-[#1C130B] font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md cursor-pointer font-['Plus_Jakarta_Sans']"
                      >
                        Confirm Free Swatch Van Visit
                      </button>
                    </form>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* Direct WhatsApp Quote Lock */}
            <a
              href={`https://wa.me/919700675637?text=${bookingText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-[#C5A880] hover:bg-[#b0936d] text-[#1C130B] text-xs font-bold uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 font-['Plus_Jakarta_Sans']"
            >
              <span>Lock Quote on WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>

      {/* Persistent Floating 3-Slot Swatch Bar */}
      <PlumSwatchBar />
    </div>
  );
}

export default function PlumRoomStyler() {
  return (
    <SwatchProvider>
      <PlumRoomStylerContent />
    </SwatchProvider>
  );
}
