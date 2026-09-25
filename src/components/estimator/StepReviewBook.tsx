"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ShieldCheck, Clock, MessageCircle, User, Phone, MapPin, Building } from 'lucide-react';
import AnimatedPrice from './AnimatedPrice';
import { isValidLeadName, isValidLeadPhone } from '@/lib/lead-details';
import { getDefaultCity } from '@/lib/cities';

export default function StepReviewBook({
  pricingDetails,
  widthFt,
  heightFt,
  finishTier,
  onBack,
}: {
  pricingDetails: any;
  widthFt: number;
  heightFt: number;
  finishTier: string;
  onBack: () => void;
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [society, setSociety] = useState('');
  const [address, setAddress] = useState('');

  const cityData = getDefaultCity();

  const getTierName = (tier: string) => {
    if (tier === 'base') return 'Standard Wallpaper';
    if (tier === 'premium') return 'Acoustic Louvers';
    return 'Smart Blinds + Paneling';
  };

  const isFormValid = isValidLeadName(name) && isValidLeadPhone(phone) && society.trim() !== '' && address.trim() !== '';

  const handleWhatsApp = async () => {
    if (!isFormValid) return;

    try {
      // R-C13 / R11.4: Gateway must POST booking intent before WhatsApp open
      await fetch('/api/leads/estimator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          phone: phone,
          society,
          widthFt,
          heightFt,
          finishTier,
          estimatedTotal: pricingDetails.totalRetailPrice,
        }),
      });
    } catch (e) {
      console.error(e);
    }

    const text = `Hi AuroMakeover team! I'd like to book the mobile swatch van.
    
*Customer Details:*
Name: ${name}
Phone: ${phone}
Society: ${society}
Address/Flat No: ${address}

*My Space:* ${widthFt}ft x ${heightFt}ft Wall
*Selected Tier:* ${getTierName(finishTier)}
*Estimated Total:* ₹${pricingDetails.totalRetailPrice.toLocaleString('en-IN')}`;

    window.open(`https://wa.me/919700675637?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <motion.div
      key="step-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 sm:space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
        {/* Left: Summary Breakdown & Contact Form */}
        <div className="space-y-6 sm:space-y-8">
          <div>
            <h4 className="text-2xl sm:text-3xl font-black font-['Syne'] text-[#1C130B] mb-2">
              Finalize Details
            </h4>
            <p className="text-xs sm:text-sm text-[#1C130B]/70 font-['Plus_Jakarta_Sans'] leading-relaxed">
              Transparent pricing, zero hidden fees. Provide your details below to book the swatch van.
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#C5A880]/30 shadow-sm space-y-4">
            <h5 className="font-['Syne'] text-lg font-bold text-[#1C130B] mb-2 border-b border-[#C5A880]/20 pb-2">Pricing Breakdown</h5>
            <div className="flex justify-between items-center pb-2">
              <span className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#1C130B]/70 font-bold uppercase tracking-wider">Dimensions</span>
              <span className="font-['Syne'] text-sm sm:text-base font-bold text-[#1C130B]">{widthFt}ft x {heightFt}ft</span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#1C130B]/70 font-bold uppercase tracking-wider">Material Grade</span>
              <span className="font-['Syne'] text-sm sm:text-base font-bold text-[#1C130B]">{getTierName(finishTier)}</span>
            </div>
            
            <div className="flex justify-between items-end pt-4 border-t border-[#C5A880]/20">
              <span className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#8A5836] font-bold uppercase tracking-widest">Total Investment</span>
              <AnimatedPrice 
                value={pricingDetails.totalRetailPrice} 
                className="font-['Syne'] text-3xl sm:text-4xl font-black text-[#1C130B]"
              />
            </div>
          </div>

          {/* Contact Details Form */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#C5A880]/30 shadow-sm space-y-4">
            <h5 className="font-['Syne'] text-lg font-bold text-[#1C130B] mb-2 border-b border-[#C5A880]/20 pb-2">Your Contact Details</h5>
            
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A880]" />
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FAF8F5] border-none rounded-xl py-3 pl-10 pr-4 font-['Plus_Jakarta_Sans'] text-sm focus:ring-2 focus:ring-[#C5A880]"
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A880]" />
                <input
                  type="tel"
                  placeholder="Phone Number (10 digits)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#FAF8F5] border-none rounded-xl py-3 pl-10 pr-4 font-['Plus_Jakarta_Sans'] text-sm focus:ring-2 focus:ring-[#C5A880]"
                />
              </div>

              <div className="relative">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A880]" />
                <select
                  value={society}
                  onChange={(e) => setSociety(e.target.value)}
                  className="w-full bg-[#FAF8F5] border-none rounded-xl py-3 pl-10 pr-4 font-['Plus_Jakarta_Sans'] text-sm focus:ring-2 focus:ring-[#C5A880] appearance-none"
                >
                  <option value="" disabled>Select your Society</option>
                  {cityData.societies.map((s) => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                  <option value="Other">Other / Not Listed</option>
                </select>
              </div>

              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A880]" />
                <input
                  type="text"
                  placeholder="Flat No / Exact Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#FAF8F5] border-none rounded-xl py-3 pl-10 pr-4 font-['Plus_Jakarta_Sans'] text-sm focus:ring-2 focus:ring-[#C5A880]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Tranches & CTA */}
        <div className="space-y-6 sm:space-y-8 flex flex-col justify-center">
          <div className="bg-[#1C130B] p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl text-[#FAF8F5]">
            <h5 className="font-['Syne'] text-lg sm:text-xl font-bold mb-6 text-[#C5A880]">Escrow Payment Tranches</h5>
            
            <div className="space-y-5 sm:space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#FAF8F5]/10 flex items-center justify-center font-bold font-['Plus_Jakarta_Sans'] shrink-0 text-sm">
                  1
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1">
                    <span className="font-bold text-sm sm:text-base font-['Syne']">10% Advance</span>
                    <span className="font-bold text-sm sm:text-base text-[#C5A880] font-['Syne']">₹{Math.round(pricingDetails.escrowTranches.deposit10).toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-xs text-[#FAF8F5]/60 font-['Plus_Jakarta_Sans']">To book the design consultation and swatch van visit.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#FAF8F5]/10 flex items-center justify-center font-bold font-['Plus_Jakarta_Sans'] shrink-0 text-sm">
                  2
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1">
                    <span className="font-bold text-sm sm:text-base font-['Syne']">60% Material</span>
                    <span className="font-bold text-sm sm:text-base text-[#C5A880] font-['Syne']">₹{Math.round(pricingDetails.escrowTranches.materialRelease60).toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-xs text-[#FAF8F5]/60 font-['Plus_Jakarta_Sans']">Released when materials arrive securely at your society gate.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#C5A880] text-[#1C130B] flex items-center justify-center font-bold font-['Plus_Jakarta_Sans'] shrink-0 text-sm">
                  3
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1">
                    <span className="font-bold text-sm sm:text-base font-['Syne']">30% Handover</span>
                    <span className="font-bold text-sm sm:text-base text-[#C5A880] font-['Syne']">₹{Math.round(pricingDetails.escrowTranches.postQAUnlock30).toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-xs text-[#FAF8F5]/60 font-['Plus_Jakarta_Sans']">Released ONLY when you approve the final 48-hour handover.</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleWhatsApp}
            disabled={!isFormValid}
            className={`w-full px-6 sm:px-10 py-5 sm:py-6 rounded-2xl sm:rounded-3xl font-bold font-['Plus_Jakarta_Sans'] text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-3 transition-colors duration-300 ${
              isFormValid 
                ? 'bg-[#15803D] hover:bg-[#166534] text-white shadow-[0_10px_30px_rgba(21,128,61,0.3)]' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            {isFormValid ? 'Book via WhatsApp Now' : 'Complete Form to Book'}
          </button>
        </div>
      </div>

      {/* Footer Trust Badges */}
      <div className="pt-8 border-t border-[#C5A880]/20 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 justify-center sm:justify-start">
          <ShieldCheck className="w-5 h-5 text-[#8A5836]" />
          <span className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#1C130B]/70 uppercase tracking-widest">2-Year Warranty</span>
        </div>
        <div className="flex items-center gap-3 justify-center sm:justify-center">
          <Clock className="w-5 h-5 text-[#8A5836]" />
          <span className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#1C130B]/70 uppercase tracking-widest">48-Hr SLA</span>
        </div>
        <div className="flex items-center gap-3 justify-center sm:justify-end">
          <CheckCircle2 className="w-5 h-5 text-[#8A5836]" />
          <span className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#1C130B]/70 uppercase tracking-widest">Zero Hidden Fees</span>
        </div>
      </div>

      <div className="pt-4 flex justify-start">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl font-bold font-['Plus_Jakarta_Sans'] text-xs uppercase tracking-wider text-[#1C130B]/70 hover:text-[#1C130B] flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Edit Selection
        </button>
      </div>
    </motion.div>
  );
}
