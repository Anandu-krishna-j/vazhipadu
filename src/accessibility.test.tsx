import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import * as api from './api';
import type { Temple, Offering } from './types';

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

describe('P5 - Mobile and Accessibility Acceptance Criteria', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.spyOn(api, 'getTemples').mockResolvedValue(mockTemples);
    vi.spyOn(api, 'getOfferings').mockResolvedValue(mockOfferings);
  });

  it('acceptance criterion: tests find form fields by their labels', async () => {
    render(<App />);

    // Wait for temple offerings to render
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Pushpanjali' })).toBeInTheDocument();
    });

    // Temple selector found by its label
    expect(screen.getByLabelText(/select temple/i)).toBeInTheDocument();

    // Devotee order form fields found by their accessible labels
    const nameInput = screen.getByLabelText(/devotee name/i);
    const phoneInput = screen.getByLabelText(/phone number/i);
    const starSelect = screen.getByLabelText(/birth star/i);
    const dateInput = screen.getByLabelText(/date of offering/i);

    expect(nameInput).toBeInTheDocument();
    expect(phoneInput).toBeInTheDocument();
    expect(starSelect).toBeInTheDocument();
    expect(dateInput).toBeInTheDocument();

    // All form fields have appropriate accessible attributes
    expect(nameInput).toHaveAttribute('aria-required', 'true');
    expect(phoneInput).toHaveAttribute('aria-required', 'true');
    expect(starSelect).toHaveAttribute('aria-required', 'true');
    expect(dateInput).toHaveAttribute('aria-required', 'true');
  });

  it('acceptance criterion: the whole booking flow works with the keyboard alone', async () => {
    const user = userEvent.setup();

    const createOrderSpy = vi.spyOn(api, 'createOrder').mockResolvedValue({
      id: 'ORD-2026-7777',
      templeId: 'temple-1',
      templeName: 'Sabarimala Sree Dharma Sastha Temple',
      devoteeName: 'Anandu Krishna',
      phoneNumber: '9847012345',
      nakshatra: 'Ashwini (Aswathy)',
      offeringDate: '2026-11-10',
      items: [{ offeringId: 'off-1', offeringName: 'Pushpanjali', price: 30, quantity: 1 }],
      totalAmount: 30,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Pushpanjali' })).toBeInTheDocument();
    });

    // 1. Add offering using keyboard Enter on button
    const addBtn = screen.getByRole('button', { name: /add pushpanjali for ₹30 to cart/i });
    addBtn.focus();
    expect(document.activeElement).toBe(addBtn);
    await user.keyboard('{Enter}');

    // Cart updates
    expect(screen.getByTestId('cart-total-amount')).toHaveTextContent('₹30');

    // 2. Navigate and fill form using keyboard
    const nameInput = screen.getByLabelText(/devotee name/i);
    nameInput.focus();
    await user.keyboard('Anandu Krishna');

    const phoneInput = screen.getByLabelText(/phone number/i);
    phoneInput.focus();
    await user.keyboard('9847012345');

    const starSelect = screen.getByLabelText(/birth star/i);
    starSelect.focus();
    await user.selectOptions(starSelect, 'Ashwini (Aswathy)');

    const dateInput = screen.getByLabelText(/date of offering/i);
    fireEvent.change(dateInput, { target: { value: '2026-11-10' } });

    // 3. Focus on submit button and press Enter
    const submitBtn = screen.getByRole('button', { name: /place order/i });
    submitBtn.focus();
    expect(document.activeElement).toBe(submitBtn);
    await user.keyboard('{Enter}');

    // 4. Modal opens
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByTestId('confirmed-order-id')).toHaveTextContent('ORD-2026-7777');
    });

    // 5. Close modal using keyboard Escape key
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    expect(createOrderSpy).toHaveBeenCalledTimes(1);
  });

  it('acceptance criterion: no horizontal scrolling at 360 px wide', async () => {
    window.innerWidth = 360;
    window.innerHeight = 640;

    const { container } = render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Pushpanjali' })).toBeInTheDocument();
    });

    const rootElement = container.firstElementChild as HTMLElement;
    expect(rootElement).toHaveClass('overflow-x-hidden');
    expect(rootElement).toHaveClass('max-w-full');
  });
});
