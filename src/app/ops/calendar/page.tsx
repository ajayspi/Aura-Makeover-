"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Clock, User, Truck } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const mockInstallations = [
  { id: 'INS-401', customer: 'Arjun Reddy', society: 'My Home Bhooja', unit: 'T3-1204', tech: 'Ravi K.', van: 'TS-09-AB-4455', time: '09:00', duration: '4h', status: 'SCHEDULED', day: 2 },
  { id: 'INS-402', customer: 'Priya Sharma', society: 'Aparna Sarovar', unit: 'T1-803', tech: 'Sunil M.', van: 'TS-09-CD-7788', time: '10:00', duration: '6h', status: 'IN_PROGRESS', day: 2 },
  { id: 'INS-403', customer: 'Rahul V.', society: 'Prestige High Fields', unit: 'T5-1501', tech: 'Ravi K.', van: 'TS-09-AB-4455', time: '09:00', duration: '8h', status: 'SCHEDULED', day: 3 },
  { id: 'INS-404', customer: 'Sneha M.', society: 'Rajapushpa Provincia', unit: 'T2-602', tech: 'Venkat P.', van: 'TS-09-EF-1122', time: '11:00', duration: '4h', status: 'QA_PENDING', day: 1 },
  { id: 'INS-405', customer: 'Kiran D.', society: 'My Home Bhooja', unit: 'T1-405', tech: 'Sunil M.', van: 'TS-09-CD-7788', time: '14:00', duration: '4h', status: 'COMPLETED', day: 0 },
];

const STATUS_COLORS: Record<string, string> = {
  SCHEDULED: 'bg-blue-100 text-blue-700 border-blue-200',
  IN_PROGRESS: 'bg-amber-100 text-amber-700 border-amber-200',
  QA_PENDING: 'bg-purple-100 text-purple-700 border-purple-200',
  COMPLETED: 'bg-green-100 text-green-700 border-green-200',
};

export default function InstallationCalendar() {
  const [weekOffset, setWeekOffset] = useState(0);

  // Generate current week dates
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1 + (weekOffset * 7));

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold font-['Syne'] text-[#1C130B]">Installation Calendar</h1>
          <p className="text-gray-500 text-sm mt-1">Schedule and dispatch technicians & swatch vans.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setWeekOffset(w => w - 1)} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setWeekOffset(0)} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50">
            This Week
          </button>
          <button onClick={() => setWeekOffset(w => w + 1)} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Fleet Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Vans Active Today', value: '3 / 5', icon: Truck, accent: 'text-[#8A5836]' },
          { label: 'Installs This Week', value: '12', icon: Clock, accent: 'text-[#C5A880]' },
          { label: 'Techs on Field', value: '4', icon: User, accent: 'text-green-600' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
              <kpi.icon className={`w-5 h-5 ${kpi.accent}`} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{kpi.label}</p>
              <p className="text-xl font-bold font-['Syne']">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Calendar Grid */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {weekDates.map((date, i) => {
            const isToday = date.toDateString() === today.toDateString();
            return (
              <div key={i} className={`p-4 text-center border-r border-gray-50 last:border-r-0 ${isToday ? 'bg-[#FAF8F5]' : ''}`}>
                <p className="text-xs font-bold text-gray-400 uppercase">{DAYS[i]}</p>
                <p className={`text-lg font-bold mt-1 ${isToday ? 'text-[#8A5836] bg-[#C5A880]/20 w-8 h-8 rounded-full flex items-center justify-center mx-auto' : 'text-[#1C130B]'}`}>
                  {date.getDate()}
                </p>
              </div>
            );
          })}
        </div>

        {/* Calendar Body */}
        <div className="grid grid-cols-7 min-h-[400px]">
          {weekDates.map((_, dayIndex) => (
            <div key={dayIndex} className="border-r border-gray-50 last:border-r-0 p-2 space-y-2">
              {mockInstallations
                .filter(inst => inst.day === dayIndex)
                .map(inst => (
                  <div
                    key={inst.id}
                    className={`p-3 rounded-xl border text-xs cursor-pointer hover:shadow-md transition-shadow ${STATUS_COLORS[inst.status] || 'bg-gray-100'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold">{inst.time}</span>
                      <span className="font-mono text-[10px] opacity-70">{inst.id}</span>
                    </div>
                    <p className="font-bold text-sm mb-1">{inst.customer}</p>
                    <div className="flex items-center gap-1 opacity-70">
                      <MapPin className="w-3 h-3" />
                      <span>{inst.society} · {inst.unit}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 opacity-70">
                      <User className="w-3 h-3" />
                      <span>{inst.tech}</span>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
