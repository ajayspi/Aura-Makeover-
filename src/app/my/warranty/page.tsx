"use client";

import React from 'react';
import { ShieldCheck, Calendar, FileText, AlertCircle } from 'lucide-react';

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
  return (
    <div>
      <h1 className="text-2xl font-bold font-['Syne'] text-[#1C130B] mb-2">Warranty Vault</h1>
      <p className="text-gray-500 text-sm mb-8">Your 2-year comprehensive warranty details and claim history.</p>

      {/* Warranty Status Card */}
      <div className="bg-gradient-to-br from-[#1C130B] to-[#3E2C1E] rounded-3xl p-8 text-[#FAF8F5] mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A880]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-8 h-8 text-[#C5A880]" />
              <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full border border-amber-400/30">
                PENDING ACTIVATION
              </span>
            </div>
            <h2 className="font-['Syne'] text-2xl font-bold mb-1">AuroMakeover Warranty</h2>
            <p className="text-white/50 text-sm">2-Year Comprehensive Coverage</p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-[#C5A880] text-xs font-bold uppercase tracking-wider mb-1">Project ID</p>
              <p className="font-mono font-bold">ORD-1021</p>
            </div>
            <div>
              <p className="text-[#C5A880] text-xs font-bold uppercase tracking-wider mb-1">Property</p>
              <p className="font-bold">My Home Bhooja, T3-1204</p>
            </div>
            <div>
              <p className="text-[#C5A880] text-xs font-bold uppercase tracking-wider mb-1">Activation Date</p>
              <p className="font-bold text-white/60">Pending QA</p>
            </div>
            <div>
              <p className="text-[#C5A880] text-xs font-bold uppercase tracking-wider mb-1">Expiry Date</p>
              <p className="font-bold text-white/60">—</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coverage Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* What's Covered */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-[#1C130B] mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#C5A880]" />
              What's Covered
            </h3>
            <ul className="space-y-3">
              {coveredItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <ShieldCheck className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Materials Registry */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-[#1C130B]">Installed Materials Registry</h3>
              <p className="text-xs text-gray-400 mt-1">These exact SKUs and dye-lot batches are stored for future repairs.</p>
            </div>
            <table className="w-full text-left">
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

        {/* File Claim Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-[#1C130B] mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              File a Warranty Claim
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              If you notice any defects covered under warranty, submit a claim and our team will inspect within 48 hours.
            </p>
            <button className="w-full py-3 bg-[#1C130B] text-white rounded-xl font-bold text-sm hover:bg-[#8A5836] transition-colors">
              Start Claim Process
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-[#1C130B] mb-3">Claim History</h3>
            <p className="text-sm text-gray-400 text-center py-4">No claims filed yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
