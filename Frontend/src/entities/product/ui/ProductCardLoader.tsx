import { Spinner } from '@/shared/ui/Spinner'

export function ProductCardLoader() {
  return (
    <article className="product-card" aria-busy="true" aria-label="Loading product">
      <div className="product-card__shell">
        <div className="product-card__media">
          <div className="product-card__well flex items-center justify-center">
            <Spinner label="Loading product" />
          </div>
        </div>
        <div className="product-card__body">
          <div className="skeleton-shimmer h-2.5 w-[36%] rounded-sm" aria-hidden />
          <div
            className="skeleton-shimmer mt-2 h-5 w-full max-w-[92%] rounded-sm"
            aria-hidden
          />
          <div className="skeleton-shimmer mt-1.5 h-3 w-[55%] rounded-sm" aria-hidden />
          <div className="product-card__footer">
            <div className="skeleton-shimmer h-4 w-[28%] rounded-sm" aria-hidden />
            <div className="skeleton-shimmer h-2.5 w-[32%] rounded-sm" aria-hidden />
          </div>
        </div>
      </div>
    </article>
  )
}
