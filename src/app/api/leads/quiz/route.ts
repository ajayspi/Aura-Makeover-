import { NextRequest, NextResponse } from 'next/server';
import { assignAgent } from '@/lib/lead-assign';

// Dynamic Prisma client for Prisma 8 compatibility
let prismaClient: {
  lead: {
    upsert: (args: { where: { sessionId: string }; update: unknown; create: unknown }) => Promise<unknown>;
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

interface QuizLeadBody {
  answers: Record<string, unknown>;
  sessionId: string;
  society?: string;
  citySlug?: string;
  customerName?: string;
  phone?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as QuizLeadBody;
    const { answers, sessionId, society, citySlug } = body;

    if (!answers || !sessionId) {
      return NextResponse.json({ error: 'answers and sessionId required' }, { status: 400 });
    }

    // Lead capture (R11): real name + phone when provided; keep legacy fallbacks for old clients
    const customerName = body.customerName?.trim() || 'Walk-in (quiz)';
    const phone = body.phone?.trim() || 'UNKNOWN';

    const prisma = await getPrisma();
    const { agent } = await assignAgent(prisma, { citySlug, society });

    const lead = await prisma.lead.upsert({
      where: { sessionId },
      update: {
        quizAnswers: answers,
        customerName,
        phone,
        source: 'quiz',
        assignedAgentId: agent ? agent.id : null,
        routedAt: agent ? new Date() : null,
        status: 'NEW',
      },
      create: {
        sessionId,
        customerName,
        phone,
        quizAnswers: answers,
        source: 'quiz',
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
    console.error('Quiz lead upsert error:', error);
    return NextResponse.json({ error: 'Failed to save quiz lead' }, { status: 500 });
  }
}
