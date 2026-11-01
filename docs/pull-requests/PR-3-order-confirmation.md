# PR #3: Order Confirmation, Double-Click Guard, and Error Resilience

- **Branch**: `feature/p3-order-confirmation`
- **Target**: `main`
- **Status**: Merged

---

## Problem
Connects the order submission pipeline to the mock asynchronous API, prevents accidental duplicate orders via debouncing and double-click guards, preserves cart items and form data upon network failures, and displays an order confirmation modal with a unique reference ID and receipt details on success.

## Assumptions
- **Double-Click Mitigation**: Both React state (`isSubmittingOrder`) and an immediate synchronous ref (`isSubmittingRef.current`) are combined so that rapid successive button clicks or double-clicks are ignored at the exact tick they occur.
- **Error Recovery Workflow**: If `createOrder` rejects (e.g. 10% simulated mock network failure), the devotee's cart items in localStorage and form inputs are preserved unchanged. A dedicated error banner appears with a one-click "Retry Order" action.
- **Cart Cleanup**: Upon receiving a successful confirmation from the mock API, the cart is emptied via `clearCart()` to ready the application for subsequent bookings.

## Decisions & trade-offs
- **Modal Confirmation**: Implemented an accessible dialog modal (`role="dialog"`, `aria-modal="true"`) summarizing the complete order, including temple name, devotee name, nakshatra, offering date, itemized list, and total amount in ₹.
- **Receipt Printing**: Added a "Print Receipt" button configured to safely invoke `window.print()` when supported.

## How to test
1. **Automated Unit & Integration Tests**:
   ```bash
   npm test src/components/OrderConfirmation.test.tsx
   ```
2. **Acceptance Criteria Verification**:
   - Double-clicking "Place Order" creates exactly 1 order (tested with mock network latency).
   - In the event of an API error, verify the form inputs and cart remain intact, and clicking "Retry Order" succeeds.
   - On success, check that the modal reveals the Order ID (e.g., `ORD-2026-1001`), total in ₹, and resets the cart.

---

## Code Review
- **Reviewer Comment** on `src/components/OrderConfirmationModal.tsx:124`:
  > *"Calling `window.print()` directly may cause unhandled exceptions in environments where `window.print` is undefined (such as non-browser testing contexts or restricted iframes). Check that `typeof window !== 'undefined' && typeof window.print === 'function'` before invoking."*
- **Resolution**:
  - Addressed in commit `27f23ff`: Guarded the print action safely against missing window/print functions.
