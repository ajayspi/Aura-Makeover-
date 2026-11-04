/**
 * AiSensy WhatsApp Business API Integration
 * 
 * Handles dispatching template and session messages via the AiSensy platform.
 * Requires AISENSY_API_KEY in the environment variables.
 */

interface AiSensyTemplatePayload {
  apiKey: string;
  campaignName: string;
  destination: string; // e.g. "919876543210" (no '+')
  userName: string;
  templateParams: string[]; // Ordered list of variables for the template
  source?: string;
  media?: {
    url: string;
    filename: string;
  };
}

export class AiSensyService {
  private static readonly API_URL = 'https://backend.aisensy.com/campaign/t1/api/v2';
  
  /**
   * Dispatches a pre-approved WhatsApp template via AiSensy.
   * 
   * @param destination Phone number with country code (e.g., "+919876543210")
   * @param campaignName The exact Template/Campaign Name created in the AiSensy Dashboard
   * @param userName Customer's name
   * @param templateParams Array of string variables to replace {{1}}, {{2}} in the template
   */
  static async sendTemplateMessage(
    destination: string,
    campaignName: string,
    userName: string,
    templateParams: string[] = []
  ): Promise<boolean> {
    const apiKey = process.env.AISENSY_API_KEY;
    
    if (!apiKey) {
      console.warn('[AiSensy] AISENSY_API_KEY is not set. Simulating message dispatch.');
      console.log(`[AiSensy SIMULATION] To: ${destination} | Campaign: ${campaignName} | Params: [${templateParams.join(', ')}]`);
      return true; // Return true in dev/simulation mode
    }

    // AiSensy requires the number without the '+' symbol
    const cleanDestination = destination.replace('+', '');

    const payload: AiSensyTemplatePayload = {
      apiKey,
      campaignName,
      destination: cleanDestination,
      userName,
      templateParams,
      source: 'AuroMakeover-Platform',
    };

    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[AiSensy] Failed to send message to ${cleanDestination}. Status: ${response.status}`, errorText);
        return false;
      }

      console.log(`[AiSensy] Successfully dispatched campaign '${campaignName}' to ${cleanDestination}`);
      return true;

    } catch (error) {
      console.error('[AiSensy] Network error during dispatch:', error);
      return false;
    }
  }

  /**
   * Generates a standardized, copyable text block for residents to paste into MyGate / NoBrokerHood
   */
  static generateMyGatePassText(booking: {
    society: string;
    flatNumber: string;
    date: string;
    slot: string;
    vehicleNo?: string;
    technicianName?: string;
  }): string {
    const vehicle = booking.vehicleNo || 'TS 09 UB 1234';
    const tech = booking.technicianName || 'Ramesh Kumar (Lead Finish Specialist)';

    return [
      `*AuroMakeover — Mobile Swatch Van Gate Pass*`,
      `----------------------------------------`,
      `Company: AuroMakeover Surface Architecture`,
      `Vehicle: ${vehicle}`,
      `Specialist: ${tech}`,
      `Society: ${booking.society} (Flat: ${booking.flatNumber})`,
      `Purpose: Pre-Measured Wall Consultation & Material Box`,
      `Slot: ${booking.date} [${booking.slot}]`,
      `----------------------------------------`,
      `Pre-approved by Resident. Please grant service entry.`,
    ].join('\n');
  }

  /**
   * Builds the direct WhatsApp booking URL for instant lead routing
   */
  static buildWhatsAppBookingUrl(booking: {
    customerName: string;
    phone: string;
    society: string;
    flatNumber: string;
    preferredDate: string;
    preferredSlot: string;
    finishTier?: string;
    wallDimensions?: string;
  }): string {
    const messageLines = [
      `*New Swatch Van Booking Request* 🚐`,
      ``,
      `*Name:* ${booking.customerName}`,
      `*Phone:* ${booking.phone}`,
      `*Society:* ${booking.society}`,
      `*Flat No:* ${booking.flatNumber}`,
      `*Preferred Date:* ${booking.preferredDate}`,
      `*Slot:* ${booking.preferredSlot}`,
      booking.finishTier ? `*Selected Finish:* ${booking.finishTier}` : '',
      booking.wallDimensions ? `*Wall Dimensions:* ${booking.wallDimensions}` : '',
      ``,
      `*Assigned Van:* TS 09 UB 1234 (Ramesh Kumar)`,
      `Please confirm dispatch slot and send driver contact details.`,
    ].filter(Boolean);

    const encoded = encodeURIComponent(messageLines.join('\n'));
    // WhatsApp concierge: 918555069441 (Fallback: 919700675637)
    return `https://wa.me/918555069441?text=${encoded}`;
  }
}
