/**
 * Communication Orchestrator
 * 
 * Routes messages to the correct channel (WhatsApp, SMS, Email, Push)
 * based on event type and customer preferences.
 * 
 * Phase 1: Template rendering + channel routing logic (no external API calls yet).
 * Phase 2: Wire to Gupshup/Twilio WhatsApp, AWS SES email, Firebase Push.
 */

export type Channel = 'WHATSAPP' | 'SMS' | 'EMAIL' | 'PUSH' | 'IN_APP';

export interface MessagePayload {
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  templateSlug: string;
  variables: Record<string, string>;
  channel?: Channel; // Override auto-routing
}

export interface RoutedMessage {
  channel: Channel;
  to: string; // phone or email
  subject?: string;
  body: string;
  templateSlug: string;
}

// Channel priority per event type
const CHANNEL_PRIORITY: Record<string, Channel[]> = {
  'lead.welcome':         ['WHATSAPP', 'SMS'],
  'quote.sent':           ['WHATSAPP', 'EMAIL', 'SMS'],
  'payment.reminder':     ['WHATSAPP', 'SMS', 'PUSH'],
  'install.update':       ['PUSH', 'WHATSAPP', 'SMS'],
  'qa.signoff_request':   ['WHATSAPP', 'SMS'],
  'warranty.activated':   ['EMAIL', 'WHATSAPP', 'SMS'],
  'warranty.claim_update':['WHATSAPP', 'PUSH', 'EMAIL'],
  'nurture.drip':         ['WHATSAPP'],
  'referral.reward':      ['WHATSAPP', 'SMS'],
  'default':              ['WHATSAPP', 'SMS'],
};

// Built-in template registry (Phase 1 — in-memory, Phase 2 — from DB)
const TEMPLATES: Record<string, { subject?: string; body: string }> = {
  'lead_welcome': {
    body: 'Hi {{name}}! 👋 Welcome to AuroMakeover. We transform homes in 48 hours — zero dust, zero civil work. Reply "QUOTE" to get an instant estimate for your flat.',
  },
  'quote_sent': {
    subject: 'Your AuroMakeover Estimate — {{amount}}',
    body: 'Hi {{name}}, your personalized estimate for {{society}} is ready:\n\n💰 Total: {{amount}} (incl. GST)\n🛡️ 10/60/30 Escrow Protection\n📅 48-hour installation guarantee\n\nReply "BOOK" to lock your slot with a 10% deposit.',
  },
  'payment_reminder_10': {
    body: 'Hi {{name}}, your booking deposit of {{amount}} is pending. Pay now to secure your installation slot: {{paymentLink}}',
  },
  'payment_reminder_60': {
    body: 'Hi {{name}}, your material release payment of {{amount}} is due. Once paid, we begin custom fabrication. Pay here: {{paymentLink}}',
  },
  'install_started': {
    body: '🏠 {{name}}, your AuroMakeover installation has begun! Technician {{techName}} is on-site. We\'ll send you live updates.',
  },
  'qa_signoff': {
    body: '✅ {{name}}, installation is complete! Please inspect the work and sign off to release the final 30% payment. Your 2-year warranty activates immediately.',
  },
  'warranty_activated': {
    subject: 'Your 2-Year AuroMakeover Warranty Certificate',
    body: 'Congratulations {{name}}! 🎉\n\nYour AuroMakeover warranty is now ACTIVE.\n📋 Project: {{projectId}}\n🏠 Property: {{society}}, {{unit}}\n📅 Valid until: {{expiryDate}}\n\nKeep this for your records. File claims anytime at aura-makeover.vercel.app/my/warranty',
  },
  'nurture_day1': {
    body: 'Did you know? AuroMakeover uses Italian-imported wallpapers that last 15+ years. No peeling, no fading. See our portfolio: https://aura-makeover.vercel.app/projects 🇮🇹',
  },
  'nurture_day3': {
    body: '{{name}}, flats in {{society}} start at just {{estimatedPrice}}. That includes wallpapers, louvers, AND installation. Zero hidden costs. 💰',
  },
  'nurture_day5': {
    body: 'Free swatch van visit — see 200+ textures and designs in YOUR flat before deciding. Book your slot: https://aura-makeover.vercel.app/#estimator 🚐',
  },
  'nurture_day7': {
    body: '⏰ Last chance {{name}}! Our 10% early-bird discount expires today. Reply "BOOK" or call us to lock in your price.',
  },
  'referral_reward': {
    body: '🎁 {{name}}, your friend {{referredName}} just booked with AuroMakeover using your referral! You\'ve earned ₹2,000 off your next project. Use code: {{referralCode}}',
  },
};

