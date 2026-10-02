"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Plus, Filter, ArrowUpRight, Phone, Mail } from 'lucide-react';

const mockCustomers = [
  { id: 'cust-001', name: 'Arjun Reddy', phone: '+91 98765 43210', email: 'arjun@gmail.com', society: 'My Home Bhooja', stage: 'INSTALLING', ltv: '₹1,20,000', score: 87, tier: 'S', tags: ['VIP', 'REPEAT'] },
  { id: 'cust-002', name: 'Priya Sharma', phone: '+91 91234 56789', email: 'priya.s@gmail.com', society: 'Aparna Sarovar', stage: 'QUOTE_SENT', ltv: '₹55,000', score: 62, tier: 'A', tags: ['REFERRAL_SOURCE'] },
  { id: 'cust-003', name: 'Rahul Venkat', phone: '+91 88765 12345', email: null, society: 'Prestige High Fields', stage: 'LEAD_CAPTURED', ltv: '₹0', score: 38, tier: 'C', tags: [] },
  { id: 'cust-004', name: 'Sneha Murthy', phone: '+91 77654 98765', email: 'sneha.m@outlook.com', society: 'Rajapushpa Provincia', stage: 'WARRANTY_ACTIVE', ltv: '₹89,000', score: 72, tier: 'A', tags: ['HIGH_VALUE'] },
  { id: 'cust-005', name: 'Kiran D.', phone: '+91 99887 76655', email: null, society: 'My Home Bhooja', stage: 'DEAL_LOST', ltv: '₹0', score: 22, tier: 'C', tags: ['CHURNED'] },
];

const TIER_COLORS: Record<string, string> = {
  S: 'bg-red-100 text-red-700 border-red-200',
  A: 'bg-amber-100 text-amber-700 border-amber-200',
  B: 'bg-blue-100 text-blue-700 border-blue-200',
  C: 'bg-gray-100 text-gray-500 border-gray-200',
};

const STAGE_COLORS: Record<string, string> = {
  LEAD_CAPTURED: 'bg-blue-50 text-blue-700',
  CONTACTED: 'bg-sky-50 text-sky-700',
  QUOTE_SENT: 'bg-amber-50 text-amber-700',
  DEAL_WON: 'bg-green-50 text-green-700',
  DEAL_LOST: 'bg-red-50 text-red-600',
  INSTALLING: 'bg-purple-50 text-purple-700',
  WARRANTY_ACTIVE: 'bg-emerald-50 text-emerald-700',
};

export default function CustomersListPage() {
  const [search, setSearch] = useState('');

  const filtered = mockCustomers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.society.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold font-['Syne'] text-[#1C130B]">Customer 360°</h1>
          <p className="text-gray-500 text-sm mt-1">Unified view of every customer across all channels.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, phone, society..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C5A880] w-72"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
            <Filter className="w-4 h-4" /> Segment
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1C130B] text-white rounded-lg text-sm font-bold hover:bg-[#8A5836] transition-colors">
            <Plus className="w-4 h-4" /> Add Customer
          </button>
        </div>
      </div>

      {/* Score Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {(['S', 'A', 'B', 'C'] as const).map(tier => {
          const count = mockCustomers.filter(c => c.tier === tier).length;
          const labels = { S: 'Hot Leads', A: 'Warm Leads', B: 'Nurture', C: 'Cold' };
          return (
            <div key={tier} className={`p-4 rounded-xl border ${TIER_COLORS[tier]}`}>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold font-['Syne']">{count}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full border bg-white/50">{tier}-Tier</span>
              </div>
              <p className="text-xs font-bold mt-1 opacity-70">{labels[tier]}</p>
            </div>
          );
        })}
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
              <th className="p-4 pl-6">Customer</th>
              <th className="p-4">Society</th>
              <th className="p-4">Lifecycle Stage</th>
              <th className="p-4">Score</th>
              <th className="p-4">LTV</th>
              <th className="p-4">Tags</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="p-4 pl-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#1C130B] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {c.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <Link href={`/ops/customers/${c.id}`} className="font-bold text-[#1C130B] hover:text-[#8A5836] transition-colors">
                        {c.name}
                      </Link>
                      <p className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                        <Phone className="w-3 h-3" /> {c.phone}
                        {c.email && <><Mail className="w-3 h-3 ml-1" /> {c.email}</>}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600">{c.society}</td>
                <td className="p-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${STAGE_COLORS[c.stage] || 'bg-gray-100 text-gray-600'}`}>
                    {c.stage.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{c.score}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${TIER_COLORS[c.tier]}`}>{c.tier}</span>
                  </div>
                </td>
                <td className="p-4 text-sm font-bold text-[#1C130B]">{c.ltv}</td>
                <td className="p-4">
                  <div className="flex gap-1 flex-wrap">
                    {c.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold bg-[#FAF8F5] text-[#8A5836] px-2 py-0.5 rounded-full border border-[#C5A880]/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4 pr-6 text-right">
                  <Link href={`/ops/customers/${c.id}`} className="text-[#C5A880] hover:text-[#8A5836] transition-colors">
                    <ArrowUpRight className="w-4 h-4 inline" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
