'use client'

import { useMemo, useState } from 'react'
import {
  getProductReviews,
  type StarBucket,
} from '@/entities/product/lib/product-reviews.mock'

type ProductReviewsSectionProps = {
  productId: string
}

const STAR_ORDER: StarBucket[] = [5, 4, 3, 2, 1]

function ReviewStars({
  value,
  size = 'md',
}: {
  value: number
  size?: 'sm' | 'md' | 'lg'
}) {
  const filled = Math.min(5, Math.max(0, Math.round(value)))
  return (
    <span
      className={`review-stars review-stars--${size}`}
      role="img"
      aria-label={`${value.toFixed(1)} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={
            i < filled ? 'review-stars__glyph is-on' : 'review-stars__glyph'
          }
          aria-hidden
        >
          ★
        </span>
      ))}
    </span>
  )
}

export function ProductReviewsSection({ productId }: ProductReviewsSectionProps) {
  const { average, count, distribution, reviews } = getProductReviews(productId)
  const [starFilter, setStarFilter] = useState<StarBucket | null>(null)

  const visibleReviews = useMemo(() => {
    if (starFilter === null) return reviews
    return reviews.filter((review) => review.rating === starFilter)
  }, [reviews, starFilter])

  const toggleStarFilter = (stars: StarBucket) => {
    setStarFilter((prev) => (prev === stars ? null : stars))
  }

  return (
    <section
      className="product-reviews"
      id="product-reviews"
      aria-labelledby="product-reviews-heading"
    >
      <h2 id="product-reviews-heading" className="product-reviews__title">
        Ratings &amp; reviews
      </h2>

      <div className="product-reviews__layout">
        <aside className="product-reviews__sidebar">
          <p className="product-reviews__score">{average.toFixed(1)}</p>
          <ReviewStars value={average} size="lg" />
          <p className="product-reviews__count">{count} ratings</p>

          <ul className="product-reviews__bars" aria-label="Filter by star rating">
            {STAR_ORDER.map((stars) => {
              const n = distribution[stars]
              const pct = count > 0 ? Math.round((n / count) * 100) : 0
              const isActive = starFilter === stars
              return (
                <li key={stars}>
                  <button
                    type="button"
                    className={
                      isActive
                        ? 'product-reviews__bar-btn is-active'
                        : 'product-reviews__bar-btn'
                    }
                    disabled={n === 0}
                    aria-pressed={isActive}
                    aria-label={`${stars} stars, ${n} ratings`}
                    onClick={() => toggleStarFilter(stars)}
                  >
                    <span className="product-reviews__bar-label">
                      {stars}
                      <span className="product-reviews__bar-star" aria-hidden>
                        ★
                      </span>
                    </span>
                    <span className="product-reviews__bar-track" aria-hidden>
                      <span
                        className="product-reviews__bar-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </span>
                    <span className="product-reviews__bar-n">{n}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </aside>

        <div className="product-reviews__feed">
          <p className="product-reviews__feed-meta">
            {starFilter === null ? (
              <>Showing recent reviews</>
            ) : (
              <>
                Showing {starFilter}-star reviews ({visibleReviews.length})
                <button
                  type="button"
                  className="product-reviews__clear-filter"
                  onClick={() => setStarFilter(null)}
                >
                  Show all
                </button>
              </>
            )}
          </p>
          {visibleReviews.length === 0 ? (
            <p className="product-reviews__empty" role="status">
              No reviews with this rating yet.
            </p>
          ) : (
            <ul className="product-reviews__list">
              {visibleReviews.map((review) => (
                <li key={review.id} className="product-reviews__item">
                  <div className="product-reviews__item-head">
                    <p className="product-reviews__author">{review.author}</p>
                    <ReviewStars value={review.rating} size="sm" />
                  </div>
                  <p className="product-reviews__date">{review.dateLabel}</p>
                  <p className="product-reviews__body">{review.body}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
