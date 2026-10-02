"use client";

import React from 'react';
import { Search, Plus, Filter } from 'lucide-react';

const mockLeads = [
  { id: 'LD-1021', name: 'Arjun Reddy', society: 'My Home Bhooja', stage: 'NEW', value: '₹55,000' },
  { id: 'LD-1022', name: 'Priya K.', society: 'Aparna Sarovar', stage: 'CONTACTED', value: 'Pending' },
  { id: 'LD-1019', name: 'Rahul V.', society: 'Prestige High Fields', stage: 'QUOTED', value: '₹89,000' },
  { id: 'LD-1015', name: 'Sneha M.', society: 'Rajapushpa', stage: 'WON', value: '₹1,20,000' },
];

const STAGES = ['NEW', 'CONTACTED', 'QUOTED', 'WON'];

export default function LeadsCRM() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold font-['Syne'] text-[#1C130B]">Leads CRM</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your pipeline and trigger webhooks.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search leads..." 
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C5A880]"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1C130B] text-white rounded-lg text-sm font-bold hover:bg-[#8A5836] transition-colors">
            <Plus className="w-4 h-4" /> New Lead
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {STAGES.map(stage => (
          <div key={stage} className="min-w-[300px] flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-gray-700">{stage}</h3>
              <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {mockLeads.filter(l => l.stage === stage).length}
              </span>
            </div>
            
            <div className="space-y-3">
              {mockLeads.filter(l => l.stage === stage).map(lead => (
                <div key={lead.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-[#C5A880]/50 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-gray-400">{lead.id}</span>
                    <span className="text-xs font-bold text-[#8A5836]">{lead.value}</span>
                  </div>
                  <h4 className="font-bold text-[#1C130B] mb-1">{lead.name}</h4>
                  <p className="text-sm text-gray-500">{lead.society}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
