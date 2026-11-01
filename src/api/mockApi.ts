import type {
  Temple,
  Offering,
  Order,
  CreateOrderRequest,
  GetOrdersQuery,
  PaginatedOrders,
} from '../types';
import { SEED_TEMPLES, SEED_OFFERINGS, generateSeedOrders } from './seedData';

class MockApiStore {
  private temples: Temple[] = [...SEED_TEMPLES];
  private offerings: Offering[] = [...SEED_OFFERINGS];
  private orders: Order[] = generateSeedOrders();

  // Configurable failure rate: 10% by default as per requirements
  private failureRate: number = 0.10;
  // Delay range: 200–1000 ms as per requirements
  private minDelayMs: number = 200;
  private maxDelayMs: number = 1000;

  public setFailureRate(rate: number): void {
    this.failureRate = Math.max(0, Math.min(1, rate));
  }

  public getFailureRate(): number {
    return this.failureRate;
  }

  public setDelayRange(minMs: number, maxMs: number): void {
    this.minDelayMs = minMs;
    this.maxDelayMs = maxMs;
  }

  public resetDatabase(): void {
    this.temples = [...SEED_TEMPLES];
    this.offerings = [...SEED_OFFERINGS];
    this.orders = generateSeedOrders();
  }

  private async simulateNetwork(operationName: string): Promise<void> {
    const delay =
      this.minDelayMs === this.maxDelayMs
        ? this.minDelayMs
        : Math.floor(Math.random() * (this.maxDelayMs - this.minDelayMs + 1)) + this.minDelayMs;

    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    if (Math.random() < this.failureRate) {
      throw new Error(`Network Error: Request failed during ${operationName}. Please try again.`);
    }
  }

  // List all temples
  public async getTemples(): Promise<Temple[]> {
    await this.simulateNetwork('getTemples');
    return JSON.parse(JSON.stringify(this.temples));
  }

  // A temple's offerings
  public async getOfferings(templeId: string): Promise<Offering[]> {
    await this.simulateNetwork('getOfferings');
    const filtered = this.offerings.filter((o) => o.templeId === templeId);
    return JSON.parse(JSON.stringify(filtered));
  }

  // Place an order with one or more offerings
  public async createOrder(request: CreateOrderRequest): Promise<Order> {
    await this.simulateNetwork('createOrder');

    if (!request.templeId) {
      throw new Error('Validation Error: templeId is required.');
    }
    if (!request.devoteeName?.trim()) {
      throw new Error('Validation Error: devoteeName is required.');
    }
    if (!request.phoneNumber?.trim() || !/^\d{10}$/.test(request.phoneNumber.trim())) {
      throw new Error('Validation Error: Valid 10-digit phoneNumber is required.');
    }
    if (!request.nakshatra?.trim()) {
      throw new Error('Validation Error: nakshatra is required.');
    }
    if (!request.offeringDate) {
      throw new Error('Validation Error: offeringDate is required.');
    }
    if (!request.items || request.items.length === 0) {
      throw new Error('Validation Error: At least one offering must be selected.');
    }

    const temple = this.temples.find((t) => t.id === request.templeId);
    const templeName = temple ? temple.name : 'Travancore Devaswom Temple';

    const orderItems = request.items.map((item) => {
      const offering = this.offerings.find((o) => o.id === item.offeringId);
      if (!offering) {
        throw new Error(`Offering with id ${item.offeringId} not found.`);
      }
      if (!offering.active) {
        throw new Error(`Offering "${offering.name}" is currently inactive and cannot be booked.`);
      }
      return {
        offeringId: offering.id,
        offeringName: offering.name,
        price: offering.price,
        quantity: item.quantity,
      };
    });

    const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newOrder: Order = {
      id: `ORD-${new Date().getFullYear()}-${String(1000 + this.orders.length + 1)}`,
      templeId: request.templeId,
      templeName,
      devoteeName: request.devoteeName.trim(),
      phoneNumber: request.phoneNumber.trim(),
      nakshatra: request.nakshatra.trim(),
      offeringDate: request.offeringDate,
      items: orderItems,
      totalAmount,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    };

    // Store in-memory
    this.orders.unshift(newOrder);

    return JSON.parse(JSON.stringify(newOrder));
  }

  // List orders, with filters and pages
  public async getOrders(query: GetOrdersQuery = {}): Promise<PaginatedOrders> {
    await this.simulateNetwork('getOrders');

    const {
      date,
      status = 'ALL',
      phoneNumber,
      page = 1,
      pageSize = 10,
    } = query;

    let filtered = [...this.orders];

    if (date && date.trim() !== '') {
      filtered = filtered.filter((order) => order.offeringDate === date.trim());
    }

    if (status && status !== 'ALL') {
      filtered = filtered.filter((order) => order.status === status);
    }

    if (phoneNumber && phoneNumber.trim() !== '') {
      const searchClean = phoneNumber.trim().replace(/\D/g, '');
      filtered = filtered.filter((order) => order.phoneNumber.includes(searchClean));
    }

    const totalCount = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const currentPage = Math.min(Math.max(1, page), totalPages);

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedItems = filtered.slice(startIndex, startIndex + pageSize);

    return {
      orders: JSON.parse(JSON.stringify(paginatedItems)),
      totalCount,
      page: currentPage,
      pageSize,
      totalPages,
    };
  }

  // Cancel an order
  public async cancelOrder(orderId: string): Promise<Order> {
    await this.simulateNetwork('cancelOrder');

    const orderIndex = this.orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) {
      throw new Error(`Order with ID ${orderId} not found.`);
    }

    const order = this.orders[orderIndex];
    if (order.status === 'CANCELLED') {
      throw new Error(`Order ${orderId} is already cancelled.`);
    }

    order.status = 'CANCELLED';
    return JSON.parse(JSON.stringify(order));
  }
}

export const mockApi = new MockApiStore();

// Export standalone API functions as required by specification
export const getTemples = () => mockApi.getTemples();
export const getOfferings = (templeId: string) => mockApi.getOfferings(templeId);
export const createOrder = (request: CreateOrderRequest) => mockApi.createOrder(request);
export const getOrders = (query?: GetOrdersQuery) => mockApi.getOrders(query);
export const cancelOrder = (orderId: string) => mockApi.cancelOrder(orderId);
