import { NextRequest, NextResponse } from 'next/server';
import { attemptTransition, getAvailableTransitions, isValidStage } from '@/lib/services/LifecycleStateMachine';
import { EventBus } from '@/lib/infrastructure/EventBus';

/**
 * REST API v1 — Leads Lifecycle Endpoint
 * 
 * GET  /api/v1/leads              — List leads (filterable by stage, score tier, agent)
 * POST /api/v1/leads              — Trigger lifecycle state transition
 * 
 * This endpoint enforces the State Machine guard conditions.
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

    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);
    const stage = searchParams.get('stage');
    const agentId = searchParams.get('agentId');

    const where: any = {};
    if (stage) where.status = stage;
    if (agentId) where.assignedAgentId = agentId;

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          assignedAgent: { select: { id: true, name: true, phone: true } },
          society: { select: { societyName: true, unitType: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.lead.count({ where }),
    ]);

    return NextResponse.json({
      data: leads,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('[API v1] Leads list error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * POST /api/v1/leads
 * Body: { customerId, trigger, context }
 * 
 * Executes a lifecycle state transition with full guard validation.
 */
export async function POST(request: NextRequest) {
  try {
    const prisma = await getPrisma();
    const body = await request.json();

    const { customerId, trigger, context = {} } = body;

    if (!customerId || !trigger) {
      return NextResponse.json({ error: 'customerId and trigger are required' }, { status: 400 });
    }

    // 1. Fetch current customer state
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      select: { id: true, lifecycleStage: true, name: true, phone: true },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // 2. Attempt transition via the State Machine
    const result = attemptTransition(customer.lifecycleStage, trigger, context);

    if (!result.success) {
      return NextResponse.json({
        error: result.error,
        failedGuards: result.failedGuards,
        availableTransitions: getAvailableTransitions(customer.lifecycleStage).map(t => ({
          trigger: t.trigger,
          targetStage: t.to,
          guards: t.guards.map(g => g.field),
        })),
      }, { status: 422 });
    }

    // 3. Apply transition in database
    const oldStage = customer.lifecycleStage;
    const newStage = result.newStage!;

    await prisma.customer.update({
      where: { id: customerId },
      data: {
        lifecycleStage: newStage,
        lastActivityAt: new Date(),
        timeline: {
          create: {
            eventType: 'STAGE_CHANGE',
            channel: 'SYSTEM',
            summary: `Lifecycle: ${oldStage} → ${newStage} (trigger: ${trigger})`,
            actorName: context.actorName || 'System',
            metadata: { trigger, oldStage, newStage, context },
          }
        }
      },
    });

    // 4. Emit domain event (async, non-blocking)
    EventBus.emitEvent('lead.status_updated', {
      leadId: customerId,
      oldStatus: oldStage,
      newStatus: newStage,
    });

    return NextResponse.json({
      success: true,
      transition: { from: oldStage, to: newStage, trigger },
      availableNext: getAvailableTransitions(newStage).map(t => ({
        trigger: t.trigger,
        targetStage: t.to,
      })),
    });
  } catch (error) {
    console.error('[API v1] Lead transition error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
