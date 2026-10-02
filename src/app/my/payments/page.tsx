"use client";

import React from 'react';
import { Download, CheckCircle2, Clock, IndianRupee } from 'lucide-react';

const transactions = [
  { id: 'TXN-9901', date: 'Sep 28, 2026', type: 'Booking Deposit (10%)', amount: '₹5,500', status: 'PAID', method: 'UPI' },
  { id: 'TXN-9945', date: 'Sep 30, 2026', type: 'Material Release (60%)', amount: '₹33,000', status: 'PAID', method: 'NEFT' },
  { id: 'TXN-PEND', date: 'Pending', type: 'QA Final (30%)', amount: '₹16,500', status: 'PENDING', method: '—' },
];

export default function PaymentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold font-['Syne'] text-[#1C130B] mb-2">Payments & Invoices</h1>
      <p className="text-gray-500 text-sm mb-8">Track your 10/60/30 escrow payments securely.</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-green-700 mb-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-bold">Total Paid</span>
          </div>
          <p className="text-3xl font-bold font-['Syne'] text-green-800">₹38,500</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-amber-700 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-bold">Pending</span>
          </div>
          <p className="text-3xl font-bold font-['Syne'] text-amber-800">₹16,500</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <IndianRupee className="w-5 h-5" />
            <span className="text-sm font-bold">Total Project Value</span>
          </div>
          <p className="text-3xl font-bold font-['Syne'] text-[#1C130B]">₹55,000</p>
          <p className="text-xs text-gray-400 mt-1">Inclusive of 18% GST</p>
        </div>
      </div>

      {/* Pending Action CTA */}
      <div className="bg-gradient-to-r from-[#C5A880] to-[#8A5836] rounded-2xl p-6 mb-8 flex items-center justify-between text-white">
        <div>
          <p className="font-bold text-lg">30% QA Final Payment Due</p>
          <p className="text-sm text-white/70">This payment will be unlocked after the technician submits the QA report and you sign off.</p>
        </div>
        <button disabled className="bg-white/20 text-white px-6 py-3 rounded-xl font-bold text-sm cursor-not-allowed opacity-70">
          Awaiting QA Sign-off
        </button>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-bold text-[#1C130B]">Transaction History</h2>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 font-bold border-b border-gray-100">
              <th className="p-4 pl-6">Transaction</th>
              <th className="p-4">Date</th>
              <th className="p-4">Type</th>
              <th className="p-4">Method</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 pr-6 text-right">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="p-4 pl-6 font-mono text-xs font-bold text-gray-400">{txn.id}</td>
                <td className="p-4 text-sm text-gray-700">{txn.date}</td>
                <td className="p-4 text-sm font-bold text-[#1C130B]">{txn.type}</td>
                <td className="p-4 text-sm text-gray-500">{txn.method}</td>
                <td className="p-4 text-sm font-bold text-[#1C130B]">{txn.amount}</td>
                <td className="p-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${txn.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {txn.status}
                  </span>
                </td>
                <td className="p-4 pr-6 text-right">
                  {txn.status === 'PAID' ? (
                    <button className="text-[#C5A880] hover:text-[#8A5836] transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  ) : <span className="text-gray-300">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
