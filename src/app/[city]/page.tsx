import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CityLanding from './CityLanding';
import { getCity, getAllCitySlugs } from '@/lib/cities';

interface CityPageProps {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  return getAllCitySlugs().map((slug) => ({ city: slug }));
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { city } = await params;
  const cityConfig = getCity(city);
  
  if (!cityConfig) {
    return { title: 'City Not Found' };
  }
  
  return {
    title: cityConfig.meta.title,
    description: cityConfig.meta.description,
    openGraph: {
      title: cityConfig.meta.title,
      description: cityConfig.meta.description,
      type: 'website',
    },
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const { city } = await params;
  const cityConfig = getCity(city);
  
  if (!cityConfig) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#1C130B] font-['Plus_Jakarta_Sans'] overflow-x-hidden">
      <CityLanding city={cityConfig} />
    </main>
  );
}