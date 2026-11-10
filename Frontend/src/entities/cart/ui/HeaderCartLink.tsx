'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CartIcon } from '@/shared/ui/Icons'
import { useCart } from './CartProvider'

export function HeaderCartLink() {
  const { totalItems } = useCart()
  const [showCount, setShowCount] = useState(false)

  useEffect(() => {
    setShowCount(true)
  }, [])

  const badgeCount = showCount ? totalItems : 0

  return (
    <Link
      href="/cart"
      className="header-cart-link header-utility-btn text-text-secondary transition-colors hover:text-primary-soft"
      aria-label={badgeCount > 0 ? `Cart, ${badgeCount} items` : 'Cart'}
    >
      <CartIcon />
      {badgeCount > 0 && (
        <span className="header-cart-link__badge" aria-hidden>
          {badgeCount > 99 ? '99+' : badgeCount}
        </span>
      )}
    </Link>
  )
}
