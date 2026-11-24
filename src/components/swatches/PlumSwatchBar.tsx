"use client";

import React, { useState } from 'react';
import { Box, Check, X, ArrowRight } from 'lucide-react';
import { useSwatch, Swatch } from '@/context/SwatchContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';

export interface PlumSwatchBarProps {
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideFloatingBar?: boolean;
}

export default function PlumSwatchBar({
  className = '',
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  hideFloatingBar = false,
}: PlumSwatchBarProps) {
  const { swatches, removeSwatch } = useSwatch();
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const setIsOpen = isControlled ? (controlledOnOpenChange || (() => {})) : setInternalOpen;

  const [success, setSuccess] = useState(false);
  const [society, setSociety] = useState('My Home Bhooja');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // 3 slots
  const slots: (Swatch | null)[] = [
    swatches[0] || null,
    swatches[1] || null,
    swatches[2] || null,
  ];

  const bookingText = encodeURIComponent(
    `Hi AuroMakeover! I've selected my 3 physical swatches via the Swatch Bar:\n` +
    swatches.map((s, i) => `${i + 1}. ${s.name} (${s.category})`).join('\n') +
    `\nPlease dispatch the Swatch Van to ${society}. Name: ${fullName}, Phone: ${phone}.`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
  };

  const dialogContentMarkup = (
    <DialogContent className="max-w-lg bg-[#FAF8F5] text-[#1C130B]">
      <DialogHeader>
        <DialogTitle className="font-['Syne'] text-2xl font-bold text-[#1C130B]">
          Your Swatch Box (3 Free Samples)
        </DialogTitle>
        <DialogDescription className="text-sm text-[#1C130B]/70 font-['Plus_Jakarta_Sans']">
          Inspect your 3 tactile material swatches in 13×13 cm format. Our Swatch Van visits West Hyderabad gated societies daily.
        </DialogDescription>
      </DialogHeader>

      {success ? (
        <div className="py-8 text-center space-y-4">
          <div className="w-14 h-14 bg-green-100 text-[#15803D] rounded-full mx-auto flex items-center justify-center">
            <Check className="w-7 h-7" />
          </div>
          <h4 className="font-['Syne'] text-xl font-bold text-[#1C130B]">
            Swatch Van Visit Confirmed!
          </h4>
          <p className="text-xs text-[#1C130B]/70 font-['Plus_Jakarta_Sans'] max-w-sm mx-auto">
            Your curated swatch box will be delivered within 48 hours to {society}. Confirm your MyGate entry code on WhatsApp.
          </p>
          <a
            href={`https://wa.me/919700675637?text=${bookingText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#15803D] text-white rounded-2xl text-xs font-bold uppercase tracking-wider font-['Plus_Jakarta_Sans'] shadow"
          >
            Confirm Gate Pass on WhatsApp (919700675637)
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      ) : (
        <div className="space-y-4 pt-2">
          {/* Swatches in Box with direct deletion support */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8A5836] font-['Plus_Jakarta_Sans']">
                Selected Swatches ({swatches.length}/3):
              </span>
              {swatches.length < 3 && (
                <span className="text-[11px] text-[#1C130B]/60 font-medium">
                  {3 - swatches.length} free slot{3 - swatches.length > 1 ? 's' : ''} remaining
                </span>
              )}
            </div>
            {swatches.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-[#1C130B]/20 text-center text-xs text-[#1C130B]/60">
                No swatches selected yet. Tap &quot;Sample Finish&quot; on any material in the visualizer to add up to 3 free samples.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {swatches.map((s) => (
                  <div
                    key={s.id}
                    className="relative p-2.5 rounded-xl border border-[#1C130B]/15 bg-white text-center flex flex-col items-center justify-between shadow-sm group"
                  >
                    <button
                      type="button"
                      onClick={() => removeSwatch(s.id)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer"
                      aria-label={`Remove ${s.name} swatch`}
                      title={`Remove ${s.name}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <span
                      className="w-7 h-7 rounded-lg mb-1 border border-black/20"
                      style={{ backgroundColor: s.colorHex }}
                    />
                    <span className="text-[10px] font-bold text-[#1C130B] line-clamp-1">{s.name}</span>
                    <span className="text-[9px] text-[#8A5836] uppercase">{s.category}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#1C130B] uppercase tracking-wider mb-1 font-['Plus_Jakarta_Sans']">
                Gated Community / High-Rise (Hyderabad)
              </label>
              <select
                value={society}
                onChange={(e) => setSociety(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#1C130B]/20 bg-white text-sm font-['Plus_Jakarta_Sans'] text-[#1C130B]"
              >
                <option value="My Home Bhooja">My Home Bhooja (Kokapet)</option>
                <option value="Rajapushpa Provincia">Rajapushpa Provincia (Narsingi)</option>
                <option value="Prestige High Fields">Prestige High Fields (Financial District)</option>
                <option value="Aparna Sarovar Zenith">Aparna Sarovar Zenith (Nallagandla)</option>
                <option value="Lanco Hills">Lanco Hills (Manikonda)</option>
                <option value="Other High-Rise">Other West Hyderabad Society</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C130B] uppercase tracking-wider mb-1 font-['Plus_Jakarta_Sans']">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ananya Rao"
                className="w-full px-4 py-2.5 rounded-2xl border border-[#1C130B]/20 bg-white text-sm font-['Plus_Jakarta_Sans'] text-[#1C130B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C130B] uppercase tracking-wider mb-1 font-['Plus_Jakarta_Sans']">
                WhatsApp Mobile Number (for MyGate pass)
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full px-4 py-2.5 rounded-2xl border border-[#1C130B]/20 bg-white text-sm font-['Plus_Jakarta_Sans'] text-[#1C130B]"
              />
            </div>

            <button
              type="submit"
              disabled={swatches.length === 0}
              className={`w-full py-3.5 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md cursor-pointer font-['Plus_Jakarta_Sans'] ${
                swatches.length > 0
                  ? 'bg-[#C5A880] hover:bg-[#b0936d] text-[#1C130B]'
                  : 'bg-black/10 text-black/40 cursor-not-allowed'
              }`}
            >
              Dispatch Free Swatch Box in 48 Hours
            </button>
          </form>
        </div>
      )}
    </DialogContent>
  );

  // If floating bar is suppressed or controlled externally, render strictly the Dialog
  if (hideFloatingBar || isControlled) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {dialogContentMarkup}
      </Dialog>
    );
  }

  return (
    <>
      <aside
        aria-label="Plum Floating Swatch Tray"
        className={`fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl bg-[#1C130B]/95 text-[#FAF8F5] border-2 border-[#C5A880]/50 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] rounded-3xl p-3 sm:px-6 sm:py-3.5 transition-all duration-300 font-['Plus_Jakarta_Sans'] ${className}`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
          {/* Left: 3 Swatch Slots */}
          <div className="flex items-center gap-2.5">
            {slots.map((item, idx) => (
              <div
                key={idx}
                className="relative group w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border-2 flex items-center justify-center transition-all overflow-hidden shrink-0"
                style={{
                  borderColor: item ? '#C5A880' : 'rgba(197, 168, 128, 0.25)',
                  borderStyle: item ? 'solid' : 'dashed',
                  backgroundColor: item ? item.colorHex : 'rgba(255, 255, 255, 0.04)',
                }}
                title={item ? item.name : `Empty Slot ${idx + 1}`}
              >
                {item ? (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSwatch(item.id);
                      }}
                      className="absolute inset-0 bg-black/75 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                      title="Remove swatch"
                    >
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                    <span className="sr-only">{item.name}</span>
                  </>
                ) : (
                  <span className="text-[10px] font-bold text-[#C5A880]/50 font-['Syne']">
                    {idx + 1}
                  </span>
                )}
              </div>
            ))}

            {/* Counter Text */}
            <div className="pl-1 text-left hidden sm:block">
              <div className="text-xs font-bold text-white font-['Syne'] flex items-center gap-1.5">
                <span>{swatches.length}/3 Free Swatches</span>
                <span className="text-[10px] bg-[#C5A880] text-[#1C130B] font-extrabold px-1.5 py-0.5 rounded-full uppercase">
                  Free
                </span>
              </div>
              <p className="text-[11px] text-[#FAF8F5]/70">
                Delivered in 48 hours by Swatch Van
              </p>
            </div>
          </div>

          {/* Right: Validation CTA */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#C5A880] hover:bg-[#b0936d] text-[#1C130B] font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer font-['Plus_Jakarta_Sans']"
                >
                  <Box className="w-4 h-4" />
                  <span>Order Sample Box ({swatches.length}/3)</span>
                </button>
              </DialogTrigger>
              {dialogContentMarkup}
            </Dialog>
          </div>
        </div>
      </aside>
    </>
  );
}
