# Travancore Devaswom Board (TDB) - Vazhipadu Booking System

A lightweight, accessible, high-performance web application for devotees to book ritual offerings (*vazhipadu*) across Kerala temples and for temple board staff to search, filter, and manage orders.

Built with **React 18+ / 19**, **TypeScript (Strict Mode)**, **Vite**, **Tailwind CSS**, and **Vitest / React Testing Library**.

---

## 🏛️ Features Overview

1. **P1 – Temple Offerings Catalog**
   - Temple selection dropdown (Sabarimala, Guruvayur, Chottanikkara).
   - Real-time offering search filter strictly matching offering names.
   - Clean display of ritual name, description, category badge, and pricing in Indian Rupees (₹).
   - Inactive offerings automatically disabled and excluded from booking.
   - Loading skeletons, empty state prompts, and retryable error banners.

2. **P2 – Offering Cart & Devotee Booking Form**
   - Interactive cart with quantity increment, decrement, and removal.
   - Live total calculation formatted in Indian Rupees (₹) (e.g., 2 Pushpanjali @ ₹30 + 1 Archana @ ₹50 = ₹110).
   - Cart persisted across browser refreshes via `localStorage` (`tdb_vazhipadu_cart_v1`).
   - Comprehensive devotee form: Devotee Name, 10-digit Phone Number, Birth Star (Nakshatra from 27 traditional Malayalam/Sanskrit stars), and Offering Date.
   - Immediate and submit validation (disallows past dates, invalid phone numbers, or empty fields).

3. **P3 – Resilient Order Confirmation & Double-Click Protection**
   - Direct integration with mock asynchronous API.
   - In-flight debounce guard preventing duplicate order submissions on double-clicking.
   - Fault-tolerant error recovery: if an order call fails (simulated network error), cart items and form inputs are preserved so the devotee can easily retry.
   - Upon successful placement: displays a clear confirmation modal with the unique Order ID (e.g. `ORD-2026-1053`) and receipt breakdown, while resetting the cart.

4. **P4 – Staff Order Management & Filtering**
   - Dedicated Temple Staff Portal view toggle.
   - Search orders by phone number substring.
   - Filter by ritual date and order status (`ALL`, `CONFIRMED`, `CANCELLED`, `COMPLETED`).
   - Paginated display (10 orders per page) with total record counters.
   - URL query parameter synchronization (`?view=orders&page=...&status=...&date=...&phone=...`) so filters and active page survive page refresh.
   - In-place order cancellation with staff confirmation modal, updating state without full-page reloads.

5. **P5 – Mobile Optimization & Screen-Reader Accessibility**
   - Fully responsive design down to 360px viewport width with zero horizontal scrolling.
   - Complete booking flow operable via keyboard alone (`Tab`, `Shift+Tab`, `Space`, `Enter`, `Escape`).
   - Accessible form controls with explicit `<label htmlFor="...">` and `aria-live` / `aria-describedby` error announcements.
   - High-contrast visual color palette meeting WCAG AA/AAA guidelines.

---

## ⚙️ Tech Stack

