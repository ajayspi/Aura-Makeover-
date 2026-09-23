import { NextRequest, NextResponse } from 'next/server';
import { assignAgent } from '@/lib/lead-assign';

// Dynamic Prisma client for Prisma 8 compatibility
let prismaClient: {
  lead: {
    create: (args: { data: unknown }) => Promise<unknown>;
    count: (args?: unknown) => Promise<unknown>;
  };
  saleAgent: { findMany: (args?: unknown) => Promise<unknown[]> };
} | null = null;

async function getPrisma() {
  if (!prismaClient) {
    const { PrismaClient } = await import('@prisma/client');
    prismaClient = new PrismaClient();
  }
  return prismaClient;
}

interface EstimatorIntentBody {
  society?: string;
  citySlug?: string;
  widthFt?: number;
  heightFt?: number;
  quality?: string;
  total?: number;
  sessionId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as EstimatorIntentBody;
    const prisma = await getPrisma();
    const { agent } = await assignAgent(prisma, {
      citySlug: body.citySlug,
      society: body.society,
    });

    const detail = {
      widthFt: body.widthFt,
      heightFt: body.heightFt,
      quality: body.quality,
      total: body.total,
    };

    const lead = await prisma.lead.create({
      data: {
        customerName: 'Walk-in (estimator)',
        phone: 'UNKNOWN',
        source: 'estimator',
        quizAnswers: detail,
        sessionId: body.sessionId || undefined,
        assignedAgentId: agent ? agent.id : null,
        routedAt: agent ? new Date() : null,
        status: 'NEW',
      },
    });

    return NextResponse.json({
      success: true,
      leadId: (lead as { id: string }).id,
      assignedAgent: agent ? { id: agent.id, name: agent.name } : null,
      assignedWhatsapp: agent ? agent.phone : null,
    });
  } catch (error) {
    console.error('Estimator intent error:', error);
    return NextResponse.json({ error: 'Failed to record estimator intent' }, { status: 500 });
  }
}
