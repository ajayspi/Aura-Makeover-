import { NextRequest, NextResponse } from 'next/server';

/**
 * REST API v1 — Customers Endpoint
 * 
 * GET  /api/v1/customers        — List customers (paginated, filterable)
 * POST /api/v1/customers        — Create a new customer
 * 
 * Authentication: API Key (X-Api-Key header)
 * CRM-Agnostic: Standardized JSON payloads
 */

// Dynamic Prisma client
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
    const city = searchParams.get('city');
    const search = searchParams.get('search');
    const tier = searchParams.get('tier');

    // Build dynamic where clause
    const where: any = {};
    if (stage) where.lifecycleStage = stage;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (tier) {
      where.score = { tier };
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: {
          addresses: { where: { isPrimary: true }, take: 1 },
          score: true,
          tags: true,
          _count: { select: { timeline: true } },
        },
        orderBy: { lastActivityAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.customer.count({ where }),
    ]);

    return NextResponse.json({
      data: customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[API v1] Customer list error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const prisma = await getPrisma();
    const body = await request.json();

    const { name, phone, email, city, society, tower, unit, utmSource, utmCampaign, externalCrmId, preferences } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'name and phone are required' }, { status: 400 });
    }

    // Generate referral code: AURO-XXXX
    const referralCode = `AURO-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const customer = await prisma.customer.create({
      data: {
        name,
        phone,
        email: email || null,
        lifecycleStage: 'LEAD_CAPTURED',
        referralCode,
        utmSource: utmSource || null,
        utmCampaign: utmCampaign || null,
        externalCrmId: externalCrmId || null,
        preferences: preferences || null,
        addresses: city ? {
          create: {
            city,
            society: society || null,
            tower: tower || null,
            unit: unit || null,
            isPrimary: true,
          }
        } : undefined,
        timeline: {
          create: {
            eventType: 'SYSTEM',
            channel: 'WEB',
            summary: `Customer created via API. Stage: LEAD_CAPTURED`,
            actorName: 'System',
          }
        }
      },
      include: {
        addresses: true,
        score: true,
        tags: true,
      }
    });

    return NextResponse.json({ data: customer }, { status: 201 });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Customer with this phone already exists' }, { status: 409 });
    }
    console.error('[API v1] Customer create error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
