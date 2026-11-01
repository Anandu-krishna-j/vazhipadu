import { useState, useEffect, useCallback } from 'react';
import type { CartItem, Offering } from '../types';

export const CART_STORAGE_KEY = 'tdb_vazhipadu_cart_v1';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.error('Failed to load cart from localStorage:', err);
    }
    return [];
  });

  // Persist cart to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Failed to save cart to localStorage:', err);
    }
  }, [items]);

  const addItem = useCallback((offering: Offering) => {
    if (!offering.active) return;

    setItems((prevItems) => {
      const existing = prevItems.find((i) => i.offering.id === offering.id);
      if (existing) {
        return prevItems.map((i) =>
          i.offering.id === offering.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { offering, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((offeringId: string, quantity: number) => {
    setItems((prevItems) => {
      if (quantity <= 0) {
        return prevItems.filter((i) => i.offering.id !== offeringId);
      }
      return prevItems.map((i) =>
        i.offering.id === offeringId ? { ...i, quantity } : i
      );
    });
  }, []);

  const removeItem = useCallback((offeringId: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.offering.id !== offeringId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear cart from localStorage:', err);
    }
  }, []);

  const totalAmount = items.reduce(
    (sum, item) => sum + item.offering.price * item.quantity,
    0
  );

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    totalAmount,
    totalItemsCount,
  };
}

