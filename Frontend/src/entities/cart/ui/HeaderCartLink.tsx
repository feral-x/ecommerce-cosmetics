'use client'

import Link from 'next/link'
import { CartIcon } from '@/shared/ui/Icons'
import { useCart } from './CartProvider'

export function HeaderCartLink() {
  const { totalItems } = useCart()

  return (
    <Link
      href="/cart"
      className="header-cart-link text-text-secondary transition-colors hover:text-primary-soft"
      aria-label={totalItems > 0 ? `Cart, ${totalItems} items` : 'Cart'}
    >
      <CartIcon />
      {totalItems > 0 && (
        <span className="header-cart-link__badge" aria-hidden>
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Link>
  )
}
