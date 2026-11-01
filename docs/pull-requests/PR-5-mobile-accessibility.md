# PR #5: Mobile Responsiveness (360px) and WCAG Accessibility

- **Branch**: `feature/p5-mobile-accessibility`
- **Target**: `main`
- **Status**: Merged

---

## Problem
Optimizes the application interface for small mobile screens down to 360px viewport width with zero horizontal scrolling, ensures the entire devotee booking flow is operable via keyboard alone, associates explicit labels with all form fields, and guarantees WCAG AA/AAA color contrast.

## Assumptions
- **Mobile Breakpoint**: Minimum target phone width is 360px (standard compact Android/iPhone devices). All containers use flexible grids/flexbox, `max-w-full`, and `overflow-x-hidden`.
- **Keyboard Trapping & Escape**: Dialogs/modals (confirmation and cancellation) listen for `Escape` to dismiss and support direct keyboard tab navigation.
- **Screen Reader Announcements**: Error alerts utilize `role="alert"`, `aria-live="polite"`, `aria-invalid="true"`, and `aria-describedby` referencing error element IDs.

## Decisions & trade-offs
- **High-Contrast Palette**: 
  - Text on white: `text-stone-900` (#1c1917) delivers 14.5:1 contrast against `#ffffff` (surpassing WCAG AAA 7:1 requirement).
  - Primary button: `bg-amber-800` (#92400e) with crisp white text delivers > 7:1 contrast.
  - Error badge: `bg-rose-50` with `text-rose-900` (#4c0519) delivers > 9:1 contrast.
- **Focus Rings**: Standardized `focus-visible:ring-2 focus-visible:ring-amber-600 outline-offset-2` on all clickable and interactive elements so keyboard users can trace focus effortlessly.

---

## ⌨️ Written Keyboard Walkthrough (Devotee Booking Flow without Mouse)

1. **Initial Focus & Temple Selection**:
   - Devotee presses `Tab` to navigate past the header directly into the **Select Temple** dropdown (`#temple-select`).
   - Using the `Down Arrow` / `Up Arrow` keys, the devotee selects a temple (e.g. Guruvayur Sree Krishna Temple) and presses `Enter`.
2. **Search & Offering Selection**:
   - Devotee presses `Tab` to focus on the **Search offerings by name** input (`#offering-search`).
   - Types `push` to instantly filter for *Pushpanjali*.
   - Presses `Tab` to reach the **Add Pushpanjali for ₹30 to cart** button.
   - Presses `Enter` or `Space` to add the offering to the cart. The button announces *Added to Cart*, and the cart counter updates to ₹30.
3. **Completing Devotee & Sankalpam Details**:
   - Devotee presses `Tab` to reach **Devotee Name** (`#devotee-name`); types `Anandu Krishna`.
   - Presses `Tab` to reach **Phone Number** (`#phone-number`); types `9847012345`.
   - Presses `Tab` to reach **Birth Star** (`#nakshatra-select`); presses `Down Arrow` to select `Ashwini (Aswathy)` and presses `Enter`.
   - Presses `Tab` to reach **Date of Offering** (`#offering-date`); enters the ritual date (e.g., `2026-11-10`).
4. **Order Submission**:
   - Presses `Tab` to focus on the **Place Order** button.
   - Presses `Enter` to submit the order.
5. **Confirmation Modal Interaction**:
   - The confirmation modal appears with `role="dialog"`, announcing the order ID (e.g. `ORD-2026-1053`) and item total.
   - Devotee can press `Tab` to reach **Print Receipt**, or press `Escape` to immediately dismiss the modal and return focus to the page.

---

## How to test
1. **Automated Unit Tests**:
   ```bash
   npm test src/accessibility.test.tsx
   ```
2. **Acceptance Criteria Verification**:
   - Resize browser window or devtools device emulator to **360 px width**; verify zero horizontal scroll occurs.
   - Run the automated keyboard test in `accessibility.test.tsx`; verifies complete end-to-end booking flow using keyboard events alone (`user.keyboard`).
   - Run tests querying form fields by label (`screen.getByLabelText`); all inputs and dropdowns are successfully located by their accessible `<label>` text.

---

## Code Review
- **Reviewer Comment** on `src/components/DevoteeOrderForm.tsx:162`:
  > *"Input fields used `focus-visible:outline-hidden` and `focus-visible:ring-2`. In Windows High Contrast Mode or forced color modes, box-shadow rings might be suppressed by the operating system. Add `outline-offset-2` to guarantee high contrast indicators remain active."*
- **Resolution**:
  - Addressed in commit `109cc86`: Added `outline-offset-2` to all input and select focus-visible styles.
