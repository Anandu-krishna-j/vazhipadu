# PR #1: Temple Offerings List, Search, and Error Recovery

- **Branch**: `feature/p1-offerings-list`
- **Target**: `main`
- **Status**: Merged

---

## Problem
Allows devotees to select a temple, view all active offerings with pricing, search offerings by name, and retry upon network failure.

## Assumptions
- **Inactive Offerings**: The specification states "Inactive offerings are not offered for booking." We decided to exclude inactive offerings from the bookable catalog view and marked any inactive offerings at the data/API level to safeguard against booking.
- **Temple Selection**: The temple list is loaded on application startup, defaulting to the first temple (Sabarimala) so devotees immediately see rituals without unnecessary extra clicks.
- **Search Behavior**: Case-insensitive substring matching against offering names (e.g. typing "push" matches "Pushpanjali").

## Decisions & trade-offs
- **Component Separation**: Split into `TempleSelector`, `OfferingsList`, and `OfferingCard` for modularity, testability, and reusability.
- **State Handling**: Implemented distinct states for loading (skeleton placeholders), error (retryable alert banner with network retry callback), empty search results (friendly prompt with clear button), and active offerings grid.
- **Mock Failure Handling**: The retry button invokes `fetchOfferings()` again, cleanly recovering without a full page reload.

## How to test
1. **Automated Unit Tests**:
   ```bash
   npm test src/components/OfferingsList.test.tsx
   ```
2. **UI Verification**:
   - Run `npm run dev`.
   - In the dropdown, switch temples (e.g. Guruvayur). Offerings update with respective prices in ₹.
   - Type `push` in the search box; only "Pushpanjali" is shown and others are hidden.
   - Clear the search box to view all offerings again.
   - Trigger a network error (or set failure rate) to verify the error banner and click "Try Again".

---

## Code Review
- **Reviewer Comment** on `src/components/OfferingsList.tsx:38`:
  > *"The search filter currently matches both `name` and `description`. Requirement P1 states: 'The devotee can search offerings by name. Typing "push" shows Pushpanjali and hides offerings that don't match.' Search should strictly match `offering.name` to prevent unintentional matches from ritual descriptions."*
- **Resolution**:
  - Fixed in commit `e1324f6`: Updated filter logic to search strictly on `offering.name.toLowerCase().includes(term)`.

