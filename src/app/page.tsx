import HeroSection from '@/components/HeroSection';
import BeforeAfterShowcase from '@/components/BeforeAfterShowcase';
import BeforeAfterGrid from '@/components/BeforeAfterGrid';
import DesignGallery from '@/components/DesignGallery';
import ProductShowcase from '@/components/ProductShowcase';
import SocietyPreMeasured from '@/components/SocietyPreMeasured';
import SocietyRegionBand from '@/components/SocietyRegionBand';
import StatsTicker from '@/components/StatsTicker';
import Reviews from '@/components/Reviews';
import TestimonialMarquee from '@/components/TestimonialMarquee';
import HowItWorks from '@/components/HowItWorks';
import GoldDivider from '@/components/GoldDivider';
import PackageRecommender from '@/components/PackageRecommender';
import FAQSection from '@/components/FAQSection';
import UrgencyBanner48 from '@/components/UrgencyBanner48';
import EstimatorGateway from '@/components/EstimatorGateway';
import Footer from '@/components/Footer';
import FeaturesGrid from '@/components/FeaturesGrid';
import AIRestyleBanner from '@/components/AIRestyleBanner';

import ScrollReveal from '@/components/ScrollReveal';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#1C130B] font-['Plus_Jakarta_Sans'] overflow-x-hidden">
      <HeroSection />
      
      <ScrollReveal>
        <BeforeAfterGrid />
      </ScrollReveal>

      <AIRestyleBanner />
      
      <ScrollReveal>
        <ProductShowcase />
      </ScrollReveal>
      
      <ScrollReveal>
        <SocietyPreMeasured />
      </ScrollReveal>
      
      <ScrollReveal>
        <SocietyRegionBand />
      </ScrollReveal>
      
      <ScrollReveal>
        <StatsTicker />
      </ScrollReveal>
      
      <ScrollReveal>
        <Reviews />
      </ScrollReveal>
      
      <ScrollReveal>
        <TestimonialMarquee />
      </ScrollReveal>
      
      <GoldDivider />

      <ScrollReveal>
        <div id="gallery" className="bg-[#FAF8F5]">
          <DesignGallery />
        </div>
      </ScrollReveal>
      
      <FeaturesGrid />
      
      <ScrollReveal>
        <HowItWorks />
      </ScrollReveal>
      
      <GoldDivider />
      
      <ScrollReveal>
        <PackageRecommender />
      </ScrollReveal>
      
      <ScrollReveal>
        <FAQSection />
      </ScrollReveal>
      
      <ScrollReveal>
        <UrgencyBanner48 />
      </ScrollReveal>
      
      <ScrollReveal>
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
      </ScrollReveal>
      
      <Footer />
    </main>
  );
}
