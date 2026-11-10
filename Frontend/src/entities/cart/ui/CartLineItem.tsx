'use client'

import Image from 'next/image'
import Link from 'next/link'
import { QuantityStepper } from './QuantityStepper'
import { TrashIcon } from '@/shared/ui/Icons'
import { formatUsd } from '@/shared/lib/format-usd'
import type { CartLineRow } from '../lib/cart-lines'

type CartLineItemProps = {
  row: CartLineRow
  editable?: boolean
  onQuantityChange?: (lineId: string, quantity: number) => void
  onRemove?: (lineId: string) => void
}

export function CartLineItem({
  row,
  editable = true,
  onQuantityChange,
  onRemove,
}: CartLineItemProps) {
  const lineTotal = row.unitPrice * row.quantity

  return (
    <li className="cart-line">
      <Link href={row.href} className="cart-line__thumb" tabIndex={-1} aria-hidden>
        {row.imageUrl ? (
          <Image
            src={row.imageUrl}
            alt=""
            width={96}
            height={96}
            className="cart-line__image"
          />
        ) : (
          <span className="cart-line__thumb-fallback" aria-hidden />
        )}
      </Link>

      <div className="cart-line__body">
        <div className="cart-line__head">
          <div>
            {row.kind === 'bundle' && (
              <span className="cart-line__badge">Bundle</span>
            )}
            <Link href={row.href} className="cart-line__title type-product-title">
              {row.title}
            </Link>
            <p className="cart-line__meta">{row.meta}</p>
            <p className="cart-line__unit">{formatUsd(row.unitPrice)} each</p>
          </div>
          {editable && onRemove ? (
            <button
              type="button"
              className="cart-line__remove"
              onClick={() => onRemove(row.lineId)}
              aria-label={`Remove ${row.title}`}
            >
              <TrashIcon size="sm" />
            </button>
          ) : null}
        </div>

        <div className="cart-line__foot">
          {editable && onQuantityChange ? (
            <QuantityStepper
              value={row.quantity}
              min={0}
              onChange={(next) => onQuantityChange(row.lineId, next)}
              aria-label={`Quantity for ${row.title}`}
            />
          ) : (
            <p className="cart-line__qty-readonly">Qty {row.quantity}</p>
          )}
          <p className="cart-line__total">{formatUsd(lineTotal)}</p>
        </div>
      </div>
    </li>
  )
}
