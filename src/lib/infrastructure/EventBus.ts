import { EventEmitter } from 'events';

// In a full Google-scale production environment, this would interface with 
// Google Cloud Pub/Sub or Kafka. For Next.js serverless, we use an in-memory 
// EventEmitter as our Phase 1 Domain Event Bus.

type EventMap = {
  'lead.created': { leadId: string; externalCrmId?: string | null; customerName: string; phone: string; };
  'lead.status_updated': { leadId: string; oldStatus: string; newStatus: string; };
  'order.escrow_released': { orderId: string; stage: string; amount: number; };
  'inventory.low_stock': { sku: string; dyeLot: string; remainingMeters: number; };
};

class DomainEventBus extends EventEmitter {
  public emitEvent<K extends keyof EventMap>(eventName: K, payload: EventMap[K]): boolean {
    console.log(`[EventBus] Emitting event: ${eventName}`, payload);
    return this.emit(eventName, payload);
  }

  public onEvent<K extends keyof EventMap>(eventName: K, listener: (payload: EventMap[K]) => void): this {
    return this.on(eventName, listener);
  }
}

// Singleton instance
export const EventBus = new DomainEventBus();
