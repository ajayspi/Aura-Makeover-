"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CreditCard, ShieldCheck, MessageSquare, ArrowLeft } from 'lucide-react';
import { AuroBrand } from '@/components/AuroLogo';

const NAV_ITEMS = [
  { href: '/my/dashboard', label: 'Dashboard', icon: Home },
  { href: '/my/payments', label: 'Escrow Payments', icon: CreditCard },
  { href: '/my/warranty', label: 'Warranty Vault', icon: ShieldCheck },
];

export default function CustomerPortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20 md:pb-8">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/">
              <AuroBrand variant="dark" />
            </Link>
            <span className="text-[10px] sm:text-xs font-bold text-[#8A5836] bg-[#C5A880]/15 px-3 py-1 rounded-full border border-[#C5A880]/30 font-['Plus_Jakarta_Sans'] uppercase tracking-wider">
              Resident Portal
            </span>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all font-['Plus_Jakarta_Sans'] ${
                    isActive
                      ? 'bg-[#1C130B] text-[#C5A880] shadow-sm'
                      : 'text-[#1C130B]/70 hover:text-[#1C130B] hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/918555069441?text=Hi%20AuroMakeover%2C%20I%20have%20a%20question%20about%20my%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#15803D] bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Concierge
            </a>
            <Link
              href="/"
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#1C130B] font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Store</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Top Subnav Pill Strip */}
      <div className="md:hidden bg-white border-b border-gray-100 px-4 py-2.5 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-['Plus_Jakarta_Sans'] transition-all ${
                  isActive
                    ? 'bg-[#1C130B] text-[#C5A880] shadow-sm'
                    : 'text-[#1C130B]/70 bg-gray-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Page Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 py-2 px-6 flex items-center justify-around z-40 shadow-lg">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 font-['Plus_Jakarta_Sans'] ${
                isActive ? 'text-[#8A5836] font-bold' : 'text-gray-400 font-medium'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
        <a
          href="https://wa.me/918555069441?text=Hi%20AuroMakeover%2C%20I%20have%20a%20question%20about%20my%20order."
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 py-1 text-emerald-600 font-medium font-['Plus_Jakarta_Sans']"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px]">Concierge</span>
        </a>
      </nav>
    </div>
  );
}
