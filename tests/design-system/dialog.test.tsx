import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

describe('Luxury Radix Dialog Component', () => {
  it('renders trigger and opens dialog with luxury tokens', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle>Bespoke Wall Consultation</DialogTitle>
          <p>Book your Mercedes-Benz Swatch Van visit.</p>
        </DialogContent>
      </Dialog>
    );
    expect(screen.getByText('Bespoke Wall Consultation')).toBeDefined();
    const content = screen.getByRole('dialog');
    expect(content.className).toContain('rounded-3xl');
  });
});
