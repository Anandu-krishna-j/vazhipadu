import React from 'react';
import type { Temple } from '../types';
import { Landmark } from 'lucide-react';

interface TempleSelectorProps {
  temples: Temple[];
  selectedTempleId: string | null;
  onSelectTemple: (templeId: string) => void;
  isLoading?: boolean;
}

export const TempleSelector: React.FC<TempleSelectorProps> = ({
  temples,
  selectedTempleId,
  onSelectTemple,
  isLoading = false,
}) => {
  return (
    <div className="rounded-xl border border-amber-200/80 bg-white p-5 shadow-xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <label
            htmlFor="temple-select"
            className="flex items-center gap-2 text-sm font-semibold text-amber-950"
          >
            <Landmark className="h-4 w-4 text-amber-700" aria-hidden="true" />
            <span>Select Temple (ക്ഷേത്രം)</span>
          </label>
          <p className="mt-0.5 text-xs text-stone-500">
            Choose a temple board shrine to view available rituals and offerings
          </p>
        </div>

        <div className="w-full sm:w-80">
          <select
            id="temple-select"
            value={selectedTempleId || ''}
            onChange={(e) => onSelectTemple(e.target.value)}
            disabled={isLoading || temples.length === 0}
            className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm font-medium text-stone-900 transition focus:border-amber-600 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {temples.map((temple) => (
              <option key={temple.id} value={temple.id}>
                {temple.name} ({temple.location.split(',')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
