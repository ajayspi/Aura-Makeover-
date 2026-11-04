import { Metadata } from 'next';
import RentalYieldCalculator from '@/components/RentalYieldCalculator';
import BeforeAfterGrid from '@/components/BeforeAfterGrid';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'West Hyderabad Rental Yield & Landlord Payback Model | AuroMakeover',
  description: 'High-rise landlord capex and rental appreciation calculator for My Home Bhooja, Rajapushpa Provincia, Prestige High Fields, and Aparna Sarovar Zenith.',
};

export default function RentalROIPage() {
  return (
    <main className="min-h-screen bg-[#1C130B] text-[#FAF8F5] font-['Plus_Jakarta_Sans'] overflow-x-hidden pt-20">
      <RentalYieldCalculator />
      <div className="bg-[#FAF8F5] text-[#1C130B]">
        <BeforeAfterGrid />
      </div>
      <Footer />
    </main>
  );
}
