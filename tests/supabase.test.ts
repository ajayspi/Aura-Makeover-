import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getSupabase, getSupabaseAdmin } from '@/lib/supabase';

describe('Supabase Client Initializer', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('handles missing credentials gracefully without throwing', () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    expect(getSupabase()).toBeNull();
    expect(getSupabaseAdmin()).toBeNull();
  });

  it('creates client instance when credentials are provided', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mockproject.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'sb_publishable_test_key';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'sb_secret_test_key';

    const client = getSupabase();
    expect(client).toBeDefined();

    const adminClient = getSupabaseAdmin();
    expect(adminClient).toBeDefined();
  });
});
