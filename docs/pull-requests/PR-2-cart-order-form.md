# PR #2: Offering Cart, LocalStorage Persistence, and Devotee Form

- **Branch**: `feature/p2-cart-order-form`
- **Target**: `main`
- **Status**: Merged

---

## Problem
Enables devotees to manage offerings in an interactive cart with live rupee calculations, maintain cart state across page refreshes, and complete the devotee booking form with strict validation for Indian phone numbers, the 27 Nakshatras, and future offering dates.

## Assumptions
- **Cart Persistence**: Stored under localStorage key `tdb_vazhipadu_cart_v1` so that reloading the tab or accidental browser closures preserves the devotee's cart.
- **Star (Nakshatra) Selection**: Included all 27 Malayalam/Sanskrit stars with their traditional names in Kerala temples (e.g. "Ashwini (Aswathy)", "Rohini", "Ardra (Thiruvathira)", "Revati (Revathi)").
- **Date Validation**: Ritual offerings require preparation and priest scheduling; therefore, dates strictly in the past are rejected with an explicit message next to the field.

## Decisions & trade-offs
- **Custom Hook `useCart`**: Abstracted all cart state modifications and synchronization into a clean, reusable React hook with pure functions for quantity modifications and item removals.
- **Accessible Form Validation**: Error messages are placed directly next to their respective form controls, using `role="alert"`, `aria-invalid`, and `aria-describedby` so screen readers and users receive immediate, clear feedback.

## How to test
1. **Automated Unit Tests**:
   ```bash
   npm test src/components/OfferingCart.test.tsx src/components/DevoteeOrderForm.test.tsx src/hooks/useCart.test.ts
   ```
2. **Acceptance Criteria Verification**:
   - Add 2 Pushpanjali (@ ₹30) and 1 Archana (@ ₹50); verify the cart total displays **₹110**.
   - Click "Place Order" with an empty form; verify error messages appear next to Devotee Name, Phone Number, Birth Star, and Date.
   - Enter a past date (e.g. 2020-01-01); verify error "Offering date cannot be in the past".
   - Refresh the page in the browser; verify the cart items and total are preserved.

---

## Code Review
- **Reviewer Comment** on `src/components/DevoteeOrderForm.tsx:37`:
  > *"Using `new Date().toISOString().split('T')[0]` evaluates against UTC rather than the devotee's local timezone (IST, UTC+5:30). In the evening, this can make today's date appear as yesterday in UTC and prematurely mark today as a past date."*
- **Resolution**:
  - Addressed in commit `0b1792c`: Changed date computation to use local date components `now.getFullYear()`, `now.getMonth() + 1`, and `now.getDate()`.
