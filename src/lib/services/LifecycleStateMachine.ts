/**
 * Customer Lifecycle State Machine
 * 
 * Deterministic state transitions with guard conditions.
 * Every customer transition MUST go through this module.
 * This is the single source of truth for what transitions are legal.
 */

export type LifecycleStage =
  | 'ANONYMOUS'
  | 'LEAD_CAPTURED'
  | 'CONTACTED'
  | 'VAN_DISPATCHED'
  | 'MEASURED'
  | 'QUOTE_SENT'
  | 'NEGOTIATING'
  | 'DEAL_WON'
  | 'DEAL_LOST'
  | 'MATERIAL_ORDERED'
  | 'INSTALL_SCHEDULED'
  | 'INSTALLING'
  | 'QA_PENDING'
  | 'COMPLETED'
  | 'WARRANTY_ACTIVE'
  | 'CLAIM_OPEN'
  | 'CLAIM_RESOLVED'
  | 'WARRANTY_EXPIRED'
  | 'REACTIVATION_TARGET'
  | 'NURTURE_SEQUENCE';

export interface TransitionGuard {
  field: string;
  condition: string; // 'exists' | 'equals' | 'gt' | 'true'
  value?: unknown;
  message: string;
}

interface TransitionRule {
  from: LifecycleStage;
  to: LifecycleStage;
  trigger: string;
  guards: TransitionGuard[];
}

// ═══════════════════════════════════════════════════════════
// TRANSITION TABLE — The heart of the platform
// ═══════════════════════════════════════════════════════════

const TRANSITIONS: TransitionRule[] = [
  {
    from: 'ANONYMOUS', to: 'LEAD_CAPTURED',
    trigger: 'quiz_submit',
    guards: [{ field: 'sessionId', condition: 'exists', message: 'Session ID required for lead capture' }]
  },
  {
    from: 'LEAD_CAPTURED', to: 'CONTACTED',
    trigger: 'agent_contact',
    guards: [{ field: 'assignedAgentId', condition: 'exists', message: 'Agent must be assigned before contacting' }]
  },
  {
    from: 'CONTACTED', to: 'VAN_DISPATCHED',
    trigger: 'van_scheduled',
    guards: [{ field: 'vanId', condition: 'exists', message: 'Van must be assigned' }]
  },
  {
    from: 'VAN_DISPATCHED', to: 'MEASURED',
    trigger: 'measurement_complete',
    guards: [{ field: 'moistureReading', condition: 'exists', message: 'Moisture reading required' }]
  },
  {
    from: 'MEASURED', to: 'QUOTE_SENT',
    trigger: 'quote_generated',
    guards: [{ field: 'quoteAmount', condition: 'gt', value: 0, message: 'Quote amount must be positive' }]
  },
  {
    from: 'QUOTE_SENT', to: 'NEGOTIATING',
    trigger: 'customer_counter',
    guards: []
  },
  {
    from: 'NEGOTIATING', to: 'QUOTE_SENT',
    trigger: 'revised_quote',
    guards: [{ field: 'quoteAmount', condition: 'gt', value: 0, message: 'Revised quote amount must be positive' }]
  },
  {
    from: 'QUOTE_SENT', to: 'DEAL_WON',
    trigger: 'deposit_received',
    guards: [{ field: 'depositPaid', condition: 'true', message: '10% deposit must be confirmed paid' }]
  },
  {
    from: 'QUOTE_SENT', to: 'DEAL_LOST',
    trigger: 'customer_declined',
    guards: []
  },
  {
    from: 'DEAL_WON', to: 'MATERIAL_ORDERED',
    trigger: 'material_escrow_received',
    guards: [{ field: 'materialEscrowPaid', condition: 'true', message: '60% material escrow must be confirmed' }]
  },
  {
    from: 'MATERIAL_ORDERED', to: 'INSTALL_SCHEDULED',
    trigger: 'install_scheduled',
    guards: [
      { field: 'technicianId', condition: 'exists', message: 'Technician must be assigned' },
      { field: 'scheduledDate', condition: 'exists', message: 'Installation date must be set' }
    ]
  },
  {
    from: 'INSTALL_SCHEDULED', to: 'INSTALLING',
    trigger: 'tech_arrived',
    guards: [{ field: 'technicianId', condition: 'exists', message: 'Technician must check in' }]
  },
  {
    from: 'INSTALLING', to: 'QA_PENDING',
    trigger: 'install_photos_submitted',
    guards: [{ field: 'qaPhotosCount', condition: 'gt', value: 0, message: 'At least one QA photo required' }]
  },
  {
    from: 'QA_PENDING', to: 'COMPLETED',
    trigger: 'customer_signoff',
    guards: [{ field: 'customerSigned', condition: 'true', message: 'Customer signature required' }]
  },
  {
    from: 'COMPLETED', to: 'WARRANTY_ACTIVE',
    trigger: 'warranty_activated',
    guards: [{ field: 'warrantyId', condition: 'exists', message: 'Warranty vault record must exist' }]
  },
  {
    from: 'WARRANTY_ACTIVE', to: 'CLAIM_OPEN',
    trigger: 'claim_filed',
    guards: [{ field: 'claimDescription', condition: 'exists', message: 'Claim description required' }]
  },
  {
    from: 'CLAIM_OPEN', to: 'CLAIM_RESOLVED',
    trigger: 'claim_resolved',
    guards: []
  },
  {
    from: 'CLAIM_RESOLVED', to: 'WARRANTY_ACTIVE',
    trigger: 'back_to_active',
    guards: []
  },
  {
    from: 'WARRANTY_ACTIVE', to: 'WARRANTY_EXPIRED',
    trigger: 'warranty_expired',
    guards: []
  },
  {
    from: 'WARRANTY_EXPIRED', to: 'REACTIVATION_TARGET',
    trigger: 'mark_for_reactivation',
    guards: []
  },
  {
    from: 'DEAL_LOST', to: 'NURTURE_SEQUENCE',
    trigger: 'enroll_nurture',
    guards: []
  },
  {
    from: 'NURTURE_SEQUENCE', to: 'LEAD_CAPTURED',
    trigger: 're_engagement',
    guards: [{ field: 'sessionId', condition: 'exists', message: 'New session required for re-engagement' }]
  },
];

