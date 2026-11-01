import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrdersList } from './OrdersList';
import * as api from '../api';
import type { Order } from '../types';

const sampleOrders: Order[] = [
  {
    id: 'ORD-2026-1001',
    templeId: 'temple-1',
    templeName: 'Sabarimala Sree Dharma Sastha Temple',
    devoteeName: 'Anandu Krishna',
    phoneNumber: '9847012345',
    nakshatra: 'Ashwini (Aswathy)',
    offeringDate: '2026-11-05',
    items: [{ offeringId: 'off-1', offeringName: 'Pushpanjali', price: 30, quantity: 2 }],
    totalAmount: 60,
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ORD-2026-1002',
    templeId: 'temple-1',
    templeName: 'Sabarimala Sree Dharma Sastha Temple',
    devoteeName: 'Sreehari Nair',
    phoneNumber: '9447123456',
    nakshatra: 'Rohini',
    offeringDate: '2026-11-06',
    items: [{ offeringId: 'off-2', offeringName: 'Archana', price: 50, quantity: 1 }],
    totalAmount: 50,
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ORD-2026-1003',
    templeId: 'temple-2',
    templeName: 'Guruvayur Sree Krishna Temple',
    devoteeName: 'Lakshmi Menon',
    phoneNumber: '9895234567',
    nakshatra: 'Ardra (Thiruvathira)',
    offeringDate: '2026-11-07',
    items: [{ offeringId: 'off-203', offeringName: 'Paal Payasam', price: 180, quantity: 1 }],
    totalAmount: 180,
    status: 'CANCELLED',
    createdAt: new Date().toISOString(),
  },
];

describe('OrdersList (P4 Acceptance Criteria)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('acceptance criterion: filtering by status shows only matching orders and goes back to page 1', async () => {
    const getOrdersSpy = vi.spyOn(api, 'getOrders').mockImplementation(async (query = {}) => {
      let filtered = [...sampleOrders];
      if (query.status && query.status !== 'ALL') {
        filtered = filtered.filter((o) => o.status === query.status);
      }
      return {
        orders: filtered,
        totalCount: filtered.length,
        page: query.page || 1,
        pageSize: 10,
        totalPages: 1,
      };
    });

    const onFilterChange = vi.fn();

    render(
      <OrdersList
        initialPage={2}
        initialStatus="ALL"
        onFilterChange={onFilterChange}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('ORD-2026-1001')).toBeInTheDocument();
    });

    // Change status filter to CANCELLED
    const statusSelect = screen.getByLabelText(/status filter/i);
    fireEvent.change(statusSelect, { target: { value: 'CANCELLED' } });

    await waitFor(() => {
      expect(screen.getByText('ORD-2026-1003')).toBeInTheDocument();
      expect(screen.queryByText('ORD-2026-1001')).not.toBeInTheDocument();
    });

    // Verify API called with status CANCELLED and reset to page 1
    expect(getOrdersSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        status: 'CANCELLED',
        page: 1,
      })
    );

    // Verify onFilterChange notified parent of reset to page 1
    expect(onFilterChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        status: 'CANCELLED',
        page: 1,
      })
    );
  });

  it('acceptance criterion: refreshing the page keeps the filters and the current page (initial prop rehydration)', async () => {
    const getOrdersSpy = vi.spyOn(api, 'getOrders').mockResolvedValue({
      orders: [sampleOrders[0]],
      totalCount: 25,
      page: 3,
      pageSize: 10,
      totalPages: 3,
    });

    render(
      <OrdersList
        initialPage={3}
        initialStatus="CONFIRMED"
        initialDate="2026-11-05"
        initialPhone="9847"
      />
    );

    await waitFor(() => {
      expect(getOrdersSpy).toHaveBeenCalledWith({
        page: 3,
        pageSize: 10,
        status: 'CONFIRMED',
        date: '2026-11-05',
        phoneNumber: '9847',
      });
    });

    // Verify UI reflects restored filters from URL
    expect((screen.getByLabelText(/status filter/i) as HTMLSelectElement).value).toBe('CONFIRMED');
    expect((screen.getByLabelText(/offering date/i) as HTMLInputElement).value).toBe('2026-11-05');
    expect((screen.getByLabelText(/search phone number/i) as HTMLInputElement).value).toBe('9847');
    expect(screen.getByText('3 / 3')).toBeInTheDocument();
  });

  it('acceptance criterion: a cancelled order shows as cancelled without reloading the page', async () => {
    vi.spyOn(api, 'getOrders').mockResolvedValue({
      orders: [sampleOrders[0]],
      totalCount: 1,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    });

    const cancelledOrder: Order = {
      ...sampleOrders[0],
      status: 'CANCELLED',
    };

    const cancelOrderSpy = vi.spyOn(api, 'cancelOrder').mockResolvedValue(cancelledOrder);

    render(<OrdersList />);

    await waitFor(() => {
      expect(screen.getByText('ORD-2026-1001')).toBeInTheDocument();
    });

    // Status initially CONFIRMED
    expect(screen.getByTestId('order-status-ORD-2026-1001')).toHaveTextContent('CONFIRMED');

    // Click cancel button
    const cancelBtn = screen.getByRole('button', { name: /cancel order ord-2026-1001/i });
    fireEvent.click(cancelBtn);

    // Confirmation dialog appears
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/confirm order cancellation/i)).toBeInTheDocument();

    // Confirm cancellation
    const confirmBtn = screen.getByRole('button', { name: /confirm cancellation/i });
    fireEvent.click(confirmBtn);

    // In-place update: without page reload, status updates to CANCELLED
    await waitFor(() => {
      expect(screen.getByTestId('order-status-ORD-2026-1001')).toHaveTextContent('CANCELLED');
    });

    expect(cancelOrderSpy).toHaveBeenCalledWith('ORD-2026-1001');
    // Dialog closes
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
