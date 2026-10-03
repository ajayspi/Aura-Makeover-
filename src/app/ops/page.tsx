import React from 'react';
import { TrendingUp, Users, IndianRupee, Truck, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function OpsOverview() {
  // Fetch Live Data
  const [
    totalOrders,
    leads,
    criticalInventory,
    recentLogs
  ] = await Promise.all([
    prisma.order.findMany({ select: { totalAmount: true, escrowStage: true } }),
    prisma.lead.findMany({ select: { status: true, id: true } }),
    prisma.dyeLot.count({ where: { stockMeters: { lt: 30 } } }),
    prisma.auditLog.findMany({ take: 5, orderBy: { timestamp: 'desc' } })
  ]);

  const activeLeadsCount = leads.filter(l => !['WON', 'LOST'].includes(l.status)).length;
  
  // Pipeline Value (Sum of orders not fully paid/completed)
  const pipelineValue = totalOrders
    .filter(o => o.escrowStage !== 'COMPLETED')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const revenueCurrentMonth = totalOrders.reduce((sum, o) => sum + o.totalAmount, 0); // Simplified for demo

  // Escrow Tranches calculation
  const getTranche = (stage: string) => totalOrders.filter(o => o.escrowStage === stage);

  return (
    <div className="p-8 bg-[#FAF8F5] min-h-screen relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C5A880]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#8A5836]/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Header */}
      <div className="mb-10 relative z-10">
        <h1 className="text-3xl font-black font-['Syne'] text-[#1C130B] tracking-tight">Command Center</h1>
        <p className="text-[#8A5836] text-sm mt-1 font-bold">Real-time business pulse & CRM Intelligence</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 relative z-10">
        {[
          { label: 'Total Revenue', value: `₹${(revenueCurrentMonth / 100000).toFixed(1)}L`, change: '+12%', up: true, icon: IndianRupee, accent: 'bg-[#1C130B] text-[#C5A880]' },
          { label: 'Active Leads', value: activeLeadsCount.toString(), change: 'Live Pipeline', up: true, icon: Users, accent: 'bg-white text-[#8A5836] border border-[#C5A880]/30' },
          { label: 'Pipeline Value', value: `₹${(pipelineValue / 100000).toFixed(1)}L`, change: 'In Escrow', up: true, icon: TrendingUp, accent: 'bg-white text-[#1C130B] border border-gray-200' },
          { label: 'Inventory Alerts', value: criticalInventory.toString(), change: 'Dye-lots < 30m', up: criticalInventory === 0, icon: Activity, accent: criticalInventory > 0 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100' },
        ].map((kpi, i) => (
          <div key={i} className={`p-6 rounded-3xl shadow-sm ${kpi.accent.includes('bg-[#1C130B]') ? 'bg-[#1C130B] shadow-xl' : 'bg-white'} hover:-translate-y-1 transition-transform duration-300`}>
            <div className="flex items-center justify-between mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${kpi.accent}`}>
                <kpi.icon className="w-6 h-6" />
              </div>
              <span className={`text-xs font-bold flex items-center gap-1 ${kpi.up ? (kpi.accent.includes('bg-[#1C130B]') ? 'text-[#C5A880]' : 'text-green-600') : 'text-red-500'}`}>
                {kpi.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {kpi.change}
              </span>
            </div>
            <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${kpi.accent.includes('bg-[#1C130B]') ? 'text-white/60' : 'text-gray-500'}`}>{kpi.label}</p>
            <p className={`text-3xl font-black font-['Syne'] ${kpi.accent.includes('bg-[#1C130B]') ? 'text-white' : 'text-[#1C130B]'}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Analytics Main Pane */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-[#1C130B] mb-8 font-['Syne'] text-xl">Revenue Trajectory</h3>
          <div className="flex items-end gap-6 h-64">
            {[
              { month: 'May', value: 320 },
              { month: 'Jun', value: 480 },
              { month: 'Jul', value: 510 },
              { month: 'Aug', value: 720 },
              { month: 'Sep', value: revenueCurrentMonth / 1000 },
            ].map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 group cursor-pointer">
                <span className="text-sm font-bold text-gray-400 group-hover:text-[#8A5836] transition-colors">₹{d.value.toFixed(0)}K</span>
                <div
                  className="w-full bg-gradient-to-t from-[#C5A880] to-[#1C130B] rounded-xl transition-all duration-700 opacity-80 group-hover:opacity-100 group-hover:shadow-[0_0_20px_rgba(197,168,128,0.4)]"
                  style={{ height: `${(d.value / 1000) * 100}%`, minHeight: '10%' }}
                />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Event Stream */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-[#1C130B] mb-6 font-['Syne'] text-xl flex items-center justify-between">
            Live Stream
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </h3>
          <div className="space-y-6 flex-1">
            {recentLogs.length > 0 ? recentLogs.map((log) => (
              <div key={log.id} className="flex gap-4">
                <div className="w-2 h-2 rounded-full mt-2 shrink-0 bg-[#C5A880]" />
                <div>
                  <p className="text-sm font-bold text-[#1C130B] capitalize">{log.action.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{log.details?.toString() || 'System event triggered'}</p>
                  <p className="text-[10px] font-bold text-[#8A5836] mt-1 tracking-wider uppercase">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            )) : (
              <div className="text-center text-gray-400 text-sm py-10 font-medium">No recent system events</div>
            )}
          </div>
        </div>
      </div>

      {/* Escrow Pipeline */}
      <div className="mt-8 bg-[#1C130B] p-8 rounded-3xl text-[#FAF8F5] shadow-2xl relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <h3 className="font-bold mb-6 font-['Syne'] text-xl">Active Escrow Tranches</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { stage: '10% Deposits Pending', orders: getTranche('DEPOSIT_PENDING') },
            { stage: '60% Material Release', orders: getTranche('MATERIAL_RELEASED') },
            { stage: '30% QA Unlock', orders: getTranche('POST_QA_UNLOCK_PENDING') },
          ].map((tranche, i) => {
            const amount = tranche.orders.reduce((sum, o) => sum + o.totalAmount, 0);
            return (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <p className="text-xs text-[#C5A880] font-bold uppercase tracking-widest mb-2">{tranche.stage}</p>
                <p className="text-3xl font-black font-['Syne']">₹{(amount / 1000).toFixed(1)}K</p>
                <p className="text-xs text-white/50 mt-2 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white/20 inline-block"></span>
                  {tranche.orders.length} active orders
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
