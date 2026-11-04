"use client";

import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles, 
  Phone, 
  Send,
  Layers,
  ChevronRight,
  ArrowRight,
  User
} from 'lucide-react';
import IntakeForm from '@/components/technician/IntakeForm';

interface SocietyVisit {
  id: string;
  time: string;
  society: string;
  flat: string;
  customer: string;
  phone: string;
  gatePassStatus: 'APPROVED' | 'SECURITY_PENDING';
  tierInterest: string;
  swatchesPresented: string[];
  depositStatus: 'PAID' | 'PENDING';
}

const INITIAL_VISITS: SocietyVisit[] = [
  {
    id: 'VISIT-101',
    time: '10:00 AM – 01:00 PM',
    society: 'My Home Bhooja',
    flat: 'Tower 3, Flat 1204',
    customer: 'Arjun Reddy',
    phone: '+91 98490 12345',
    gatePassStatus: 'APPROVED',
    tierInterest: 'Executive Acoustic Louvers',
    swatchesPresented: ['Smoked Walnut Louver', 'Botanical Linen Wallpaper'],
    depositStatus: 'PENDING',
  },
  {
    id: 'VISIT-102',
    time: '02:00 PM – 05:00 PM',
    society: 'Rajapushpa Provincia',
    flat: 'Tower 2, Flat 602',
    customer: 'Sneha M.',
    phone: '+91 99887 54321',
    gatePassStatus: 'SECURITY_PENDING',
    tierInterest: 'Presidential Smart Blinds + Louvers',
    swatchesPresented: ['Double-Cell Honeycomb', 'Oak Slat Panel'],
    depositStatus: 'PENDING',
  },
  {
    id: 'VISIT-103',
    time: '05:30 PM – 07:00 PM',
    society: 'Prestige High Fields',
    flat: 'Tower 5, Flat 1501',
    customer: 'Rahul Verma',
    phone: '+91 97001 98765',
    gatePassStatus: 'APPROVED',
    tierInterest: 'Lotus Temple Pichwai',
    swatchesPresented: ['Gold Foil Damask', 'Pichwai Canvas'],
    depositStatus: 'PAID',
  },
];

