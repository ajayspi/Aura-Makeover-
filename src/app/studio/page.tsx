import React from 'react';
import { Metadata } from 'next';
import HomographyCanvasVisualizer from '@/components/HomographyCanvasVisualizer';
import EstimatorGateway from '@/components/EstimatorGateway';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Sparkles, ArrowRight, Layers, Sliders, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Design Studio & Spatial Surface Visualizer | AuroMakeover',
  description: 'Interactive 2.5D spatial canvas for previewing acoustic fluted louvers, European wallpapers, and 3000K ambient cove lighting in real high-rise interiors with live BOM costing.',
};

export default function StudioPage() {
  return (
    <main className="min-h-screen bg-[#1C130B] text-[#FAF8F5] font-['Plus_Jakarta_Sans'] overflow-x-hidden pt-24">
      {/* Studio Top Bar */}
      <section className="px-6 max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#C5A880]/20">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#C5A880]/10 text-[#C5A880] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-3 border border-[#C5A880]/30 font-['Plus_Jakarta_Sans']">
              <Sparkles className="w-3.5 h-3.5" />
              AuroMakeover Spatial Engine v2.5
            </div>
            <h1 className="font-['Syne'] text-3xl sm:text-5xl font-black text-[#FAF8F5] tracking-tight">
              AI Design Studio & Canvas
            </h1>
            <p className="text-[#FAF8F5]/70 text-sm sm:text-base max-w-2xl mt-2 font-medium">
              Upload your apartment photo or select a pre-measured Kokapet floorplan. Drag the 4 corner pins to snap luxury architectural skins to your wall plane with ambient day/night lighting simulation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="#quote-drawer"
              className="bg-[#C5A880] hover:bg-[#d5ba94] text-[#1C130B] px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow-lg"
            >
              <span>Jump to BOM & Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Main Visualizer Viewport */}
      <section className="px-6 max-w-7xl mx-auto mb-16">
        <div className="bg-[#2A1E12] rounded-3xl p-6 sm:p-10 border border-[#C5A880]/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none" />
          <HomographyCanvasVisualizer />
        </div>
      </section>

      {/* Embedded Live Estimator & Sticky BOM Drawer */}
      <section id="quote-drawer" className="py-20 px-6 bg-[#FAF8F5] text-[#1C130B]">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#8A5836]/10 text-[#8A5836] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-3 font-['Plus_Jakarta_Sans']">
            <Sliders className="w-3.5 h-3.5" />
            Instant Material & Escrow Sizing
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-['Syne'] text-[#1C130B] mb-4 tracking-tight">
            Configure Dimensions & Lock BOM
          </h2>
          <p className="text-sm sm:text-base text-[#1C130B]/70 max-w-xl mx-auto font-medium">
            Fine-tune linear footage, select your acoustic tier, and watch your itemized Bill of Materials calculate with deterministic 11% pattern safety buffer.
          </p>
        </div>

        <EstimatorGateway />
      </section>

      <Footer />
    </main>
  );
}
