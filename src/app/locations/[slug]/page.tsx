import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, ArrowRight, Truck } from 'lucide-react';
import Footer from '@/components/Footer';

interface LocationData {
  slug: string;
  corridorName: string;
  headline: string;
  subhead: string;
  heroImg: string;
  flatsCompleted: string;
  vanSchedule: string;
  societies: { name: string; flats: string; typicalLayout: string; estCost: string }[];
  localChallenges: { issue: string; solution: string }[];
  metaTitle: string;
  metaDesc: string;
}

const LOCATIONS: Record<string, LocationData> = {
  'premium-interiors-kokapet-highrises': {
    slug: 'premium-interiors-kokapet-highrises',
    corridorName: 'Kokapet High-Rise Corridor',
    headline: '48-Hour Luxury Makeovers for Kokapet High-Rises',
    subhead: 'Pre-measured acoustic fluted slats, European Pichwai murals, and solar blinds for My Home Bhooja, Rajapushpa Provincia & Kokapet towers.',
    heroImg: '/images/showcase-living.jpg',
    flatsCompleted: '142+ Flats Completed',
    vanSchedule: 'Daily Swatch Van Service (10 AM – 8 PM)',
    societies: [
      { name: 'My Home Bhooja', flats: '47 Flats Done', typicalLayout: '3BHK & 4BHK (2,680 – 4,070 sq.ft)', estCost: '₹38,000 – ₹65,000' },
      { name: 'Rajapushpa Provincia', flats: '38 Flats Done', typicalLayout: '3BHK & 4BHK (2,020 – 3,000 sq.ft)', estCost: '₹42,000 – ₹58,000' },
      { name: 'SAS Crown', flats: '16 Flats Done', typicalLayout: '4BHK Sky Villas (6,500+ sq.ft)', estCost: '₹75,000 – ₹1,20,000' },
      { name: 'The Trilight', flats: '12 Flats Done', typicalLayout: '3BHK & 4BHK (2,850 sq.ft)', estCost: '₹45,000 – ₹68,000' },
    ],
    localChallenges: [
      { issue: 'Intense West Afternoon Heat on Floors 15+', solution: 'Dual-cell automated Somfy blinds reject 78% solar radiation, dropping room temperature by 4°C.' },
      { issue: 'Double-Height Living Hall Flutter Echoes', solution: 'Acoustic composite fluted louvers (NRC 0.85) eliminate hollow room reflections across Italian marble floors.' },
      { issue: 'Strict Society RWA Weekend Noise Rules', solution: 'Zero civil demolition, zero wet drilling, zero dust. Silent mechanical hanging installed in 48 hours.' },
    ],
    metaTitle: 'Interior Design Makeovers in Kokapet High-Rises | AuroMakeover',
    metaDesc: 'Luxury home makeovers in Kokapet, Hyderabad. Pre-measured for My Home Bhooja & Rajapushpa Provincia. 48-hr turnaround with zero civil work.',
  },
  'interior-design-makeovers-in-manikonda': {
    slug: 'interior-design-makeovers-in-manikonda',
    corridorName: 'Manikonda & Puppalguda Corridor',
    headline: 'Quick 48-Hour Interior Makeovers in Manikonda & Lanco Hills',
    subhead: 'High-impact accent walls and rental yield maximization for apartments in Manikonda and Puppalguda.',
    heroImg: '/images/after-master-pichwai.jpg',
    flatsCompleted: '98+ Flats Completed',
    vanSchedule: 'Tuesday, Thursday & Weekend Route',
    societies: [
      { name: 'Lanco Hills Mega High-Rise', flats: '76 Flats Done', typicalLayout: '2BHK, 3BHK & 4BHK Units', estCost: '₹32,000 – ₹55,000' },
      { name: 'Puppalguda Premium Enclaves', flats: '22 Flats Done', typicalLayout: '3BHK (1,850 – 2,400 sq.ft)', estCost: '₹36,000 – ₹52,000' },
      { name: 'Chitrapuri Hills Gated Units', flats: '18 Flats Done', typicalLayout: '2BHK & 3BHK Towers', estCost: '₹28,000 – ₹45,000' },
    ],
    localChallenges: [
      { issue: 'Landlords Needing Fast Tenant Handover', solution: '48-hour turnkey execution enables immediate tenant occupancy with an average ₹18,000/mo rental bump.' },
      { issue: 'Wall Peeling & Deccan Humidity', solution: 'Moisture-resistant German Henkel Metylan adhesives and breathable non-woven wallpapers prevent edge lifting.' },
      { issue: 'Compact Apartment Acoustic Clutter', solution: 'Space-saving fluted louvers (12mm slim profile) add architectural warmth without reducing usable carpet area.' },
    ],
    metaTitle: 'Interior Design Makeovers in Manikonda | AuroMakeover',
    metaDesc: 'Turnkey 48-hour interior upgrades for Manikonda & Lanco Hills apartments. Zero civil work, instant quotes, 2-year warranty.',
  },
  'financial-district-apartment-styling': {
    slug: 'financial-district-apartment-styling',
    corridorName: 'Financial District & Nanakramguda',
    headline: 'Architectural Apartment Styling in Financial District',
    subhead: 'Sound-dampened executive home offices, motorized drapes, and feature walls for Prestige High Fields & Gachibowli towers.',
    heroImg: '/images/after-office-bright.jpg',
    flatsCompleted: '115+ Flats Completed',
    vanSchedule: 'Monday through Saturday Service',
    societies: [
      { name: 'Prestige High Fields', flats: '54 Flats Done', typicalLayout: '2.5BHK & 3BHK (1,490 – 1,980 sq.ft)', estCost: '₹35,000 – ₹52,000' },
      { name: 'Jayabheri Silicon County', flats: '51 Flats Done', typicalLayout: '3BHK & 4BHK (2,200 – 3,100 sq.ft)', estCost: '₹40,000 – ₹62,000' },
      { name: 'Aparna CyberLife', flats: '33 Flats Done', typicalLayout: '3BHK (1,685 – 1,965 sq.ft)', estCost: '₹36,000 – ₹48,000' },
    ],
    localChallenges: [
      { issue: 'Global Remote Work Conference Call Echoes', solution: 'Acoustic PET slat headboards and media wall panels deliver studio-quality vocal clarity on video meetings.' },
      { issue: 'High Glass Façade Solar Glare', solution: 'Automated Matter-enabled motorized solar blinds cut screen glare while preserving panoramic skyline views.' },
      { issue: 'Fast-Paced Tech Professional Schedules', solution: 'Digital 10/60/30 escrow tracker and full photo progress reports via your private /my/dashboard portal.' },
    ],
    metaTitle: 'Financial District Apartment Styling & Makeovers | AuroMakeover',
    metaDesc: 'Interior styling for Prestige High Fields & Financial District apartments in Hyderabad. 48-hr execution, acoustic panels, smart blinds.',
  },
};