export default function TechnicianFieldPortal() {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'swatch_selector' | 'qa_form'>('itinerary');
  const [selectedVisit, setSelectedVisit] = useState<SocietyVisit>(INITIAL_VISITS[0]);
  const [swatchChecks, setSwatchChecks] = useState<Record<string, boolean>>({
    'Smoked Walnut Slat Panel': true,
    'European Acoustic Felt Backing': true,
    'Lotus Pond Pichwai Canvas': false,
    'Matter Wireless Motorized Shading': true,
    '3000K Concealed LED Extrusion': false,
  });
  const [sentWhatsapp, setSentWhatsapp] = useState(false);

  const toggleSwatch = (swatch: string) => {
    setSwatchChecks(prev => ({ ...prev, [swatch]: !prev[swatch] }));
  };

  const handleSendLockedBOM = () => {
    const selectedList = Object.entries(swatchChecks)
      .filter(([_, checked]) => checked)
      .map(([name]) => `• ${name}`)
      .join('\n');

    const msg = encodeURIComponent(
      `Hello ${selectedVisit.customer}, thank you for hosting the AuroMakeover Mobile Van at ${selectedVisit.society} (${selectedVisit.flat}).\n\n*Approved Swatches & Finishes:*\n${selectedList}\n\n*Locked Bill of Materials (BOM):* ₹48,600 (inc. 18% GST)\n*10% Escrow Milestone Deposit:* ₹4,860\n\nTap to lock fixed pricing & dispatch off-site precision cutting: https://aura-makeover.vercel.app/my/payments`
    );

    window.open(`https://wa.me/918555069441?text=${msg}`, '_blank');
    setSentWhatsapp(true);
    setTimeout(() => setSentWhatsapp(false), 4000);
  };

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900 font-['Plus_Jakarta_Sans'] pb-24">
      
      {/* Top Header */}
      <header className="bg-[#1C130B] text-[#FAF8F5] p-5 pt-8 shadow-lg sticky top-0 z-30">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C5A880]/20 border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A880] block">
                Van Dispatch Fleet
              </span>
              <h1 className="font-['Syne'] font-black text-lg text-[#FAF8F5]">
                TechOps: Ramesh Kumar
              </h1>
            </div>
          </div>
          <span className="bg-[#15803D]/20 border border-[#15803D]/50 text-[#15803D] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            TS 09 UB 1234
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="max-w-md mx-auto mt-4 grid grid-cols-3 gap-1 bg-[#FAF8F5]/10 p-1 rounded-xl text-xs font-bold font-['Plus_Jakarta_Sans']">
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'itinerary' ? 'bg-[#C5A880] text-[#1C130B] shadow' : 'text-[#FAF8F5]/70 hover:text-white'
            }`}
          >
            Today&apos;s Route
          </button>
          <button
            onClick={() => setActiveTab('swatch_selector')}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'swatch_selector' ? 'bg-[#C5A880] text-[#1C130B] shadow' : 'text-[#FAF8F5]/70 hover:text-white'
            }`}
          >
            BOM Handoff
          </button>
          <button
            onClick={() => setActiveTab('qa_form')}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'qa_form' ? 'bg-[#C5A880] text-[#1C130B] shadow' : 'text-[#FAF8F5]/70 hover:text-white'
            }`}
          >
            Laser QA
          </button>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-4">

        {/* TAB 1: ITINERARY */}
        {activeTab === 'itinerary' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
              <span>Today&apos;s High-Rise Corridors</span>
              <span>{INITIAL_VISITS.length} Stops</span>
            </div>

            {INITIAL_VISITS.map((visit) => {
              const isSelected = selectedVisit.id === visit.id;
              return (
                <div
                  key={visit.id}
                  onClick={() => setSelectedVisit(visit)}
                  className={`bg-white rounded-2xl p-5 border-2 transition-all cursor-pointer shadow-sm ${
                    isSelected ? 'border-[#8A5836] shadow-md ring-2 ring-[#8A5836]/10' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 font-bold text-xs text-[#8A5836] bg-[#8A5836]/10 px-2.5 py-1 rounded-full">
                      <Clock className="w-3.5 h-3.5" />
                      {visit.time}
                    </span>
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      visit.gatePassStatus === 'APPROVED' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {visit.gatePassStatus === 'APPROVED' ? 'Gate Pass OK' : 'Check Gate'}
                    </span>
                  </div>

                  <h3 className="font-['Syne'] font-bold text-lg text-gray-900 mb-1">
                    {visit.society}
                  </h3>
                  <p className="text-xs text-gray-600 mb-3 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {visit.flat}
                  </p>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-semibold text-gray-700">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      {visit.customer}
                    </span>
                    <a
                      href={`tel:${visit.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#15803D] font-bold flex items-center gap-1 bg-green-50 px-2.5 py-1 rounded-lg"
                    >
                      <Phone className="w-3 h-3" />
                      Call Resident
                    </a>
                  </div>
                </div>
              );
            })}

            {/* Quick Action Bar for Selected Visit */}
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#C5A880]/40 shadow-sm mt-6">
              <h4 className="font-['Syne'] font-bold text-sm text-[#1C130B] mb-1">
                Selected: {selectedVisit.society} ({selectedVisit.flat})
              </h4>
              <p className="text-xs text-gray-600 mb-4">
                Resident Interest: <strong className="text-[#8A5836]">{selectedVisit.tierInterest}</strong>
              </p>
              <button
                onClick={() => setActiveTab('swatch_selector')}
                className="w-full bg-[#1C130B] hover:bg-[#3E2C1E] text-[#C5A880] py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow"
              >
                <span>Open Physical Swatch Checklist</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: SWATCH SELECTOR & BOM LOCK */}
        {activeTab === 'swatch_selector' && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#8A5836] uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-[#C5A880]" />
                On-Site Swatch Presentation
              </div>
              <h2 className="font-['Syne'] font-black text-xl text-gray-900">
                {selectedVisit.society} — {selectedVisit.customer}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Check off physical samples presented and approved by resident.
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-2.5">
              {Object.entries(swatchChecks).map(([swatch, isChecked]) => (
                <div
                  key={swatch}
                  onClick={() => toggleSwatch(swatch)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                    isChecked ? 'bg-amber-50/50 border-[#8A5836] text-[#1C130B]' : 'bg-gray-50 border-gray-200 text-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                      isChecked ? 'bg-[#8A5836] border-[#8A5836] text-white' : 'bg-white border-gray-300'
                    }`}>
                      {isChecked && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <span className="text-xs font-bold">{swatch}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-400">Physical Box</span>
                </div>
              ))}
            </div>

            {/* Locked BOM Card */}
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#C5A880]/30 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600 font-semibold">Total Measured Value:</span>
                <span className="font-black text-sm text-[#1C130B]">₹48,600</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600 font-semibold">Tranche 1 Deposit (10%):</span>
                <span className="font-black text-sm text-[#C5A880] bg-[#1C130B] px-2 py-0.5 rounded">₹4,860</span>
              </div>
              <p className="text-[10px] text-gray-500">
                Locks fixed pricing, prevents roll wastage, and triggers laser survey sign-off.
              </p>
            </div>

            {/* WhatsApp Send Action */}
            <button
              onClick={handleSendLockedBOM}
              className="w-full bg-[#15803D] hover:bg-[#126e34] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
            >
              <Send className="w-4 h-4" />
              <span>Send Locked BOM WhatsApp to Resident</span>
            </button>

            {sentWhatsapp && (
              <p className="text-center text-xs text-green-700 font-bold animate-pulse">
                ✓ WhatsApp payload dispatched to resident!
              </p>
            )}
          </div>
        )}

        {/* TAB 3: LASER QA & SUBSTRATE FORM */}
        {activeTab === 'qa_form' && (
          <div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-xs text-amber-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Checking site: <strong>{selectedVisit.society}</strong> ({selectedVisit.flat})</span>
            </div>
            <IntakeForm />
          </div>
        )}

      </div>
    </main>
  );
}
