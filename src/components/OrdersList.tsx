import React, { useState, useEffect, useCallback } from 'react';
import type { Order, OrderStatus, PaginatedOrders } from '../types';
import { getOrders, cancelOrder } from '../api';
import {
  Search,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Ban,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  Phone,
  User,
  Sparkles,
} from 'lucide-react';

interface OrdersListProps {
  initialPage?: number;
  initialStatus?: OrderStatus | 'ALL';
  initialDate?: string;
  initialPhone?: string;
  onFilterChange?: (filters: {
    page: number;
    status: OrderStatus | 'ALL';
    date: string;
    phone: string;
  }) => void;
}

export const OrdersList: React.FC<OrdersListProps> = ({
  initialPage = 1,
  initialStatus = 'ALL',
  initialDate = '',
  initialPhone = '',
  onFilterChange,
}) => {
  const [ordersData, setOrdersData] = useState<PaginatedOrders>({
    orders: [],
    totalCount: 0,
    page: initialPage,
    pageSize: 10,
    totalPages: 1,
  });

  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>(initialStatus);
  const [dateFilter, setDateFilter] = useState<string>(initialDate);
  const [phoneSearch, setPhoneSearch] = useState<string>(initialPhone);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cancellation modal state
  const [cancellingOrder, setCancellingOrder] = useState<Order | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getOrders({
        page: currentPage,
        pageSize: 10,
        status: statusFilter,
        date: dateFilter || undefined,
        phoneNumber: phoneSearch || undefined,
      });
      setOrdersData(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch orders.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, statusFilter, dateFilter, phoneSearch]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Notify parent of filter/page changes for URL state persistence
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        page: currentPage,
        status: statusFilter,
        date: dateFilter,
        phone: phoneSearch,
      });
    }
  }, [currentPage, statusFilter, dateFilter, phoneSearch, onFilterChange]);

  // Acceptance Criterion: "Filtering by status shows only matching orders and goes back to page 1."
  const handleStatusChange = (status: OrderStatus | 'ALL') => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleDateChange = (date: string) => {
    setDateFilter(date);
    setCurrentPage(1);
  };

  const handlePhoneChange = (phone: string) => {
    setPhoneSearch(phone);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setStatusFilter('ALL');
    setDateFilter('');
    setPhoneSearch('');
    setCurrentPage(1);
  };

  // Staff order cancellation handler
  const handleConfirmCancel = async () => {
    if (!cancellingOrder) return;
    setIsCancelling(true);
    setCancelError(null);
    try {
      const updated = await cancelOrder(cancellingOrder.id);
      // Acceptance Criterion: "A cancelled order shows as cancelled without reloading the page."
      setOrdersData((prev) => ({
        ...prev,
        orders: prev.orders.map((o) => (o.id === updated.id ? updated : o)),
      }));
      setCancellingOrder(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to cancel order.';
      setCancelError(msg);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-stone-900">
            Temple Staff Order Management (ഓർഡറുകൾ)
          </h2>
          <p className="text-xs text-stone-500">
            View, search, filter and manage devotee vazhipadu bookings across temples
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-amber-100/80 px-3 py-1.5 text-xs font-bold text-amber-900">
            Total Orders: {ordersData.totalCount}
          </span>
          <button
            type="button"
            onClick={fetchOrders}
            className="rounded-lg border border-stone-200 bg-white p-2 text-stone-600 hover:bg-stone-50 transition"
            aria-label="Refresh orders list"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-xs">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Status Filter */}
          <div>
            <label
              htmlFor="filter-status"
              className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 mb-1"
            >
              <Filter className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />
              <span>Status Filter</span>
            </label>
            <select
              id="filter-status"
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value as OrderStatus | 'ALL')}
              className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-xs font-medium text-stone-800 transition focus:border-amber-600 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            >
              <option value="ALL">All Statuses (എല്ലാം)</option>
              <option value="CONFIRMED">CONFIRMED (സ്ഥിരീകരിച്ചു)</option>
              <option value="CANCELLED">CANCELLED (റദ്ദാക്കി)</option>
              <option value="COMPLETED">COMPLETED (പൂർത്തിയായി)</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label
              htmlFor="filter-date"
              className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 mb-1"
            >
              <Calendar className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />
              <span>Offering Date</span>
            </label>
            <input
              id="filter-date"
              type="date"
              value={dateFilter}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-xs font-medium text-stone-800 transition focus:border-amber-600 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Phone Search */}
          <div>
            <label
              htmlFor="search-phone"
              className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 mb-1"
            >
              <Phone className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />
              <span>Search Phone Number</span>
            </label>
            <div className="relative">
              <input
                id="search-phone"
                type="text"
                placeholder="Search by phone..."
                value={phoneSearch}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 pl-8 text-xs font-medium text-stone-800 transition focus:border-amber-600 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
              />
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
            </div>
          </div>

          {/* Clear Filters Action */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleClearFilters}
              className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800"
        >
          <div className="flex items-center justify-between">
            <p className="font-semibold">{error}</p>
            <button
              type="button"
              onClick={fetchOrders}
              className="rounded bg-rose-700 px-3 py-1 font-semibold text-white hover:bg-rose-800"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Orders Table Container */}
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600" aria-label="Orders table">
            <thead className="border-b border-stone-200 bg-stone-50 text-[11px] font-bold uppercase tracking-wider text-stone-500">
              <tr>
                <th scope="col" className="px-4 py-3.5">Order Ref</th>
                <th scope="col" className="px-4 py-3.5">Offering Date</th>
                <th scope="col" className="px-4 py-3.5">Devotee & Star</th>
                <th scope="col" className="px-4 py-3.5">Offerings Booked</th>
                <th scope="col" className="px-4 py-3.5 text-right">Total</th>
                <th scope="col" className="px-4 py-3.5">Status</th>
                <th scope="col" className="px-4 py-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-500">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin text-amber-700" />
                      <span>Loading orders...</span>
                    </div>
                  </td>
                </tr>
              ) : ordersData.orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-500">
                    <p className="font-semibold">No orders found matching the filter criteria.</p>
                    <p className="mt-1 text-stone-400">Try adjusting status, date, or phone filters.</p>
                  </td>
                </tr>
              ) : (
                ordersData.orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-amber-50/20 transition"
                    data-testid={`order-row-${order.id}`}
                  >
                    <td className="px-4 py-3.5 font-bold text-stone-900 whitespace-nowrap">
                      <div>{order.id}</div>
                      <div className="text-[10px] text-stone-400 font-normal truncate max-w-[130px]">
                        {order.templeName}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="font-medium text-stone-800">{order.offeringDate}</span>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-stone-900 flex items-center gap-1">
                        <User className="h-3 w-3 text-stone-400" />
                        <span>{order.devoteeName}</span>
                      </div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                        <Phone className="h-3 w-3 text-stone-400" />
                        <span>{order.phoneNumber}</span>
                      </div>
                      <div className="text-[10px] text-amber-800 flex items-center gap-1 mt-0.5 font-medium">
                        <Sparkles className="h-2.5 w-2.5 text-amber-600" />
                        <span>{order.nakshatra}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <ul className="space-y-0.5">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="text-stone-700 font-medium">
                            {item.offeringName} <span className="text-stone-400">×{item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </td>

                    <td className="px-4 py-3.5 text-right font-bold text-amber-950 whitespace-nowrap">
                      ₹{order.totalAmount}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        data-testid={`order-status-${order.id}`}
                        className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-bold ${
                          order.status === 'CONFIRMED'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : order.status === 'CANCELLED'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : 'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {order.status === 'CONFIRMED' && (
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        )}
                        {order.status === 'CANCELLED' && (
                          <Ban className="h-3 w-3 text-rose-600" />
                        )}
                        {order.status === 'COMPLETED' && (
                          <Clock className="h-3 w-3 text-blue-600" />
                        )}
                        <span>{order.status}</span>
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      {order.status === 'CONFIRMED' ? (
                        <button
                          type="button"
                          onClick={() => setCancellingOrder(order)}
                          className="rounded-md border border-stone-200 bg-white px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition"
                          aria-label={`Cancel order ${order.id}`}
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-stone-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-stone-200 bg-stone-50 px-4 py-3 gap-2">
          <div className="text-xs text-stone-500">
            Showing Page <span className="font-bold text-stone-800">{ordersData.page}</span> of{' '}
            <span className="font-bold text-stone-800">{ordersData.totalPages}</span> (
            <span className="font-bold text-stone-800">{ordersData.totalCount}</span> total orders)
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={ordersData.page <= 1 || isLoading}
              className="flex items-center gap-1 rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous Page"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>
            <span className="text-xs font-bold text-stone-700 px-2">
              {ordersData.page} / {ordersData.totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(ordersData.totalPages, p + 1))}
              disabled={ordersData.page >= ordersData.totalPages || isLoading}
              className="flex items-center gap-1 rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next Page"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Cancel Order Confirmation Modal */}
      {cancellingOrder && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 id="cancel-dialog-title" className="text-base font-bold text-stone-900">
                  Confirm Order Cancellation
                </h3>
                <p className="text-xs text-stone-500">
                  Temple board staff authorization required
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-stone-50 p-3 text-xs space-y-1.5 border border-stone-200">
              <div className="flex justify-between">
                <span className="text-stone-500">Order ID:</span>
                <span className="font-bold text-stone-900">{cancellingOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Devotee:</span>
                <span className="font-semibold text-stone-800">{cancellingOrder.devoteeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Offering Date:</span>
                <span className="font-semibold text-stone-800">{cancellingOrder.offeringDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Total Amount:</span>
                <span className="font-bold text-amber-900">₹{cancellingOrder.totalAmount}</span>
              </div>
            </div>

            {cancelError && (
              <p className="mt-2 text-xs font-semibold text-rose-600" role="alert">
                {cancelError}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCancellingOrder(null)}
                disabled={isCancelling}
                className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="rounded-lg bg-rose-700 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-800 transition disabled:opacity-50"
              >
                {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
