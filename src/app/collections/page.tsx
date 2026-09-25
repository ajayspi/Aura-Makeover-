import React from 'react';
import BeforeAfterGrid from '@/components/BeforeAfterGrid';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Master Showcase | AuroMakeover',
  description: 'Explore 15 true same-space transformations from standard builder-finish to architectural luxury.',
};

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#1C130B]">
      {/* Header/Nav Spacer if needed, or simple back button */}
      <div className="w-full bg-[#1C130B] p-4 text-center">
        <a href="/" className="font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-widest text-[#C5A880] hover:text-[#FAF8F5] transition-colors">
          ← Back to AuroMakeover Homepage
        </a>
      </div>

      <BeforeAfterGrid />

      <Footer />
    </main>
  );
}
