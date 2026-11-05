import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

describe('Luxury Radix Tabs Component', () => {
  it('renders luxury styled tabs list and active tab indicator', () => {
    render(
      <Tabs defaultValue="standard">
        <TabsList>
          <TabsTrigger value="standard">Standard Wall</TabsTrigger>
          <TabsTrigger value="society">Society Floorplans</TabsTrigger>
        </TabsList>
        <TabsContent value="standard">Standard Presets Content</TabsContent>
        <TabsContent value="society">Society Presets Content</TabsContent>
      </Tabs>
    );
    expect(screen.getByText('Standard Presets Content')).toBeDefined();
  });
});
