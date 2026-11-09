export type ProductReview = {
  id: string
  author: string
  rating: number
  dateLabel: string
  body: string
}

export type StarBucket = 5 | 4 | 3 | 2 | 1

export type ProductReviewSummary = {
  average: number
  count: number
  /** Количество оценок по звёздам (сумма = count). */
  distribution: Record<StarBucket, number>
  reviews: ProductReview[]
}

const REVIEW_BODIES = [
  'Texture is lightweight and sinks in quickly. No sticky finish — perfect under sunscreen.',
  'Gentle on sensitive skin. I noticed calmer redness after about two weeks of nightly use.',
  'Packaging feels premium and the pump dispenses a sensible amount. Will repurchase.',
  'Slight floral note but fades fast. Hydration lasts through a dry office day.',
  'A little goes a long way. Pairs well with my usual essence and moisturizer.',
] as const

const AUTHORS = [
  'Mika R.',
  'Jordan L.',
  'Soo-Yeon K.',
  'Alex P.',
  'Hana T.',
  'Chris W.',
] as const

function hashId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i += 1) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0
  }
  return h
}

export function getProductReviews(productId: string): ProductReviewSummary {
  const h = hashId(productId)
  const count = 8 + (h % 24)
  const average = Math.round((4.2 + (h % 8) * 0.1) * 10) / 10
  const reviewCount = 5 + (h % 4)

  const distribution: Record<StarBucket, number> = {
    5: Math.round(count * (0.45 + (h % 20) / 100)),
    4: Math.round(count * (0.28 + (h % 11) / 100)),
    3: Math.round(count * 0.12),
    2: Math.round(count * 0.08),
    1: 0,
  }
  distribution[1] = Math.max(
    0,
    count -
      distribution[5] -
      distribution[4] -
      distribution[3] -
      distribution[2],
  )

  const reviews: ProductReview[] = Array.from({ length: reviewCount }, (_, i) => {
    const idx = (h + i * 17) % REVIEW_BODIES.length
    const authorIdx = (h + i * 7) % AUTHORS.length
    const rating = Math.min(5, Math.max(1, ((h + i * 11) % 5) + 1))
    return {
      id: `${productId}-review-${i}`,
      author: AUTHORS[authorIdx]!,
      rating,
      dateLabel: i === 0 ? '2 weeks ago' : `${1 + i} month${i > 1 ? 's' : ''} ago`,
      body: REVIEW_BODIES[idx]!,
    }
  })

  return { average, count, distribution, reviews }
}
