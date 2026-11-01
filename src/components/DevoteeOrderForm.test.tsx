import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DevoteeOrderForm } from './DevoteeOrderForm';

describe('DevoteeOrderForm (P2 Acceptance Criteria)', () => {
  it('acceptance criterion: the form shows a message next to each invalid field when submitted empty', () => {
    const handleSubmit = vi.fn();
    render(
      <DevoteeOrderForm
        onSubmit={handleSubmit}
        cartItemCount={2}
        totalAmount={110}
      />
    );

    const submitBtn = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(submitBtn);

    // Form should not submit
    expect(handleSubmit).not.toHaveBeenCalled();

    // Messages next to each invalid field
    expect(screen.getByText(/devotee name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
    expect(screen.getByText(/please select a birth star/i)).toBeInTheDocument();
    expect(screen.getByText(/date of offering is required/i)).toBeInTheDocument();
  });

  it('acceptance criterion: rejects dates in the past with a validation error', () => {
    const handleSubmit = vi.fn();
    render(
      <DevoteeOrderForm
        onSubmit={handleSubmit}
        cartItemCount={1}
        totalAmount={50}
      />
    );

    const nameInput = screen.getByLabelText(/devotee name/i);
    const phoneInput = screen.getByLabelText(/phone number/i);
    const starSelect = screen.getByLabelText(/birth star/i);
    const dateInput = screen.getByLabelText(/date of offering/i);

    fireEvent.change(nameInput, { target: { value: 'Anandu Krishna' } });
    fireEvent.change(phoneInput, { target: { value: '9847012345' } });
    fireEvent.change(starSelect, { target: { value: 'Ashwini (Aswathy)' } });

    // Set past date (e.g., 2020-01-01)
    fireEvent.change(dateInput, { target: { value: '2020-01-01' } });

    const submitBtn = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/offering date cannot be in the past/i)).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('submits successfully when all fields are valid with a future date', () => {
    const handleSubmit = vi.fn();
    render(
      <DevoteeOrderForm
        onSubmit={handleSubmit}
        cartItemCount={2}
        totalAmount={110}
      />
    );

    const nameInput = screen.getByLabelText(/devotee name/i);
    const phoneInput = screen.getByLabelText(/phone number/i);
    const starSelect = screen.getByLabelText(/birth star/i);
    const dateInput = screen.getByLabelText(/date of offering/i);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    const futureDateStr = futureDate.toISOString().split('T')[0];

    fireEvent.change(nameInput, { target: { value: 'Anandu Krishna' } });
    fireEvent.change(phoneInput, { target: { value: '9847012345' } });
    fireEvent.change(starSelect, { target: { value: 'Ashwini (Aswathy)' } });
    fireEvent.change(dateInput, { target: { value: futureDateStr } });

    const submitBtn = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledWith({
      devoteeName: 'Anandu Krishna',
      phoneNumber: '9847012345',
      nakshatra: 'Ashwini (Aswathy)',
      offeringDate: futureDateStr,
    });
  });
});

