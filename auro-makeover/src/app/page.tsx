import HeroSection from '@/components/HeroSection';
import DesignGallery from '@/components/DesignGallery';
import EstimatorGateway from '@/components/EstimatorGateway';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <HeroSection />

      <div className="bg-[#FAF8F5]">
        <DesignGallery />
      </div>

      <div id="estimator" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center mb-12 px-6">
          <h2 className="text-4xl font-black font-['Syne'] text-[#1C130B] mb-4">
            Instant AI Estimator
          </h2>
          <p className="text-gray-600 font-medium">
            No waiting for quotes. Adjust your dimensions and book our mobile swatch van instantly.
          </p>
        </div>
        <EstimatorGateway />
      </div>

      <footer className="bg-[#1C130B] text-white py-12 text-center border-t border-white/10">
        <h2 className="text-2xl font-bold font-['Syne'] tracking-tight mb-2">
          Auro<span className="text-[#C5A880]">Makeover</span>
        </h2>
        <p className="text-sm text-gray-400 font-['Plus_Jakarta_Sans']">
          © 2024 AuroMakeover Spacemake OS. All rights reserved.<br/>
          Serving Kokapet, Tellapur, Financial District, Nallagandla.
        </p>
      </footer>
    </main>
  );
}
