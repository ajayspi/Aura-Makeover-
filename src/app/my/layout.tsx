import React from 'react';
import Link from 'next/link';
import { Home, CreditCard, ShieldCheck, LogOut } from 'lucide-react';
import { AuroBrand } from '@/components/AuroLogo';

export default function CustomerPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/">
              <AuroBrand variant="dark" />
            </Link>
            <span className="text-xs font-bold text-[#C5A880] bg-[#C5A880]/10 px-3 py-1 rounded-full border border-[#C5A880]/20">
              My Portal
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/my/dashboard" className="flex items-center gap-2 text-sm font-bold text-[#1C130B] hover:text-[#8A5836] transition-colors">
              <Home className="w-4 h-4" /> Dashboard
            </Link>
            <Link href="/my/payments" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#8A5836] transition-colors">
              <CreditCard className="w-4 h-4" /> Payments
            </Link>
            <Link href="/my/warranty" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#8A5836] transition-colors">
              <ShieldCheck className="w-4 h-4" /> Warranty
            </Link>
          </nav>

          <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </header>

      {/* Page Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