- **Framework**: React 19 + TypeScript (Strict Mode)
- **Tooling**: Vite 8
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
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Running Automated Tests
```bash
# Run the complete test suite (26 tests across 8 suites)
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

## 📦 Pull Requests & Git Workflow History

This repository followed disciplined trunk-based development with 5 dedicated feature branches, 5 PRs, inline code reviews, review resolutions, and merges:

| Problem | Branch | PR Document & Review Record | Status |
|---|---|---|---|
| **Base Setup** | `main` | Initial Vite + React + TypeScript base setup & Mock API | Merged |
| **P1** | `feature/p1-offerings-list` | [PR #1: Temple Offerings List, Search, and Error Recovery](./docs/pull-requests/PR-1-offerings-list.md) | Merged |
| **P2** | `feature/p2-cart-order-form` | [PR #2: Offering Cart, LocalStorage Persistence, and Devotee Form](./docs/pull-requests/PR-2-cart-order-form.md) | Merged |
| **P3** | `feature/p3-order-confirmation` | [PR #3: Order Confirmation, Double-Click Guard, and Error Resilience](./docs/pull-requests/PR-3-order-confirmation.md) | Merged |
| **P4** | `feature/p4-orders-list` | [PR #4: Staff Orders Dashboard, URL State Sync, and Cancellation](./docs/pull-requests/PR-4-orders-list.md) | Merged |
| **P5** | `feature/p5-mobile-accessibility` | [PR #5: 360px Mobile Layout, WCAG Contrast, and Full Keyboard A11y](./docs/pull-requests/PR-5-mobile-accessibility.md) | Merged |

---

## 📂 Repository File Tree & Purpose

```
vazhipadu/
├── docs/
│   └── pull-requests/
│       ├── PR-1-offerings-list.md        # PR description, assumptions & review resolution for P1
│       ├── PR-2-cart-order-form.md        # PR description, assumptions & review resolution for P2
│       ├── PR-3-order-confirmation.md     # PR description, assumptions & review resolution for P3
│       ├── PR-4-orders-list.md            # PR description, assumptions & review resolution for P4
│       └── PR-5-mobile-accessibility.md   # PR description, assumptions, keyboard walkthrough & review resolution for P5
├── src/
│   ├── api/
│   │   ├── index.ts                       # API exports
│   │   ├── mockApi.ts                     # In-memory mock network store with configurable failure & delay
│   │   ├── mockApi.test.ts                # Unit tests verifying mock API operations
│   │   └── seedData.ts                    # 3 temples, 26+ offerings, 52 pre-seeded orders
│   ├── components/
│   │   ├── DevoteeOrderForm.tsx           # Form with 27 nakshatras, date validation, and aria-live errors
│   │   ├── DevoteeOrderForm.test.tsx      # Tests for form validation (past date, required fields)
│   │   ├── OfferingCard.tsx               # Individual offering item card with rupee price & bookable check
│   │   ├── OfferingCart.tsx               # Cart items, increment/decrement, remove, and grand total in ₹
│   │   ├── OfferingCart.test.tsx          # Tests verifying 2 Pushpanjali + 1 Archana = ₹110
│   │   ├── OfferingsList.tsx              # Offering grid, search filter, skeleton loader, retryable error
│   │   ├── OfferingsList.test.tsx         # Tests for "push" search and error retry
│   │   ├── OrderConfirmationModal.tsx     # Success modal dialog with order ID, receipt breakdown, print option
│   │   ├── OrderConfirmation.test.tsx     # Tests verifying double-click protection and error recovery
│   │   ├── OrdersList.tsx                 # Staff order dashboard: pagination, status/date/phone filters, cancel flow
│   │   ├── OrdersList.test.tsx            # Tests for status filter reset to page 1, refresh sync, in-place cancel
│   │   └── TempleSelector.tsx             # Dropdown selector for Kerala temples
│   ├── hooks/
│   │   ├── useCart.ts                     # Custom hook with localStorage persistence
│   │   └── useCart.test.ts                # Tests verifying cart survives refresh
│   ├── types/
│   │   └── index.ts                       # TypeScript interfaces for Temple, Offering, Order, Nakshatra
│   ├── accessibility.test.tsx             # Tests for 360px mobile width, keyboard walkthrough, and getByLabelText
│   ├── App.tsx                            # Root application view orchestrator with URL sync & portal toggle
│   ├── index.css                          # Tailwind CSS imports and typography
│   ├── main.tsx                           # Application entry point
│   └── setupTests.ts                      # Jest-DOM matchers for Vitest
├── package.json                           # Dependencies and scripts (dev, build, test, lint)
├── tsconfig.json                          # TypeScript configuration
├── vite.config.ts                         # Vite configuration with Tailwind CSS & Vitest
└── README.md                              # Complete system guide, test instructions, and PR index
```
