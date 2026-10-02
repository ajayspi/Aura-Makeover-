"use client";

import React from 'react';
import { TrendingUp, Users, IndianRupee, Truck, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const revenueData = [
  { month: 'May', value: 320000 },
  { month: 'Jun', value: 480000 },
  { month: 'Jul', value: 510000 },
  { month: 'Aug', value: 720000 },
  { month: 'Sep', value: 890000 },
];

const recentActivity = [
  { action: 'Lead converted to Order', detail: 'Arjun Reddy · My Home Bhooja', time: '2 min ago', type: 'success' },
  { action: 'Escrow 60% received', detail: 'Order ORD-882 · ₹34,200', time: '15 min ago', type: 'payment' },
  { action: 'Low stock alert', detail: 'Art Deco Gold (WP-GEO-04) — 45m remaining', time: '1h ago', type: 'warning' },
  { action: 'QA Report submitted', detail: 'Ravi K. · Prestige High Fields T5-1501', time: '3h ago', type: 'info' },
  { action: 'New lead captured', detail: 'Quiz · Sneha from Rajapushpa', time: '4h ago', type: 'info' },
];

export default function OpsOverview() {
  const maxRevenue = Math.max(...revenueData.map(d => d.value));

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-['Syne'] text-[#1C130B]">Ops Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Real-time business pulse across all verticals.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Monthly Revenue', value: '₹8,90,000', change: '+17%', up: true, icon: IndianRupee, accent: 'bg-green-50 text-green-600' },
          { label: 'Active Leads', value: '34', change: '+5 this week', up: true, icon: Users, accent: 'bg-blue-50 text-blue-600' },
          { label: 'Pipeline Value', value: '₹12.4L', change: '8 deals in Quote', up: true, icon: TrendingUp, accent: 'bg-amber-50 text-amber-600' },
          { label: 'Vans Deployed', value: '3 / 5', change: '2 returning', up: false, icon: Truck, accent: 'bg-purple-50 text-purple-600' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.accent}`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold flex items-center gap-1 ${kpi.up ? 'text-green-600' : 'text-gray-500'}`}>
                {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {kpi.change}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{kpi.label}</p>
            <p className="text-2xl font-bold font-['Syne'] text-[#1C130B]">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart (CSS-only bar chart) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-[#1C130B] mb-6">Revenue Trend (Last 5 Months)</h3>
          <div className="flex items-end gap-4 h-48">
            {revenueData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-gray-500">₹{(d.value / 1000).toFixed(0)}K</span>
                <div
                  className="w-full bg-gradient-to-t from-[#C5A880] to-[#8A5836] rounded-t-lg transition-all duration-700"
                  style={{ height: `${(d.value / maxRevenue) * 100}%` }}
                />
                <span className="text-xs font-bold text-gray-400">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-[#1C130B] mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                  item.type === 'success' ? 'bg-green-500' :
                  item.type === 'payment' ? 'bg-[#C5A880]' :
                  item.type === 'warning' ? 'bg-red-500' : 'bg-blue-400'
                }`} />
                <div>
                  <p className="text-sm font-bold text-[#1C130B]">{item.action}</p>
                  <p className="text-xs text-gray-500">{item.detail}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Escrow Pipeline */}
      <div className="mt-6 bg-[#1C130B] p-6 rounded-2xl text-[#FAF8F5] shadow-xl">
        <h3 className="font-bold mb-4">Escrow Pipeline</h3>
        <div className="grid grid-cols-3 gap-6">
          {[
            { stage: '10% Deposits Pending', amount: '₹1,42,000', count: '8 orders' },
            { stage: '60% Material Release', amount: '₹4,80,000', count: '5 orders' },
            { stage: '30% QA Unlock', amount: '₹2,10,000', count: '3 orders' },
          ].map((tranche, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-xs text-[#C5A880] font-bold uppercase tracking-wider mb-2">{tranche.stage}</p>
              <p className="text-2xl font-bold font-['Syne']">{tranche.amount}</p>
              <p className="text-xs text-white/50 mt-1">{tranche.count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
