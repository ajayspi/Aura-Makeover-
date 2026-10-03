import React from 'react';
import { CheckCircle2, Circle, Clock, Phone, MapPin, User } from 'lucide-react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PROJECT_STAGES = [
  { id: 'DEPOSIT_PAID', label: 'Booking Confirmed' },
  { id: 'MATERIAL_RELEASED', label: 'Material Ordered' },
  { id: 'INSTALL_READY', label: 'Installation Day' },
  { id: 'POST_QA_UNLOCK_PENDING', label: 'QA Inspection' },
  { id: 'COMPLETED', label: 'Warranty Activated' },
];

export default async function CustomerDashboard() {
  // For demo, we fetch Arjun Reddy. In prod, we'd use auth context.
  const customer = await prisma.customer.findFirst({
    where: { name: 'Arjun Reddy' },
    include: {
      addresses: { where: { isPrimary: true } },
    }
  });

  // Find associated user record (if any) to fetch Orders and Installations
  const user = customer ? await prisma.user.findFirst({
    where: { phone: customer.phone },
    include: {
      orders: {
        include: {
          escrowTransactions: true,
          installation: {
            include: { technician: true, van: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    }
  }) : null;

  const address = customer?.addresses[0];
  const order = user?.orders[0];
  const installation = order?.installation;
  
  // Default values if DB seed doesn't have full relational tree yet
  const name = customer?.name || 'Valued Customer';
  const societyStr = address ? `${address.society} · Tower ${address.tower}, Unit ${address.unit}` : 'Unknown Location';
  
  // Determine Stage Progress
  const currentStageIndex = order 
    ? PROJECT_STAGES.findIndex(s => s.id === order.escrowStage) 
    : 0;

  const getStatus = (index: number) => {
    if (index < currentStageIndex) return 'done';
    if (index === currentStageIndex) return 'current';
    return 'pending';
  };

  const getTrancheStatus = (stage: string) => {
    const tx = order?.escrowTransactions.find(t => t.stage === stage);
    return tx?.status || 'PENDING';
  };

  const tranche10 = order?.totalAmount ? `₹${(order.totalAmount * 0.1).toLocaleString()}` : '₹5,500';
  const tranche60 = order?.totalAmount ? `₹${(order.totalAmount * 0.6).toLocaleString()}` : '₹33,000';
  const tranche30 = order?.totalAmount ? `₹${(order.totalAmount * 0.3).toLocaleString()}` : '₹16,500';

  return (
    <div>
      {/* Welcome Banner */}
      <div className="bg-[#1C130B] rounded-3xl p-8 md:p-10 text-[#FAF8F5] mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#C5A880]/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10">
          <p className="text-[#C5A880] text-sm font-bold tracking-wider uppercase mb-2">Welcome back</p>
          <h1 className="font-['Syne'] text-3xl md:text-4xl font-bold mb-2">{name}</h1>
          <p className="text-white/60 text-sm">{societyStr}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project Tracker — Main Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <h2 className="font-['Syne'] text-xl font-bold text-[#1C130B] mb-6">Your Project Status</h2>
            
            {/* Visual Progress Bar */}
            <div className="relative mb-8">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
              <div className="space-y-0">
                {PROJECT_STAGES.map((stage, i) => {
                  const status = getStatus(i);
                  return (
                    <div key={i} className="relative flex items-start gap-4 pb-8 last:pb-0">
                      {/* Dot */}
                      <div className="relative z-10">
                        {status === 'done' ? (
                          <CheckCircle2 className="w-8 h-8 text-green-500 bg-white rounded-full" />
                        ) : status === 'current' ? (
                          <div className="w-8 h-8 rounded-full bg-[#C5A880] flex items-center justify-center shadow-lg shadow-[#C5A880]/30">
                            <Clock className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <Circle className="w-8 h-8 text-gray-300 bg-white rounded-full" />
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className={`flex-1 ${status === 'pending' ? 'opacity-40' : ''}`}>
                        <div className="flex items-center justify-between">
                          <h3 className={`font-bold ${status === 'current' ? 'text-[#8A5836]' : 'text-[#1C130B]'}`}>
                            {stage.label}
                          </h3>
                        </div>
                        {status === 'current' && installation && (
                          <p className="text-sm text-[#8A5836] mt-1 font-medium">
                            Technician {installation.technician?.name || 'assigned'} is en route.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Escrow Summary */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Payment Progress</h3>
              <div className="flex gap-4 flex-wrap md:flex-nowrap">
                {[
                  { label: '10% Deposit', amount: tranche10, status: getTrancheStatus('DEPOSIT_10') },
                  { label: '60% Material', amount: tranche60, status: getTrancheStatus('MATERIAL_60') },
                  { label: '30% QA Final', amount: tranche30, status: getTrancheStatus('QA_30') },
                ].map((tranche, i) => (
                  <div key={i} className={`flex-1 p-4 rounded-xl border min-w-[140px] ${tranche.status === 'PAID' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <p className="text-xs font-bold text-gray-500 uppercase">{tranche.label}</p>
                    <p className="text-lg font-bold mt-1">{tranche.amount}</p>
                    <span className={`text-xs font-bold mt-2 inline-block px-2 py-0.5 rounded-full ${tranche.status === 'PAID' ? 'bg-green-200 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {tranche.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Assigned Technician */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Your Technician</h3>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#1C130B] text-white flex items-center justify-center font-bold text-lg">
                {installation?.technician?.name ? installation.technician.name.substring(0, 2).toUpperCase() : 'RK'}
              </div>
              <div>
                <p className="font-bold text-[#1C130B]">{installation?.technician?.name || 'Ravi Kumar'}</p>
                <p className="text-sm text-gray-500">5 years experience · 98% rating</p>
              </div>
            </div>
            <a
              href={`tel:${installation?.technician?.phone || '+919876543210'}`}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-[#1C130B] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#8A5836] transition-colors"
            >
              <Phone className="w-4 h-4" /> Call Technician
            </a>
          </div>

          {/* Warranty Card */}
          <div className="bg-gradient-to-br from-[#1C130B] to-[#3E2C1E] rounded-2xl p-6 text-[#FAF8F5] relative overflow-hidden">
            <div className="absolute top-2 right-2 w-16 h-16 bg-[#C5A880]/10 rounded-full blur-xl pointer-events-none" />
            <p className="text-[#C5A880] text-xs font-bold uppercase tracking-widest mb-3">2-Year Warranty</p>
            <p className="font-['Syne'] text-lg font-bold mb-1">Pending Activation</p>
            <p className="text-xs text-white/50">Will activate after QA sign-off.</p>
            <div className="mt-4 border-t border-white/10 pt-3">
              <p className="text-[10px] text-white/30 uppercase tracking-wider">Coverage</p>
              <p className="text-xs text-white/70 mt-1">Wallpaper seams, adhesive failure, colour fade, louver warping.</p>
            </div>
          </div>

          {/* WhatsApp Support */}
          <a
            href="https://wa.me/919700675637?text=Hi%2C%20I%20need%20help%20with%20my%20AuroMakeover%20project"
            target="_blank"
            className="block bg-[#15803D] text-white p-4 rounded-2xl text-center font-bold text-sm hover:bg-green-700 transition-colors"
          >
            💬 WhatsApp Support
          </a>
        </div>
      </div>
    </div>
  );
}
