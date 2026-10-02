import { NextRequest, NextResponse } from 'next/server';

/**
 * REST API v1 — Analytics Endpoint
 * 
 * GET /api/v1/analytics?type=pipeline|revenue|conversion|agents
 * 
 * Returns pre-computed analytics for dashboards and investor decks.
 */

let prismaClient: any = null;
async function getPrisma() {
  if (!prismaClient) {
    const { PrismaClient } = await import('@prisma/client');
    prismaClient = new PrismaClient();
  }
  return prismaClient;
}

export async function GET(request: NextRequest) {
  try {
    const prisma = await getPrisma();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'pipeline';

    switch (type) {
      case 'pipeline': {
        // Lead pipeline by stage
        const stages = ['NEW', 'WHATSAPP_SENT', 'VAN_DISPATCHED', 'MEASURED', 'QUOTE_LOCKED', 'WON', 'LOST'];
        const pipeline = await Promise.all(
          stages.map(async (status) => ({
            stage: status,
            count: await prisma.lead.count({ where: { status } }),
          }))
        );
        const totalLeads = pipeline.reduce((sum, s) => sum + s.count, 0);
        const wonCount = pipeline.find(s => s.stage === 'WON')?.count || 0;
        const conversionRate = totalLeads > 0 ? ((wonCount / totalLeads) * 100).toFixed(1) : '0.0';

        return NextResponse.json({
          data: {
            pipeline,
            summary: { totalLeads, wonCount, conversionRate: `${conversionRate}%` },
          },
        });
      }

      case 'revenue': {
        // Revenue by month (from Orders)
        const orders = await prisma.order.findMany({
          where: { escrowStage: { not: 'DEPOSIT_PENDING' } },
          select: { totalAmount: true, createdAt: true },
          orderBy: { createdAt: 'asc' },
        });

        // Group by month
        const monthlyRevenue: Record<string, number> = {};
        for (const order of orders) {
          const monthKey = new Date(order.createdAt).toISOString().slice(0, 7); // YYYY-MM
          monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + order.totalAmount;
        }

        const totalRevenue = orders.reduce((sum: number, o: any) => sum + o.totalAmount, 0);
        const avgDealSize = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

        return NextResponse.json({
          data: {
            monthlyRevenue: Object.entries(monthlyRevenue).map(([month, amount]) => ({ month, amount })),
            summary: {
              totalRevenue,
              totalOrders: orders.length,
              avgDealSize,
            },
          },
        });
      }

      case 'conversion': {
        // Funnel: Lead → Contacted → Measured → Quoted → Won
        const funnel = await Promise.all([
          prisma.lead.count(),
          prisma.lead.count({ where: { status: { in: ['WHATSAPP_SENT', 'VAN_DISPATCHED', 'MEASURED', 'QUOTE_LOCKED', 'WON'] } } }),
          prisma.lead.count({ where: { status: { in: ['MEASURED', 'QUOTE_LOCKED', 'WON'] } } }),
          prisma.lead.count({ where: { status: { in: ['QUOTE_LOCKED', 'WON'] } } }),
          prisma.lead.count({ where: { status: 'WON' } }),
        ]);

        return NextResponse.json({
          data: {
            funnel: [
              { stage: 'All Leads', count: funnel[0] },
              { stage: 'Contacted', count: funnel[1] },
              { stage: 'Measured', count: funnel[2] },
              { stage: 'Quoted', count: funnel[3] },
              { stage: 'Won', count: funnel[4] },
            ],
          },
        });
      }

      case 'agents': {
        // Agent leaderboard
        const agents = await prisma.salesAgent.findMany({
          where: { isActive: true },
          include: {
            _count: { select: { leads: true } },
            leads: {
              where: { status: 'WON' },
              select: { id: true },
            },
          },
        });

        const leaderboard = agents.map((agent: any) => ({
          id: agent.id,
          name: agent.name,
          totalLeads: agent._count.leads,
          dealsWon: agent.leads.length,
          winRate: agent._count.leads > 0
            ? `${((agent.leads.length / agent._count.leads) * 100).toFixed(0)}%`
            : '0%',
        })).sort((a: any, b: any) => b.dealsWon - a.dealsWon);

        return NextResponse.json({ data: { leaderboard } });
      }

      default:
        return NextResponse.json({ error: `Unknown analytics type: ${type}. Use: pipeline, revenue, conversion, agents` }, { status: 400 });
    }
  } catch (error) {
    console.error('[API v1] Analytics error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
