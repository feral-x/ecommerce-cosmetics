import type { Product } from '../model/types'
import { CartIcon, HeartIcon } from '@/shared/ui/Icons'

const availabilityStyle = {
  'in-stock': 'bg-success/15 text-success',
  'pre-order': 'bg-warning/15 text-warning',
  'new-release': 'bg-primary/20 text-primary-soft',
} as const

const availabilityLabel = {
  'in-stock': 'In stock',
  'pre-order': 'Pre-order',
  'new-release': 'New release',
} as const

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface transition-colors duration-200 hover:border-border hover:bg-surface-elevated/40">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-elevated">
        <div
          className="absolute inset-0 bg-linear-to-b from-primary/10 via-transparent to-bg/80"
          aria-hidden
        />
        <div className="flex size-full items-center justify-center p-8">
          <span className="font-display text-5xl text-primary-soft/25 select-none">
            {product.name.charAt(0)}
          </span>
        </div>

        <span
          className={`absolute left-3 top-3 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${availabilityStyle[product.availability]}`}
        >
          {availabilityLabel[product.availability]}
        </span>

        <button
          type="button"
          className="absolute right-3 top-3 cursor-pointer rounded-full border border-border-subtle bg-bg/60 p-2 text-text-secondary opacity-0 backdrop-blur-sm transition-all duration-200 hover:border-primary-soft hover:text-primary-soft focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-soft group-hover:opacity-100"
          aria-label={`Save ${product.name}`}
        >
          <HeartIcon size="sm" />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4 pt-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-muted">
          {product.series}
        </p>
        <h3 className="mt-1.5 text-base font-semibold leading-snug text-text-primary">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-text-secondary">{product.scale}</p>
        <p className="mt-1 text-xs text-text-muted">{product.brand}</p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <p className="text-xl font-semibold tabular-nums text-primary-soft">
            ${product.price}
          </p>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-white opacity-0 transition-all duration-200 hover:bg-primary-hover focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-soft group-hover:opacity-100 sm:opacity-100 sm:px-4"
          >
            <CartIcon size="sm" className="text-white" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </article>
  )
}
