import { useState, useEffect, useCallback } from 'react';
import type { Temple, Offering } from './types';
import { getTemples, getOfferings } from './api';
import { TempleSelector } from './components/TempleSelector';
import { OfferingsList } from './components/OfferingsList';

export default function App() {
  const [temples, setTemples] = useState<Temple[]>([]);
  const [selectedTempleId, setSelectedTempleId] = useState<string | null>(null);
  const [offerings, setOfferings] = useState<Offering[]>([]);

  const [isLoadingTemples, setIsLoadingTemples] = useState(true);
  const [isLoadingOfferings, setIsLoadingOfferings] = useState(false);
  const [offeringsError, setOfferingsError] = useState<string | null>(null);

  // Load temples on mount
  useEffect(() => {
    let isMounted = true;
    async function loadTemples() {
      setIsLoadingTemples(true);
      try {
        const data = await getTemples();
        if (isMounted) {
          setTemples(data);
          if (data.length > 0 && !selectedTempleId) {
            setSelectedTempleId(data[0].id);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load temples:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoadingTemples(false);
        }
      }
    }
    loadTemples();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch offerings whenever selected temple changes
  const fetchOfferings = useCallback(async (templeId: string) => {
    setIsLoadingOfferings(true);
    setOfferingsError(null);
    try {
      const data = await getOfferings(templeId);
      setOfferings(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch temple offerings.';
      setOfferingsError(message);
    } finally {
      setIsLoadingOfferings(false);
    }
  }, []);

  useEffect(() => {
    if (selectedTempleId) {
      fetchOfferings(selectedTempleId);
    }
  }, [selectedTempleId, fetchOfferings]);

  const selectedTemple = temples.find((t) => t.id === selectedTempleId);

  return (
    <div className="min-h-screen bg-amber-50/20 text-stone-900 antialiased">
      {/* Header */}
      <header className="border-b border-amber-800/20 bg-gradient-to-r from-amber-800 via-amber-900 to-amber-950 text-white shadow-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/20 text-2xl shadow-inner"
              aria-hidden="true"
            >
              🪔
            </span>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-amber-100 sm:text-2xl">
                തിരുവിതാംകൂർ ദേവസ്വം ബോർഡ്
              </h1>
              <p className="text-xs font-medium tracking-wide text-amber-200/90 sm:text-sm">
                Travancore Devaswom Board • Vazhipadu Portal
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 space-y-6">
        {/* Temple Selector */}
        <TempleSelector
          temples={temples}
          selectedTempleId={selectedTempleId}
          onSelectTemple={(id) => setSelectedTempleId(id)}
          isLoading={isLoadingTemples}
        />

        {/* Selected Temple Info Banner */}
        {selectedTemple && (
          <div className="rounded-xl border border-amber-200/70 bg-gradient-to-r from-amber-50 to-orange-50/40 p-4 text-stone-800 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Deity: {selectedTemple.deity}
                </span>
                <h2 className="text-base font-bold text-stone-900">
                  {selectedTemple.name}
                </h2>
              </div>
              <span className="text-xs text-stone-500 font-medium">
                📍 {selectedTemple.location}
              </span>
            </div>
            <p className="mt-1 text-xs text-stone-600">
              {selectedTemple.description}
            </p>
          </div>
        )}

        {/* Offerings Catalog */}
        <section aria-label="Temple Offerings">
          <OfferingsList
            offerings={offerings}
            isLoading={isLoadingOfferings}
            error={offeringsError}
            onRetry={() => selectedTempleId && fetchOfferings(selectedTempleId)}
            templeName={selectedTemple?.name}
          />
        </section>
      </main>
    </div>
  );
}
