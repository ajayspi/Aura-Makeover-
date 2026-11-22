import { NextRequest, NextResponse } from 'next/server';
import { assignAgent } from '@/lib/lead-assign';
import { EventBus } from '@/lib/infrastructure/EventBus';
import { prisma } from '@/lib/prisma';

async function getPrisma() {
  return prisma;
}

interface EstimatorIntentBody {
  society?: string;
  citySlug?: string;
  widthFt?: number;
  heightFt?: number;
  quality?: string;
  total?: number;
  sessionId?: string;
  customerName?: string;
  phone?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as EstimatorIntentBody;
    const prisma = await getPrisma();
    const { agent } = await assignAgent(prisma, {
      citySlug: body.citySlug,
      society: body.society,
    });

    // Lead capture (R11): real name + phone when provided; keep legacy fallbacks
    const customerName = body.customerName?.trim() || 'Walk-in (estimator)';
    const phone = body.phone?.trim() || 'UNKNOWN';

    const detail = {
      widthFt: body.widthFt,
      heightFt: body.heightFt,
      quality: body.quality,
      total: body.total,
    };

    const lead = await prisma.lead.create({
      data: {
        customerName,
        phone,
        source: 'estimator',
        quizAnswers: detail,
        sessionId: body.sessionId || undefined,
        assignedAgentId: agent ? agent.id : null,
        routedAt: agent ? new Date() : null,
        status: 'NEW',
      },
    });

    const typedLead = lead as { id: string; customerName: string; phone: string };

    // [Enterprise Architecture] Fire-and-forget Domain Event
    EventBus.emitEvent('lead.created', {
      leadId: typedLead.id,
      customerName: typedLead.customerName,
      phone: typedLead.phone,
    });

    return NextResponse.json({
      success: true,
      leadId: typedLead.id,
      assignedAgent: agent ? { id: agent.id, name: agent.name } : null,
      assignedWhatsapp: agent ? agent.phone : null,
    });
  } catch (error) {
    console.error('Estimator intent error:', error);
    return NextResponse.json({ error: 'Failed to record estimator intent' }, { status: 500 });
  }
}
