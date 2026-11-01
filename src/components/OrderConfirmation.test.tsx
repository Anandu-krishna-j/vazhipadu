import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';
import * as api from '../api';
import type { Temple, Offering, Order } from '../types';

const mockTemples: Temple[] = [
  {
    id: 'temple-1',
    name: 'Sabarimala Sree Dharma Sastha Temple',
    location: 'Pathanamthitta',
    deity: 'Lord Ayyappa',
    description: 'Hill shrine',
  },
];

const mockOfferings: Offering[] = [
  {
    id: 'off-1',
    templeId: 'temple-1',
    name: 'Pushpanjali',
    price: 30,
    active: true,
  },
  {
    id: 'off-2',
    templeId: 'temple-1',
    name: 'Archana',
    price: 50,
    active: true,
  },
];

describe('P3 - Order Confirmation & Resilience Acceptance Criteria', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.spyOn(api, 'getTemples').mockResolvedValue(mockTemples);
    vi.spyOn(api, 'getOfferings').mockResolvedValue(mockOfferings);
  });

  it('acceptance criterion: double-clicking Place order creates only one order', async () => {
    let callCount = 0;
    const createOrderSpy = vi.spyOn(api, 'createOrder').mockImplementation(async (req) => {
      callCount++;
      // Simulate network latency so button remains disabled / in-flight
      await new Promise((r) => setTimeout(r, 100));
      return {
        id: `ORD-2026-${1000 + callCount}`,
        templeId: req.templeId,
        templeName: 'Sabarimala Sree Dharma Sastha Temple',
        devoteeName: req.devoteeName,
        phoneNumber: req.phoneNumber,
        nakshatra: req.nakshatra,
        offeringDate: req.offeringDate,
        items: [{ offeringId: 'off-1', offeringName: 'Pushpanjali', price: 30, quantity: 1 }],
        totalAmount: 30,
        status: 'CONFIRMED',
        createdAt: new Date().toISOString(),
      };
    });

    render(<App />);

    // Wait for temple offerings to render
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Pushpanjali' })).toBeInTheDocument();
    });

    // Add offering to cart
    const addBtn = screen.getByRole('button', { name: /add pushpanjali for ₹30 to cart/i });
    fireEvent.click(addBtn);

    // Fill form
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    fireEvent.change(screen.getByLabelText(/devotee name/i), {
      target: { value: 'Anandu Krishna' },
    });
    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: '9847012345' },
    });
    fireEvent.change(screen.getByLabelText(/birth star/i), {
      target: { value: 'Ashwini (Aswathy)' },
    });
    fireEvent.change(screen.getByLabelText(/date of offering/i), {
      target: { value: dateStr },
    });

    const placeOrderBtn = screen.getByRole('button', { name: /place order/i });

    // Double-click rapid succession
    fireEvent.click(placeOrderBtn);
    fireEvent.click(placeOrderBtn);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Verify createOrder was called exactly once
    expect(createOrderSpy).toHaveBeenCalledTimes(1);

    // Confirmation shows order number and total
    expect(screen.getByTestId('confirmed-order-id')).toHaveTextContent('ORD-2026-1001');
    expect(screen.getByTestId('confirmed-order-total')).toHaveTextContent('₹30');

    // Cart is now empty
    expect(screen.getByText(/no offerings added to your cart yet/i)).toBeInTheDocument();
  });

  it('acceptance criterion: after a failure, the cart and form are unchanged and a retry works', async () => {
    let callAttempt = 0;
    const createOrderSpy = vi.spyOn(api, 'createOrder').mockImplementation(async (req) => {
      callAttempt++;
      if (callAttempt === 1) {
        throw new Error('Network Error: Request failed during createOrder. Please try again.');
      }
      return {
        id: 'ORD-2026-9999',
        templeId: req.templeId,
        templeName: 'Sabarimala Sree Dharma Sastha Temple',
        devoteeName: req.devoteeName,
        phoneNumber: req.phoneNumber,
        nakshatra: req.nakshatra,
        offeringDate: req.offeringDate,
        items: [{ offeringId: 'off-2', offeringName: 'Archana', price: 50, quantity: 1 }],
        totalAmount: 50,
        status: 'CONFIRMED',
        createdAt: new Date().toISOString(),
      };
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Archana' })).toBeInTheDocument();
    });

    // Add Archana to cart
    fireEvent.click(screen.getByRole('button', { name: /add archana for ₹50 to cart/i }));

    // Fill form
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const dateStr = tomorrow.toISOString().split('T')[0];

    const nameInput = screen.getByLabelText(/devotee name/i) as HTMLInputElement;
    const phoneInput = screen.getByLabelText(/phone number/i) as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: 'Sreehari Nair' } });
    fireEvent.change(phoneInput, { target: { value: '9447123456' } });
    fireEvent.change(screen.getByLabelText(/birth star/i), {
      target: { value: 'Rohini' },
    });
    fireEvent.change(screen.getByLabelText(/date of offering/i), {
      target: { value: dateStr },
    });

    // Attempt 1: Click Place order (fails)
    fireEvent.click(screen.getByRole('button', { name: /place order/i }));

    // Wait for failure alert
    await waitFor(() => {
      expect(screen.getByText(/order submission failed/i)).toBeInTheDocument();
    });

    // Verify Cart items and form inputs are still intact and unchanged!
    expect(screen.getByTestId('cart-total-amount')).toHaveTextContent('₹50');
    expect(nameInput.value).toBe('Sreehari Nair');
    expect(phoneInput.value).toBe('9447123456');

    // Attempt 2: Click Retry Order
    const retryBtn = screen.getByRole('button', { name: /retry order/i });
    fireEvent.click(retryBtn);

    // Should succeed and show confirmation
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByTestId('confirmed-order-id')).toHaveTextContent('ORD-2026-9999');
      expect(screen.getByTestId('confirmed-order-total')).toHaveTextContent('₹50');
    });

    expect(createOrderSpy).toHaveBeenCalledTimes(2);
  });
});
