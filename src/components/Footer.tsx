"use client";

import React from 'react';
import {
  ShieldCheck,
  MapPin,
  MessageCircle,
  ArrowUpRight,
  Truck,
} from 'lucide-react';
import { CityConfig } from '@/lib/cities';

interface FooterProps {
  city?: CityConfig;
}

const QUICK_LINKS = [
  { label: 'Instant Price Estimator', href: '#estimator' },
  { label: 'Design Lookbook', href: '#gallery' },
  { label: 'Pre-Measured Societies', href: '#societies' },
  { label: 'Client Reviews', href: '#reviews' },
  { label: 'The 48-Hour Process', href: '#how-it-works' },
];

const DESIGN_COLLECTIONS = [
  { label: 'Botanical Wallpapers', href: '#gallery' },
  { label: 'Acoustic Fluted Louvers', href: '#gallery' },
  { label: 'Neo-Classical Mouldings', href: '#gallery' },
  { label: 'Temple Pichwai Canvas', href: '#gallery' },
];

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function Footer({ city }: FooterProps) {
  const serviceAreas = city?.serviceAreas || ['Kokapet', 'Tellapur', 'Financial District', 'Nallagandla', 'Gachibowli'];
  const whatsappNumber = city?.whatsappNumber || '919700675637';
  const cityName = city?.name || 'Hyderabad';
  const cityRegion = city?.region || 'West';

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hi AuroMakeover! 👋 I would like to inquire about a 48-hour premium makeover for my home in ${cityName}.`
  )}`;

  return (
    <footer className="w-full bg-[#1C130B] text-[#FAF8F5] border-t border-[#C5A880]/30 pt-16 pb-12 px-6 sm:px-8 relative overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A880]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8A5836]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Column & 2-Year Warranty Badge */}
          <div className="md:col-span-5 space-y-6">
            <div>
              <h3 className="text-3xl font-black font-['Syne'] tracking-tight mb-2 text-[#FAF8F5]">
                Auro<span className="text-[#C5A880]">Makeover</span>
              </h3>
              <p className="text-sm text-[#FAF8F5]/70 font-medium leading-relaxed max-w-sm">
                Cinematic 48-Hour Micro-Makeovers for {cityName}&apos;s Marquee High-Rises. Zero civil work. Engineered acoustic louvers, museum wallpapers & smart blinds.
              </p>
            </div>

            {/* 2-Year Warranty Seal Badge */}
            <div className="bg-[#FAF8F5]/5 border border-[#C5A880]/40 p-5 rounded-2xl max-w-md shadow-lg relative overflow-hidden group hover:border-[#C5A880] transition-colors">
              <div className="flex items-start gap-4">
                <div className="bg-[#C5A880]/20 p-3 rounded-2xl border border-[#C5A880]/30 text-[#C5A880] shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold font-['Syne'] text-[#FAF8F5] flex items-center gap-2">
                    2-Year Comprehensive Warranty
                    <span className="text-[10px] bg-[#C5A880] text-[#1C130B] font-bold px-2 py-0.5 rounded-full uppercase">
                      Included
                    </span>
                  </div>
                  <p className="text-xs text-[#FAF8F5]/70 font-medium mt-1 leading-relaxed">
                    Guaranteed zero-peel German adhesive bonding, bubble-free laser alignment & mechanical hardware QA vault.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Hotline Button */}
            <div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#15803D] hover:bg-[#166534] text-[#FAF8F5] px-6 py-3.5 rounded-2xl font-bold font-['Syne'] text-sm transition-all active:scale-95 shadow-lg shadow-[#15803D]/25"
              >
                <MessageCircle className="w-5 h-5 text-white" />
                <span>WhatsApp Hotline: +91 {whatsappNumber.slice(2, 4)} {whatsappNumber.slice(4, 9)} {whatsappNumber.slice(9)}</span>
              </a>
            </div>
          </div>

          {/* Service Areas Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-[#C5A880] font-['Syne']">
              Service Areas ({cityName} {cityRegion})
            </h4>
            <p className="text-xs text-[#FAF8F5]/60 font-medium">
              48-hour dedicated mobile van dispatches to:
            </p>
            <ul className="space-y-2.5">
              {serviceAreas.map((area) => (
                <li key={area} className="flex items-center gap-2 text-sm text-[#FAF8F5]/85 font-medium">
                  <MapPin className="w-4 h-4 text-[#C5A880] shrink-0" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
            <div className="pt-2 text-xs text-[#FAF8F5]/60 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#8A5836]" />
              <span>Mobile showroom van arrives in 60-120 mins</span>
            </div>
          </div>

          {/* Quick Links & Collections */}
          <div className="md:col-span-4 grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#C5A880] font-['Syne']">
                Navigation
              </h4>
              <ul className="space-y-2 text-xs font-medium">
                {QUICK_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[#FAF8F5]/70 hover:text-[#C5A880] transition-colors flex items-center gap-1"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="w-3 h-3 text-[#C5A880]/50" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#C5A880] font-['Syne']">
                Collections
              </h4>
              <ul className="space-y-2 text-xs font-medium">
                {DESIGN_COLLECTIONS.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-[#FAF8F5]/70 hover:text-[#C5A880] transition-colors flex items-center gap-1"
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight className="w-3 h-3 text-[#C5A880]/50" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Strip: Social Links & Copyright */}
        <div className="pt-8 border-t border-[#C5A880]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#FAF8F5]/60 text-center sm:text-left">
            © 2026 AuroMakeover Spacemake OS. All rights reserved.
          </div>

          {/* Social Link Placeholders with rounded-2xl targets */}
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="AuroMakeover on Instagram"
              className="w-10 h-10 rounded-2xl bg-[#FAF8F5]/5 border border-[#C5A880]/30 hover:border-[#C5A880] hover:bg-[#C5A880]/10 text-[#C5A880] hover:text-[#FAF8F5] flex items-center justify-center transition-all"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>

            <a
              href={`https://wa.me/${city?.whatsappNumber || '919700675637'}?text=${encodeURIComponent(
                `Hi AuroMakeover! 👋 I would like to inquire about a 48-hour premium makeover for my home in ${city?.name || 'Hyderabad'}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="AuroMakeover on WhatsApp"
              className="w-10 h-10 rounded-2xl bg-[#FAF8F5]/5 border border-[#C5A880]/30 hover:border-[#15803D] hover:bg-[#15803D]/10 hover:text-[#15803D] text-[#C5A880] flex items-center justify-center transition-all"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="AuroMakeover on LinkedIn"
              className="w-10 h-10 rounded-2xl bg-[#FAF8F5]/5 border border-[#C5A880]/30 hover:border-[#C5A880] hover:bg-[#C5A880]/10 text-[#C5A880] hover:text-[#FAF8F5] flex items-center justify-center transition-all"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
