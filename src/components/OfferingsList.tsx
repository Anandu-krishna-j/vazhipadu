import React, { useState, useMemo } from 'react';
import type { Offering } from '../types';
import { OfferingCard } from './OfferingCard';
import { Search, AlertCircle, RefreshCw, XCircle } from 'lucide-react';

interface OfferingsListProps {
  offerings: Offering[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onAddToCart?: (offering: Offering) => void;
  cartOfferingIds?: string[];
  templeName?: string;
}

export const OfferingsList: React.FC<OfferingsListProps> = ({
  offerings,
  isLoading,
  error,
  onRetry,
  onAddToCart,
  cartOfferingIds = [],
  templeName,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Per requirements: "Inactive offerings are not offered for booking."
  // Filter for active offerings only for booking
  const activeOfferings = useMemo(() => {
    return offerings.filter((offering) => offering.active);
  }, [offerings]);

  // Filter offerings based on devotee search query (case-insensitive)
  const filteredOfferings = useMemo(() => {
    if (!searchTerm.trim()) {
      return activeOfferings;
    }
    const term = searchTerm.toLowerCase().trim();
    // Strict search by offering name as specified in P1 requirements
    return activeOfferings.filter((offering) =>
      offering.name.toLowerCase().includes(term)
    );
  }, [activeOfferings, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Search Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-stone-900">
            {templeName ? `${templeName} Offerings` : 'Available Offerings'}
          </h2>
          <p className="text-xs text-stone-500">
            Select vazhipadu rituals to perform in your family name and nakshatra
          </p>
        </div>

        {/* Search input with accessible label */}
        <div className="relative w-full sm:w-72">
          <label htmlFor="offering-search" className="sr-only">
            Search offerings by name
          </label>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-stone-400" aria-hidden="true" />
          </div>
          <input
            id="offering-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search offerings by name..."
            className="w-full rounded-lg border border-stone-300 bg-white py-2 pl-9 pr-8 text-sm placeholder-stone-400 shadow-xs transition focus:border-amber-600 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-stone-400 hover:text-stone-600"
              aria-label="Clear search query"
            >
              <XCircle className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Loading Skeleton State */}
      {isLoading && (
        <div data-testid="loading-skeleton" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-stone-200 bg-white p-5 shadow-xs"
            >
              <div className="flex justify-between">
                <div className="h-4 w-24 rounded bg-stone-200"></div>
                <div className="h-4 w-12 rounded bg-amber-100"></div>
              </div>
              <div className="mt-3 h-5 w-3/4 rounded bg-stone-200"></div>
              <div className="mt-2 h-3 w-full rounded bg-stone-100"></div>
              <div className="mt-1 h-3 w-4/5 rounded bg-stone-100"></div>
              <div className="mt-6 flex justify-end">
                <div className="h-8 w-24 rounded-lg bg-stone-200"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State with Retry Button */}
      {!isLoading && error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-800 shadow-xs"
        >
          <AlertCircle className="mx-auto h-8 w-8 text-rose-500" aria-hidden="true" />
          <h3 className="mt-2 text-base font-bold text-rose-900">
            Unable to load offerings
          </h3>
          <p className="mt-1 text-xs text-rose-700 max-w-md mx-auto">
            {error}
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-rose-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500/30"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Empty State: No Offerings Match Search Query */}
      {!isLoading && !error && filteredOfferings.length === 0 && (
        <div className="rounded-xl border border-dashed border-stone-300 bg-white p-12 text-center">
          <Search className="mx-auto h-8 w-8 text-stone-400" aria-hidden="true" />
          <h3 className="mt-3 text-base font-semibold text-stone-800">
            No offerings match your search
          </h3>
          <p className="mt-1 text-xs text-stone-500">
            No active rituals found matching "{searchTerm}". Check the spelling or clear the filter.
          </p>
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Offerings Grid */}
      {!isLoading && !error && filteredOfferings.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredOfferings.map((offering) => (
            <OfferingCard
              key={offering.id}
              offering={offering}
              onAddToCart={onAddToCart}
              isInCart={cartOfferingIds.includes(offering.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
