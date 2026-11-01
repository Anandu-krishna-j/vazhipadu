import React, { useEffect } from 'react';
import type { Order } from '../types';
import { CheckCircle2, Calendar, User, Phone, Sparkles, Printer, X } from 'lucide-react';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
}) => {
  // Close dialog on Escape key for keyboard accessibility
  useEffect(() => {
    if (!order) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [order, onClose]);

  if (!order) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-3 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-amber-200 bg-white p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 sm:right-4 sm:top-4 rounded-lg p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-800 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-600 transition"
          aria-label="Close confirmation dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Success Icon & Header */}
        <div className="text-center pt-1">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-inner">
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          </div>
          <h2
            id="confirmation-modal-title"
            className="mt-3 text-lg sm:text-xl font-bold text-stone-900"
          >
            Vazhipadu Booking Confirmed!
          </h2>
          <p className="mt-1 text-xs text-stone-600">
            Your sacred temple offering has been recorded with Travancore Devaswom Board
          </p>
        </div>

        {/* Order Details Card */}
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50/50 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-amber-200 pb-2.5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                Order Reference
              </span>
              <p
                className="text-base font-extrabold text-amber-950"
                data-testid="confirmed-order-id"
              >
                {order.id}
              </p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900 border border-emerald-300">
              {order.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-stone-800">
              <User className="h-3.5 w-3.5 text-amber-800 shrink-0" aria-hidden="true" />
              <span className="truncate font-medium">{order.devoteeName}</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-800">
              <Phone className="h-3.5 w-3.5 text-amber-800 shrink-0" aria-hidden="true" />
              <span className="font-medium">{order.phoneNumber}</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-800">
              <Sparkles className="h-3.5 w-3.5 text-amber-800 shrink-0" aria-hidden="true" />
              <span className="truncate font-medium">{order.nakshatra}</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-800">
              <Calendar className="h-3.5 w-3.5 text-amber-800 shrink-0" aria-hidden="true" />
              <span className="font-medium">{order.offeringDate}</span>
            </div>
          </div>

          <div className="pt-2 text-xs text-amber-950 font-medium border-t border-amber-200">
            Temple: <span className="font-bold">{order.templeName}</span>
          </div>
        </div>

        {/* Offerings Summary Breakdown */}
        <div className="mt-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
            Rituals & Offerings Summary
          </h4>
          <ul className="divide-y divide-stone-100 text-xs" aria-label="Booked offerings">
            {order.items.map((item) => (
              <li key={item.offeringId} className="flex items-center justify-between py-2">
                <span className="font-medium text-stone-800">
                  {item.offeringName} × {item.quantity}
                </span>
                <span className="font-bold text-stone-900">
                  ₹{item.price * item.quantity}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex items-center justify-between border-t border-stone-200 pt-3">
            <span className="text-sm font-bold text-stone-900">Total Paid:</span>
            <span
              className="text-lg font-extrabold text-amber-950"
              data-testid="confirmed-order-total"
            >
              ₹{order.totalAmount}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined' && typeof window.print === 'function') {
                window.print();
              }
            }}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-stone-300 bg-white py-2.5 text-xs font-semibold text-stone-800 hover:bg-stone-50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-600 transition"
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            <span>Print Receipt</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex flex-1 items-center justify-center rounded-lg bg-amber-800 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-amber-900 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-600 transition"
          >
            <span>Book Another Offering</span>
          </button>
        </div>
      </div>
    </div>
  );
};
