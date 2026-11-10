'use client'

import { MinusIcon, PlusIcon } from '@/shared/ui/Icons'

type QuantityStepperProps = {
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
  id?: string
  'aria-label'?: string
}

export function QuantityStepper({
  value,
  onChange,
  min = 0,
  max,
  id,
  'aria-label': ariaLabel = 'Quantity',
}: QuantityStepperProps) {
  const decrement = () => onChange(Math.max(min, value - 1))
  const increment = () =>
    onChange(max == null ? value + 1 : Math.min(max, value + 1))

  return (
    <div className="qty-stepper" role="group" aria-label={ariaLabel}>
      <button
        type="button"
        className="qty-stepper__btn"
        onClick={decrement}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <MinusIcon size="sm" />
      </button>
      <output className="qty-stepper__value" htmlFor={id} aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className="qty-stepper__btn"
        onClick={increment}
        disabled={max != null && value >= max}
        aria-label="Increase quantity"
      >
        <PlusIcon size="sm" />
      </button>
    </div>
  )
}
