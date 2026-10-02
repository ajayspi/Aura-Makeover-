import { EventBus } from './EventBus';
import { routeMessage, dispatchMessage } from '../services/CommunicationOrchestrator';
import { calculateLeadScore, getAutomationAction } from '../services/LeadScoringEngine';

// Prevent duplicate registrations during Next.js HMR
let subscribersRegistered = false;

/**
 * Bootstraps the Domain Event Bus listeners.
 * Bridges events to the Communication Orchestrator and Lead Scoring Engine.
 */
export function registerEventSubscribers() {
  if (subscribersRegistered) return;
  subscribersRegistered = true;

  console.log('[EventSubscribers] Registering domain event listeners...');

  // 1. Lead Created -> Welcome Message & Initial Scoring
  EventBus.onEvent('lead.created', async (payload) => {
    // A. Score the lead (simulated input based on quiz properties)
    // In reality, you'd fetch the full Lead/Customer record from Prisma here
    const score = calculateLeadScore({
      quizCompleted: true,
      estimatorUsed: false,
      pageVisits: 2,
      whatsappResponded: false,
      vanVisitDone: false,
      societyMentioned: false,
      budgetProvided: true,
      timelineMentioned: false,
      callbackRequested: false,
      pricingPageVisits: 1,
      estimatedValue: 0,
      unitType: '3BHK',
      isPremiumSociety: false,
      isRepeatCustomer: false,
      isReferred: false,
    });

    console.log(`[LeadScoringEngine] Scored lead ${payload.leadId}: ${score.compositeScore} (${score.tier}-Tier)`);
    const action = getAutomationAction(score.tier);
    console.log(`[LeadScoringEngine] Automation trigger: ${action.action}`);

    // B. Orchestrate Communication
    const messages = routeMessage({
      customerId: payload.leadId,
      customerName: payload.customerName,
      customerPhone: payload.phone,
      templateSlug: 'lead_welcome',
      variables: {
        name: payload.customerName.split(' ')[0], // First name
      },
    });

    for (const msg of messages) {
      await dispatchMessage(msg);
    }
  });

  // 2. Lead Status Updated -> Lifecycle communications
  EventBus.onEvent('lead.status_updated', async (payload) => {
    if (payload.newStatus === 'QUOTE_SENT') {
      const messages = routeMessage({
        customerId: payload.leadId,
        customerName: 'Customer', // Would fetch real name from DB
        customerPhone: '+919999999999', // Would fetch real phone from DB
        templateSlug: 'quote_sent',
        variables: {
          name: 'Customer',
          society: 'Your Society',
          amount: '₹85,000',
        },
      });
      for (const msg of messages) {
        await dispatchMessage(msg);
      }
    }
  });

  // 3. Order Escrow Released -> Notifications & Operations
  EventBus.onEvent('order.escrow_released', async (payload) => {
    console.log(`[EscrowService] Escrow released for ${payload.orderId}. Stage: ${payload.stage}, Amount: ₹${payload.amount}`);
    // If it's the 60% material release, trigger the warehouse
    if (payload.stage === 'MATERIAL_60') {
      console.log(`[WarehouseService] Triggering material fabrication for order ${payload.orderId}`);
    }
  });

  // 4. Inventory Low Stock Alert -> Internal Ops notification
  EventBus.onEvent('inventory.low_stock', async (payload) => {
    console.log(`[InventoryService] ALERT: Low stock for SKU ${payload.sku} (${payload.remainingMeters}m remaining in batch ${payload.dyeLot})`);
  });
}
