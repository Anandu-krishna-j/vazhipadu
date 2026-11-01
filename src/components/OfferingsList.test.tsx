import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OfferingsList } from './OfferingsList';
import type { Offering } from '../types';

const mockOfferings: Offering[] = [
  {
    id: 'off-1',
    templeId: 'temple-1',
    name: 'Pushpanjali',
    price: 30,
    active: true,
    description: 'Special flower offering for peace and blessings',
    category: 'Daily',
  },
  {
    id: 'off-2',
    templeId: 'temple-1',
    name: 'Archana',
    price: 50,
    active: true,
    description: 'Chanting divine names with flowers',
    category: 'Archana',
  },
  {
    id: 'off-3',
    templeId: 'temple-1',
    name: 'Ganapathy Homam',
    price: 200,
    active: true,
    description: 'Morning fire ritual to remove all obstacles',
    category: 'Special',
  },
  {
    id: 'off-4',
    templeId: 'temple-1',
    name: 'Udayastamana Pooja (Inactive)',
    price: 5000,
    active: false,
    description: 'Special annual pooja currently inactive',
    category: 'Special',
  },
];

describe('OfferingsList (P1 Requirements & Acceptance Criteria)', () => {
  it('renders active offerings with their prices and excludes inactive offerings from booking', () => {
    render(
      <OfferingsList
        offerings={mockOfferings}
        isLoading={false}
        error={null}
        onRetry={vi.fn()}
      />
    );

    // Active offerings should be visible
    expect(screen.getByRole('heading', { name: 'Pushpanjali' })).toBeInTheDocument();
    expect(screen.getByText('₹30')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Archana' })).toBeInTheDocument();
    expect(screen.getByText('₹50')).toBeInTheDocument();

    // Inactive offerings must not be offered for booking
    expect(screen.queryByText('Udayastamana Pooja (Inactive)')).not.toBeInTheDocument();
  });

  it('acceptance criterion: typing "push" shows Pushpanjali and hides offerings that don\'t match', () => {
    render(
      <OfferingsList
        offerings={mockOfferings}
        isLoading={false}
        error={null}
        onRetry={vi.fn()}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search offerings by name/i);
    fireEvent.change(searchInput, { target: { value: 'push' } });

    // Pushpanjali is shown
    expect(screen.getByText('Pushpanjali')).toBeInTheDocument();
    // Archana and Ganapathy Homam are hidden
    expect(screen.queryByText('Archana')).not.toBeInTheDocument();
    expect(screen.queryByText('Ganapathy Homam')).not.toBeInTheDocument();
  });

  it('acceptance criterion: a failed load shows an error with a way to try again', () => {
    const handleRetry = vi.fn();
    render(
      <OfferingsList
        offerings={[]}
        isLoading={false}
        error="Network Error: Request failed during getOfferings. Please try again."
        onRetry={handleRetry}
      />
    );

    // Error banner is shown
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/unable to load offerings/i)).toBeInTheDocument();
    expect(screen.getByText(/Network Error: Request failed/i)).toBeInTheDocument();

    // Try Again button exists and can be clicked
    const retryBtn = screen.getByRole('button', { name: /try again/i });
    expect(retryBtn).toBeInTheDocument();
    fireEvent.click(retryBtn);

    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('shows loading skeleton while fetching data', () => {
    render(
      <OfferingsList
        offerings={[]}
        isLoading={true}
        error={null}
        onRetry={vi.fn()}
      />
    );

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('shows an empty state when search matches nothing', () => {
    render(
      <OfferingsList
        offerings={mockOfferings}
        isLoading={false}
        error={null}
        onRetry={vi.fn()}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search offerings by name/i);
    fireEvent.change(searchInput, { target: { value: 'xyznonexistent' } });

    expect(screen.getByText(/no offerings match your search/i)).toBeInTheDocument();
  });
});
