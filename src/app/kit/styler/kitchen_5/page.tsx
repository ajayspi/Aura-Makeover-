import React from 'react';
import { Metadata } from 'next';
import PlumKitchenStyler from '@/components/styler/PlumKitchenStyler';

export const metadata: Metadata = {
  title: 'Line : 3D Kitchen Styler & BOM Customizer | AuroMakeover Hyderabad',
  description:
    'Customize the Line Kitchen Makeover: Choose from 34 matte lacquer shades, fluted oak louvers, Calacatta marble, and brass hardware with live 48-hour cost estimation for Hyderabad apartments.',
};

export default function Kitchen5StylerPage() {
  return (
    <main className="min-h-screen bg-[#1C130B]">
      <PlumKitchenStyler />
    </main>
  );
}
