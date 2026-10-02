"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Phone, Mail, MapPin, ShieldCheck, Clock, MessageSquare, CreditCard, Star, Tag, ExternalLink } from 'lucide-react';

// Mock 360° profile (in production: fetched from /api/v1/customers/:id)
const customer = {
  id: 'cust-001',
  name: 'Arjun Reddy',
  phone: '+91 98765 43210',
  email: 'arjun@gmail.com',
  avatarInitials: 'AR',
  lifecycleStage: 'INSTALLING',
  lifetimeValue: 120000,
  projectCount: 2,
  npsScore: 9,
  referralCode: 'AURO-AR7K',
  firstTouchAt: '2026-08-15',
  externalCrmId: 'hubspot_deal_444',
  score: { engagement: 85, intent: 90, value: 75, composite: 84, tier: 'S' },
  tags: ['VIP', 'REPEAT', 'HIGH_VALUE'],
  address: { society: 'My Home Bhooja', tower: 'T3', unit: '1204', city: 'Hyderabad', pincode: '500032' },
};

const timeline = [
  { type: 'STAGE_CHANGE', channel: 'SYSTEM', summary: 'Lifecycle: INSTALL_SCHEDULED → INSTALLING', actor: 'System', time: '2 hours ago' },
  { type: 'PAYMENT', channel: 'WEB', summary: '60% Material Escrow — ₹33,000 received via NEFT', actor: 'Razorpay', time: 'Yesterday' },
  { type: 'WHATSAPP', channel: 'PHONE', summary: 'Agent sent swatch catalog PDF. Customer replied: "Love the oak panels!"', actor: 'Deepak S.', time: '3 days ago' },
  { type: 'NOTE', channel: 'WEB', summary: 'Customer prefers Syne-style fonts on accent walls. Wants minimal gold, more earth tones.', actor: 'Deepak S.', time: '4 days ago' },
  { type: 'STAGE_CHANGE', channel: 'SYSTEM', summary: 'Lifecycle: DEAL_WON → MATERIAL_ORDERED', actor: 'System', time: '5 days ago' },
  { type: 'PAYMENT', channel: 'WEB', summary: '10% Booking Deposit — ₹5,500 received via UPI', actor: 'Razorpay', time: '1 week ago' },
  { type: 'CALL', channel: 'PHONE', summary: 'Initial callback. Customer interested in 3BHK package. Budget ~₹1L.', actor: 'Deepak S.', time: '2 weeks ago' },
  { type: 'SYSTEM', channel: 'WEB', summary: 'Lead captured via AI Style Quiz. Score: 84 (S-Tier).', actor: 'System', time: '2 weeks ago' },
];

const EVENT_ICONS: Record<string, React.ReactNode> = {
  STAGE_CHANGE: <Clock className="w-4 h-4 text-purple-500" />,
  PAYMENT: <CreditCard className="w-4 h-4 text-green-500" />,
  WHATSAPP: <MessageSquare className="w-4 h-4 text-green-600" />,
  NOTE: <Tag className="w-4 h-4 text-amber-500" />,
  CALL: <Phone className="w-4 h-4 text-blue-500" />,
  SYSTEM: <ShieldCheck className="w-4 h-4 text-gray-400" />,
};

