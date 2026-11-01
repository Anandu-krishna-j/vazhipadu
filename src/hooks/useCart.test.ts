import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useCart, CART_STORAGE_KEY } from './useCart';
import type { Offering } from '../types';

const pushpanjali: Offering = {
  id: 'off-1',
  templeId: 'temple-1',
  name: 'Pushpanjali',
  price: 30,
  active: true,
};

const archana: Offering = {
  id: 'off-2',
  templeId: 'temple-1',
  name: 'Archana',
  price: 50,
  active: true,
};

describe('useCart (P2 Acceptance Criteria)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('acceptance criterion: refreshing the page keeps the cart (localStorage rehydration)', () => {
    // 1. Initial page session: user adds offerings
    const { result, unmount } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(pushpanjali);
      result.current.addItem(pushpanjali); // quantity = 2
      result.current.addItem(archana); // quantity = 1
    });

    expect(result.current.items.length).toBe(2);
    expect(result.current.totalAmount).toBe(110);

    // Verify written to localStorage
    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    expect(stored.length).toBe(2);

    // 2. Simulate page unmount / refresh
    unmount();

    // 3. New session (page reloaded): cart is still there
    const { result: reloadedResult } = renderHook(() => useCart());
    expect(reloadedResult.current.items.length).toBe(2);
    expect(reloadedResult.current.totalAmount).toBe(110);
    expect(reloadedResult.current.items[0].offering.name).toBe('Pushpanjali');
    expect(reloadedResult.current.items[0].quantity).toBe(2);
    expect(reloadedResult.current.items[1].offering.name).toBe('Archana');
    expect(reloadedResult.current.items[1].quantity).toBe(1);
  });
});
