"use client";

import React from 'react';
import { CheckCircle2, Circle, Clock, Phone, MapPin, User } from 'lucide-react';
import Image from 'next/image';

const PROJECT_STAGES = [
  { label: 'Booking Confirmed', status: 'done', date: 'Sep 28, 2026' },
  { label: 'Material Ordered', status: 'done', date: 'Sep 29, 2026' },
  { label: 'Installation Day', status: 'current', date: 'Oct 2, 2026' },
  { label: 'QA Inspection', status: 'pending', date: 'Pending' },
  { label: 'Warranty Activated', status: 'pending', date: 'Pending' },
];

export default function CustomerDashboard() {
  return (
    <div>
      {/* Welcome Banner */}
      <div className="bg-[#1C130B] rounded-3xl p-8 md:p-10 text-[#FAF8F5] mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#C5A880]/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10">
          <p className="text-[#C5A880] text-sm font-bold tracking-wider uppercase mb-2">Welcome back</p>
          <h1 className="font-['Syne'] text-3xl md:text-4xl font-bold mb-2">Arjun Reddy</h1>
          <p className="text-white/60 text-sm">My Home Bhooja · Tower 3, Unit 1204 · 3BHK Standard</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project Tracker — Main Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <h2 className="font-['Syne'] text-xl font-bold text-[#1C130B] mb-6">Your Project Status</h2>
            
            {/* Visual Progress Bar */}
            <div className="relative mb-8">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
              <div className="space-y-0">
                {PROJECT_STAGES.map((stage, i) => (
                  <div key={i} className="relative flex items-start gap-4 pb-8 last:pb-0">
                    {/* Dot */}
                    <div className="relative z-10">
                      {stage.status === 'done' ? (
                        <CheckCircle2 className="w-8 h-8 text-green-500 bg-white rounded-full" />
                      ) : stage.status === 'current' ? (
                        <div className="w-8 h-8 rounded-full bg-[#C5A880] flex items-center justify-center shadow-lg shadow-[#C5A880]/30">
                          <Clock className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <Circle className="w-8 h-8 text-gray-300 bg-white rounded-full" />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className={`flex-1 ${stage.status === 'pending' ? 'opacity-40' : ''}`}>
                      <div className="flex items-center justify-between">
                        <h3 className={`font-bold ${stage.status === 'current' ? 'text-[#8A5836]' : 'text-[#1C130B]'}`}>
                          {stage.label}
                        </h3>
                        <span className="text-xs text-gray-400 font-mono">{stage.date}</span>
                      </div>
                      {stage.status === 'current' && (
                        <p className="text-sm text-[#8A5836] mt-1 font-medium">
                          Technician Ravi K. is en route with Van TS-09-AB-4455. Estimated arrival: 9:00 AM.
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Escrow Summary */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Payment Progress</h3>
              <div className="flex gap-4">
                {[
                  { label: '10% Deposit', amount: '₹5,500', status: 'PAID' },
                  { label: '60% Material', amount: '₹33,000', status: 'PAID' },
                  { label: '30% QA Final', amount: '₹16,500', status: 'PENDING' },
                ].map((tranche, i) => (
                  <div key={i} className={`flex-1 p-4 rounded-xl border ${tranche.status === 'PAID' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <p className="text-xs font-bold text-gray-500 uppercase">{tranche.label}</p>
                    <p className="text-lg font-bold mt-1">{tranche.amount}</p>
                    <span className={`text-xs font-bold mt-2 inline-block px-2 py-0.5 rounded-full ${tranche.status === 'PAID' ? 'bg-green-200 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {tranche.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Assigned Technician */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Your Technician</h3>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#1C130B] text-white flex items-center justify-center font-bold text-lg">
                RK
              </div>
              <div>
                <p className="font-bold text-[#1C130B]">Ravi Kumar</p>
                <p className="text-sm text-gray-500">5 years experience · 98% rating</p>
              </div>
            </div>
            <a
              href="tel:+919876543210"
              className="mt-4 w-full flex items-center justify-center gap-2 bg-[#1C130B] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#8A5836] transition-colors"
            >
              <Phone className="w-4 h-4" /> Call Technician
            </a>
          </div>

          {/* Warranty Card */}
          <div className="bg-gradient-to-br from-[#1C130B] to-[#3E2C1E] rounded-2xl p-6 text-[#FAF8F5] relative overflow-hidden">
            <div className="absolute top-2 right-2 w-16 h-16 bg-[#C5A880]/10 rounded-full blur-xl pointer-events-none" />
            <p className="text-[#C5A880] text-xs font-bold uppercase tracking-widest mb-3">2-Year Warranty</p>
            <p className="font-['Syne'] text-lg font-bold mb-1">Pending Activation</p>
            <p className="text-xs text-white/50">Will activate after QA sign-off.</p>
            <div className="mt-4 border-t border-white/10 pt-3">
              <p className="text-[10px] text-white/30 uppercase tracking-wider">Coverage</p>
              <p className="text-xs text-white/70 mt-1">Wallpaper seams, adhesive failure, colour fade, louver warping.</p>
            </div>
          </div>

          {/* WhatsApp Support */}
          <a
            href="https://wa.me/919700675637?text=Hi%2C%20I%20need%20help%20with%20my%20AuroMakeover%20project"
            target="_blank"
            className="block bg-[#15803D] text-white p-4 rounded-2xl text-center font-bold text-sm hover:bg-green-700 transition-colors"
          >
            💬 WhatsApp Support
          </a>
        </div>
      </div>
    </div>
  );
}