/**
 * Render a template with variable substitution.
 */
export function renderTemplate(templateSlug: string, variables: Record<string, string>): { subject?: string; body: string } | null {
  const template = TEMPLATES[templateSlug];
  if (!template) return null;

  let body = template.body;
  let subject = template.subject;

  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`;
    body = body.split(placeholder).join(value);
    if (subject) subject = subject.split(placeholder).join(value);
  }

  return { subject, body };
}

/**
 * Route a message to the appropriate channel(s).
 * Returns an array of RoutedMessages ready for dispatch.
 */
export function routeMessage(payload: MessagePayload): RoutedMessage[] {
  const rendered = renderTemplate(payload.templateSlug, payload.variables);
  if (!rendered) {
    console.error(`[Orchestrator] Template not found: ${payload.templateSlug}`);
    return [];
  }

  // Determine channel priority
  const eventPrefix = payload.templateSlug.split('_')[0]; // e.g. "lead", "quote", "payment"
  const priorities = CHANNEL_PRIORITY[`${eventPrefix}.${payload.templateSlug.split('_').slice(1).join('_')}`]
    || CHANNEL_PRIORITY[payload.templateSlug]
    || CHANNEL_PRIORITY['default'];

  // If explicit channel override, use only that
  if (payload.channel) {
    return [{
      channel: payload.channel,
      to: payload.channel === 'EMAIL' ? (payload.customerEmail || payload.customerPhone) : payload.customerPhone,
      subject: rendered.subject,
      body: rendered.body,
      templateSlug: payload.templateSlug,
    }];
  }

  // Otherwise, route to primary channel only (Phase 2: multi-channel fan-out)
  const primaryChannel = priorities[0];
  return [{
    channel: primaryChannel,
    to: primaryChannel === 'EMAIL' ? (payload.customerEmail || payload.customerPhone) : payload.customerPhone,
    subject: rendered.subject,
    body: rendered.body,
    templateSlug: payload.templateSlug,
  }];
}

import { AiSensyService } from './AiSensyService';

/**
 * Dispatch a message (Phase 1: console log, Phase 2: real API calls).
 */
export async function dispatchMessage(message: RoutedMessage, rawVariables: Record<string, string> = {}): Promise<boolean> {
  console.log(`[Orchestrator] Dispatching via ${message.channel} to ${message.to}`);
  console.log(`  Template: ${message.templateSlug}`);
  
  if (message.channel === 'WHATSAPP') {
    // AiSensy expects ordered parameters (e.g., ["Arjun", "₹85,000"]) rather than named keys.
    // We extract the values from our named variables payload to pass to AiSensy.
    const orderedParams = Object.values(rawVariables);
    
    // Fallback username if name isn't provided in variables
    const userName = rawVariables.name || 'Customer';

    return await AiSensyService.sendTemplateMessage(
      message.to,
      message.templateSlug, // This must match the Campaign Name in AiSensy dashboard exactly
      userName,
      orderedParams
    );
  }

  // Phase 2: Add other channel dispatchers (SMS/Email)
  // switch (message.channel) {
  //   case 'SMS': return await twillioSend(message);
  //   case 'EMAIL': return await sesSend(message);
  // }

  return true;
}
