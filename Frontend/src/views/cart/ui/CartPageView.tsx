'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import {
  buildCartRows,
  cartLineReactKey,
  CartCheckoutLink,
  CartLineItem,
  CartOrderSummary,
  useCart,
} from '@/entities/cart'
import { formatPhoneDisplay } from '@/entities/user'
import { ArrowRightIcon } from '@/shared/ui/Icons'

export function CartPageView() {
  const { lines, setProductQuantity, totalItems, userPhoneKey } = useCart()

  const rows = useMemo(() => buildCartRows(lines), [lines])

  const handleQuantity = (lineId: string, quantity: number) => {
    setProductQuantity(lineId, quantity)
  }

  const handleRemove = (lineId: string) => {
    setProductQuantity(lineId, 0)
  }

  if (totalItems === 0) {
    return (
      <div className="cart-empty">
        <div className="container mx-auto px-4 py-16 text-center lg:px-6 lg:py-20">
          <p className="landing-eyebrow">Your bag</p>
          <h1 className="font-display text-3xl text-text-primary md:text-4xl">
            Your cart is empty
          </h1>
          <p className="mx-auto mt-4 max-w-md text-text-secondary">
            Explore the shop — serums, SPF, and ritual sets curated from
            Japanese beauty houses.
          </p>
          <Link href="/catalog" className="landing-cta-primary mt-8 inline-flex">
            Browse shop
            <ArrowRightIcon size="sm" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container mx-auto px-4 py-8 lg:px-6 lg:py-10">
        <nav className="checkout-crumb" aria-label="Checkout progress">
          <span className="checkout-crumb__active">Cart</span>
          <span aria-hidden>›</span>
          <Link href="/checkout">Checkout</Link>
        </nav>

        <header className="cart-page__header">
          <h1 className="font-display text-3xl text-text-primary">Your cart</h1>
          <p className="cart-page__lead">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} ready for checkout
            {userPhoneKey ? (
              <>
                {' '}
                · Saved for {formatPhoneDisplay(userPhoneKey)}
              </>
            ) : null}
          </p>
        </header>

        <div className="cart-layout">
          <section className="cart-page__main" aria-labelledby="cart-lines-title">
            <h2 id="cart-lines-title" className="sr-only">
              Items in cart
            </h2>
            <ul className="cart-line-list">
              {rows.map((row) => (
                <CartLineItem
                  key={cartLineReactKey(row)}
                  row={row}
                  onQuantityChange={handleQuantity}
                  onRemove={handleRemove}
                />
              ))}
            </ul>
            <Link href="/catalog" className="cart-page__continue landing-text-link">
              Continue shopping
              <ArrowRightIcon size="sm" />
            </Link>
          </section>

          <CartOrderSummary
            rows={rows}
            primaryAction={<CartCheckoutLink />}
          />
        </div>
      </div>
    </div>
  )
}
