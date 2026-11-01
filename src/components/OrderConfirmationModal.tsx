import React from 'react';
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
  if (!order) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-amber-200 bg-white p-6 shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition"
          aria-label="Close confirmation dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Success Icon & Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          </div>
          <h2
            id="confirmation-modal-title"
            className="mt-3 text-xl font-bold text-stone-900"
          >
            Vazhipadu Booking Confirmed!
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            Your sacred temple offering has been recorded with Travancore Devaswom Board
          </p>
        </div>

        {/* Order Details Card */}
        <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50/40 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-amber-200/60 pb-2.5">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800">
                Order Reference
              </span>
              <p
                className="text-base font-extrabold text-amber-950"
                data-testid="confirmed-order-id"
              >
                {order.id}
              </p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
              {order.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-stone-700">
              <User className="h-3.5 w-3.5 text-amber-700 shrink-0" aria-hidden="true" />
              <span className="truncate">{order.devoteeName}</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-700">
              <Phone className="h-3.5 w-3.5 text-amber-700 shrink-0" aria-hidden="true" />
              <span>{order.phoneNumber}</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-700">
              <Sparkles className="h-3.5 w-3.5 text-amber-700 shrink-0" aria-hidden="true" />
              <span className="truncate">{order.nakshatra}</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-700">
              <Calendar className="h-3.5 w-3.5 text-amber-700 shrink-0" aria-hidden="true" />
              <span>{order.offeringDate}</span>
            </div>
          </div>

          <div className="pt-2 text-xs text-amber-900/90 font-medium border-t border-amber-200/40">
            Temple: <span className="font-bold">{order.templeName}</span>
          </div>
        </div>

        {/* Offerings Summary Breakdown */}
        <div className="mt-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
            Rituals & Offerings Summary
          </h4>
          <ul className="divide-y divide-stone-100 text-xs" aria-label="Booked offerings">
            {order.items.map((item) => (
              <li key={item.offeringId} className="flex items-center justify-between py-2">
                <span className="font-medium text-stone-800">
                  {item.offeringName} × {item.quantity}
                </span>
                <span className="font-semibold text-stone-900">
                  ₹{item.price * item.quantity}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex items-center justify-between border-t border-stone-200 pt-3">
            <span className="text-sm font-bold text-stone-900">Total Paid:</span>
            <span
              className="text-lg font-extrabold text-amber-900"
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
            onClick={() => window.print()}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-stone-300 bg-white py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            <span>Print Receipt</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex flex-1 items-center justify-center rounded-lg bg-amber-700 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-amber-800 transition"
          >
            <span>Book Another Offering</span>
          </button>
        </div>
      </div>
    </div>
  );
};
