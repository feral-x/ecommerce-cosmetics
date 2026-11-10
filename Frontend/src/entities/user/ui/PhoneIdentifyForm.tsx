'use client'

import { useState, type FormEvent, type ReactNode } from 'react'
import { formatPhoneDisplay, validatePhoneInput } from '../lib/phone'

type PhoneIdentifyFormProps = {
  eyebrow: string
  title: string
  lead: string
  submitLabel?: string
  onConfirm: (phoneKey: string) => void
  footer?: ReactNode
}

export function PhoneIdentifyForm({
  eyebrow,
  title,
  lead,
  submitLabel = 'Confirm',
  onConfirm,
  footer,
}: PhoneIdentifyFormProps) {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const result = validatePhoneInput(phone)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setError(null)
    onConfirm(result.phoneKey)
  }

  const validated = phone.trim() ? validatePhoneInput(phone) : null
  const preview =
    validated?.ok === true ? formatPhoneDisplay(validated.phoneKey) : null

  return (
    <div className="checkout-identify">
      <p className="landing-eyebrow">{eyebrow}</p>
      <h1 className="checkout-identify__title font-display">{title}</h1>
      <p className="checkout-identify__lead">{lead}</p>

      <form className="checkout-identify__form" onSubmit={handleSubmit}>
        <label className="checkout-field">
          <span>Phone number</span>
          <input
            type="tel"
            name="phone"
            className="filter-input"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+7 (900) 123-45-67"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
              setError(null)
            }}
            aria-invalid={error != null}
            required
          />
        </label>
        {error ? (
          <p className="checkout-form-error" role="alert">
            {error}
          </p>
        ) : null}
        <button type="submit" className="landing-cta-primary checkout-identify__submit">
          {submitLabel}
        </button>
      </form>

      <p className="checkout-identify__hint">
        {preview ? (
          <>
            Account <strong>{preview}</strong> on this device.
          </>
        ) : (
          'Enter at least 10 digits — spaces and dashes are fine.'
        )}
      </p>

      {footer}
    </div>
  )
}
