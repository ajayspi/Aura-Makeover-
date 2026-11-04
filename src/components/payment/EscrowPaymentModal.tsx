"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  ShieldCheck, 
  QrCode, 
  Smartphone, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Lock,
  ArrowRight
} from 'lucide-react';

export interface EscrowPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tranche: 'tranche_1_deposit' | 'tranche_2_material' | 'tranche_3_qa';
  amount: number;
  projectRef: string;
  onPaymentSuccess?: () => void;
}

export default function EscrowPaymentModal({
  isOpen,
  onClose,
  tranche,
  amount,
  projectRef,
  onPaymentSuccess,
}: EscrowPaymentModalProps) {
  const [method, setMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txnId, setTxnId] = useState('TXN-ESCROW-772901');

  if (!isOpen) return null;

  const trancheTitle = 
    tranche === 'tranche_1_deposit' ? '10% Milestone 1: Fixed Price & Survey Deposit' :
    tranche === 'tranche_2_material' ? '60% Milestone 2: Material Cut & Dispatch' :
    '30% Milestone 3: Post-QA Final Handover';

  const trancheDesc =
    tranche === 'tranche_1_deposit' ? 'Held in ICICI Bank Escrow until physical laser survey sign-off.' :
    tranche === 'tranche_2_material' ? 'Released strictly after workshop rolls QA photo verification.' :
    'Unlocked only after client digital handover sign-off and 2-Year Warranty activation.';

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setTxnId(`TXN-ESCROW-${Math.floor(100000 + Math.random() * 900000)}`);
      setIsProcessing(false);
      setIsSuccess(true);
      if (onPaymentSuccess) onPaymentSuccess();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1C130B]/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#C5A880]/30 overflow-hidden font-['Plus_Jakarta_Sans']"
      >
        {/* Header */}
        <div className="bg-[#1C130B] p-6 text-[#FAF8F5] relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C5A880]/20 flex items-center justify-center text-[#C5A880]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A880] block">
                Escrow Milestone Engine
              </span>
              <h3 className="font-['Syne'] font-bold text-lg text-[#FAF8F5]">
                Secure Escrow Checkout
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#FAF8F5] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">

          {!isSuccess ? (
            <>
              {/* Tranche Breakdown */}
              <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#C5A880]/30 space-y-2">
                <span className="text-xs font-bold text-[#8A5836] uppercase tracking-wider block">
                  {trancheTitle}
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-black font-['Syne'] text-[#1C130B]">
                    ₹{amount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    Ref: {projectRef}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed pt-1">
                  {trancheDesc}
                </p>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-3">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setMethod('upi')}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      method === 'upi' ? 'border-[#8A5836] bg-amber-50/50 text-[#8A5836]' : 'border-gray-200 text-gray-500'
                    }`}
                  >
                    <Smartphone className="w-5 h-5" />
                    <span className="text-xs font-bold">UPI / GPay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('card')}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      method === 'card' ? 'border-[#8A5836] bg-amber-50/50 text-[#8A5836]' : 'border-gray-200 text-gray-500'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="text-xs font-bold">Cards</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('netbanking')}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      method === 'netbanking' ? 'border-[#8A5836] bg-amber-50/50 text-[#8A5836]' : 'border-gray-200 text-gray-500'
                    }`}
                  >
                    <QrCode className="w-5 h-5" />
                    <span className="text-xs font-bold">Scan QR</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Method Panel */}
              {method === 'upi' && (
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
                  <label className="text-xs font-bold text-gray-600 block">Virtual Payment Address (VPA / UPI ID)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      defaultValue="resident@okhdfcbank"
                      className="flex-1 p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none font-medium focus:border-[#8A5836]"
                    />
                    <span className="bg-[#15803D]/10 text-[#15803D] text-xs font-bold px-3 py-3 rounded-xl flex items-center">
                      Verified
                    </span>
                  </div>
                </div>
              )}

              {method === 'netbanking' && (
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 text-center space-y-3">
                  <div className="w-32 h-32 bg-white p-2 rounded-xl border border-gray-300 mx-auto flex items-center justify-center shadow-sm">
                    <QrCode className="w-24 h-24 text-gray-800" />
                  </div>
                  <p className="text-xs text-gray-500">Scan using any UPI App (Google Pay, PhonePe, Paytm)</p>
                </div>
              )}

              {method === 'card' && (
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                  <input
                    type="text"
                    placeholder="Card Number (•••• •••• •••• 4242)"
                    defaultValue="4532 •••• •••• 8891"
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none font-mono"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      defaultValue="12/28"
                      className="p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none font-mono"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      defaultValue="•••"
                      className="p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Escrow Guarantee Pill */}
              <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-[#15803D] shrink-0" />
                <span>Protected by 10/60/30 Escrow milestone lock. Zero upfront contractor risk.</span>
              </div>

              {/* Action Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleSimulatePayment}
                className="w-full bg-[#1C130B] hover:bg-[#3E2C1E] text-[#C5A880] py-4 rounded-2xl font-bold font-['Plus_Jakarta_Sans'] text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2 text-white">
                    <Clock className="w-4 h-4 animate-spin text-[#C5A880]" />
                    Locking Escrow Tranche in Bank Vault...
                  </span>
                ) : (
                  <>
                    <span>Pay ₹{amount.toLocaleString('en-IN')} via Escrow</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 mx-auto flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-['Syne'] font-black text-2xl text-gray-900">
                Milestone Tranche Locked!
              </h4>
              <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                ₹{amount.toLocaleString('en-IN')} successfully vaulted in Escrow. Workshop dispatched for precision roll laser cutting.
              </p>
              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#C5A880]/30 text-xs font-mono text-gray-600">
                Transaction ID: {txnId}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-[#1C130B] text-[#C5A880] py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider mt-4"
              >
                Close & Return to Dashboard
              </button>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
