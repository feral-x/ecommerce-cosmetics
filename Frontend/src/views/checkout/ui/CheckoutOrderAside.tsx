'use client'

import {
  buildCartRows,
  cartGrandTotal,
  cartLineReactKey,
  cartShipping,
  cartSubtotal,
  CartLineItem,
  CartOrderSummary,
} from '@/entities/cart'
import type { CartState } from '@/entities/cart/model/types'
import { formatUsd } from '@/shared/lib/format-usd'

type CheckoutOrderAsideProps = {
  lines: CartState
}

export function CheckoutOrderAside({ lines }: CheckoutOrderAsideProps) {
  const rows = buildCartRows(lines)
  const subtotal = cartSubtotal(rows)
  const total = cartGrandTotal(subtotal, cartShipping(subtotal))

  return (
    <aside className="checkout-sidebar" aria-label="Order review">
      <div className="checkout-sidebar__summary">
        <CartOrderSummary
          rows={rows}
          compact
          sticky={false}
          primaryAction={
            <p className="order-summary__aside-note">
              {rows.length} {rows.length === 1 ? 'line' : 'lines'} ·{' '}
              {formatUsd(total)} due
            </p>
          }
        />
      </div>
      <div className="checkout-sidebar__items scrollbar-themed">
        <p className="checkout-sidebar__items-label">Items in order</p>
        <ul className="checkout-mini-cart">
          {rows.map((row) => (
            <CartLineItem
              key={cartLineReactKey(row)}
              row={row}
              editable={false}
            />
          ))}
        </ul>
      </div>
    </aside>
  )
}
