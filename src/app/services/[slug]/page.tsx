import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ShieldCheck, Clock, Award, CheckCircle2, ArrowRight, Phone } from 'lucide-react';
import Footer from '@/components/Footer';

interface ServiceDetail {
  slug: string;
  title: string;
  subtitle: string;
  price: string;
  heroImg: string;
  galleryImgs: string[];
  description: string;
  specs: { label: string; value: string }[];
  features: string[];
}

const SERVICE_DATA: Record<string, ServiceDetail> = {
  'luxury-wallpapers': {
    slug: 'luxury-wallpapers',
    title: 'Luxury European Wallpapers & Bespoke Murals',
    subtitle: 'Tactile textured linens, Pichwai temple art, and metallic leaf foils',
    price: '₹45 / sq.ft',
    heroImg: '/images/showcase-wallpaper.jpg',
    galleryImgs: ['/images/after-master-pichwai.jpg', '/images/botanical.jpg', '/images/neoclassical.jpg'],
    description: 'Transform your main accent walls with bespoke European non-woven and fabric-backed wallpapers. Milled with 11% safety pattern matching to eliminate visible seams, and installed using non-VOC, odorless German Henkel adhesives that protect indoor air quality.',
    specs: [
      { label: 'Turnaround Time', value: '24 – 48 Hours Makeover Turnaround' },
      { label: 'Adhesive Type', value: 'Zero-VOC Water-Based Henkel Metylan' },
      { label: 'Seam Tolerance', value: '< 0.2mm Precision Laser Aligned' },
      { label: 'Warranty', value: '2-Year Anti-Peel & Colorfast Guarantee' },
      { label: 'Escrow Terms', value: '10% Booking · 60% Milled · 30% Post-QA' },
    ],
    features: [
      'Zero civil demolition or structural wall scraping',
      'Washable vinyl and breathable non-woven options',
      'Exclusive dye-lot color batch archiving for seamless future repairs',
      'Laser-leveled drop alignment across high-rise architectural slabs',
    ],
  },
  'fluted-louvers': {
    slug: 'fluted-louvers',
    title: 'Acoustic Fluted Wood Louvers & Architectural Slats',
    subtitle: 'Solid smoked oak, rich walnut, and charcoal acoustic felt backings',
    price: '₹85 / sq.ft',
    heroImg: '/images/showcase-slats.jpg',
    galleryImgs: ['/images/after-office-bright.jpg', '/images/fluted-louver.jpg', '/images/after-living-fluted.jpg'],
    description: 'Elevate your living room TV credenzas, bedroom headboards, and executive home offices with acoustic fluted slats. Our high-density composite slats feature real wood veneer and recycled PET acoustic backing that dampens flutter echoes in high-ceiling apartments.',
    specs: [
      { label: 'Turnaround Time', value: '48 Hours Makeover Turnaround' },
      { label: 'Sound Absorption', value: 'NRC 0.85 Certified Acoustic Dampening' },
      { label: 'Material Core', value: 'High-Density Moisture-Resistant Engineered Wood' },
      { label: 'Finish Veneer', value: 'Natural Smoked Oak / American Walnut' },
      { label: 'Mounting Mechanism', value: 'Concealed Interlocking Clip Profile' },
      { label: 'Warranty', value: '2-Year Anti-Warping Guarantee' },
    ],
    features: [
      'Eliminates room echo and optimizes home theater sound staging',
      'Rapid mechanical mounting without wet mortar or brickwork',
      'Integrated LED channel housing for indirect warm halo illumination',
      'Pre-cut precision sizing for My Home Bhooja & Provincia master suites',
    ],
  },
  'smart-blinds': {
    slug: 'smart-blinds',
    title: 'Smart Motorized Blinds & Solar Lux Window Shading',
    subtitle: 'App & voice-automated Somfy motors with dual-cell heat insulation',
    price: '₹120 / sq.ft',
    heroImg: '/images/showcase-blinds.jpg',
    galleryImgs: ['/images/after-living-fluted.jpg', '/images/showcase-living.jpg', '/images/showcase-drapes.jpg'],
    description: 'Designed specifically for West Hyderabad high-rise apartments exposed to aggressive afternoon solar heat. Our automated smart blinds integrate seamlessly with Apple HomeKit, Google Home, and Amazon Alexa to automate daily thermal shading and privacy.',
    specs: [
      { label: 'Turnaround Time', value: '48 Hours Makeover Turnaround' },
      { label: 'Motor System', value: 'Somfy / Tuya Ultra-Quiet (< 35dB) Motor' },
      { label: 'Solar Heat Rejection', value: 'Up to 78% Solar Heat Radiation Blocked' },
      { label: 'Smart Integration', value: 'Matter / Zigbee / Alexa / Google / HomeKit' },
      { label: 'Power Source', value: 'Lithium Rechargeable / Concealed AC Line' },
      { label: 'Warranty', value: '2-Year Motor & Rail Comprehensive Warranty' },
    ],
    features: [
      'Automated schedule routines (opens at sunrise, shades at 2 PM west peak)',
      'Dual-cell honeycomb fabric blocks UV fading on furniture and art',
      'Smooth whisper-quiet operation with soft start and soft stop',
      'Pre-wired and battery options requiring zero wall trenching',
    ],
  },
  'pooja-rooms': {
    slug: 'pooja-rooms',
    title: 'Sacred Mandir & Pooja Room Architectural Makeovers',
    subtitle: 'Pichwai temple gold accents, CNC backlit brass & marble backdrops',
    price: '₹35,000 / room',
    heroImg: '/images/showcase-pooja.jpg',
    galleryImgs: ['/images/after-pooja-traditional.jpg', '/images/after-pooja-marble.jpg', '/images/after-pooja.jpg'],
    description: 'Create a sanctuary of peace in your high-rise home. Our turnkey Pooja room backdrops blend traditional sanctum iconography with modern architectural finishes, combining laser-cut brass latticework, backlit translucent onyx, and hand-embossed Pichwai details.',
    specs: [
      { label: 'Backdrop Material', value: 'Fire-Resistant Composite + Gold Foil Accent' },
      { label: 'Illumination', value: '3000K Warm Backlit LED Profile' },
      { label: 'Turnaround Time', value: '48 Hours Makeover Turnaround' },
      { label: 'Customization', value: 'Custom Sized to Exact Society Niche Floorplans' },
      { label: 'Warranty', value: '2-Year Comprehensive Surface Warranty' },
    ],
    features: [
      'Flame-resistant backing safe for traditional brass diyas and dhoop',
      'Concealed electrical wiring for ambient warm sanctuary illumination',
      'Pre-measured templates for My Home, Rajapushpa, and Prestige niche layouts',
      'Zero civil demolition or structural alterations required',
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(SERVICE_DATA).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = await params;
  const service = SERVICE_DATA[resolvedParams.slug];
  if (!service) return { title: 'Service | AuroMakeover' };
  return {
    title: `${service.title} | AuroMakeover`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = await params;
  const service = SERVICE_DATA[resolvedParams.slug];

  if (!service) {
    notFound();
  }

  const bookingText = encodeURIComponent(
    `Hi AuroMakeover! I'm interested in booking the ${service.title} (From ${service.price}). Please share sample catalogs and Swatch Van availability.`
  );

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#1C130B]">
      {/* Hero Section */}
      <section className="pt-28 pb-16 px-6 bg-[#1C130B] text-[#FAF8F5] relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <Image src={service.heroImg} fill className="object-cover" alt={service.title} priority />
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C5A880] uppercase tracking-widest hover:text-[#FAF8F5] transition-colors mb-6 font-['Plus_Jakarta_Sans']"
          >
            ← Back to All Services
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <span className="bg-[#C5A880]/20 text-[#C5A880] text-xs font-bold px-3.5 py-1.5 rounded-full border border-[#C5A880]/30 font-mono inline-block mb-4">
                48-HOUR ZERO-CIVIL MAKEOVER
              </span>
              <h1 className="font-['Syne'] text-3xl sm:text-5xl font-black mb-4 max-w-3xl leading-tight">
                {service.title}
              </h1>
              <p className="text-[#FAF8F5]/70 text-base sm:text-lg font-['Plus_Jakarta_Sans'] max-w-2xl">
                {service.subtitle}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-right shrink-0">
              <p className="text-xs text-[#C5A880] uppercase tracking-wider font-bold mb-1">Transparent Pricing</p>
              <p className="text-3xl font-black font-['Syne'] text-white">{service.price}</p>
              <p className="text-[11px] text-white/60 mt-1">Includes materials, primer & expert installation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Specs */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Description & Gallery */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="font-['Syne'] text-2xl font-bold text-[#1C130B] mb-4">
                Architectural Excellence Without Civil Disruption
              </h2>
              <p className="text-[#1C130B]/80 font-['Plus_Jakarta_Sans'] leading-relaxed text-base">
                {service.description}
              </p>
            </div>

            {/* Gallery Images */}
            <div>
              <h3 className="font-['Syne'] text-lg font-bold text-[#1C130B] mb-4">
                Installed Finish Samples
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {service.galleryImgs.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden shadow-md group">
                    <Image
                      src={img}
                      alt={`${service.title} sample ${i + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Key Features */}
            <div>
              <h3 className="font-['Syne'] text-lg font-bold text-[#1C130B] mb-4">
                Why High-Rise Residents Choose AuroMakeover
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#C5A880]/30 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs text-[#1C130B]/80 font-medium font-['Plus_Jakarta_Sans'] leading-relaxed">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Technical Specs & Sticky Booking Card */}
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#C5A880]/30 shadow-lg space-y-6">
              <h3 className="font-['Syne'] text-lg font-bold text-[#1C130B] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#8A5836]" />
                Technical Specifications
              </h3>

              <div className="space-y-4 text-xs font-['Plus_Jakarta_Sans'] border-y border-gray-100 py-4">
                {service.specs.map((spec, i) => (
                  <div key={i} className="flex justify-between items-start gap-2">
                    <span className="text-gray-500">{spec.label}</span>
                    <span className="font-bold text-[#1C130B] text-right">{spec.value}</span>
                  </div>
                ))}
              </div>

              {/* Guarantees */}
              <div className="space-y-2 text-xs text-[#1C130B]/70 font-['Plus_Jakarta_Sans']">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#8A5836]" />
                  <span>48-Hour complete makeover turnaround guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#8A5836]" />
                  <span>2-Year comprehensive digital warranty</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2">
                <a
                  href={`https://wa.me/918555069441?text=${bookingText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#15803D] hover:bg-green-700 text-white py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <Phone className="w-4 h-4" />
                  Book on WhatsApp
                </a>

                <Link
                  href="/#estimator"
                  className="w-full bg-[#1C130B] hover:bg-[#8A5836] text-[#FAF8F5] py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md text-center"
                >
                  Calculate Instant Quote
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
