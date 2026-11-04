"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  Camera, 
  Sun, 
  Moon, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight,
  Maximize2
} from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

const SAMPLE_ROOMS = [
  { id: 'room-1', name: 'Kokapet High-Rise Living Room', url: '/images/after-living-fluted.jpg' },
  { id: 'room-2', name: 'Prestige Master Bedroom', url: '/images/after-master-pichwai.jpg' },
  { id: 'room-3', name: 'Bhooja Balcony Alcove', url: '/images/after-balcony-decking.jpg' },
];

const SWATCH_OPTIONS = [
  { id: 'fluted-walnut', name: 'Acoustic Fluted Louver (Walnut)', color: '#3E2C1E', pattern: 'repeating-linear-gradient(90deg, #2A1E12 0px, #3E2C1E 12px, #1C130B 18px)' },
  { id: 'temple-pichwai', name: 'Royal Temple Pichwai (Gold)', color: '#C5A880', pattern: 'radial-gradient(circle at 50% 50%, #C5A880 0%, #8A5836 100%)' },
  { id: 'botanical-linen', name: 'Botanical European Linen', color: '#8A5836', pattern: 'linear-gradient(135deg, #FAF8F5 0%, #C5A880 50%, #8A5836 100%)' },
];

export default function HomographyCanvasVisualizer() {
  const [selectedRoom, setSelectedRoom] = useState<string>('/images/after-master-pichwai.jpg');
  const [selectedSwatch, setSelectedSwatch] = useState(SWATCH_OPTIONS[0]);
  const [ambientLight, setAmbientLight] = useState<number>(50); // 0 = Midnight, 50 = 3000K Warm, 100 = Bright Sun
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  // 4 corner quad points normalized (0 to 100 percentage)
  const [quadPoints, setQuadPoints] = useState<Point[]>([
    { x: 18, y: 15 }, // Top-Left
    { x: 82, y: 12 }, // Top-Right
    { x: 85, y: 85 }, // Bottom-Right
    { x: 15, y: 88 }, // Bottom-Left
  ]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const resetQuad = () => {
    setQuadPoints([
      { x: 18, y: 15 },
      { x: 82, y: 12 },
      { x: 85, y: 85 },
      { x: 15, y: 88 },
    ]);
  };

  const handleApplyToQuote = () => {
    window.dispatchEvent(new CustomEvent('auro:estimator-prefill', {
      detail: { tier: selectedSwatch.id.includes('fluted') ? 'premium' : 'luxury' }
    }));
    document.getElementById('estimator')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Render on canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = selectedRoom;
    img.onload = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw base room photo
      ctx.drawImage(img, 0, 0, width, height);

      // Map quad points to canvas pixels
      const p = quadPoints.map(pt => ({
        x: (pt.x / 100) * width,
        y: (pt.y / 100) * height,
      }));

      // Clip path to quad
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(p[0].x, p[0].y);
      ctx.lineTo(p[1].x, p[1].y);
      ctx.lineTo(p[2].x, p[2].y);
      ctx.lineTo(p[3].x, p[3].y);
      ctx.closePath();
      ctx.clip();

      // Render swatch texture layer with multiply blend
      ctx.globalAlpha = 0.88;
      ctx.fillStyle = selectedSwatch.color;
      ctx.fill();

      // Subtle fluted lines simulation
      ctx.strokeStyle = '#1C130B';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.35;
      const steps = 24;
      for (let i = 0; i <= steps; i++) {
        const topX = p[0].x + ((p[1].x - p[0].x) * (i / steps));
        const topY = p[0].y + ((p[1].y - p[0].y) * (i / steps));
        const botX = p[3].x + ((p[2].x - p[3].x) * (i / steps));
        const botY = p[3].y + ((p[2].y - p[3].y) * (i / steps));

        ctx.beginPath();
        ctx.moveTo(topX, topY);
        ctx.lineTo(botX, botY);
        ctx.stroke();
      }

      // Ambient lighting overlay (Day / Night warmth)
      ctx.globalAlpha = 0.25;
      if (ambientLight < 40) {
        ctx.fillStyle = '#0F172A'; // Cool night blue
      } else if (ambientLight > 60) {
        ctx.fillStyle = '#FEF08A'; // Daylight gold
      } else {
        ctx.fillStyle = '#C5A880'; // 3000K warm ambient
      }
      ctx.fill();

      ctx.restore();
    };
  }, [selectedRoom, selectedSwatch, ambientLight, quadPoints]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  return (
    <section id="visualizer" className="py-24 sm:py-32 px-6 bg-[#1C130B] text-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#C5A880]/15 text-[#C5A880] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest font-['Plus_Jakarta_Sans'] mb-4 border border-[#C5A880]/30">
            <Sparkles className="w-3.5 h-3.5" />
            2.5D Client Spatial Studio
          </div>
          <h2 className="font-['Syne'] text-4xl sm:text-5xl font-black text-[#FAF8F5] mb-6">
            Perspective Wall Surface Visualizer
          </h2>
          <p className="font-['Plus_Jakarta_Sans'] text-[#FAF8F5]/70 text-lg max-w-2xl mx-auto">
            Zero app installation, zero mobile crashes. Adjust corner pins to map architectural slats and European wallcoverings onto real high-rise room photos.
          </p>
        </div>

        {/* Visualizer Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Left Canvas Viewport (8 cols) */}
          <div className="lg:col-span-8 bg-black/60 rounded-3xl p-4 border border-[#C5A880]/30 shadow-2xl relative">
            
            <div ref={containerRef} className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#1C130B]">
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full h-full object-cover"
              />

              {/* 4 Interactive Corner Drag Pins */}
              {quadPoints.map((pt, idx) => (
                <div
                  key={idx}
                  style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                  onMouseDown={() => setDragIndex(idx)}
                  className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full bg-[#C5A880] border-2 border-[#1C130B] shadow-lg cursor-move flex items-center justify-center text-[10px] font-black text-[#1C130B] select-none hover:scale-125 transition-transform"
                >
                  {idx + 1}
                </div>
              ))}
            </div>

            {/* Controls Bar under Canvas */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-4 px-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={resetQuad}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5]/10 hover:bg-[#FAF8F5]/20 text-[#FAF8F5] text-xs font-['Plus_Jakarta_Sans'] font-semibold transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Corner Pins
                </button>
              </div>

              {/* Ambient Day/Night Slider */}
              <div className="flex items-center gap-3">
                <Moon className="w-4 h-4 text-[#C5A880]" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={ambientLight}
                  onChange={(e) => setAmbientLight(Number(e.target.value))}
                  aria-label="Ambient Lighting Warmth"
                  className="w-28 sm:w-36 accent-[#C5A880] cursor-pointer h-1.5 bg-[#FAF8F5]/20 rounded-lg"
                />
                <Sun className="w-4 h-4 text-[#C5A880]" />
                <span className="text-xs text-[#FAF8F5]/60 font-['Plus_Jakarta_Sans']">
                  {ambientLight < 40 ? 'Night Ambient' : ambientLight > 60 ? 'Daylight 6500K' : 'Warm 3000K'}
                </span>
              </div>
            </div>

          </div>

          {/* Right Swatch & Texture Selector (4 cols) */}
          <div className="lg:col-span-4 bg-[#FAF8F5]/5 border border-[#C5A880]/30 rounded-3xl p-6 sm:p-8 space-y-6">
            
            {/* 1. Select Room Image */}
            <div>
              <label className="text-xs font-bold text-[#C5A880] uppercase tracking-wider block mb-2 font-['Plus_Jakarta_Sans']">
                1. Select Room Template:
              </label>
              <div className="space-y-2">
                {SAMPLE_ROOMS.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(room.url)}
                    className={`w-full p-2.5 rounded-xl text-xs font-bold font-['Plus_Jakarta_Sans'] text-left flex items-center justify-between border transition-all ${
                      selectedRoom === room.url
                        ? 'bg-[#C5A880] text-[#1C130B] border-[#C5A880] shadow-md'
                        : 'bg-[#1C130B]/60 text-[#FAF8F5]/70 border-[#C5A880]/20 hover:border-[#C5A880]/50'
                    }`}
                  >
                    <span>{room.name}</span>
                    {selectedRoom === room.url && <CheckCircle2 className="w-4 h-4 text-[#1C130B]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Select Architectural Surface */}
            <div>
              <label className="text-xs font-bold text-[#C5A880] uppercase tracking-wider block mb-2 font-['Plus_Jakarta_Sans']">
                2. Surface Finish Texture:
              </label>
              <div className="space-y-2">
                {SWATCH_OPTIONS.map((swatch) => (
                  <button
                    key={swatch.id}
                    onClick={() => setSelectedSwatch(swatch)}
                    className={`w-full p-3 rounded-2xl text-xs font-bold font-['Plus_Jakarta_Sans'] text-left flex items-center gap-3 border transition-all ${
                      selectedSwatch.id === swatch.id
                        ? 'bg-[#1C130B] text-[#C5A880] border-[#C5A880] shadow-md'
                        : 'bg-[#1C130B]/40 text-[#FAF8F5]/70 border-[#C5A880]/20 hover:border-[#C5A880]/50'
                    }`}
                  >
                    <div 
                      className="w-8 h-8 rounded-lg shrink-0 border border-white/20" 
                      style={{ background: swatch.pattern }}
                    />
                    <div className="flex-1">
                      <span className="block">{swatch.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Terminal Action */}
            <div className="pt-4 border-t border-[#FAF8F5]/10">
              <button
                onClick={handleApplyToQuote}
                className="w-full bg-[#C5A880] hover:bg-[#d5ba94] text-[#1C130B] font-bold font-['Plus_Jakarta_Sans'] py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl text-sm"
              >
                <span>Apply Finish to My Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
