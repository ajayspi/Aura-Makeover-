import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Dynamic Prisma client for Prisma 8 compatibility
let prismaClient: any = null;

async function getPrisma() {
  if (!prismaClient) {
    const { PrismaClient } = await import('@prisma/client');
    prismaClient = new PrismaClient();
  }
  return prismaClient;
}

/**
 * Inbound Webhook Endpoint
 * Allows external CRMs (Salesforce, HubSpot) to update AuroMakeover data securely.
 */
export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-auro-signature');
    const rawBody = await request.text();
    
    // In production, this comes from process.env.CRM_WEBHOOK_SECRET
    const WEBHOOK_SECRET = process.env.CRM_WEBHOOK_SECRET || 'dev-secret-key-do-not-use-in-prod';

    // 1. Verify Zero-Trust HMAC Signature
    if (!signature) {
      return NextResponse.json({ error: 'Missing Signature Header' }, { status: 401 });
    }

    const expectedSignature = `sha256=${crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex')}`;

    // Use constant-time comparison to prevent timing attacks
    if (signature.length !== expectedSignature.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return NextResponse.json({ error: 'Invalid Signature' }, { status: 403 });
    }

    // 2. Process Payload
    const payload = JSON.parse(rawBody);
    const { event, data } = payload;

    const prisma = await getPrisma();

    // 3. Route Event (Command Pattern)
    switch (event) {
      case 'crm.lead.status_changed':
        // The CRM updated the lead status (e.g. from NEW to CONTACTED)
        if (data.auroLeadId && data.newStatus) {
          await prisma.lead.update({
            where: { id: data.auroLeadId },
            data: { status: data.newStatus }
          });
        }
        break;

      case 'crm.lead.won':
        // The CRM marked the deal as Closed-Won. Time to create an Order!
        if (data.auroLeadId && data.amount) {
          // This is a complex transaction in reality: Lead -> Order -> Escrow initialization
          // For now, we update the lead status to WON.
          await prisma.lead.update({
            where: { id: data.auroLeadId },
            data: { status: 'WON' }
          });
        }
        break;

      default:
        console.warn(`[Inbound Webhook] Unhandled event type: ${event}`);
        return NextResponse.json({ message: 'Event ignored' }, { status: 200 });
    }

    return NextResponse.json({ success: true, message: 'Webhook processed' }, { status: 200 });
  } catch (error) {
    console.error('[Inbound Webhook] Error processing payload:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
