"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
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

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const myGateText = AiSensyService.generateMyGatePassText({
    society,
    flatNumber: flatNumber || 'Tower A',
    date: preferredDate,
    slot: preferredSlot,
  });

  const handleCopyPass = async () => {
    try {
      await navigator.clipboard.writeText(myGateText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleConfirmAndOpenWhatsApp = () => {
    const url = AiSensyService.buildWhatsAppBookingUrl({
      customerName: customerName.trim() || 'Resident',
      phone: phone.trim() || 'Pending',
      society,
      flatNumber: flatNumber.trim() || 'Pending',
      preferredDate,
      preferredSlot,
      finishTier,
      wallDimensions,
    });
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1C130B]/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-[#C5A880]/40 overflow-hidden relative"
      >
        {/* Header */}
        <div className="bg-[#1C130B] p-6 text-[#FAF8F5] relative overflow-hidden flex items-start justify-between">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-[#C5A880] text-xs font-bold uppercase tracking-wider mb-1 font-['Plus_Jakarta_Sans']">
              <Truck className="w-4 h-4" />
              Mobile Design Studio
            </div>
            <h3 className="font-['Syne'] text-2xl font-black text-[#FAF8F5]">
              Book Swatch Van Visit
            </h3>
            <p className="text-xs text-[#FAF8F5]/70 font-['Plus_Jakarta_Sans'] mt-1">
              Touch full-scale architectural slats & wallpapers at your society gate.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#FAF8F5]/10 hover:bg-[#FAF8F5]/20 flex items-center justify-center text-[#FAF8F5] transition-colors relative z-10 cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 font-['Plus_Jakarta_Sans'] text-[#1C130B]">
          
          {step === 1 ? (
            <div className="space-y-4">
              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#8A5836] block mb-1">Your Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      placeholder="e.g. Anand Rao"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#8A5836] block mb-1">WhatsApp Phone</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>
              </div>

              {/* Society & Flat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#8A5836] block mb-1">Gated Community</label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                    <select
                      value={society}
                      onChange={(e) => setSociety(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#C5A880] cursor-pointer"
                    >
                      {Object.values(WEST_HYDERABAD_SOCIETIES).map((s) => (
                        <option key={s.name} value={s.name}>{s.name}</option>
                      ))}
                      <option value="Other Society">Other Society (Kokapet/Tellapur)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#8A5836] block mb-1">Tower & Flat No.</label>
                  <input
                    type="text"
                    placeholder="e.g. Tower 3, Flat 1204"
                    value={flatNumber}
                    onChange={(e) => setFlatNumber(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              {/* Date & Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#8A5836] block mb-1">Preferred Date</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#C5A880] cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#8A5836] block mb-1">Time Window</label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                    <select
                      value={preferredSlot}
                      onChange={(e) => setPreferredSlot(e.target.value as any)}
                      className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#C5A880] cursor-pointer"
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
                  className="w-full bg-[#1C130B] hover:bg-[#2A1E12] text-[#C5A880] font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg text-sm cursor-pointer"
                >
                  <span>Continue to Gate Pass & Confirmation →</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              
              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#C5A880]/30 space-y-2">
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
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-[#8A5836] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                    1-Tap MyGate / NoBrokerHood Entry Text:
                  </span>
                  <button
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
                <span className="text-[10px] text-gray-500 block mt-1">
                  Copy and paste into your society app under Visitor / Service Entry for seamless gate entry.
                </span>
              </div>

              {/* Final WhatsApp Action */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleConfirmAndOpenWhatsApp}
                  className="w-full bg-[#15803D] hover:bg-[#126e34] text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl text-sm cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Confirm Dispatch via WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-xs text-gray-500 hover:text-gray-800 py-1 transition-colors text-center block cursor-pointer"
                >
                  ← Edit booking details
                </button>
              </div>

            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
