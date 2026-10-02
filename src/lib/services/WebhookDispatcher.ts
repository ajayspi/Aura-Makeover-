import crypto from 'crypto';

/**
 * Enterprise Webhook Dispatcher
 * Securely signs and dispatches JSON payloads to external CRMs (Salesforce, HubSpot, Zoho).
 */
export class WebhookDispatcher {
  
  /**
   * Dispatches a signed webhook to a target URL.
   * @param targetUrl The external CRM webhook endpoint
   * @param secret The pre-shared secret for HMAC signing
   * @param event The event type (e.g. 'lead.created')
   * @param data The JSON payload
   */
  static async dispatch(targetUrl: string, secret: string, event: string, data: any): Promise<boolean> {
    const payload = JSON.stringify({
      event,
      timestamp: new Date().toISOString(),
      data
    });

    // Generate cryptographic signature (Zero-Trust Security Principle)
    const signature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auro-Signature': `sha256=${signature}`,
          'User-Agent': 'AuroMakeover-Enterprise-Webhook-Dispatcher/1.0'
        },
        body: payload,
      });

      if (!response.ok) {
        console.error(`[WebhookDispatcher] Failed to dispatch to ${targetUrl}. Status: ${response.status}`);
        // In a true Google-scale architecture, this would throw to a Dead Letter Queue (DLQ) for retries.
        return false;
      }

      console.log(`[WebhookDispatcher] Successfully dispatched ${event} to ${targetUrl}`);
      return true;

    } catch (error) {
      console.error(`[WebhookDispatcher] Network error dispatching to ${targetUrl}`, error);
      return false;
    }
  }
}
