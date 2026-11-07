import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import Footer from '@/components/Footer';

const ROOM_SILOS = [
  {
    slug: 'living-room-makeovers',
    title: 'Living Room Makeovers',
    type: 'Hall & Media Wall',
    desc: 'Fluted TV credenzas, acoustic slat feature walls, motorized solar shading & warm 3000K indirect cove illumination.',
    price: 'From ₹38,000',
    time: '48hr Turnaround',
    img: '/images/showcase-living.jpg',
  },
  {
    slug: 'master-bedroom-sanctuaries',
    title: 'Master Bedroom Sanctuaries',
    type: 'Master Suite',
    desc: 'Tactile Belgian linen wallcoverings, hand-embossed Pichwai headboard art & 100% blackout motorized blinds.',
    price: 'From ₹34,000',
    time: '48hr Turnaround',
    img: '/images/after-master-pichwai.jpg',
  },
  {
    slug: 'media-and-acoustic-rooms',
    title: 'Media & Acoustic Rooms',
    type: 'Home Cinema & Study',
    desc: 'NRC 0.85 acoustic composite slats dampening flutter echoes, integrated cable raceways & zero-reverb audio tuning.',
    price: 'From ₹45,000',
    time: '48hr Turnaround',
    img: '/images/after-office-bright.jpg',
  },
  {
    slug: 'balcony-and-outdoor-styling',
    title: 'Balcony & Outdoor Styling',
    type: 'Sky Balcony',
    desc: 'Weatherproof interlocking composite decking, UV50+ biophilic vertical gardens & high-altitude windproof zip blinds.',
    price: 'From ₹28,000',
    time: '24hr Turnaround',
    img: '/images/after-balcony-decking.jpg',
  },
];

export const metadata = {
  title: 'Room Makeover Silos | AuroMakeover',
  description: 'Turnkey 48-hour room transformations for West Hyderabad apartments. Living rooms, master bedroom suites, acoustic media rooms, and balcony sky lounges.',
};

export default function RoomsPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#1C130B]">
      {/* 1. Hero */}
      <section className="pt-32 pb-16 px-6 bg-[#1C130B] text-[#FAF8F5] relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <Image src="/images/hero.jpg" fill className="object-cover" alt="Rooms hub background" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-[#C5A880] text-xs font-bold tracking-[0.3em] uppercase mb-4 font-['Plus_Jakarta_Sans']">
            HUB 2 · ROOM MAKEOVER SILOS
          </p>
          <h1 className="font-['Syne'] text-4xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight">
            Turnkey Rooms.<br /><span className="text-[#C5A880]">Tailored to Your Life.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#FAF8F5]/80 max-w-2xl mx-auto font-['Plus_Jakarta_Sans'] leading-relaxed">
            Select your target room. Pre-engineered for zero dust, zero civil demolition, and guaranteed 48-hour handover while you stay in your flat.
          </p>
        </div>
      </section>

      {/* 2. Room Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ROOM_SILOS.map((room) => (
            <Link
              key={room.slug}
              href={`/rooms/${room.slug}`}
              className="group relative block overflow-hidden rounded-3xl aspect-[16/11] bg-[#1C130B] border border-[#C5A880]/20 hover:border-[#C5A880] transition-all shadow-lg hover:shadow-2xl"
            >
              <Image
                src={room.img}
                alt={room.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C130B] via-[#1C130B]/50 to-transparent"></div>

              <div className="absolute top-6 left-6 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#C5A880] text-[#1C130B] font-['Plus_Jakarta_Sans']">
                  {room.type}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-[#FAF8F5] font-['Plus_Jakarta_Sans']">
                  {room.time}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 flex flex-col justify-end">
                <span className="text-[#C5A880] font-bold text-xs uppercase tracking-widest mb-1 font-['Plus_Jakarta_Sans']">
                  {room.price}
                </span>
                <h3 className="font-['Syne'] text-2xl sm:text-3xl font-bold text-white mb-2 leading-snug">
                  {room.title}
                </h3>
                <p className="text-white/80 text-xs sm:text-sm line-clamp-2 mb-4 font-['Plus_Jakarta_Sans']">
                  {room.desc}
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#C5A880] group-hover:text-white uppercase tracking-wider font-['Plus_Jakarta_Sans']">
                  View Room Specifications & Before/After
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Why AuroMakeover Room Transformation */}
      <section className="py-16 bg-white border-y border-[#C5A880]/20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
          <div className="p-6 bg-[#FAF8F5] rounded-3xl border border-[#1C130B]/5">
            <h4 className="font-['Syne'] font-bold text-lg mb-2 text-[#1C130B]">Zero Structural Scraping</h4>
            <p className="text-sm text-[#1C130B]/70 font-['Plus_Jakarta_Sans']">
              Mechanical clip channels and clean water-based adhesives ensure your apartment walls and slabs remain 100% intact.
            </p>
          </div>
          <div className="p-6 bg-[#FAF8F5] rounded-3xl border border-[#1C130B]/5">
            <h4 className="font-['Syne'] font-bold text-lg mb-2 text-[#1C130B]">Live In Your Home</h4>
            <p className="text-sm text-[#1C130B]/70 font-['Plus_Jakarta_Sans']">
              No civil dust, no toxic fumes, no relocating to hotels. We install in 48 hours without disrupting your daily routine.
            </p>
          </div>
          <div className="p-6 bg-[#FAF8F5] rounded-3xl border border-[#1C130B]/5">
            <h4 className="font-['Syne'] font-bold text-lg mb-2 text-[#1C130B]">10/60/30 Escrow Model</h4>
            <p className="text-sm text-[#1C130B]/70 font-['Plus_Jakarta_Sans']">
              Pay 10% booking, 60% on factory milling, and only release the final 30% after your personal signed QA walkthrough.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
