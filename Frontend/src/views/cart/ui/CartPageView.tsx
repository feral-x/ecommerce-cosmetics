'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import {
  bundleCartLineId,
  isBundleCartLine,
  parseBundleIdFromCartLine,
  useCart,
} from '@/entities/cart'
import { getBundleById } from '@/entities/bundle'
import { mockProducts } from '@/entities/product'

export function CartPageView() {
  const { lines, setProductQuantity, totalItems } = useCart()

  const rows = useMemo(() => {
    return Object.entries(lines)
      .map(([lineId, quantity]) => {
        if (isBundleCartLine(lineId)) {
          const bundleId = parseBundleIdFromCartLine(lineId)
          if (!bundleId) return null
          const bundle = getBundleById(bundleId)
          if (!bundle) return null
          return {
            kind: 'bundle' as const,
            id: bundleId,
            title: bundle.title,
            meta: `${bundle.brandLabel} · Bundle`,
            href: `/bundles/${bundleId}`,
            unitPrice: bundle.price,
            quantity,
          }
        }
        const product = mockProducts.find((p) => p.id === lineId)
        if (!product) return null
        return {
          kind: 'product' as const,
          id: product.id,
          title: product.name,
          meta: `${product.brand} · ${product.sizeLabel}`,
          href: `/product/${product.id}`,
          unitPrice: product.price,
          quantity,
        }
      })
      .filter((row): row is NonNullable<typeof row> => row != null)
  }, [lines])

  const subtotal = rows.reduce(
    (sum, row) => sum + row.unitPrice * row.quantity,
    0,
  )

  if (totalItems === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center lg:px-6">
        <h1 className="font-display text-3xl text-text-primary">Your cart</h1>
        <p className="mt-4 text-text-secondary">Your cart is empty.</p>
        <Link href="/catalog" className="landing-cta-primary mt-8 inline-flex">
          Browse shop
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:px-6 lg:py-10">
      <h1 className="font-display text-3xl text-text-primary">Your cart</h1>
      <p className="mt-2 text-sm text-text-muted">{totalItems} items</p>

      <ul className="cart-page__list">
        {rows.map((row) => {
          const lineKey =
            row.kind === 'bundle' ? `bundle-${row.id}` : `product-${row.id}`
          const lineId =
            row.kind === 'bundle' ? bundleCartLineId(row.id) : row.id
          const setQty = (next: number) => {
            setProductQuantity(lineId, next)
          }
          return (
            <li key={lineKey} className="cart-page__row">
              <div>
                <Link href={row.href} className="cart-page__name type-product-title">
                  {row.title}
                </Link>
                <p className="cart-page__meta">{row.meta}</p>
              </div>
              <div className="cart-page__qty">
                <button
                  type="button"
                  className="qty-stepper__btn"
                  aria-label="Decrease"
                  onClick={() => setQty(row.quantity - 1)}
                >
                  −
                </button>
                <span className="qty-stepper__value">{row.quantity}</span>
                <button
                  type="button"
                  className="qty-stepper__btn"
                  aria-label="Increase"
                  onClick={() => setQty(row.quantity + 1)}
                >
                  +
                </button>
              </div>
              <p className="cart-page__line-total">
                ${(row.unitPrice * row.quantity).toFixed(2)}
              </p>
            </li>
          )
        })}
      </ul>

      <p className="cart-page__subtotal">
        Subtotal <span>${subtotal.toFixed(2)}</span>
      </p>
    </div>
  )
}
