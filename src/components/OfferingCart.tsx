import React from 'react';
import type { CartItem } from '../types';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

interface OfferingCartProps {
  items: CartItem[];
  totalAmount: number;
  onUpdateQuantity: (offeringId: string, quantity: number) => void;
  onRemoveItem: (offeringId: string) => void;
  onClearCart: () => void;
  onProceedToForm?: () => void;
}

export const OfferingCart: React.FC<OfferingCartProps> = ({
  items,
  totalAmount,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToForm,
}) => {
  return (
    <div className="rounded-xl border border-amber-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-amber-700" aria-hidden="true" />
          <h2 className="text-base font-bold text-stone-900">
            Selected Offerings ({items.reduce((s, i) => s + i.quantity, 0)})
          </h2>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            className="text-xs font-medium text-stone-400 hover:text-rose-600 transition"
          >
            Clear All
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="py-8 text-center text-stone-500">
          <p className="text-xs">No offerings added to your cart yet.</p>
          <p className="mt-1 text-xs text-stone-400">
            Select offerings from the list above to proceed with booking.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <ul className="divide-y divide-stone-100" aria-label="Cart items">
            {items.map((item) => {
              const lineTotal = item.offering.price * item.quantity;
              return (
                <li
                  key={item.offering.id}
                  className="flex items-center justify-between py-3 gap-3"
                  data-testid={`cart-item-${item.offering.id}`}
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-stone-900 truncate">
                      {item.offering.name}
                    </h4>
                    <p className="text-xs text-stone-500">
                      ₹{item.offering.price} each
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateQuantity(item.offering.id, item.quantity - 1)
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 transition focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                      aria-label={`Decrease quantity of ${item.offering.name}`}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span
                      className="w-7 text-center text-xs font-bold text-stone-800"
                      aria-label={`Quantity: ${item.quantity}`}
                      data-testid={`quantity-${item.offering.id}`}
                    >
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateQuantity(item.offering.id, item.quantity + 1)
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 transition focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                      aria-label={`Increase quantity of ${item.offering.name}`}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Line Total in Rupees */}
                  <div className="w-16 text-right">
                    <span
                      className="text-sm font-bold text-stone-900"
                      data-testid={`line-total-${item.offering.id}`}
                    >
                      ₹{lineTotal}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.offering.id)}
                    className="p-1 text-stone-400 hover:text-rose-600 transition focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                    aria-label={`Remove ${item.offering.name} from cart`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Cart Summary & Total in Rupees */}
          <div className="border-t border-stone-200 pt-4">
            <div className="flex items-center justify-between text-stone-600 text-xs">
              <span>Items Total</span>
              <span>{items.reduce((s, i) => s + i.quantity, 0)} item(s)</span>
            </div>

            <div className="mt-2 flex items-center justify-between border-t border-dashed border-stone-200 pt-2 text-stone-900">
              <span className="text-sm font-bold">Total Amount</span>
              <span
                className="text-xl font-extrabold text-amber-900"
                data-testid="cart-total-amount"
              >
                ₹{totalAmount}
              </span>
            </div>

            {onProceedToForm && (
              <button
                type="button"
                onClick={onProceedToForm}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-700 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-amber-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
              >
                <span>Proceed to Devotee Details</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

