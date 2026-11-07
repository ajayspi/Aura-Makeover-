import React from 'react';
import Link from 'next/link';
import { ArrowRight, Calculator, TrendingUp } from 'lucide-react';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Calculators & Financial Models | AuroMakeover',
  description: 'Precision capex and cost estimators for high-rise apartment transformations in West Hyderabad.',
};

export default function CalculatorsPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#1C130B]">
      <section className="pt-32 pb-16 px-6 bg-[#1C130B] text-[#FAF8F5] text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#C5A880] text-xs font-bold tracking-[0.3em] uppercase mb-4 font-['Plus_Jakarta_Sans']">
            HUB 3 · PRECISION ESTIMATORS & ROI
          </p>
          <h1 className="font-['Syne'] text-4xl sm:text-6xl font-black mb-4">
            Interactive Calculators
          </h1>
          <p className="text-white/75 text-base sm:text-lg max-w-2xl mx-auto font-['Plus_Jakarta_Sans']">
            Calculate material sq.ft requirements, landlord rental appreciation, and 10/60/30 escrow schedules.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link
            href="/calculators/rental-yield"
            className="p-8 bg-white rounded-3xl border border-[#C5A880]/30 hover:border-[#C5A880] shadow-sm hover:shadow-xl transition-all group block"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#C5A880]/15 flex items-center justify-center text-[#8A5836] mb-6">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-['Syne'] text-2xl font-bold mb-3 text-[#1C130B] group-hover:text-[#8A5836] transition-colors">
              Landlord Rental Yield Model
            </h3>
            <p className="text-[#1C130B]/75 text-sm leading-relaxed mb-6 font-['Plus_Jakarta_Sans']">
              Simulate ₹15,000–₹25,000/mo rental bumps and zero vacant tenant turnaround for Kokapet, Financial District, and Tellapur high-rises.
            </p>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8A5836] font-['Plus_Jakarta_Sans']">
              Open Yield Model <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            href="/#estimator"
            className="p-8 bg-white rounded-3xl border border-[#C5A880]/30 hover:border-[#C5A880] shadow-sm hover:shadow-xl transition-all group block"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#8A5836]/15 flex items-center justify-center text-[#8A5836] mb-6">
              <Calculator className="w-6 h-6" />
            </div>
            <h3 className="font-['Syne'] text-2xl font-bold mb-3 text-[#1C130B] group-hover:text-[#8A5836] transition-colors">
              3-Step Makeover Cost Estimator
            </h3>
            <p className="text-[#1C130B]/75 text-sm leading-relaxed mb-6 font-['Plus_Jakarta_Sans']">
              Select your society floorplan (My Home Bhooja, Aparna Sarovar, Provincia), choose your finish tier, and get instant itemized GST & escrow tranches.
            </p>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8A5836] font-['Plus_Jakarta_Sans']">
              Launch Live Estimator <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
