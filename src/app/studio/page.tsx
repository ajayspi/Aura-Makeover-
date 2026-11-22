import React from 'react';
import { Metadata } from 'next';
import PlumRoomStyler from '@/components/styler/PlumRoomStyler';

export const metadata: Metadata = {
  title: 'AI Design Studio & 3D Room Styler | AuroMakeover Hyderabad',
  description: 'Interactive 3D Room Styler: Configure acoustic fluted louvers, mineral stone finishes, motorized Somfy solar blinds, and 3000K warm cove lighting with live BOM costing for Hyderabad apartments.',
};

export default function StudioPage() {
  return (
    <main className="min-h-screen bg-[#1C130B]">
      <PlumRoomStyler />
    </main>
  );
}
