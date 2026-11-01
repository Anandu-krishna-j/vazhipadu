# Travancore Devaswom Board (TDB) - Vazhipadu Booking System

A lightweight, accessible, high-performance web application for devotees to book ritual offerings (vazhipadu) at Kerala temples and for temple board staff to search, filter, and manage orders.

Built with **React 18+ / 19**, **TypeScript (Strict Mode)**, **Vite**, **Tailwind CSS**, and **Vitest / React Testing Library**.

---

## 🏛️ Features Overview

1. **P1 – Temple Offerings Catalog**
   - Temple selection dropdown (Sabarimala, Guruvayur, Chottanikkara).
   - Real-time offering search filter by name.
   - Clean display of ritual name, description, category, and pricing in Indian Rupees (₹).
   - Inactive offerings automatically disabled/filtered from booking.
   - Network loading skeletons, empty state prompts, and retryable error banners.

2. **P2 – Offering Cart & Devotee Booking Form**
   - Interactive cart with quantity increment, decrement, and removal.
   - Live total calculation formatted in Indian Rupees (₹) (e.g., 2 Pushpanjali @ ₹30 + 1 Archana @ ₹50 = ₹110).
   - Cart persisted across browser refreshes via `localStorage`.
   - Comprehensive devotee form: Devotee Name, 10-digit Phone Number, Birth Star (Nakshatra from 27 traditional Malayalam/Sanskrit stars), and Offering Date.
   - Real-time and submit validation (disallows past dates, invalid phone formats, or blank fields).

3. **P3 – Resilient Order Confirmation & Double-Click Protection**
   - Direct integration with mock asynchronous API.
   - Debounce and disabled state preventing accidental duplicate order submissions.
   - Fault-tolerant error recovery: if an order call fails (simulated network error), cart and form inputs are preserved so the devotee can easily retry.
   - Upon successful placement: displays a clear confirmation modal with the unique Order ID (e.g. `ORD-2026-1053`) and receipt breakdown, while resetting the cart.

4. **P4 – Staff Order Management & Filtering**
   - Dedicated Temple Staff Portal view.
   - Search orders by phone number substring.
   - Filter by ritual date and order status (`ALL`, `CONFIRMED`, `CANCELLED`, `COMPLETED`).
   - Paginated display (10 orders per page) with total record counters.
   - URL query parameter synchronization so filters and page number survive page refresh.
   - In-place order cancellation with staff confirmation prompt, updating state without full-page reloads.

5. **P5 – Mobile Optimization & Screen-Reader Accessibility**
   - Fully responsive design down to 360px viewport width with zero horizontal scrolling.
   - Complete keyboard accessibility (`Tab`, `Shift+Tab`, `Space`, `Enter`, and accessible button controls).
   - Accessible form controls with explicit `<label htmlFor="...">` and `aria-live` / `aria-describedby` error announcements.
   - High-contrast visual color palette meeting WCAG AA/AAA guidelines.

---

## ⚙️ Tech Stack

- **Framework**: React 19 + TypeScript (Strict Mode)
- **Bundler / Tooling**: Vite 8
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library + `@testing-library/jest-dom` + `jsdom`
- **Mock Network API**: In-memory typed API with random latency (200–1000ms), configurable error simulation (default 10%), pre-seeded with 3 temples, 26+ offerings, and 52 orders.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v22)
- npm 9+

### Installation
```bash
npm install
```

### Running Locally
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### Running Automated Tests
```bash
# Run Vitest test suite once
npm test

# Run tests in watch mode
npm run test:watch
```

### Building for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

---

## 📦 Pull Requests & Development History

This project was built step-by-step following disciplined trunk-based development with feature branches and pull request code reviews:

| Problem | Branch | PR Link / Title | Status |
|---|---|---|---|
| **Base Setup** | `main` | Initial Vite + React + TypeScript base setup & Mock API | Merged |
| **P1** | `feature/p1-offerings-list` | [PR #1: Temple Offerings List, Search, and Error Recovery](#) | Merged |
| **P2** | `feature/p2-cart-order-form` | [PR #2: Offering Cart, LocalStorage Persistence, and Devotee Form](#) | Merged |
| **P3** | `feature/p3-order-confirmation` | [PR #3: Order Confirmation, Double-Click Guard, and Error Resilience](#) | Merged |
| **P4** | `feature/p4-orders-list` | [PR #4: Staff Orders Dashboard, URL State Sync, and Cancellation](#) | Merged |
| **P5** | `feature/p5-mobile-accessibility` | [PR #5: 360px Mobile Layout, WCAG Contrast, and Full Keyboard A11y](#) | Merged |

---

## 📋 Assumptions & Design Decisions

1. **Mock API Network Behavior**: 
   - Uses an in-memory singleton store with configurable failure rate (defaults to 10% in dev mode, 0% in test suites for deterministic testing) and configurable network delay (200–1000ms in dev, 0ms in unit tests).
   - Data persists within the browser session memory.

2. **Offering Booking Rules**:
   - Inactive offerings (e.g. seasonal poojas or restricted rituals) are clearly labeled with a badge and cannot be booked or added to cart.

3. **Cart & Form State**:
   - Cart items persist in `localStorage` (`tdb_vazhipadu_cart_v1`) so devotees don't lose items during accidental refreshes or network errors.
   - Form validation requires Indian 10-digit mobile numbers and dates must be today or in the future.

4. **Staff Management View**:
   - Implemented as a view mode toggle in the navigation header to switch seamlessly between Devotee Booking and Staff Order Lookup without requiring separate server auth.
   - Filters and active page persist via URL query parameters (`?status=...&date=...&phone=...&page=...`).
