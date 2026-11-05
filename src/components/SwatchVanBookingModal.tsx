"use client";

import React, { useState } from 'react';
import { 
  Truck, 
  Calendar, 
  Clock, 
  Building, 
  Phone, 
  User, 
  Check, 
  Copy, 
  ShieldCheck, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { AiSensyService } from '@/lib/services/AiSensyService';
import { WEST_HYDERABAD_SOCIETIES } from '@/lib/roi-engine';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export interface SwatchVanBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSociety?: string;
  finishTier?: string;
  wallDimensions?: string;
}

export default function SwatchVanBookingModal({
  isOpen,
  onClose,
  initialSociety,
  finishTier,
  wallDimensions,
}: SwatchVanBookingModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [society, setSociety] = useState(initialSociety || 'My Home Bhooja');
  const [flatNumber, setFlatNumber] = useState('');
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [preferredSlot, setPreferredSlot] = useState<'Morning (10:00 AM – 1:00 PM)' | 'Afternoon (2:00 PM – 5:00 PM)'>('Morning (10:00 AM – 1:00 PM)');
  const [copied, setCopied] = useState(false);

  // Generate pre-formatted MyGate pass text
  const myGateText = AiSensyService.generateMyGatePassText({
    society,
    flatNumber: flatNumber || 'Pending Confirmation',
    date: preferredDate,
    slot: preferredSlot,
  });

  const handleCopyPass = () => {
    navigator.clipboard.writeText(myGateText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleConfirmAndOpenWhatsApp = async () => {
    try {
      await fetch('/api/leads/estimator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName || 'High-Rise Resident',
          phone: phone || '8555069441',
          society,
          source: 'swatch_van_dispatch_modal',
          preferredDate,
          preferredSlot,
          finishTier: finishTier || 'premium',
          notes: `Swatch Van Gate Dispatch for ${society} (${flatNumber || 'Flat N/A'})`,
        }),
      });
    } catch {
      // Non-blocking lead persist
    }

    const waUrl = AiSensyService.buildWhatsAppBookingUrl({
      customerName: customerName || 'Resident',
      phone: phone || '8555069441',
      society,
      flatNumber,
      preferredDate,
      preferredSlot,
      finishTier: finishTier || 'Bespoke Finishes',
      wallDimensions,
    });
    window.open(waUrl, '_blank');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1C130B] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-[#C5A880]" />
            </div>
            <div>
              <DialogTitle>
                Book Mobile Swatch Van
              </DialogTitle>
              <DialogDescription>
                Tactile samples delivered to your gated society entrance.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Form Body */}
        {step === 1 ? (
          <div className="space-y-4">
            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#8A5836] block mb-1 font-['Plus_Jakarta_Sans']">Your Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    placeholder="e.g. Anand Rao"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#C5A880] font-['Plus_Jakarta_Sans']"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#8A5836] block mb-1 font-['Plus_Jakarta_Sans']">WhatsApp Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#C5A880] font-['Plus_Jakarta_Sans']"
                  />
                </div>
              </div>
            </div>

            {/* Society & Flat */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#8A5836] block mb-1 font-['Plus_Jakarta_Sans']">Gated Community</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <select
                    value={society}
                    onChange={(e) => setSociety(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#C5A880] cursor-pointer font-['Plus_Jakarta_Sans']"
                  >
                    {Object.values(WEST_HYDERABAD_SOCIETIES).map((s) => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                    <option value="Other Society">Other Society (Kokapet/Tellapur)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#8A5836] block mb-1 font-['Plus_Jakarta_Sans']">Tower & Flat No.</label>
                <input
                  type="text"
                  placeholder="e.g. Tower 3, Flat 1204"
                  value={flatNumber}
                  onChange={(e) => setFlatNumber(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#C5A880] font-['Plus_Jakarta_Sans']"
                />
              </div>
            </div>

            {/* Date & Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#8A5836] block mb-1 font-['Plus_Jakarta_Sans']">Preferred Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#C5A880] cursor-pointer font-['Plus_Jakarta_Sans']"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#8A5836] block mb-1 font-['Plus_Jakarta_Sans']">Time Window</label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <select
                    value={preferredSlot}
                    onChange={(e) => setPreferredSlot(e.target.value as any)}
                    className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#C5A880] cursor-pointer font-['Plus_Jakarta_Sans']"
                  >
                    <option value="Morning (10:00 AM – 1:00 PM)">Morning (10:00 AM – 1:00 PM)</option>
                    <option value="Afternoon (2:00 PM – 5:00 PM)">Afternoon (2:00 PM – 5:00 PM)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-[#1C130B] hover:bg-[#2A1E12] text-[#C5A880] font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg text-sm cursor-pointer font-['Plus_Jakarta_Sans']"
              >
                <span>Continue to Gate Pass & Confirmation →</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#C5A880]/30 space-y-2 font-['Plus_Jakarta_Sans']">
              <div className="flex items-center gap-2 text-[#15803D] font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                Van Reserved: TS 09 UB 1234
              </div>
              <p className="text-xs text-gray-700">
                <strong>{society} ({flatNumber || 'Flat Confirmed'})</strong> on <strong>{preferredDate}</strong> ({preferredSlot})
              </p>
              <p className="text-xs text-gray-500">
                Lead Specialist: Ramesh Kumar • Direct Phone: +91 85550 69441
              </p>
            </div>

            {/* MyGate Copyable Box */}
            <div>
              <div className="flex justify-between items-center mb-1.5 font-['Plus_Jakarta_Sans']">
                <span className="text-xs font-bold text-[#8A5836] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                  1-Tap MyGate / NoBrokerHood Entry Text:
                </span>
                <button
                  type="button"
                  onClick={handleCopyPass}
                  className="text-xs font-bold text-[#C5A880] bg-[#1C130B] px-2.5 py-1 rounded-lg flex items-center gap-1 hover:bg-[#2A1E12] transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                </button>
              </div>
              <textarea
                readOnly
                rows={4}
                value={myGateText}
                className="w-full bg-[#FAF8F5] text-xs text-gray-800 p-3 rounded-xl border border-gray-200 font-mono resize-none focus:outline-none"
              />
              <span className="text-[10px] text-gray-500 block mt-1 font-['Plus_Jakarta_Sans']">
                Copy and paste into your society app under Visitor / Service Entry for seamless gate entry.
              </span>
            </div>

            {/* Final WhatsApp Action */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleConfirmAndOpenWhatsApp}
                className="w-full bg-[#15803D] hover:bg-[#126e34] text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl text-sm cursor-pointer font-['Plus_Jakarta_Sans']"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Confirm Dispatch via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-xs text-gray-500 hover:text-gray-800 py-1 transition-colors text-center block cursor-pointer font-['Plus_Jakarta_Sans']"
              >
                ← Edit booking details
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
