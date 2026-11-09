'use client'

import type { MouseEvent } from 'react'
import {
  CartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
} from '@/shared/ui/Icons'
import { useCart } from './CartProvider'

type ProductCardQuickAddProps = {
  productId: string
  maxQuantity?: number
}

export function ProductCardQuickAdd({
  productId,
  maxQuantity = 99,
}: ProductCardQuickAddProps) {
  const { getQuantity, addProduct, setProductQuantity } = useCart()
  const quantity = getQuantity(productId)
  const inCart = quantity > 0

  const stop = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  if (!inCart) {
    return (
      <div className="product-card__quick-add" data-state="idle">
        <button
          type="button"
          className="product-card__quick-add-cart"
          aria-label="Add to cart"
          onClick={(e) => {
            stop(e)
            addProduct(productId, 1)
          }}
        >
          <CartIcon size="sm" />
        </button>
      </div>
    )
  }

  const decrease = () => {
    if (quantity <= 1) {
      setProductQuantity(productId, 0)
      return
    }
    setProductQuantity(productId, quantity - 1)
  }

  const increase = () => {
    if (quantity >= maxQuantity) return
    setProductQuantity(productId, quantity + 1)
  }

  return (
    <div
      className="product-card__quick-add product-card__quick-add--active"
      data-state="active"
      role="group"
      aria-label={`Quantity in cart: ${quantity}`}
    >
      <button
        type="button"
        className="product-card__quick-add-step"
        aria-label={quantity === 1 ? 'Remove from cart' : 'Decrease quantity'}
        onClick={(e) => {
          stop(e)
          decrease()
        }}
      >
        {quantity === 1 ? (
          <TrashIcon size="sm" />
        ) : (
          <ChevronLeftIcon size="sm" />
        )}
      </button>
      <span className="product-card__quick-add-qty" aria-hidden>
        {quantity}
      </span>
      <button
        type="button"
        className="product-card__quick-add-step"
        aria-label="Increase quantity"
        disabled={quantity >= maxQuantity}
        onClick={(e) => {
          stop(e)
          increase()
        }}
      >
        <ChevronRightIcon size="sm" />
      </button>
    </div>
  )
}
