import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight } from 'lucide-react';
import Footer from '@/components/Footer';

const CORRIDORS = [
  {
    slug: 'premium-interiors-kokapet-highrises',
    title: 'Kokapet High-Rise Corridor',
    societies: 'My Home Bhooja, Rajapushpa Provincia, SAS Crown, The Trilight',
    stats: '142+ Flats Transformed',
    desc: 'Engineered for Kokapet towers: west-facing solar heat rejection smart blinds, double-height acoustic fluted louvers & Pichwai murals.',
    img: '/images/showcase-living.jpg',
  },
  {
    slug: 'interior-design-makeovers-in-manikonda',
    title: 'Manikonda & Puppalguda Corridor',
    societies: 'Lanco Hills, Puppalguda Enclaves, Chitrapuri Hills',
    stats: '98+ Flats Transformed',
    desc: '48-hour rental turnarounds and high-durability surface upgrades delivering an average ₹18,000/mo landlord rent bump.',
    img: '/images/after-master-pichwai.jpg',
  },
  {
    slug: 'financial-district-apartment-styling',
    title: 'Financial District & Nanakramguda',
    societies: 'Prestige High Fields, Jayabheri Silicon County, Aparna CyberLife',
    stats: '115+ Flats Transformed',
    desc: 'Acoustically dampened home office study walls and automated smart shades tailored for global executive tech apartments.',
    img: '/images/after-office-bright.jpg',
  },
];

const METROS = [
  { slug: 'hyderabad', name: 'Hyderabad West Corridor', state: 'Telangana', active: '247 Flats Done' },
  { slug: 'bangalore', name: 'Bangalore East (Whitefield / Sarjapur)', state: 'Karnataka', active: '189 Flats Done' },
  { slug: 'chennai', name: 'Chennai South (OMR Corridor)', state: 'Tamil Nadu', active: '156 Flats Done' },
];

export const metadata = {
  title: 'Service Locations & Corridors | AuroMakeover',
  description: 'Pre-measured 48-hour apartment makeovers across Kokapet, Manikonda, Financial District, Hyderabad, Bangalore, and Chennai.',
};

export default function LocationsPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#1C130B]">
      {/* 1. Hero */}
      <section className="pt-32 pb-16 px-6 bg-[#1C130B] text-[#FAF8F5] relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <Image src="/images/hero.jpg" fill className="object-cover" alt="Locations hero" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-[#C5A880] text-xs font-bold tracking-[0.3em] uppercase mb-4 font-['Plus_Jakarta_Sans']">
            HUB 4 · LOCALIZED AEO & GEO SILOS
          </p>
          <h1 className="font-['Syne'] text-4xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight">
            Your Society.<br /><span className="text-[#C5A880]">Pre-Measured Corridors.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#FAF8F5]/80 max-w-2xl mx-auto font-['Plus_Jakarta_Sans'] leading-relaxed">
            We operate localized mobile Swatch Vans with precision laser scanners stationed across West Hyderabad high-rises every single day.
          </p>
        </div>
      </section>

      {/* 2. Micro-Market Corridors */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest text-[#8A5836] uppercase font-['Plus_Jakarta_Sans']">
            Hyper-Local Service Hubs
          </span>
          <h2 className="font-['Syne'] text-3xl sm:text-4xl font-bold mt-2 text-[#1C130B]">
            West Hyderabad High-Rise Corridors
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CORRIDORS.map((c) => (
            <Link
              key={c.slug}
              href={`/locations/${c.slug}`}
              className="group bg-white rounded-3xl overflow-hidden border border-[#C5A880]/20 hover:border-[#C5A880] shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={c.img}
                  alt={c.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-[#1C130B]/85 text-[#C5A880] text-xs font-bold px-3 py-1 rounded-full font-['Plus_Jakarta_Sans']">
                  {c.stats}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-['Syne'] text-xl font-bold text-[#1C130B] mb-2 group-hover:text-[#8A5836] transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#8A5836] mb-3 font-['Plus_Jakarta_Sans']">
                    {c.societies}
                  </p>
                  <p className="text-xs text-[#1C130B]/70 line-clamp-3 mb-4 font-['Plus_Jakarta_Sans']">
                    {c.desc}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8A5836] uppercase tracking-wider font-['Plus_Jakarta_Sans']">
                  Explore Corridor Silo <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Metro SSR Cities */}
      <section className="py-16 bg-[#3E2C1E] text-[#FAF8F5] px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-widest text-[#C5A880] uppercase font-['Plus_Jakarta_Sans']">
              Regional Metro Hubs
            </span>
            <h2 className="font-['Syne'] text-3xl font-bold mt-2">
              Major Metros Operating Active Swatch Vans
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {METROS.map((metro) => (
              <Link
                key={metro.slug}
                href={`/${metro.slug}`}
                className="p-6 bg-white/5 border border-white/10 hover:border-[#C5A880] rounded-3xl transition-all group block text-center sm:text-left"
              >
                <div className="flex items-center gap-2 text-[#C5A880] mb-2 font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-wider">
                  <MapPin className="w-4 h-4" />
                  {metro.state}
                </div>
                <h4 className="font-['Syne'] text-xl font-bold text-white mb-2 group-hover:text-[#C5A880] transition-colors">
                  {metro.name}
                </h4>
                <p className="text-xs text-white/60 font-['Plus_Jakarta_Sans'] mb-4">
                  {metro.active} · 48hr Guarantee
                </p>
                <span className="text-xs font-bold uppercase tracking-wider text-[#C5A880] font-['Plus_Jakarta_Sans']">
                  Visit City Hub →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
