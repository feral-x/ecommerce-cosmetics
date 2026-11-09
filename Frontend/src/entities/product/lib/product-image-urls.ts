const COSMETIC_IMAGE_COUNT = 30

/** Локальные mock-фото в `public/mock/cosmetics/`. */
export const LOCAL_MOCK_COSMETIC_IMAGES = Array.from(
  { length: COSMETIC_IMAGE_COUNT },
  (_, index) => `/mock/cosmetics/${String(index + 1).padStart(2, '0')}.jpg`,
) as readonly string[]

/** @deprecated use LOCAL_MOCK_COSMETIC_IMAGES */
export const LOCAL_MOCK_FIGURE_IMAGES = LOCAL_MOCK_COSMETIC_IMAGES

export function buildProductImageUrls(productId: string, count: number): string[] {
  const pool = LOCAL_MOCK_COSMETIC_IMAGES
  const n = Math.max(1, Math.min(count, pool.length))
  const idNum = Number.parseInt(productId, 10)
  const start = Number.isFinite(idNum) ? (idNum - 1) % pool.length : 0

  return Array.from({ length: n }, (_, offset) => {
    const index = (start + offset) % pool.length
    return pool[index]!
  })
}

export function preloadImage(url: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.decoding = 'async'
    img.onload = () => resolve()
    img.onerror = () => reject(new Error(`Failed to preload ${url}`))
    img.src = url
  })
}