// ═══════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════

export interface TransitionResult {
  success: boolean;
  newStage?: LifecycleStage;
  error?: string;
  failedGuards?: string[];
}

/**
 * Get all legal transitions from a given stage.
 */
export function getAvailableTransitions(currentStage: LifecycleStage): TransitionRule[] {
  return TRANSITIONS.filter(t => t.from === currentStage);
}

/**
 * Attempt to transition a customer to a new lifecycle stage.
 * Returns success/failure with guard violation details.
 */
export function attemptTransition(
  currentStage: LifecycleStage,
  trigger: string,
  context: Record<string, unknown>
): TransitionResult {
  // 1. Find the matching rule
  const rule = TRANSITIONS.find(t => t.from === currentStage && t.trigger === trigger);

  if (!rule) {
    return {
      success: false,
      error: `No transition found from "${currentStage}" with trigger "${trigger}". Available triggers: ${
        getAvailableTransitions(currentStage).map(t => t.trigger).join(', ') || 'none'
      }`
    };
  }

  // 2. Evaluate all guard conditions
  const failedGuards: string[] = [];

  for (const guard of rule.guards) {
    const value = context[guard.field];

    switch (guard.condition) {
      case 'exists':
        if (value === undefined || value === null || value === '') {
          failedGuards.push(guard.message);
        }
        break;
      case 'true':
        if (value !== true) {
          failedGuards.push(guard.message);
        }
        break;
      case 'gt':
        if (typeof value !== 'number' || value <= (guard.value as number)) {
          failedGuards.push(guard.message);
        }
        break;
      case 'equals':
        if (value !== guard.value) {
          failedGuards.push(guard.message);
        }
        break;
    }
  }

  if (failedGuards.length > 0) {
    return { success: false, error: 'Guard conditions not met', failedGuards };
  }

  // 3. Transition approved
  return { success: true, newStage: rule.to };
}

/**
 * Validate whether a direct stage assignment is legal.
 * Used for admin overrides and CRM sync.
 */
export function isValidStage(stage: string): stage is LifecycleStage {
  const ALL_STAGES: string[] = [
    'ANONYMOUS', 'LEAD_CAPTURED', 'CONTACTED', 'VAN_DISPATCHED', 'MEASURED',
    'QUOTE_SENT', 'NEGOTIATING', 'DEAL_WON', 'DEAL_LOST', 'MATERIAL_ORDERED',
    'INSTALL_SCHEDULED', 'INSTALLING', 'QA_PENDING', 'COMPLETED',
    'WARRANTY_ACTIVE', 'CLAIM_OPEN', 'CLAIM_RESOLVED', 'WARRANTY_EXPIRED',
    'REACTIVATION_TARGET', 'NURTURE_SEQUENCE'
  ];
  return ALL_STAGES.includes(stage);
}
