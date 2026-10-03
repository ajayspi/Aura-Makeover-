import React from 'react';
import { Search, Plus, Filter, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function InventoryDashboard() {
  // Fetch active design items with their current dye lots
  const items = await prisma.designItem.findMany({
    where: { isActive: true },
    include: {
      dyeLots: {
        where: { stockMeters: { gt: 0 } },
        orderBy: { stockMeters: 'asc' }
      }
    }
  });

  // Flatten for table view (one row per active dye lot)
  const inventoryRows = items.flatMap(item => 
    item.dyeLots.map(lot => {
      // Status determination
      let status: 'HEALTHY' | 'LOW' | 'CRITICAL' = 'HEALTHY';
      if (lot.stockMeters < 30) status = 'CRITICAL';
      else if (lot.stockMeters < 100) status = 'LOW';
      
      return {
        id: lot.id,
        sku: item.sku,
        title: item.title,
        category: item.category,
        batch: lot.rollSerial,
        stockMeters: lot.stockMeters,
        status,
      };
    })
  );

  const totalSKUs = items.length;
  const criticalCount = inventoryRows.filter(r => r.status === 'CRITICAL').length;
  const activeLots = inventoryRows.length;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold font-['Syne'] text-[#1C130B]">Warehouse Inventory</h1>
          <p className="text-gray-500 text-sm mt-1">Manage dye-lots and active stock for the 48-hour SLA.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search SKUs or Batches..." 
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C5A880]"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1C130B] text-white rounded-lg text-sm font-bold hover:bg-[#8A5836] transition-colors">
            <Plus className="w-4 h-4" /> Receive PO
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Total SKUs</p>
            <p className="text-3xl font-bold font-['Syne']">{totalSKUs}</p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-gray-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-red-500"></div>
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Critical Stock</p>
            <p className="text-3xl font-bold font-['Syne'] text-red-600">{criticalCount}</p>
          </div>
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#C5A880]/30 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Active Dye-Lots</p>
            <p className="text-3xl font-bold font-['Syne'] text-[#8A5836]">{activeLots}</p>
          </div>
          <div className="w-12 h-12 bg-[#FAF8F5] rounded-full flex items-center justify-center">
            <Filter className="w-6 h-6 text-[#C5A880]" />
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
              <th className="p-4 pl-6">SKU & Item</th>
              <th className="p-4">Category</th>
              <th className="p-4">Dye-Lot Batch</th>
              <th className="p-4">Stock (Meters/Units)</th>
              <th className="p-4">Status</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventoryRows.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="p-4 pl-6">
                  <p className="font-bold text-[#1C130B]">{item.title}</p>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">{item.sku}</p>
                </td>
                <td className="p-4">
                  <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                    {item.category.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`text-xs font-bold font-mono px-2 py-1 rounded-md ${item.batch === 'N/A' ? 'text-gray-400' : 'bg-[#FAF8F5] text-[#8A5836] border border-[#C5A880]/20'}`}>
                    {item.batch}
                  </span>
                </td>
                <td className="p-4 font-bold text-gray-700">
                  {item.stockMeters}
                </td>
                <td className="p-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 w-max
                    ${item.status === 'HEALTHY' ? 'bg-green-100 text-green-700' : 
                      item.status === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}
                  >
                    {item.status === 'HEALTHY' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {item.status}
                  </span>
                </td>
                <td className="p-4 pr-6 text-right">
                  <button className="text-sm font-bold text-[#C5A880] hover:text-[#8A5836]">Edit</button>
                </td>
              </tr>
            ))}
            {inventoryRows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  No active dye-lots in stock. Seed the database or receive a PO.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
