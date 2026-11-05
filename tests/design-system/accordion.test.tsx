import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

describe('Luxury Radix Accordion Component', () => {
  it('renders accordion trigger and expands content cleanly', () => {
    render(
      <Accordion type="single" collapsible defaultValue="q1">
        <AccordionItem value="q1">
          <AccordionTrigger>How does the 10/60/30 escrow work?</AccordionTrigger>
          <AccordionContent>Your funds remain protected in escrow.</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByText('How does the 10/60/30 escrow work?')).toBeDefined();
    expect(screen.getByText('Your funds remain protected in escrow.')).toBeDefined();
  });
});
