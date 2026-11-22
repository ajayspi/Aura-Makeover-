import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import BeforeAfterGrid from '@/components/BeforeAfterGrid';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Master Collections & Showcase | AuroMakeover',
  description: 'Explore 15 true same-space transformations from standard builder-finish to architectural luxury, plus the tactile Plum-inspired Stone Collection.',
};

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#1C130B]">
      {/* Top Banner with Plum Stone Collection Feature */}
      <div className="w-full bg-[#1C130B] border-b border-[#C5A880]/20 text-[#FAF8F5] py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            className="font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-widest text-[#C5A880] hover:text-white transition-colors"
          >
            ← Back to Homepage
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/kit/styler/kitchen_5"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A880] hover:bg-[#b8996f] text-[#1C130B] text-xs font-bold uppercase tracking-wider transition-all font-['Plus_Jakarta_Sans'] shadow"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#1C130B]" />
              Line : Kitchen 3D Styler →
            </Link>

            <Link
              href="/collections/stone"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8A5836] hover:bg-[#a66a42] text-white text-xs font-bold uppercase tracking-wider transition-all font-['Plus_Jakarta_Sans'] shadow"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              Green 05 - Stone Collection →
            </Link>
          </div>
        </div>
      </div>

      <BeforeAfterGrid />

      <Footer />
    </main>
  );
}
