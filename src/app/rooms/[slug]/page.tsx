import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ShieldCheck, Clock, Award, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import Footer from '@/components/Footer';

interface RoomDetail {
  slug: string;
  title: string;
  roomType: string;
  subtitle: string;
  priceFrom: string;
  heroImg: string;
  beforeImg: string;
  afterImg: string;
  galleryImgs: string[];
  description: string;
  acousticRating: string;
  installationHours: string;
  specs: { label: string; value: string }[];
  features: string[];
}

const ROOM_DATA: Record<string, RoomDetail> = {
  'living-room-makeovers': {
    slug: 'living-room-makeovers',
    title: 'Living Room Architectural Transformations',
    roomType: 'Living & Dining Hall',
    subtitle: 'Fluted media walls, motorized thermal blinds, and museum-grade 3000K cove lighting',
    priceFrom: '₹38,000',
    heroImg: '/images/showcase-living.jpg',
    beforeImg: '/images/before-living-1.jpg',
    afterImg: '/images/after-living-fluted.jpg',
    galleryImgs: ['/images/after-living-fluted.jpg', '/images/after-living-arch.jpg', '/images/after-living-botanical.jpg'],
    description: 'Transform your main living hall into a gallery-grade entertaining space. We combine high-density acoustic fluted slats behind your TV console, motorized solar shading that cools afternoon heat, and seamless warm cove lighting.',
    acousticRating: 'NRC 0.85 (Echo Cancellation)',
    installationHours: '48hr Turnaround',
    specs: [
      { label: 'Turnaround Time', value: '48 Hours Makeover Turnaround' },
      { label: 'Civil Demolition', value: '0% Zero Demolition / Zero Dust' },
      { label: 'Lighting Ambience', value: '3000K Architectural Warm Indirect LED' },
      { label: 'Escrow Terms', value: '10% Booking · 60% Milled · 30% Post-QA' },
      { label: 'Warranty', value: '2-Year Comprehensive Surface Warranty' },
    ],
    features: [
      'Eliminates echo and flutter reflections from high-rise marble flooring',
      'Pre-channeled cable raceway hides all TV & console wiring',
      'Motorized blinds programmed to shade west sunlight at 2:00 PM peak',
      'Engineered specifically for My Home Bhooja and Rajapushpa living layouts',
    ],
  },
  'master-bedroom-sanctuaries': {
    slug: 'master-bedroom-sanctuaries',
    title: 'Master Bedroom Acoustic Sanctuaries',
    roomType: 'Master Bedroom Suite',
    subtitle: 'Tactile Belgian linens, Pichwai headboard art, and 100% motorized blackout blinds',
    priceFrom: '₹34,000',
    heroImg: '/images/after-master-pichwai.jpg',
    beforeImg: '/images/before-master.jpg',
    afterImg: '/images/after-master-pichwai.jpg',
    galleryImgs: ['/images/after-master-pichwai.jpg', '/images/after-master-linen.jpg', '/images/after-master-smart.jpg'],
    description: 'Design a private sanctuary of absolute stillness. We combine breathable Belgian linen textured wallpapers, bespoke headboard wall paneling, and whisper-quiet blackout motorized blinds that shield you from dawn glare.',
    acousticRating: 'NRC 0.70 (Acoustic Comfort)',
    installationHours: '48hr Turnaround',
    specs: [
      { label: 'Turnaround Time', value: '48 Hours Makeover Turnaround' },
      { label: 'Indoor Air Quality', value: 'Zero-VOC Water-Based Henkel Metylan' },
      { label: 'Light Control', value: '100% Total Sleep Blackout Blinds' },
      { label: 'Escrow Terms', value: '10% Booking · 60% Milled · 30% Post-QA' },
      { label: 'Warranty', value: '2-Year Anti-Peel & Motor Guarantee' },
    ],
    features: [
      'Tactile organic fabric feel replaces sterile plain white plaster',
      'Ultra-quiet motor (< 35dB) opens softly with morning alarm',
      'Exclusive dye-lot preservation for seamless long-term maintenance',
      'Quick 48-hour installation while you stay comfortably in your home',
    ],
  },
  'media-and-acoustic-rooms': {
    slug: 'media-and-acoustic-rooms',
    title: 'Media & High-Fidelity Acoustic Rooms',
    roomType: 'Home Cinema & Study',
    subtitle: 'NRC 0.85 fluted slat dampening, concealed sub-wiring, and zero flutter echoes',
    priceFrom: '₹45,000',
    heroImg: '/images/after-office-bright.jpg',
    beforeImg: '/images/before-office.jpg',
    afterImg: '/images/after-office-bright.jpg',
    galleryImgs: ['/images/after-office-bright.jpg', '/images/after-office-wood.jpg', '/images/fluted-louver.jpg'],
    description: 'Acoustically tuned media rooms and executive home offices. Our solid composite acoustic louvers absorb flutter reflections and bass standing waves, ensuring pristine audio for films, gaming, and remote executive calls.',
    acousticRating: 'NRC 0.85 Certified Acoustic Dampening',
    installationHours: '48hr Turnaround',
    specs: [
      { label: 'Turnaround Time', value: '48 Hours Makeover Turnaround' },
      { label: 'Core Absorber', value: 'High-Density Recycled PET Acoustic Felt' },
      { label: 'Surface Veneer', value: 'Smoked Oak / Natural American Walnut' },
      { label: 'Escrow Terms', value: '10% Booking · 60% Milled · 30% Post-QA' },
      { label: 'Warranty', value: '2-Year Anti-Warping Guarantee' },
    ],
    features: [
      'Eliminates hollow room reverb during Zoom meetings and conference calls',
      'Enriches home cinema sound clarity and dialogue crispness',
      'Concealed mechanical hanging tracks require zero wet masonry',
      'Pre-cut precision sizing for apartment study rooms and dens',
    ],
  },
  'balcony-and-outdoor-styling': {
    slug: 'balcony-and-outdoor-styling',
    title: 'Balcony Decking & High-Rise Outdoor Styling',
    roomType: 'Sky Balcony & Terrace',
    subtitle: 'Weatherproof composite decking, biophilic green walls, and windproof motorized zip screens',
    priceFrom: '₹28,000',
    heroImg: '/images/after-balcony-decking.jpg',
    beforeImg: '/images/balcony 1 -garden BEFORE.jpg',
    afterImg: '/images/after-balcony-decking.jpg',
    galleryImgs: ['/images/after-balcony-decking.jpg', '/images/after-balcony-garden.jpg', '/images/after-balcony-decking.jpg'],
    description: 'Convert barren utility balconies into private open-air sky lounges. Utilizing interlocking weather-proof composite wood tiles, UV-treated vertical biophilic planters, and heavy-wind resistant zip blinds.',
    acousticRating: 'Weatherproof UV50+ Rated',
    installationHours: '24hr Turnaround',
    specs: [
      { label: 'Turnaround Time', value: '24 Hours Quick Assembly' },
      { label: 'Decking Core', value: 'Anti-Slip Wood-Plastic Composite (WPC)' },
      { label: 'Drainage System', value: 'Self-Draining Elevated Sub-Grid Grid' },
      { label: 'Escrow Terms', value: '10% Booking · 60% Milled · 30% Post-QA' },
      { label: 'Warranty', value: '2-Year UV & Moisture Warranty' },
    ],
    features: [
      'Interlocking grid allows instant lift-and-clean access to rainwater drains',
      '100% splinter-free, barefoot safe, and moisture resistant',
      'Resistant to intense Deccan sun, monsoons, and high-altitude winds',
      'Completely reversible installation — ideal for rented and owned units',
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(ROOM_DATA).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const room = ROOM_DATA[resolvedParams.slug];
  if (!room) return { title: 'Room Makeover | AuroMakeover' };
  return {
    title: `${room.title} | AuroMakeover`,
    description: room.description,
  };
}

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const room = ROOM_DATA[resolvedParams.slug];

  if (!room) {
    notFound();
  }

  const bookingText = encodeURIComponent(
    `Hi AuroMakeover! I'd like to book a 48-Hour ${room.title} (Est. From ${room.priceFrom}). Please confirm when the Swatch Van can visit my high-rise apartment.`
  );

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#1C130B]">
      {/* 1. Hero Section */}
      <section className="pt-28 pb-16 px-6 bg-[#1C130B] text-[#FAF8F5] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image src={room.heroImg} fill className="object-cover" alt={room.title} priority />
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <Link
            href="/rooms"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C5A880] uppercase tracking-widest hover:text-[#FAF8F5] transition-colors mb-6 font-['Plus_Jakarta_Sans']"
          >
            ← Back to Room Silos
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/30 font-['Plus_Jakarta_Sans']">
              {room.roomType}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-white/10 text-[#FAF8F5] font-['Plus_Jakarta_Sans']">
              {room.installationHours}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#15803D]/30 text-green-300 border border-green-500/30 font-['Plus_Jakarta_Sans']">
              Zero Demolition
            </span>
          </div>
          <h1 className="font-['Syne'] text-4xl sm:text-5xl md:text-6xl font-black mb-4 leading-tight">
            {room.title}
          </h1>
          <p className="text-[#FAF8F5]/80 text-lg sm:text-xl max-w-3xl mb-8 font-['Plus_Jakarta_Sans'] leading-relaxed">
            {room.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`https://wa.me/919700675637?text=${bookingText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#C5A880] hover:bg-[#b0936d] text-[#1C130B] font-bold text-sm tracking-wider uppercase rounded-2xl transition-all shadow-lg font-['Plus_Jakarta_Sans']"
            >
              Book Room Makeover (From {room.priceFrom})
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/#estimator"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 text-[#FAF8F5] font-semibold text-sm rounded-2xl transition-all font-['Plus_Jakarta_Sans'] backdrop-blur-md"
            >
              Calculate Live Quote
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Before & After Split Visual */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-widest text-[#8A5836] uppercase font-['Plus_Jakarta_Sans']">
            Proven High-Rise Transformation
          </span>
          <h2 className="font-['Syne'] text-3xl sm:text-4xl font-bold mt-2 text-[#1C130B]">
            From Plain Builder Finish to Luxury Sanctuary
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] border border-[#1C130B]/10 shadow-md">
            <Image src={room.beforeImg} alt="Before makeover" fill className="object-cover" />
            <div className="absolute top-4 left-4 bg-[#1C130B]/80 backdrop-blur-md text-[#FAF8F5] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full font-['Plus_Jakarta_Sans']">
              Before · Sterile Builder Finish
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] border-2 border-[#C5A880] shadow-xl">
            <Image src={room.afterImg} alt="After makeover" fill className="object-cover" />
            <div className="absolute top-4 left-4 bg-[#8A5836] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full font-['Plus_Jakarta_Sans'] shadow">
              After · 48-Hour AuroMakeover
            </div>
            <div className="absolute bottom-4 right-4 bg-[#1C130B]/90 text-[#C5A880] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full font-['Plus_Jakarta_Sans']">
              {room.acousticRating}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Specifications & Architectural Features */}
      <section className="py-16 px-6 bg-white border-y border-[#1C130B]/10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-['Syne'] text-2xl font-bold mb-6 text-[#1C130B]">
                Architectural Invariants & Engineering
              </h3>
              <p className="text-[#1C130B]/80 text-sm sm:text-base leading-relaxed mb-6 font-['Plus_Jakarta_Sans']">
                {room.description}
              </p>
              <div className="space-y-3">
                {room.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#8A5836] shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-[#1C130B]/90 font-['Plus_Jakarta_Sans']">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#FAF8F5] p-6 sm:p-8 rounded-3xl border border-[#C5A880]/30 shadow-sm">
              <h4 className="font-['Syne'] text-lg font-bold mb-6 text-[#1C130B] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C5A880]" />
                Technical & Execution Standards
              </h4>
              <div className="space-y-4">
                {room.specs.map((spec, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:justify-between py-2.5 border-b border-[#1C130B]/10 text-sm gap-1">
                    <span className="text-[#1C130B]/70 font-['Plus_Jakarta_Sans']">{spec.label}</span>
                    <span className="font-bold text-[#1C130B] font-['Plus_Jakarta_Sans'] sm:text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA Banner */}
      <section className="py-20 px-6 bg-[#3E2C1E] text-[#FAF8F5] text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#C5A880] text-xs font-bold tracking-widest uppercase mb-3 font-['Plus_Jakarta_Sans']">
            Ready to upgrade your {room.roomType.toLowerCase()}?
          </p>
          <h2 className="font-['Syne'] text-3xl sm:text-5xl font-black mb-6">
            Book Swatch Van Visit to Your Society
          </h2>
          <p className="text-[#FAF8F5]/80 text-sm sm:text-base mb-8 font-['Plus_Jakarta_Sans']">
            Our laser-equipped Swatch Van visits Kokapet, Tellapur, Manikonda, and Financial District daily. Inspect 300+ physical finishes in your natural flat lighting.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`https://wa.me/919700675637?text=${bookingText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-[#C5A880] hover:bg-[#b0936d] text-[#1C130B] font-bold text-sm tracking-wider uppercase rounded-2xl transition-all shadow-xl font-['Plus_Jakarta_Sans']"
            >
              Confirm Van Appointment on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
