import type { MakeupProduct } from './types'

export function normalizeMakeupImageUrl(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return trimmed
  if (trimmed.startsWith('//')) return `https:${trimmed}`
  return trimmed
}

/** Убираем повторяющиеся collection-cover с одним и тем же image_link. */
export function dedupeMakeupPoolByImage(products: MakeupProduct[]): MakeupProduct[] {
  const seen = new Set<string>()
  const unique: MakeupProduct[] = []
  for (const product of products) {
    const key = normalizeMakeupImageUrl(product.image_link)
    if (!key || seen.has(key)) continue
    seen.add(key)
    unique.push(product)
  }
  return unique
}
