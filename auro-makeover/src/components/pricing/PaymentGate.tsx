"use client";

import React, { useState } from 'react';
import { calculateIndiaPricing } from '@/lib/pricing';
import { CreditCard, Wallet, Smartphone, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function PaymentGate({ baseAmount, regionTier = 'tier1' }: { baseAmount: number, regionTier?: 'tier1'|'tier2'|'tier3' }) {
  const [method, setMethod] = useState<'upi'|'emi'|'bnpl'|'cards'>('upi');

  const pricing = calculateIndiaPricing({
    baseAmount,
    materialType: 'premium',
    regionTier
  });

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 font-['Plus_Jakarta_Sans']">

      {/* Price Summary */}
      <div className="mb-6 pb-6 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Checkout Summary</h3>
        <div className="flex justify-between items-end mb-4">
          <span className="text-4xl font-black font-['Syne'] text-[#1C130B]">
            ₹{Math.round(pricing.totalAmount).toLocaleString()}
          </span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Base (Adjusted)</span>
            <span>₹{Math.round(pricing.adjustedAmount).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>GST (18% Service + Mat)</span>
            <span>+ ₹{Math.round(pricing.gst.totalGst).toLocaleString()}</span>
          </div>

          <div className="mt-4 p-4 bg-[#8A5836]/5 rounded-xl border border-[#8A5836]/20">
            <h4 className="font-bold text-[#8A5836] mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Secure Escrow Tranches
            </h4>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span>Pay Now (10% Deposit)</span>
              <span className="font-bold text-[#1C130B]">₹{Math.round(pricing.escrow.deposit).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Material Prep (60%)</span>
              <span>₹{Math.round(pricing.escrow.materialRelease).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Post-QA Release (30%)</span>
              <span>₹{Math.round(pricing.escrow.postQaUnlock).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Indian Payment Hierarchy */}
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Select Payment Method</h3>

      <div className="space-y-3">
        {/* UPI */}
        <button
          onClick={() => setMethod('upi')}
          className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${method === 'upi' ? 'border-[#15803D] bg-[#15803D]/5' : 'border-gray-100 hover:border-gray-200'}`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${method === 'upi' ? 'bg-[#15803D] text-white' : 'bg-gray-100 text-gray-500'}`}>
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-bold text-[#1C130B]">UPI Autopay</div>
              <div className="text-xs text-green-600 font-medium">Zero Fees • Instant</div>
            </div>
          </div>
          {method === 'upi' && <CheckCircle2 className="text-[#15803D] w-5 h-5" />}
        </button>

        {/* EMI */}
        <button
          onClick={() => setMethod('emi')}
          className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${method === 'emi' ? 'border-[#8A5836] bg-[#8A5836]/5' : 'border-gray-100 hover:border-gray-200'}`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${method === 'emi' ? 'bg-[#8A5836] text-white' : 'bg-gray-100 text-gray-500'}`}>
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-bold text-[#1C130B]">EMI (0% Interest)</div>
              <div className="text-xs text-[#8A5836] font-medium">From ₹{Math.round(pricing.emiOptions.months12).toLocaleString()}/mo</div>
            </div>
          </div>
          {method === 'emi' && <CheckCircle2 className="text-[#8A5836] w-5 h-5" />}
        </button>

        {/* BNPL */}
        <button
          onClick={() => setMethod('bnpl')}
          className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${method === 'bnpl' ? 'border-purple-600 bg-purple-50' : 'border-gray-100 hover:border-gray-200'}`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${method === 'bnpl' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
              <Wallet className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-bold text-[#1C130B]">Buy Now Pay Later</div>
              <div className="text-xs text-gray-500">Flipkart Pay Later, ZestMoney</div>
            </div>
          </div>
          {method === 'bnpl' && <CheckCircle2 className="text-purple-600 w-5 h-5" />}
        </button>
      </div>

      <button className="w-full mt-6 bg-[#1C130B] hover:bg-black text-white p-4 rounded-xl font-bold transition-transform active:scale-95 shadow-lg flex items-center justify-center gap-2">
        <ShieldCheck className="w-5 h-5" />
        Pay ₹{Math.round(pricing.escrow.deposit).toLocaleString()} via {method.toUpperCase()}
      </button>

    </div>
  );
}
