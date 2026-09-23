import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import EstimatorGateway from './EstimatorGateway';

describe('EstimatorGateway', () => {
  afterEach(() => {
    cleanup(); // ensure clean state between tests
  });

  it('renders correctly with default values', async () => {
    render(<EstimatorGateway />);

    expect(screen.getByText('Auro')).toBeInTheDocument();
    expect(screen.getByText('Makeover')).toBeInTheDocument();
    expect(screen.getByText('Wall Dimensions')).toBeInTheDocument();
    expect(screen.getByText('Finish Tier')).toBeInTheDocument();

    // Check default dimensions
    expect(screen.getAllByText('10 ft', { selector: 'span.font-bold' }).length).toBe(2);

    // Wait for calculation to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('updates pricing when width slider changes', async () => {
    render(<EstimatorGateway />);

    await waitFor(() => {
        expect(screen.getByText('₹23,128')).toBeInTheDocument();
    });

    const sliders = screen.getAllByRole('slider');
    const widthSlider = sliders[0];

    fireEvent.change(widthSlider, { target: { value: '20' } });

    expect(screen.getAllByText('20 ft').length).toBeGreaterThan(0);

    await waitFor(() => {
      expect(screen.getByText('₹47,578')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('updates pricing when quality changes', async () => {
    render(<EstimatorGateway />);

    await waitFor(() => {
        expect(screen.getByText('₹23,128')).toBeInTheDocument();
    });

    const belgianLuxury = screen.getAllByText(/Belgian Luxury/)[0];
    fireEvent.click(belgianLuxury.closest('button') as HTMLButtonElement);

    await waitFor(() => {
      expect(screen.getByText('₹41,920')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('handles WhatsApp booking', async () => {
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    render(<EstimatorGateway />);

    await waitFor(() => {
        expect(screen.getByText('₹23,128')).toBeInTheDocument();
    });

    const bookButton = screen.getAllByText(/Book Swatch Van via WhatsApp/i)[0];
    fireEvent.click(bookButton.closest('button') as HTMLButtonElement);

    expect(windowOpenSpy).toHaveBeenCalled();
    const url = windowOpenSpy.mock.calls[0][0];
    expect(url).toContain('https://wa.me/919999999999');
    expect(url).toContain('10ft%20x%2010ft');
    expect(url).toContain('Standard%20Canvas');

    windowOpenSpy.mockRestore();
  });
});
