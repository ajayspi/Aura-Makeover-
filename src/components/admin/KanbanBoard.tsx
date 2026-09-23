"use client";

import React from 'react';
import { Truck, MessageCircle, MapPin, CheckSquare, Clock } from 'lucide-react';

const LEADS = [
  { id: 'L1', name: 'Arjun Reddy', society: 'My Home Bhooja', corridor: 'HYD-WEST-01', stage: 'NEW', time: '10m ago' },
  { id: 'L2', name: 'Priya K', society: 'Aparna Sarovar', corridor: 'HYD-WEST-02', stage: 'VAN_DISPATCHED', time: '2h ago' },
  { id: 'L3', name: 'Vikram S', society: 'Rajapushpa', corridor: 'HYD-WEST-01', stage: 'QUOTE_LOCKED', time: '1d ago' },
];

export default function KanbanBoard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8 font-['Plus_Jakarta_Sans']">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black font-['Space_Grotesk'] text-[#1C130B]">AuroOps Command</h1>
          <p className="text-gray-500 font-medium mt-1">Live Fleet & Lead Tracking (Hyderabad West)</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 flex gap-4">
          <div className="text-sm">
            <span className="text-gray-500 block text-xs font-bold uppercase">Active Vans</span>
            <span className="font-bold text-green-600">3 / 5</span>
          </div>
          <div className="w-px bg-gray-200"></div>
          <div className="text-sm">
            <span className="text-gray-500 block text-xs font-bold uppercase">Installations Today</span>
            <span className="font-bold text-[#8A5836]">12</span>
          </div>
        </div>
      </header>

      <div className="flex gap-6 overflow-x-auto pb-4">

        {/* NEW LEADS */}
        <div className="w-80 flex-none flex flex-col gap-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-gray-700 uppercase tracking-wider text-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              New Requests
            </h2>
            <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-xs font-bold">1</span>
          </div>

          {LEADS.filter(l => l.stage === 'NEW').map(lead => (
            <div key={lead.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:border-[#8A5836] transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-[#1C130B]">{lead.name}</h3>
                <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {lead.time}
                </span>
              </div>
              <p className="text-xs text-gray-600 flex items-center gap-1 mb-4 font-medium">
                <MapPin className="w-3 h-3" /> {lead.society} ({lead.corridor})
              </p>
              <div className="flex gap-2">
                <button className="flex-1 bg-[#15803D]/10 text-[#15803D] hover:bg-[#15803D]/20 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1">
                  <MessageCircle className="w-3 h-3" /> WhatsApp
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* VAN DISPATCHED */}
        <div className="w-80 flex-none flex flex-col gap-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-gray-700 uppercase tracking-wider text-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              Van Dispatched
            </h2>
            <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-xs font-bold">1</span>
          </div>

          {LEADS.filter(l => l.stage === 'VAN_DISPATCHED').map(lead => (
            <div key={lead.id} className="bg-white p-4 rounded-xl shadow-sm border border-orange-200 cursor-pointer hover:border-orange-400 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-[#1C130B]">{lead.name}</h3>
                <span className="text-xs text-orange-500 font-bold px-2 py-0.5 bg-orange-50 rounded">Live</span>
              </div>
              <p className="text-xs text-gray-600 flex items-center gap-1 mb-4 font-medium">
                <MapPin className="w-3 h-3" /> {lead.society}
              </p>
              <div className="flex gap-2">
                <button className="flex-1 bg-orange-100 text-orange-700 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1">
                  <Truck className="w-3 h-3" /> Track Van
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* QUOTE LOCKED / PENDING INSTALL */}
        <div className="w-80 flex-none flex flex-col gap-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-gray-700 uppercase tracking-wider text-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              Escrow Active
            </h2>
            <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-xs font-bold">1</span>
          </div>

          {LEADS.filter(l => l.stage === 'QUOTE_LOCKED').map(lead => (
            <div key={lead.id} className="bg-white p-4 rounded-xl shadow-sm border border-purple-200 cursor-pointer hover:border-purple-400 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-[#1C130B]">{lead.name}</h3>
                <span className="text-xs text-purple-600 font-bold px-2 py-0.5 bg-purple-50 rounded">10% Paid</span>
              </div>
              <p className="text-xs text-gray-600 flex items-center gap-1 mb-4 font-medium">
                <CheckSquare className="w-3 h-3" /> Material Fabricated
              </p>
              <div className="flex gap-2">
                <button className="flex-1 bg-[#1C130B] text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1">
                  Schedule Install
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
