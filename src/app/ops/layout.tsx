"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Calendar, 
  Wrench, 
  Network, 
  ArrowLeft,
  UserCheck
} from 'lucide-react';
import { AuroBrand } from '@/components/AuroLogo';

const OPS_NAV = [
  { href: '/ops', label: 'Command Center', icon: LayoutDashboard },
  { href: '/ops/leads', label: 'Leads CRM', icon: Users },
  { href: '/ops/customers', label: 'Customers 360°', icon: UserCheck },
  { href: '/ops/tech', label: 'Field Tech Hub', icon: Wrench },
  { href: '/ops/inventory', label: 'Inventory & Lots', icon: Package },
  { href: '/ops/calendar', label: 'Install Calendar', icon: Calendar },
  { href: '/ops/workflows', label: 'Automations', icon: Network },
];

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col md:flex-row">
      {/* Mobile Ops Header */}
      <div className="md:hidden bg-[#1C130B] text-white p-4 sticky top-0 z-40 border-b border-white/10 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <AuroBrand variant="light" />
            <span className="text-[10px] font-bold text-[#C5A880] bg-[#C5A880]/20 px-2.5 py-0.5 rounded-full border border-[#C5A880]/30 font-mono">
              OPS HUB
            </span>
          </div>
          <Link
            href="/"
            className="text-xs text-white/70 hover:text-white flex items-center gap-1 font-['Plus_Jakarta_Sans']"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Store
          </Link>
        </div>

        {/* Horizontal Scrollable Nav for Mobile Ops */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-['Plus_Jakarta_Sans']">
          {OPS_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#C5A880] text-[#1C130B] shadow-sm'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-100">
          <AuroBrand variant="dark" />
          <p className="text-[10px] text-[#8A5836] mt-2 font-bold tracking-widest uppercase font-['Plus_Jakarta_Sans']">
            Operations & Field Hub
          </p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 font-['Plus_Jakarta_Sans']">
          {OPS_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#1C130B] text-[#C5A880] shadow-sm border border-[#1C130B]'
                    : 'text-[#1C130B]/70 hover:bg-gray-50 hover:text-[#1C130B]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#C5A880]' : 'text-gray-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer with City Manager profile and store link */}
        <div className="p-4 border-t border-gray-100 space-y-3 font-['Plus_Jakarta_Sans']">
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-[#1C130B] hover:bg-gray-50 transition-colors"
          >
            <span>Customer Storefront</span>
            <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
          </Link>

          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            <div className="w-8 h-8 rounded-full bg-[#1C130B] text-[#C5A880] flex items-center justify-center font-bold text-xs">
              HYD
            </div>
            <div>
              <p className="text-xs font-bold text-[#1C130B]">Hyderabad Metro</p>
              <p className="text-[10px] text-gray-400">Hub: HITEC Corridor</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
