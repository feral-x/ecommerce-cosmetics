import { normalizeMakeupImageUrl } from '@/shared/api/makeup/dedupe-pool'
import type { MakeupProduct } from '@/shared/api/makeup/types'
import type { Product } from '../model/types'

export { normalizeMakeupImageUrl }

export function makeupImageUrlsForItem(item: MakeupProduct): string[] {
  const featured = item.api_featured_image
    ? normalizeMakeupImageUrl(item.api_featured_image)
    : ''
  const link = item.image_link ? normalizeMakeupImageUrl(item.image_link) : ''
  if (featured) return [featured]
  if (link) return [link]
  return []
}

export function applyMakeupImagesToProducts(
  products: Product[],
  pool: MakeupProduct[],
): Product[] {
  if (pool.length === 0) return products

  return products.map((product) => {
    const count = product.images.length
    const idNum = Number.parseInt(product.id, 10)
    const start = Number.isFinite(idNum) ? (idNum - 1) % pool.length : 0

    const images = Array.from({ length: Math.max(1, count) }, (_, offset) => {
      const item = pool[(start + offset) % pool.length]!
      const urls = makeupImageUrlsForItem(item)
      return urls[0]!
    })

    return { ...product, images }
  })
}
