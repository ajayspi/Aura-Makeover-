import React from 'react';
import Link from 'next/link';
import { Search, Plus, Filter, ArrowUpRight, Phone, Mail } from 'lucide-react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

// Next.js Server Component
export default async function CustomersListPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const search = searchParams?.search || '';

  // Fetch Live Data from Prisma
  const customers = await prisma.customer.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search } },
            { addresses: { some: { society: { contains: search, mode: 'insensitive' } } } },
          ],
        }
      : undefined,
    include: {
      score: true,
      tags: true,
      addresses: { where: { isPrimary: true }, take: 1 },
    },
    orderBy: { lastActivityAt: 'desc' },
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold font-['Syne'] text-[#1C130B]">Customer 360°</h1>
          <p className="text-gray-500 text-sm mt-1">Unified view of every customer across all channels.</p>
        </div>
        <div className="flex items-center gap-3">
          <form className="relative" action="/ops/customers" method="GET">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="search"
              placeholder="Search name, phone, society..."
              defaultValue={search}
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C5A880] w-72"
            />
          </form>
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
          const count = await prisma.customerScore.count({ where: { tier } });
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
            {customers.map(c => {
              const primaryAddress = c.addresses[0];
              const score = c.score?.compositeScore || 0;
              const tier = c.score?.tier || 'C';
              
              return (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#1C130B] text-white flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                        {c.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
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
                  <td className="p-4 text-sm text-gray-600">
                    {primaryAddress ? `${primaryAddress.society || primaryAddress.city}` : '—'}
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${STAGE_COLORS[c.lifecycleStage] || 'bg-gray-100 text-gray-600'}`}>
                      {c.lifecycleStage.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{score}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${TIER_COLORS[tier]}`}>{tier}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-bold text-[#1C130B]">
                    ₹{(c.lifetimeValue / 1000).toFixed(0)}K
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1 flex-wrap">
                      {c.tags.map(tag => (
                        <span key={tag.id} className="text-[10px] font-bold bg-[#FAF8F5] text-[#8A5836] px-2 py-0.5 rounded-full border border-[#C5A880]/20">
                          {tag.tag}
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
              );
            })}
            
            {customers.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  No customers found. Database might be empty or search returned no results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
