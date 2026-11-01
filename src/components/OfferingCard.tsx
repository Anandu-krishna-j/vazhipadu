import React from 'react';
import type { Offering } from '../types';
import { Plus, Check, Ban } from 'lucide-react';

interface OfferingCardProps {
  offering: Offering;
  onAddToCart?: (offering: Offering) => void;
  isInCart?: boolean;
}

export const OfferingCard: React.FC<OfferingCardProps> = ({
  offering,
  onAddToCart,
  isInCart = false,
}) => {
  const isBookable = offering.active;

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-xl border p-5 transition-all duration-150 ${
        isBookable
          ? 'border-amber-200/80 bg-white hover:border-amber-400 hover:shadow-md'
          : 'border-stone-200 bg-stone-50 opacity-75'
      }`}
      data-testid={`offering-card-${offering.id}`}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            {offering.category && (
              <span className="inline-block rounded-md bg-amber-100/70 px-2 py-0.5 text-xs font-medium text-amber-800">
                {offering.category}
              </span>
            )}
            <h3 className="mt-1 text-base font-bold text-stone-900 group-hover:text-amber-900">
              {offering.name}
            </h3>
          </div>

          <div className="text-right">
            <span className="text-lg font-bold text-amber-800">
              ₹{offering.price}
            </span>
          </div>
        </div>

        {offering.description && (
          <p className="mt-2 text-xs leading-relaxed text-stone-600">
            {offering.description}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
        {!isBookable ? (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
            <Ban className="h-3.5 w-3.5" aria-hidden="true" />
            Not Available for Booking
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onAddToCart && onAddToCart(offering)}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 ${
              isInCart
                ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                : 'bg-amber-700 text-white hover:bg-amber-800'
            }`}
            aria-label={`Add ${offering.name} for ₹${offering.price} to cart`}
          >
            {isInCart ? (
              <>
                <Check className="h-3.5 w-3.5 text-amber-800" aria-hidden="true" />
                <span>Added to Cart</span>
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Add Offering</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
