import React from 'react';
import { describe, it, expect, beforeAll } from 'vitest';
import { render } from '@testing-library/react';
import { Slider } from '@/components/ui/slider';

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('Luxury Radix Slider Component', () => {
  it('renders slider with accessible role and luxury tokens', () => {
    const { container } = render(
      <Slider defaultValue={[14]} min={5} max={30} step={1} aria-label="Wall Width" />
    );
    const thumb = container.querySelector('[role="slider"]');
    expect(thumb).toBeDefined();
    expect(thumb?.className).toContain('rounded-full');
  });
});
