import { Metadata } from 'next';
import RenovationComparator from '@/components/RenovationComparator';
import EstimatorGateway from '@/components/EstimatorGateway';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Zero-Civil vs Traditional Renovation Disruption & Cost Comparator | AuroMakeover',
  description: 'Calculate the real financial and lifestyle cost of 45-day traditional civil renovation versus Aura Makeover 100% dust-free zero-civil transformation.',
};

export default function ComparatorPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#1C130B] font-['Plus_Jakarta_Sans'] overflow-x-hidden pt-20">
      <RenovationComparator />
      <EstimatorGateway />
      <Footer />
    </main>
  );
}
