// Shared lead-capture validation for the WhatsApp handoff (R11).
// India mobile: optional +91 (or 0) prefix, then 10 digits starting 6-9.

export function normalizeLeadPhone(input: string): string | null {
  if (!input) return null;
  const digits = input.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  if (digits.length === 10) return digits;
  return null;
}

export function isValidLeadPhone(input: string): boolean {
  const normalized = normalizeLeadPhone(input);
  return !!normalized && /^[6-9]/.test(normalized);
}

export function isValidLeadName(input: string): boolean {
  return typeof input === 'string' && input.trim().length >= 2;
}
