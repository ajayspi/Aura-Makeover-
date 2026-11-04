"use client";

import React, { useState } from 'react';
import { ShieldCheck, FileText, AlertCircle, Printer, Download, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

const coveredItems = [
  'Wallpaper seam separation or peeling',
  'Adhesive failure within coverage period',
  'Colour fading due to material defect',
  'Fluted louver warping or delamination',
  'Smart blind motor or rail malfunction',
];

const materialsInstalled = [
  { sku: 'WP-FLORAL-01', name: 'Midnight Botanical Wallpaper', area: 'Living Room — Feature Wall', sqft: '120 sq.ft', batch: 'DL-A409' },
  { sku: 'LV-ACOUSTIC-OAK', name: 'Fluted Oak Panel', area: 'Master Bedroom — TV Unit', sqft: '48 sq.ft', batch: 'N/A' },
  { sku: 'BL-SMART-01', name: 'Somfy Motorized Roller', area: 'Living Room — Balcony Window', sqft: '2 units', batch: 'N/A' },
];

export default function WarrantyPage() {
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-['Syne'] text-[#1C130B] mb-2">Warranty Vault</h1>
          <p className="text-gray-500 text-sm">Your 2-year comprehensive warranty details, dye-lot registry and certificate.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowCertificateModal(true)}
            className="flex items-center gap-2 bg-[#1C130B] hover:bg-[#8A5836] text-[#FAF8F5] px-4 py-2.5 rounded-xl font-bold font-['Plus_Jakarta_Sans'] text-xs transition-colors shadow-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#C5A880]" />
            View Official Certificate
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-[#1C130B] border border-gray-200 px-4 py-2.5 rounded-xl font-bold font-['Plus_Jakarta_Sans'] text-xs transition-colors shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4 text-gray-600" />
            Print Registry
          </button>
        </div>
      </div>

      {/* Warranty Status Card */}
      <div className="bg-gradient-to-br from-[#1C130B] to-[#3E2C1E] rounded-3xl p-8 text-[#FAF8F5] mb-8 relative overflow-hidden shadow-xl border border-[#C5A880]/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A880]/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-8 h-8 text-[#C5A880]" />
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/30 flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                ACTIVE · 2-YEAR FULL WARRANTY
              </span>
            </div>
            <h2 className="font-['Syne'] text-2xl font-bold mb-1">AuroMakeover Warranty</h2>
            <p className="text-white/60 text-sm font-['Plus_Jakarta_Sans']">2-Year Comprehensive Performance & Seam Guarantee</p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-[#C5A880] text-xs font-bold uppercase tracking-wider mb-1 font-['Plus_Jakarta_Sans']">Certificate No</p>
              <p className="font-mono font-bold">AM-WRN-2026-HYD-1021</p>
            </div>
            <div>
              <p className="text-[#C5A880] text-xs font-bold uppercase tracking-wider mb-1 font-['Plus_Jakarta_Sans']">Property</p>
              <p className="font-bold">My Home Bhooja, T3-1204</p>
            </div>
            <div>
              <p className="text-[#C5A880] text-xs font-bold uppercase tracking-wider mb-1 font-['Plus_Jakarta_Sans']">Issued Date</p>
              <p className="font-bold text-white/80">March 15, 2026</p>
            </div>
            <div>
              <p className="text-[#C5A880] text-xs font-bold uppercase tracking-wider mb-1 font-['Plus_Jakarta_Sans']">Expiry Date</p>
              <p className="font-bold text-emerald-400">March 15, 2028</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coverage Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* What's Covered */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-[#1C130B] mb-4 flex items-center gap-2 font-['Syne']">
              <FileText className="w-4 h-4 text-[#C5A880]" />
              What&apos;s Covered
            </h3>
            <ul className="space-y-3">
              {coveredItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700 font-['Plus_Jakarta_Sans']">
                  <ShieldCheck className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Materials Registry */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-[#1C130B] font-['Syne']">Installed Materials Registry</h3>
              <p className="text-xs text-gray-400 mt-1 font-['Plus_Jakarta_Sans']">
                These exact SKUs and dye-lot batches are cryptographically sealed and archived for color-matched future repairs.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-['Plus_Jakarta_Sans']">
                <thead>
                  <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 font-bold border-b border-gray-100">
                    <th className="p-4 pl-6">Material</th>
                    <th className="p-4">Installed Area</th>
                    <th className="p-4">Coverage</th>
                    <th className="p-4 pr-6">Dye-Lot Batch</th>
                  </tr>
                </thead>
                <tbody>
                  {materialsInstalled.map((mat, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="p-4 pl-6">
                        <p className="font-bold text-sm text-[#1C130B]">{mat.name}</p>
                        <p className="text-xs text-gray-400 font-mono">{mat.sku}</p>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{mat.area}</td>
                      <td className="p-4 text-sm font-bold text-gray-700">{mat.sqft}</td>
                      <td className="p-4 pr-6">
                        <span className={`text-xs font-mono font-bold px-2 py-1 rounded ${mat.batch !== 'N/A' ? 'bg-[#FAF8F5] text-[#8A5836] border border-[#C5A880]/20' : 'text-gray-400'}`}>
                          {mat.batch}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* File Claim Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-[#1C130B] mb-4 flex items-center gap-2 font-['Syne']">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              File a Warranty Claim
            </h3>
            <p className="text-sm text-gray-500 mb-5 font-['Plus_Jakarta_Sans'] leading-relaxed">
              If you notice any seam separation or material defect, our QA team dispatches an inspection van within 48 hours.
            </p>
            <a
              href="https://wa.me/918555069441?text=Hi%20AuroMakeover%2C%20I%20would%20like%20to%20file%20a%20warranty%20inquiry%20for%20Certificate%20AM-WRN-2026-HYD-1021%20at%20My%20Home%20Bhooja."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-[#1C130B] hover:bg-[#8A5836] text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              Start Claim via WhatsApp
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-[#1C130B] mb-3 font-['Syne']">Laser QA Verification</h3>
            <div className="space-y-2 text-xs text-gray-600 font-['Plus_Jakarta_Sans']">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span>Inspector ID:</span>
                <span className="font-mono font-bold text-[#1C130B]">QA-HYD-04 (Ravi K.)</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span>Seam Tolerance:</span>
                <span className="font-bold text-emerald-600">&lt; 0.2 mm (Passed)</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span>Wall Moisture Pin:</span>
                <span className="font-bold text-[#1C130B]">11.4% (Optimal)</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>Adhesive:</span>
                <span className="font-bold text-[#1C130B]">Henkel Non-VOC</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] border-4 border-[#C5A880] rounded-3xl max-w-2xl w-full p-8 md:p-10 relative shadow-2xl text-[#1C130B]">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1C130B] text-white flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-[#8A5836]"
            >
              ✕
            </button>

            {/* Certificate Content */}
            <div className="text-center border-2 border-[#C5A880]/40 p-6 md:p-8 rounded-2xl bg-white relative">
              <div className="text-[#8A5836] font-bold text-xs uppercase tracking-[0.25em] mb-2 font-['Plus_Jakarta_Sans']">
                Official Authenticity & Guarantee
              </div>
              <h2 className="text-2xl md:text-3xl font-black font-['Syne'] text-[#1C130B] mb-1">
                Certificate of 2-Year Warranty
              </h2>
              <p className="text-xs text-gray-500 font-mono mb-6">
                Certificate ID: AM-WRN-2026-HYD-1021
              </p>

              <div className="text-xs text-[#1C130B]/80 font-['Plus_Jakarta_Sans'] leading-relaxed max-w-lg mx-auto mb-6">
                This document certifies that the bespoke architectural wall coverings, acoustic louvers, and window furnishings installed at <strong className="text-[#1C130B]">My Home Bhooja, Tower 3, Flat 1204</strong> meet AuroMakeover&apos;s 0.2mm laser-aligned precision standard and are guaranteed against seam peeling, bubbling, and adhesive breakdown until <strong className="text-[#8A5836]">March 15, 2028</strong>.
              </div>

              <div className="grid grid-cols-2 gap-4 text-left bg-[#FAF8F5] p-4 rounded-xl border border-[#C5A880]/30 text-xs mb-6">
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase font-bold">Client</span>
                  <span className="font-bold text-[#1C130B]">Arjun Reddy</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase font-bold">Certified Lead Artisan</span>
                  <span className="font-bold text-[#1C130B]">Ravi Kumar (#RK-908)</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase font-bold">Adhesive Lot</span>
                  <span className="font-bold text-[#1C130B]">Henkel Metylan V-44</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase font-bold">Seam Tolerance</span>
                  <span className="font-bold text-emerald-700">0.18 mm (Laser Verified)</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#C5A880]/30">
                <div className="text-left">
                  <div className="font-serif italic text-base text-[#8A5836]">AuroMakeover QA Guild</div>
                  <div className="text-[10px] text-gray-400">Digital Seal & Cryptographic Hash</div>
                </div>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="bg-[#1C130B] hover:bg-[#8A5836] text-[#C5A880] px-4 py-2 rounded-xl text-xs font-bold font-['Plus_Jakarta_Sans'] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Print / Save PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
