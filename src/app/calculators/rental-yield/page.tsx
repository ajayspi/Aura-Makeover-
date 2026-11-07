import { Metadata } from 'next';
import RentalYieldCalculator from '@/components/RentalYieldCalculator';
import BeforeAfterGrid from '@/components/BeforeAfterGrid';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Rental Yield & Landlord Capex Calculator | AuroMakeover',
  description: 'High-rise landlord capex and rental appreciation calculator for My Home Bhooja, Rajapushpa Provincia, Prestige High Fields, and Kokapet investors.',
};

export default function RentalYieldCalculatorPage() {
  return (
    <main className="min-h-screen bg-[#1C130B] text-[#FAF8F5] font-['Plus_Jakarta_Sans'] overflow-x-hidden pt-20">
      <div className="max-w-7xl mx-auto px-6 pt-10 text-center">
        <p className="text-[#C5A880] text-xs font-bold tracking-[0.3em] uppercase mb-3 font-['Plus_Jakarta_Sans']">
          HUB 3 · LANDLORD FINANCIAL ENGINES
        </p>
        <h1 className="font-['Syne'] text-4xl sm:text-6xl font-black text-white mb-4">
          High-Rise Rental Yield & Capex Model
        </h1>
        <p className="text-white/70 text-sm sm:text-base max-w-2xl mx-auto mb-8 font-['Plus_Jakarta_Sans']">
          Calculate the exact monthly rental premium, vacancy reduction days, and payback period across Kokapet, Tellapur, and Financial District 3BHK and 4BHK units.
        </p>
      </div>

      <RentalYieldCalculator />
      
      <div className="bg-[#FAF8F5] text-[#1C130B]">
        <BeforeAfterGrid />
      </div>

      <Footer />
    </main>
  );
}
