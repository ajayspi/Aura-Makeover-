import HeroSection from '@/components/HeroSection';
import BeforeAfterShowcase from '@/components/BeforeAfterShowcase';
import DesignGallery from '@/components/DesignGallery';
import SocietyPreMeasured from '@/components/SocietyPreMeasured';
import StatsTicker from '@/components/StatsTicker';
import EstimatorGateway from '@/components/EstimatorGateway';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#1C130B] font-['Plus_Jakarta_Sans']">
      <HeroSection />
      <BeforeAfterShowcase />
      <div id="gallery" className="bg-[#FAF8F5]">
        <DesignGallery />
      </div>
      <SocietyPreMeasured />
      <StatsTicker />
      <div id="estimator" className="py-20 px-6 bg-[#FAF8F5]">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-black font-['Syne'] text-[#1C130B] mb-4 tracking-tight">
            Instant 48-Hour Estimator
          </h2>
          <p className="text-base sm:text-lg text-[#1C130B]/70 font-medium max-w-2xl mx-auto leading-relaxed">
            No waiting for contractor site visits. Adjust your dimensions, choose your architectural tier, and reserve our mobile swatch van instantly.
          </p>
        </div>
        <EstimatorGateway />
      </div>
      <Footer />
    </main>
  );
}
