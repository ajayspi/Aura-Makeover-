import React from 'react';
import { Metadata } from 'next';
import PlumRoomStyler from '@/components/styler/PlumRoomStyler';

export const metadata: Metadata = {
  title: 'AI Design Studio & 3D Room Styler (Plum-Inspired) | AuroMakeover',
  description: 'Interactive 3D Room Styler: Configure acoustic fluted louvers, Plum-inspired mineral stone finishes, motorized Somfy solar blinds, and 3000K warm cove lighting with live BOM costing.',
};

export default function StudioPage() {
  return (
    <main className="min-h-screen bg-[#1C130B]">
      <PlumRoomStyler />
    </main>
  );
}
