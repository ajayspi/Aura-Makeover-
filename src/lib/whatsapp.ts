// Mock WhatsApp Integration Service (Razorpay / Twilio / Wati API wrapper)

export type WhatsAppTemplate = 'booking_confirmed' | 'pre_install_reminder' | 'install_started' | 'install_complete';

interface WhatsAppPayload {
  phone: string;
  template: WhatsAppTemplate;
  variables: Record<string, string>;
}

export async function sendWhatsAppNotification(payload: WhatsAppPayload) {
  // In production, this would call Razorpay WhatsApp API or Wati API
  console.log(`[WhatsApp API] Sending ${payload.template} to ${payload.phone}`);

  let messageBody = "";

  switch (payload.template) {
    case 'booking_confirmed':
      messageBody = `Hi ${payload.variables.name}! Your AuroMakeover is confirmed. Order ID: ${payload.variables.orderId}. Total: ₹${payload.variables.price}. We will see you on ${payload.variables.date}.`;
      break;
    case 'pre_install_reminder':
      messageBody = `Hi ${payload.variables.name}! Your AuroMakeover is scheduled for tomorrow at ${payload.variables.time}. Your tech is ${payload.variables.techName} (${payload.variables.techPhone}).`;
      break;
    case 'install_started':
      messageBody = `Installation started! ${payload.variables.techName} has arrived at your home. ETA: ${payload.variables.eta} mins remaining. Track here: ${payload.variables.trackingUrl}`;
      break;
    case 'install_complete':
      messageBody = `Installation complete! Here are your before/after photos: ${payload.variables.photosUrl}. Rate experience to activate warranty: ${payload.variables.ratingUrl}`;
      break;
  }

  console.log(`[WhatsApp API] Body: ${messageBody}`);

  // Return mock success
  return { success: true, messageId: "wa_" + Math.random().toString(36).substring(7) };
}