export async function generateStaticParams() {
  return Object.keys(LOCATIONS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const loc = LOCATIONS[resolvedParams.slug];
  if (!loc) return { title: 'Locations | AuroMakeover' };
  return {
    title: loc.metaTitle,
    description: loc.metaDesc,
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const loc = LOCATIONS[resolvedParams.slug];

  if (!loc) {
    notFound();
  }

  const bookingText = encodeURIComponent(
    `Hi AuroMakeover! I live in ${loc.corridorName} and want to book a Swatch Van visit for my apartment. Please share available slots.`
  );

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#1C130B]">
      {/* 1. Hero */}
      <section className="pt-28 pb-16 px-6 bg-[#1C130B] text-[#FAF8F5] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image src={loc.heroImg} fill className="object-cover" alt={loc.corridorName} priority />
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <Link
            href="/locations"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C5A880] uppercase tracking-widest hover:text-[#FAF8F5] transition-colors mb-6 font-['Plus_Jakarta_Sans']"
          >
            ← Back to All Corridors
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/30 font-['Plus_Jakarta_Sans']">
              <MapPin className="w-3.5 h-3.5" />
              {loc.corridorName}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-white/10 text-[#FAF8F5] font-['Plus_Jakarta_Sans']">
              {loc.flatsCompleted}
            </span>
          </div>

          <h1 className="font-['Syne'] text-4xl sm:text-5xl md:text-6xl font-black mb-4 leading-tight">
            {loc.headline}
          </h1>
          <p className="text-[#FAF8F5]/80 text-lg sm:text-xl max-w-3xl mb-8 font-['Plus_Jakarta_Sans'] leading-relaxed">
            {loc.subhead}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`https://wa.me/919700675637?text=${bookingText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#C5A880] hover:bg-[#b0936d] text-[#1C130B] font-bold text-sm tracking-wider uppercase rounded-2xl transition-all shadow-lg font-['Plus_Jakarta_Sans']"
            >
              Book Swatch Van to My Flat
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/#estimator"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 text-[#FAF8F5] font-semibold text-sm rounded-2xl transition-all font-['Plus_Jakarta_Sans'] backdrop-blur-md"
            >
              Check Pre-Measured Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Swatch Van Dispatch Band */}
      <section className="bg-[#8A5836] text-[#FAF8F5] py-4 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-[#C5A880] shrink-0" />
            <span className="text-sm font-semibold font-['Plus_Jakarta_Sans']">
              <strong>Active Swatch Route:</strong> {loc.vanSchedule}
            </span>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C5A880] font-['Plus_Jakarta_Sans']">
            Laser Scanning & Material Swatches Brought To Your Door
          </span>
        </div>
      </section>

      {/* 3. Pre-Measured Societies in This Corridor */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest text-[#8A5836] uppercase font-['Plus_Jakarta_Sans']">
            Pre-Measured Floorplans
          </span>
          <h2 className="font-['Syne'] text-3xl sm:text-4xl font-bold mt-2 text-[#1C130B]">
            Societies We Transform Weekly
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loc.societies.map((soc, i) => (
            <div key={i} className="p-6 bg-white rounded-3xl border border-[#1C130B]/10 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-['Syne'] text-xl font-bold text-[#1C130B]">{soc.name}</h3>
                <span className="text-xs font-bold text-[#15803D] bg-green-50 px-2.5 py-1 rounded-full font-['Plus_Jakarta_Sans']">
                  {soc.flats}
                </span>
              </div>
              <p className="text-xs text-[#1C130B]/70 mb-4 font-['Plus_Jakarta_Sans']">
                Typical Layouts: {soc.typicalLayout}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-[#1C130B]/10">
                <span className="text-xs text-[#1C130B]/60 font-['Plus_Jakarta_Sans']">AuroMakeover Estimate</span>
                <span className="text-sm font-bold text-[#8A5836] font-['Plus_Jakarta_Sans']">{soc.estCost}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Local High-Rise Engineering Solved */}
      <section className="py-16 px-6 bg-white border-y border-[#1C130B]/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-['Syne'] text-3xl font-bold mb-10 text-center text-[#1C130B]">
            Engineered For {loc.corridorName} Challenges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loc.localChallenges.map((item, i) => (
              <div key={i} className="p-6 bg-[#FAF8F5] rounded-3xl border border-[#C5A880]/30 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-[#8A5836] tracking-wider uppercase font-['Plus_Jakarta_Sans'] block mb-2">
                    Challenge {i + 1}
                  </span>
                  <h4 className="font-['Syne'] font-bold text-base text-[#1C130B] mb-3">{item.issue}</h4>
                  <p className="text-sm text-[#1C130B]/75 leading-relaxed font-['Plus_Jakarta_Sans']">
                    {item.solution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. City Link Back */}
      <section className="py-12 px-6 bg-[#FAF8F5] text-center border-b border-[#1C130B]/10">
        <p className="text-sm text-[#1C130B]/70 font-['Plus_Jakarta_Sans']">
          Looking for other Hyderabad or South India metro locations? Explore our{' '}
          <Link href="/hyderabad" className="font-bold text-[#8A5836] hover:underline">
            Hyderabad City Hub
          </Link>
          ,{' '}
          <Link href="/bangalore" className="font-bold text-[#8A5836] hover:underline">
            Bangalore
          </Link>
          , or{' '}
          <Link href="/chennai" className="font-bold text-[#8A5836] hover:underline">
            Chennai
          </Link>
          .
        </p>
      </section>

      <Footer />
    </main>
  );
}
