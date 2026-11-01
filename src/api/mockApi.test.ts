import { describe, it, expect, beforeEach } from 'vitest';
import {
  mockApi,
  getTemples,
  getOfferings,
  createOrder,
  getOrders,
  cancelOrder,
} from './mockApi';

describe('Mock API Module', () => {
  beforeEach(() => {
    mockApi.setFailureRate(0); // 0% failure for deterministic tests
    mockApi.setDelayRange(0, 0); // instantaneous for tests
    mockApi.resetDatabase();
  });

  it('lists at least 2 temples with proper details', async () => {
    const temples = await getTemples();
    expect(temples.length).toBeGreaterThanOrEqual(2);
    expect(temples[0]).toHaveProperty('id');
    expect(temples[0]).toHaveProperty('name');
    expect(temples[0]).toHaveProperty('location');
  });

  it('lists 8-10 offerings for a temple with active/inactive flags', async () => {
    const temples = await getTemples();
    const offerings = await getOfferings(temples[0].id);
    expect(offerings.length).toBeGreaterThanOrEqual(8);

    const activeOfferings = offerings.filter((o) => o.active);
    const inactiveOfferings = offerings.filter((o) => !o.active);

    expect(activeOfferings.length).toBeGreaterThan(0);
    expect(inactiveOfferings.length).toBeGreaterThan(0);

    const pushpanjali = offerings.find((o) => o.name === 'Pushpanjali');
    expect(pushpanjali).toBeDefined();
    expect(pushpanjali?.price).toBe(30);
  });

  it('creates an order successfully with one or more offerings', async () => {
    const temples = await getTemples();
    const offerings = await getOfferings(temples[0].id);
    const active = offerings.filter((o) => o.active);

    const order = await createOrder({
      templeId: temples[0].id,
      devoteeName: 'Anandu Krishna',
      phoneNumber: '9847012345',
      nakshatra: 'Ashwini (Aswathy)',
      offeringDate: '2026-11-05',
      items: [
        { offeringId: active[0].id, quantity: 2 },
        { offeringId: active[1].id, quantity: 1 },
      ],
    });

    expect(order.id).toMatch(/^ORD-/);
    expect(order.devoteeName).toBe('Anandu Krishna');
    expect(order.phoneNumber).toBe('9847012345');
    expect(order.items.length).toBe(2);
    expect(order.totalAmount).toBe(active[0].price * 2 + active[1].price * 1);
    expect(order.status).toBe('CONFIRMED');
  });

  it('prevents booking inactive offerings', async () => {
    const temples = await getTemples();
    const offerings = await getOfferings(temples[0].id);
    const inactive = offerings.find((o) => !o.active);
    expect(inactive).toBeDefined();

    await expect(
      createOrder({
        templeId: temples[0].id,
        devoteeName: 'Devotee',
        phoneNumber: '9847012345',
        nakshatra: 'Bharani',
        offeringDate: '2026-11-05',
        items: [{ offeringId: inactive!.id, quantity: 1 }],
      })
    ).rejects.toThrow(/inactive/);
  });

  it('lists orders with pagination and filtering', async () => {
    const result = await getOrders({ page: 1, pageSize: 10 });
    expect(result.orders.length).toBe(10);
    expect(result.totalCount).toBeGreaterThanOrEqual(50);
    expect(result.totalPages).toBeGreaterThanOrEqual(5);

    // Filter by status
    const cancelledOrders = await getOrders({ status: 'CANCELLED', pageSize: 50 });
    expect(cancelledOrders.orders.every((o) => o.status === 'CANCELLED')).toBe(true);

    // Search by phone
    const phoneSearch = await getOrders({ phoneNumber: '9847012345' });
    expect(phoneSearch.orders.every((o) => o.phoneNumber.includes('9847012345'))).toBe(true);
  });

  it('cancels an order', async () => {
    const list = await getOrders({ status: 'CONFIRMED', pageSize: 1 });
    const target = list.orders[0];

    const cancelled = await cancelOrder(target.id);
    expect(cancelled.status).toBe('CANCELLED');

    // Cancelling again should throw
    await expect(cancelOrder(target.id)).rejects.toThrow(/already cancelled/);
  });

  it('simulates network error at configured failure rate', async () => {
    mockApi.setFailureRate(1.0); // 100% failure
    await expect(getTemples()).rejects.toThrow(/Network Error/);
  });
});
