import type { UnsplashPhoto } from '@/shared/api/unsplash/types'
import type { Product } from '../model/types'

export function applyUnsplashImagesToProducts(
  products: Product[],
  pool: UnsplashPhoto[],
): Product[] {
  if (pool.length === 0) return products

  return products.map((product) => {
    const count = product.images.length
    const idNum = Number.parseInt(product.id, 10)
    const start = Number.isFinite(idNum) ? (idNum - 1) % pool.length : 0

    const images = Array.from({ length: Math.max(1, count) }, (_, offset) => {
      const photo = pool[(start + offset) % pool.length]!
      return photo.urls.regular
    })

    return { ...product, images }
  })
}
