import { useState, useEffect, useCallback, useRef } from 'react';
import type { Temple, Offering, Order, OrderStatus } from './types';
import { getTemples, getOfferings, createOrder } from './api';
import { useCart } from './hooks/useCart';
import { TempleSelector } from './components/TempleSelector';
import { OfferingsList } from './components/OfferingsList';
import { OfferingCart } from './components/OfferingCart';
import { DevoteeOrderForm, type DevoteeFormData } from './components/DevoteeOrderForm';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrdersList } from './components/OrdersList';
import { Sparkles, ClipboardList } from 'lucide-react';

export default function App() {
  // Parse URL query params on mount for refresh persistence
  const getSearchParams = () => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  };

  const initialParams = getSearchParams();
  const initialView = (initialParams.get('view') as 'booking' | 'orders') || 'booking';
  const initialOrdersPage = parseInt(initialParams.get('page') || '1', 10);
  const initialStatus = (initialParams.get('status') as OrderStatus | 'ALL') || 'ALL';
  const initialDate = initialParams.get('date') || '';
  const initialPhone = initialParams.get('phone') || '';

  const [activeView, setActiveView] = useState<'booking' | 'orders'>(initialView);

  // Filters state for URL sync
  const [ordersFilterState, setOrdersFilterState] = useState({
    page: initialOrdersPage,
    status: initialStatus,
    date: initialDate,
    phone: initialPhone,
  });

  const [temples, setTemples] = useState<Temple[]>([]);
  const [selectedTempleId, setSelectedTempleId] = useState<string | null>(null);
  const [offerings, setOfferings] = useState<Offering[]>([]);

  const [isLoadingTemples, setIsLoadingTemples] = useState(true);
  const [isLoadingOfferings, setIsLoadingOfferings] = useState(false);
  const [offeringsError, setOfferingsError] = useState<string | null>(null);

  // Cart hook with localStorage persistence
  const {
    items: cartItems,
    addItem: addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    totalAmount,
    totalItemsCount,
  } = useCart();

  // Order submission state
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [lastSubmittedFormData, setLastSubmittedFormData] = useState<DevoteeFormData | null>(null);

  // Ref guard against concurrent double-clicking
  const isSubmittingRef = useRef(false);

  // Synchronize view and filters to URL search params (so filters & page survive refresh)
  const syncUrlParams = useCallback((view: 'booking' | 'orders', filters = ordersFilterState) => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (view === 'orders') {
      params.set('view', 'orders');
      if (filters.page > 1) params.set('page', String(filters.page));
      if (filters.status && filters.status !== 'ALL') params.set('status', filters.status);
      if (filters.date) params.set('date', filters.date);
      if (filters.phone) params.set('phone', filters.phone);
    }
    const newSearch = params.toString() ? `?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newSearch);
  }, [ordersFilterState]);

  const handleViewChange = (view: 'booking' | 'orders') => {
    setActiveView(view);
    syncUrlParams(view, ordersFilterState);
  };

  const handleOrdersFilterChange = useCallback((filters: {
    page: number;
    status: OrderStatus | 'ALL';
    date: string;
    phone: string;
  }) => {
    setOrdersFilterState(filters);
    if (activeView === 'orders') {
      syncUrlParams('orders', filters);
    }
  }, [activeView, syncUrlParams]);

  // Load temples on mount
  useEffect(() => {
    let isMounted = true;
    async function loadTemples() {
      setIsLoadingTemples(true);
      try {
        const data = await getTemples();
        if (isMounted) {
          setTemples(data);
          if (data.length > 0) {
            setSelectedTempleId((prev) => prev || data[0].id);
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
  const cartOfferingIds = cartItems.map((i) => i.offering.id);

  // Place order through mock API with double-click guard and failure resilience
  const handleOrderSubmit = async (formData: DevoteeFormData) => {
    if (isSubmittingRef.current || isSubmittingOrder) {
      return;
    }
    if (!selectedTempleId || cartItems.length === 0) {
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmittingOrder(true);
    setOrderError(null);
    setLastSubmittedFormData(formData);

    try {
      const newOrder = await createOrder({
        templeId: selectedTempleId,
        devoteeName: formData.devoteeName,
        phoneNumber: formData.phoneNumber,
        nakshatra: formData.nakshatra,
        offeringDate: formData.offeringDate,
        items: cartItems.map((item) => ({
          offeringId: item.offering.id,
          quantity: item.quantity,
        })),
      });

      // On success: show confirmation with order number & total, empty the cart
      setConfirmedOrder(newOrder);
      clearCart();
      setLastSubmittedFormData(null);
    } catch (err: unknown) {
      // On failure: devotee keeps their cart and form values and can try again
      const errorMessage =
        err instanceof Error ? err.message : 'Order submission failed. Please try again.';
      setOrderError(errorMessage);
    } finally {
      setIsSubmittingOrder(false);
      isSubmittingRef.current = false;
    }
  };

  const handleRetryOrder = () => {
    if (lastSubmittedFormData) {
      handleOrderSubmit(lastSubmittedFormData);
    }
  };

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden bg-amber-50/20 text-stone-900 antialiased">
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

          {/* Navigation View Switcher (Devotee Booking vs Staff Orders) */}
          <div className="flex items-center gap-2">
            <nav className="flex rounded-lg bg-black/20 p-1" aria-label="Portal Navigation">
              <button
                type="button"
                onClick={() => handleViewChange('booking')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition ${
                  activeView === 'booking'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-amber-200 hover:text-white'
                }`}
                aria-pressed={activeView === 'booking'}
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Devotee Booking</span>
              </button>
              <button
                type="button"
                onClick={() => handleViewChange('orders')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition ${
                  activeView === 'orders'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-amber-200 hover:text-white'
                }`}
                aria-pressed={activeView === 'orders'}
              >
                <ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Staff Orders</span>
              </button>
            </nav>

            {/* Cart Header Badge in Booking View */}
            {activeView === 'booking' && (
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-amber-500/20 px-3.5 py-1 text-xs font-bold text-amber-100 backdrop-blur-xs">
                <span>Cart:</span>
                <span>{totalItemsCount} item(s)</span>
                <span>•</span>
                <span className="text-amber-200 font-extrabold">₹{totalAmount}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 space-y-6">
        {activeView === 'orders' ? (
          <section aria-label="Staff Orders Dashboard">
            <OrdersList
              initialPage={ordersFilterState.page}
              initialStatus={ordersFilterState.status}
              initialDate={ordersFilterState.date}
              initialPhone={ordersFilterState.phone}
              onFilterChange={handleOrdersFilterChange}
            />
          </section>
        ) : (
          <>
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

            {/* 2-Column Responsive Layout: Offerings on Left, Cart + Form on Right */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Offerings Column */}
              <div className="lg:col-span-7 xl:col-span-8">
                <section aria-label="Temple Offerings">
                  <OfferingsList
                    offerings={offerings}
                    isLoading={isLoadingOfferings}
                    error={offeringsError}
                    onRetry={() => selectedTempleId && fetchOfferings(selectedTempleId)}
                    onAddToCart={addToCart}
                    cartOfferingIds={cartOfferingIds}
                    templeName={selectedTemple?.name}
                  />
                </section>
              </div>

              {/* Cart & Devotee Booking Column */}
              <div className="lg:col-span-5 xl:col-span-4 space-y-6">
                <section aria-label="Shopping Cart">
                  <OfferingCart
                    items={cartItems}
                    totalAmount={totalAmount}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeItem}
                    onClearCart={clearCart}
                  />
                </section>

                <section aria-label="Devotee Order Form">
                  <DevoteeOrderForm
                    onSubmit={handleOrderSubmit}
                    isSubmitting={isSubmittingOrder}
                    submitError={orderError}
                    onRetry={handleRetryOrder}
                    cartItemCount={totalItemsCount}
                    totalAmount={totalAmount}
                    initialValues={lastSubmittedFormData || undefined}
                  />
                </section>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
      />
    </div>
  );
}
