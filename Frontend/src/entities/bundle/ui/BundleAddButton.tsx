'use client'

import { useCart } from '@/entities/cart'
import type { EnrichedBundle } from '../lib/enrich-bundle'

type BundleAddButtonProps = {
  bundle: EnrichedBundle
  className?: string
}

export function BundleAddButton({ bundle, className = '' }: BundleAddButtonProps) {
  const { getBundleQuantity, addBundle, removeBundle } = useCart()
  const inCart = getBundleQuantity(bundle.id) > 0

  return (
    <div
      className={['bundle-cart-actions', className].filter(Boolean).join(' ')}
    >
      {inCart ? (
        <div className="bundle-cart-actions__in" role="status">
          <span className="bundle-cart-actions__status">In cart</span>
          <button
            type="button"
            className="bundle-cart-actions__remove"
            onClick={() => removeBundle(bundle.id)}
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="landing-cta-primary bundle-cart-actions__add"
          onClick={() => addBundle(bundle.id, 1)}
        >
          Add bundle
        </button>
      )}
    </div>
  )
}