export default function CustomerProfilePage() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Back Link */}
      <Link href="/ops/customers" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1C130B] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Customers
      </Link>

      {/* Profile Header */}
      <div className="bg-[#1C130B] rounded-3xl p-8 text-[#FAF8F5] mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A880]/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#C5A880] text-[#1C130B] flex items-center justify-center font-bold text-2xl font-['Syne']">
              {customer.avatarInitials}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-['Syne'] text-3xl font-bold">{customer.name}</h1>
                <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-0.5 rounded-full border border-red-400/30">
                  S-TIER
                </span>
                <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-2 py-0.5 rounded-full">
                  {customer.lifecycleStage.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-white/60">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {customer.phone}</span>
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {customer.email}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {customer.address.society}, {customer.address.tower}-{customer.address.unit}</span>
              </div>
              <div className="flex gap-2 mt-3">
                {customer.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-bold bg-white/10 text-[#C5A880] px-2 py-0.5 rounded-full border border-[#C5A880]/30">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-[#C5A880] text-xs font-bold uppercase tracking-wider mb-1">LTV</p>
              <p className="text-xl font-bold">₹{(customer.lifetimeValue / 1000).toFixed(0)}K</p>
            </div>
            <div>
              <p className="text-[#C5A880] text-xs font-bold uppercase tracking-wider mb-1">Projects</p>
              <p className="text-xl font-bold">{customer.projectCount}</p>
            </div>
            <div>
              <p className="text-[#C5A880] text-xs font-bold uppercase tracking-wider mb-1">NPS</p>
              <p className="text-xl font-bold flex items-center justify-center gap-1">{customer.npsScore} <Star className="w-4 h-4 text-amber-400" /></p>
            </div>
            <div>
              <p className="text-[#C5A880] text-xs font-bold uppercase tracking-wider mb-1">Score</p>
              <p className="text-xl font-bold">{customer.score.composite}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Timeline */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-[#1C130B]">Activity Timeline</h2>
              <select className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 font-bold text-gray-600">
                <option>All Events</option>
                <option>Payments</option>
                <option>Communications</option>
                <option>Stage Changes</option>
              </select>
            </div>

            <div className="space-y-0">
              {timeline.map((event, i) => (
                <div key={i} className="flex gap-4 pb-6 last:pb-0 relative">
                  {/* Vertical line */}
                  {i < timeline.length - 1 && (
                    <div className="absolute left-[19px] top-8 bottom-0 w-px bg-gray-200" />
                  )}
                  
                  <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0 relative z-10">
                    {EVENT_ICONS[event.type] || EVENT_ICONS.SYSTEM}
                  </div>
                  
                  <div className="flex-1 pt-1">
                    <p className="text-sm text-[#1C130B]">{event.summary}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">{event.actor}</span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-400">{event.time}</span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono">{event.channel}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Panels */}
        <div className="space-y-6">
          {/* Lead Score Breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-[#1C130B] mb-4">Lead Score Breakdown</h3>
            {[
              { label: 'Engagement', score: customer.score.engagement, color: 'bg-blue-500' },
              { label: 'Intent', score: customer.score.intent, color: 'bg-amber-500' },
              { label: 'Value', score: customer.score.value, color: 'bg-green-500' },
            ].map((dim, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-gray-600">{dim.label}</span>
                  <span>{dim.score}/100</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${dim.color} rounded-full transition-all`} style={{ width: `${dim.score}%` }} />
                </div>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-500">Composite Score</span>
              <span className="text-2xl font-bold font-['Syne']">{customer.score.composite}</span>
            </div>
          </div>

          {/* CRM Integration */}
          {customer.externalCrmId && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-[#1C130B] mb-3">External CRM</h3>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-gray-500">{customer.externalCrmId}</span>
                <button className="text-[#C5A880] hover:text-[#8A5836]">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Referral Code */}
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#C5A880]/20 p-6">
            <h3 className="font-bold text-[#1C130B] mb-2">Referral Program</h3>
            <p className="text-xs text-gray-500 mb-3">Share this code for ₹2,000 off per referral.</p>
            <div className="bg-white border border-[#C5A880]/30 rounded-xl px-4 py-3 font-mono font-bold text-center text-lg text-[#8A5836] tracking-wider">
              {customer.referralCode}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-[#1C130B] mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <a href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}`} target="_blank" className="w-full flex items-center gap-2 bg-[#15803D] text-white py-3 px-4 rounded-xl font-bold text-sm hover:bg-green-700 transition-colors justify-center">
                <MessageSquare className="w-4 h-4" /> WhatsApp
              </a>
              <a href={`tel:${customer.phone}`} className="w-full flex items-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors justify-center">
                <Phone className="w-4 h-4" /> Call
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
