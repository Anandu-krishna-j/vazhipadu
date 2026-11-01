import React, { useState } from 'react';
import { NAKSHATRAS } from '../types';
import { Calendar, User, Phone, Sparkles, Send, AlertCircle, RefreshCw } from 'lucide-react';

export interface DevoteeFormData {
  devoteeName: string;
  phoneNumber: string;
  nakshatra: string;
  offeringDate: string;
}

interface DevoteeOrderFormProps {
  initialValues?: Partial<DevoteeFormData>;
  onSubmit: (data: DevoteeFormData) => void;
  isSubmitting?: boolean;
  submitError?: string | null;
  onRetry?: () => void;
  cartItemCount: number;
  totalAmount: number;
}

export const DevoteeOrderForm: React.FC<DevoteeOrderFormProps> = ({
  initialValues = {},
  onSubmit,
  isSubmitting = false,
  submitError = null,
  onRetry,
  cartItemCount,
  totalAmount,
}) => {
  const [formData, setFormData] = useState<DevoteeFormData>({
    devoteeName: initialValues.devoteeName || '',
    phoneNumber: initialValues.phoneNumber || '',
    nakshatra: initialValues.nakshatra || '',
    offeringDate: initialValues.offeringDate || '',
  });

  const [errors, setErrors] = useState<{ [K in keyof DevoteeFormData]?: string }>({});
  const [touched, setTouched] = useState<{ [K in keyof DevoteeFormData]?: boolean }>({});

  // Compute today's date in local timezone to avoid UTC boundary shifts
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const validateField = (name: keyof DevoteeFormData, value: string): string | undefined => {
    switch (name) {
      case 'devoteeName':
        if (!value.trim()) {
          return 'Devotee name is required';
        }
        if (value.trim().length < 2) {
          return 'Name must be at least 2 characters';
        }
        return undefined;

      case 'phoneNumber':
        if (!value.trim()) {
          return 'Phone number is required';
        }
        if (!/^\d{10}$/.test(value.trim())) {
          return 'Please enter a valid 10-digit mobile number';
        }
        return undefined;

      case 'nakshatra':
        if (!value.trim()) {
          return 'Please select a birth star (nakshatra)';
        }
        return undefined;

      case 'offeringDate':
        if (!value) {
          return 'Date of offering is required';
        }
        if (value < todayStr) {
          return 'Offering date cannot be in the past';
        }
        return undefined;

      default:
        return undefined;
    }
  };

  const validateAll = (): boolean => {
    const newErrors: { [K in keyof DevoteeFormData]?: string } = {};
    (Object.keys(formData) as (keyof DevoteeFormData)[]).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    setTouched({
      devoteeName: true,
      phoneNumber: true,
      nakshatra: true,
      offeringDate: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (name: keyof DevoteeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name: keyof DevoteeFormData) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Guard against duplicate submissions
    if (validateAll()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="rounded-xl border border-amber-200/80 bg-white p-4 sm:p-5 shadow-xs">
      <div className="border-b border-stone-200 pb-3">
        <h2 className="text-base font-bold text-stone-900">
          Devotee & Sankalpam Details
        </h2>
        <p className="mt-0.5 text-xs text-stone-600">
          Please provide the devotee's star details for the priest to perform the ritual
        </p>
      </div>

      {/* Submission Failure Alert Banner with Retry Button */}
      {submitError && (
        <div
          role="alert"
          aria-live="assertive"
          className="mt-4 rounded-lg border border-rose-300 bg-rose-50 p-4 text-xs text-rose-900"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-rose-700 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1">
              <p className="font-bold text-rose-950">Order Submission Failed</p>
              <p className="mt-0.5 text-rose-800">{submitError}</p>
              <p className="mt-1 text-[11px] text-rose-700">
                Your cart and entered details have been preserved. You can safely try again.
              </p>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  disabled={isSubmitting}
                  className="mt-2.5 inline-flex items-center gap-1.5 rounded-md bg-rose-800 px-3 py-1.5 font-semibold text-white hover:bg-rose-900 focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-rose-500 transition"
                >
                  <RefreshCw className="h-3 w-3" aria-hidden="true" />
                  <span>Retry Order</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
        {/* Devotee Name */}
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="devotee-name"
              className="flex items-center gap-1.5 text-xs font-bold text-stone-900"
            >
              <User className="h-3.5 w-3.5 text-amber-800" aria-hidden="true" />
              <span>Devotee Name (ഭക്തന്റെ പേര്) *</span>
            </label>
            {errors.devoteeName && (
              <span
                id="devotee-name-error"
                role="alert"
                aria-live="polite"
                className="text-xs font-semibold text-rose-700"
              >
                {errors.devoteeName}
              </span>
            )}
          </div>
          <input
            id="devotee-name"
            type="text"
            value={formData.devoteeName}
            onChange={(e) => handleChange('devoteeName', e.target.value)}
            onBlur={() => handleBlur('devoteeName')}
            placeholder="e.g. Anandu Krishna"
            aria-required="true"
            aria-invalid={!!errors.devoteeName}
            aria-describedby={errors.devoteeName ? 'devotee-name-error' : undefined}
            className={`mt-1 w-full rounded-lg border px-3.5 py-2 text-sm text-stone-900 transition outline-offset-2 focus-visible:outline-hidden focus-visible:ring-2 ${
              errors.devoteeName
                ? 'border-rose-400 bg-rose-50/40 focus-visible:border-rose-600 focus-visible:ring-rose-500/30'
                : 'border-stone-300 bg-white focus-visible:border-amber-700 focus-visible:ring-amber-500/30'
            }`}
          />
        </div>

        {/* Phone Number */}
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="phone-number"
              className="flex items-center gap-1.5 text-xs font-bold text-stone-900"
            >
              <Phone className="h-3.5 w-3.5 text-amber-800" aria-hidden="true" />
              <span>Phone Number (ഫോൺ നമ്പർ) *</span>
            </label>
            {errors.phoneNumber && (
              <span
                id="phone-number-error"
                role="alert"
                aria-live="polite"
                className="text-xs font-semibold text-rose-700"
              >
                {errors.phoneNumber}
              </span>
            )}
          </div>
          <input
            id="phone-number"
            type="tel"
            maxLength={10}
            value={formData.phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value.replace(/\D/g, ''))}
            onBlur={() => handleBlur('phoneNumber')}
            placeholder="10-digit mobile number (e.g. 9847012345)"
            aria-required="true"
            aria-invalid={!!errors.phoneNumber}
            aria-describedby={errors.phoneNumber ? 'phone-number-error' : undefined}
            className={`mt-1 w-full rounded-lg border px-3.5 py-2 text-sm text-stone-900 transition outline-offset-2 focus-visible:outline-hidden focus-visible:ring-2 ${
              errors.phoneNumber
                ? 'border-rose-400 bg-rose-50/40 focus-visible:border-rose-600 focus-visible:ring-rose-500/30'
                : 'border-stone-300 bg-white focus-visible:border-amber-700 focus-visible:ring-amber-500/30'
            }`}
          />
        </div>

        {/* Birth Star (Nakshatra) */}
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="nakshatra-select"
              className="flex items-center gap-1.5 text-xs font-bold text-stone-900"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-800" aria-hidden="true" />
              <span>Birth Star (നക്ഷത്രം) *</span>
            </label>
            {errors.nakshatra && (
              <span
                id="nakshatra-error"
                role="alert"
                aria-live="polite"
                className="text-xs font-semibold text-rose-700"
              >
                {errors.nakshatra}
              </span>
            )}
          </div>
          <select
            id="nakshatra-select"
            value={formData.nakshatra}
            onChange={(e) => handleChange('nakshatra', e.target.value)}
            onBlur={() => handleBlur('nakshatra')}
            aria-required="true"
            aria-invalid={!!errors.nakshatra}
            aria-describedby={errors.nakshatra ? 'nakshatra-error' : undefined}
            className={`mt-1 w-full rounded-lg border px-3.5 py-2 text-sm text-stone-900 transition outline-offset-2 focus-visible:outline-hidden focus-visible:ring-2 ${
              errors.nakshatra
                ? 'border-rose-400 bg-rose-50/40 focus-visible:border-rose-600 focus-visible:ring-rose-500/30'
                : 'border-stone-300 bg-white focus-visible:border-amber-700 focus-visible:ring-amber-500/30'
            }`}
          >
            <option value="">-- Choose one of the 27 Nakshatras --</option>
            {NAKSHATRAS.map((star) => (
              <option key={star} value={star}>
                {star}
              </option>
            ))}
          </select>
        </div>

        {/* Date of the Offering */}
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="offering-date"
              className="flex items-center gap-1.5 text-xs font-bold text-stone-900"
            >
              <Calendar className="h-3.5 w-3.5 text-amber-800" aria-hidden="true" />
              <span>Date of Offering (പൂജ തീയതി) *</span>
            </label>
            {errors.offeringDate && (
              <span
                id="offering-date-error"
                role="alert"
                aria-live="polite"
                className="text-xs font-semibold text-rose-700"
              >
                {errors.offeringDate}
              </span>
            )}
          </div>
          <input
            id="offering-date"
            type="date"
            min={todayStr}
            value={formData.offeringDate}
            onChange={(e) => handleChange('offeringDate', e.target.value)}
            onBlur={() => handleBlur('offeringDate')}
            aria-required="true"
            aria-invalid={!!errors.offeringDate}
            aria-describedby={errors.offeringDate ? 'offering-date-error' : undefined}
            className={`mt-1 w-full rounded-lg border px-3.5 py-2 text-sm text-stone-900 transition outline-offset-2 focus-visible:outline-hidden focus-visible:ring-2 ${
              errors.offeringDate
                ? 'border-rose-400 bg-rose-50/40 focus-visible:border-rose-600 focus-visible:ring-rose-500/30'
                : 'border-stone-300 bg-white focus-visible:border-amber-700 focus-visible:ring-amber-500/30'
            }`}
          />
          <p className="mt-1 text-[11px] text-stone-500">
            Ritual offerings can only be scheduled for today or upcoming future dates.
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || cartItemCount === 0}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-800 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-amber-900 outline-offset-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
                Placing Order...
              </span>
            ) : (
              <>
                <Send className="h-4 w-4" aria-hidden="true" />
                <span>
                  Place Order • ₹{totalAmount} ({cartItemCount} item{cartItemCount === 1 ? '' : 's'})
                </span>
              </>
            )}
          </button>
          {cartItemCount === 0 && (
            <p className="mt-1.5 text-center text-xs text-amber-900 font-medium">
              Please add at least one offering to your cart above before placing order.
            </p>
          )}
        </div>
      </form>
    </div>
  );
};
