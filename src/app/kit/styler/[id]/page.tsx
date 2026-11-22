import React from 'react';
import { Metadata } from 'next';
import PlumKitchenStyler from '@/components/styler/PlumKitchenStyler';

export async function generateStaticParams() {
  return [
    { id: 'kitchen_1' },
    { id: 'kitchen_2' },
  ];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const formattedTitle = id.replace(/_/g, ' ').toUpperCase();
  return {
    title: `${formattedTitle} : 3D Kitchen Styler & BOM Customizer | AuroMakeover Hyderabad`,
    description:
      'Customize luxury kitchen envelopes: 34 matte lacquer shades, fluted oak louvers, Calacatta marble, and brass hardware with live 48-hour cost estimation for Hyderabad apartments.',
  };
}

export default async function DynamicKitchenStylerPage({ params }: PageProps) {
  // Await params to comply with Next.js 15/16 App Router requirements
  await params;

  return (
    <main className="min-h-screen bg-[#1C130B]">
      <PlumKitchenStyler />
    </main>
  );
}
