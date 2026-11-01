import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OfferingCart } from './OfferingCart';
import type { CartItem } from '../types';

describe('OfferingCart (P2 Acceptance Criteria)', () => {
  it('acceptance criterion: 2 Pushpanjali at ₹30 and 1 Archana at ₹50 shows a total of ₹110', () => {
    const items: CartItem[] = [
      {
        offering: {
          id: 'off-1',
          templeId: 'temple-1',
          name: 'Pushpanjali',
          price: 30,
          active: true,
        },
        quantity: 2,
      },
      {
        offering: {
          id: 'off-2',
          templeId: 'temple-1',
          name: 'Archana',
          price: 50,
          active: true,
        },
        quantity: 1,
      },
    ];

    const totalAmount = 2 * 30 + 1 * 50; // 110

    render(
      <OfferingCart
        items={items}
        totalAmount={totalAmount}
        onUpdateQuantity={vi.fn()}
        onRemoveItem={vi.fn()}
        onClearCart={vi.fn()}
      />
    );

    // Verify individual items and their line totals
    expect(screen.getByText('Pushpanjali')).toBeInTheDocument();
    expect(screen.getByTestId('quantity-off-1')).toHaveTextContent('2');
    expect(screen.getByTestId('line-total-off-1')).toHaveTextContent('₹60');

    expect(screen.getByText('Archana')).toBeInTheDocument();
    expect(screen.getByTestId('quantity-off-2')).toHaveTextContent('1');
    expect(screen.getByTestId('line-total-off-2')).toHaveTextContent('₹50');

    // Verify grand total shows ₹110
    expect(screen.getByTestId('cart-total-amount')).toHaveTextContent('₹110');
  });

  it('allows incrementing, decrementing, and removing items', () => {
    const handleUpdate = vi.fn();
    const handleRemove = vi.fn();

    const items: CartItem[] = [
      {
        offering: {
          id: 'off-1',
          templeId: 'temple-1',
          name: 'Pushpanjali',
          price: 30,
          active: true,
        },
        quantity: 2,
      },
    ];

    render(
      <OfferingCart
        items={items}
        totalAmount={60}
        onUpdateQuantity={handleUpdate}
        onRemoveItem={handleRemove}
        onClearCart={vi.fn()}
      />
    );

    // Increment
    const plusBtn = screen.getByLabelText(/increase quantity of pushpanjali/i);
    fireEvent.click(plusBtn);
    expect(handleUpdate).toHaveBeenCalledWith('off-1', 3);

    // Decrement
    const minusBtn = screen.getByLabelText(/decrease quantity of pushpanjali/i);
    fireEvent.click(minusBtn);
    expect(handleUpdate).toHaveBeenCalledWith('off-1', 1);

    // Remove
    const removeBtn = screen.getByLabelText(/remove pushpanjali from cart/i);
    fireEvent.click(removeBtn);
    expect(handleRemove).toHaveBeenCalledWith('off-1');
  });
});

