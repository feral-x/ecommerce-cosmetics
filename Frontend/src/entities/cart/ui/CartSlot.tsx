'use client'

import { CartIcon, MinusIcon } from '@/shared/ui/Icons'

type CartSlotProps = {
  inCart: boolean
  onAdd: () => void
  onRemove: () => void
  addLabel: string
  removeLabel?: string
}

export function CartSlot({
  inCart,
  onAdd,
  onRemove,
  addLabel,
  removeLabel = 'Remove from cart',
}: CartSlotProps) {
  return (
    <div className="cart-slot" data-in-cart={inCart ? 'true' : 'false'}>
      {inCart ? (
        <>
          <span className="cart-slot__status" aria-hidden>
            <CartIcon size="sm" className="cart-slot__icon cart-slot__icon--active" />
          </span>
          <button
            type="button"
            className="cart-slot__btn cart-slot__btn--remove"
            aria-label={removeLabel}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onRemove()
            }}
          >
            <MinusIcon size="sm" />
          </button>
        </>
      ) : (
        <button
          type="button"
          className="cart-slot__btn cart-slot__btn--add"
          aria-label={addLabel}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onAdd()
          }}
        >
          <CartIcon size="sm" />
        </button>
      )}
    </div>
  )
}
