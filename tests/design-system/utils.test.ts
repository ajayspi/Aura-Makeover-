import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('Design System cn() Utility', () => {
  it('merges tailwind classes cleanly and resolves conflicts', () => {
    const result = cn('bg-[#1C130B]', 'text-[#FAF8F5]', false && 'hidden', 'bg-[#C5A880]');
    expect(result).toContain('text-[#FAF8F5]');
    expect(result).toContain('bg-[#C5A880]');
    expect(result).not.toContain('bg-[#1C130B]');
  });
});
