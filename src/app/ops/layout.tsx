import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, Package, Calendar } from 'lucide-react';
import { AuroBrand } from '@/components/AuroLogo';

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <AuroBrand variant="dark" />
          <p className="text-xs text-gray-400 mt-2 font-bold tracking-wider uppercase">Ops Command Center</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/ops" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
            <LayoutDashboard className="w-5 h-5 text-gray-400" />
            Overview
          </Link>
          <Link href="/ops/leads" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#1C130B] bg-[#C5A880]/10 rounded-lg border border-[#C5A880]/20">
            <Users className="w-5 h-5 text-[#8A5836]" />
            Leads CRM
          </Link>
          <Link href="/ops/customers" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
            <Users className="w-5 h-5 text-gray-400" />
            Customers 360°
          </Link>
          <Link href="/ops/inventory" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
            <Package className="w-5 h-5 text-gray-400" />
            Inventory
          </Link>
          <Link href="/ops/calendar" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
            <Calendar className="w-5 h-5 text-gray-400" />
            Installations
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1C130B] text-white flex items-center justify-center font-bold text-xs">
              AJ
            </div>
            <div>
              <p className="text-sm font-bold text-[#1C130B]">Admin User</p>
              <p className="text-xs text-gray-500">City Manager</p>
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
