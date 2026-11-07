import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Browser / Public Client
let supabaseInstance: SupabaseClient | null = null;

export function _resetClientForTesting() {
  supabaseInstance = null;
}

export function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!url || !anonKey) {
    if (typeof window !== 'undefined') {
      console.warn('[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    }
    return null;
  }
  supabaseInstance = createClient(url, anonKey);
  return supabaseInstance;
}

// Server-side Admin Client (Service Role for bypass RLS in trusted server routes)
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!url || !serviceRoleKey) {
    console.warn('[Supabase Admin] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
    return null;
  }
  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export interface SupabaseLeadPayload {
  id?: string;
  customerName?: string;
  phone?: string;
  source?: string;
  quizAnswers?: unknown;
  sessionId?: string;
  assignedAgentId?: string | null;
  status?: string;
}

/**
 * Safely mirror/upsert a lead to Supabase when credentials and URL are present.
 * Fails silently with a warning if Supabase is unconfigured or unreachable.
 */
export async function syncLeadToSupabase(lead: SupabaseLeadPayload) {
  const client = getSupabaseAdmin() || getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client.from('leads').upsert(
      {
        id: lead.id,
        customer_name: lead.customerName,
        phone: lead.phone,
        source: lead.source,
        quiz_answers: lead.quizAnswers,
        session_id: lead.sessionId,
        assigned_agent_id: lead.assignedAgentId,
        status: lead.status || 'NEW',
        updated_at: new Date().toISOString(),
      },
      { onConflict: lead.sessionId ? 'session_id' : undefined }
    );

    if (error) {
      console.warn('[Supabase] Lead sync error:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('[Supabase] Lead sync exception:', err);
    return null;
  }
}

