import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Syne, Plus_Jakarta_Sans } from 'next/font/google';
import CityLanding from './CityLanding';
import { getCity, getAllCitySlugs } from '@/lib/cities';

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

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
    <html lang="en" className={`${syne.variable} ${plusJakarta.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col">
        <CityLanding city={cityConfig} />
      </body>
    </html>
  );
}