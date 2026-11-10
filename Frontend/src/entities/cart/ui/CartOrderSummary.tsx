'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { ShieldCheckIcon } from '@/shared/ui/Icons'
import { formatUsd } from '@/shared/lib/format-usd'
import {
  amountUntilFreeShipping,
  cartGrandTotal,
  cartShipping,
  cartSubtotal,
  FREE_SHIPPING_THRESHOLD_USD,
} from '../lib/cart-totals'
import type { CartLineRow } from '../lib/cart-lines'

type CartOrderSummaryProps = {
  rows: CartLineRow[]
  primaryAction?: ReactNode
  compact?: boolean
  /** @default true — на checkout aside отключаем, sticky на родителе */
  sticky?: boolean
}

export function CartOrderSummary({
  rows,
  primaryAction,
  compact = false,
  sticky = true,
}: CartOrderSummaryProps) {
  const subtotal = cartSubtotal(rows)
  const shipping = cartShipping(subtotal)
  const total = cartGrandTotal(subtotal, shipping)
  const untilFree = amountUntilFreeShipping(subtotal)
  const itemCount = rows.reduce((sum, row) => sum + row.quantity, 0)

  return (
    <aside
      className={[
        'order-summary',
        compact ? 'order-summary--compact' : '',
        sticky ? '' : 'order-summary--static',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-labelledby="order-summary-title"
    >
      <h2 id="order-summary-title" className="order-summary__title">
        Order summary
      </h2>
      <p className="order-summary__count">
        {itemCount} {itemCount === 1 ? 'item' : 'items'}
      </p>

      <dl className="order-summary__rows">
        <div className="order-summary__row">
          <dt>Subtotal</dt>
          <dd>{formatUsd(subtotal)}</dd>
        </div>
        <div className="order-summary__row">
          <dt>Shipping</dt>
          <dd>
            {shipping === 0 && subtotal > 0 ? (
              <span className="order-summary__free">Free</span>
            ) : (
              formatUsd(shipping)
            )}
          </dd>
        </div>
        <div className="order-summary__row order-summary__row--total">
          <dt>Total</dt>
          <dd>{formatUsd(total)}</dd>
        </div>
      </dl>

      {untilFree > 0 ? (
        <p className="order-summary__hint">
          Add {formatUsd(untilFree)} more for free shipping (orders over{' '}
          {formatUsd(FREE_SHIPPING_THRESHOLD_USD)}).
        </p>
      ) : subtotal > 0 ? (
        <p className="order-summary__hint order-summary__hint--success">
          You qualify for complimentary shipping.
        </p>
      ) : null}

      {primaryAction}

      <p className="order-summary__trust">
        <ShieldCheckIcon size="sm" />
        <span>Demo checkout — no real payment is processed.</span>
      </p>
    </aside>
  )
}

export function CartCheckoutLink({
  disabled,
  className = 'landing-cta-primary order-summary__cta',
}: {
  disabled?: boolean
  className?: string
}) {
  if (disabled) {
    return (
      <button type="button" className={`${className} is-disabled`} disabled>
        Proceed to checkout
      </button>
    )
  }

  return (
    <Link href="/checkout" className={className}>
      Proceed to checkout
    </Link>
  )
}
