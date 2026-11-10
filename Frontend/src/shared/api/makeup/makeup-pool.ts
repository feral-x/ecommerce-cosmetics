import { CATALOG_MEDIA_CACHE_TTL_MS } from '../catalog-media'
import { dedupeMakeupPoolByImage } from './dedupe-pool'
import type { MakeupProduct } from './types'

export const MAKEUP_API_PRODUCTS_URL =
  'https://makeup-api.herokuapp.com/api/v1/products.json'

type CacheEntry = {
  expiresAt: number
  products: MakeupProduct[]
}

const globalForCache = globalThis as typeof globalThis & {
  __hanamiMakeupCache?: CacheEntry | null
}

function getCache(): CacheEntry | null {
  return globalForCache.__hanamiMakeupCache ?? null
}

function setCache(entry: CacheEntry) {
  globalForCache.__hanamiMakeupCache = entry
}

/**
 * Один HTTP-запрос к Makeup API, дедуп по image_link, TTL 30 мин.
 * Живость URL не проверяем на сервере (VPN ломает HEAD) — браузер показывает placeholder при ошибке.
 */
export async function getMakeupProductPool(
  minProducts = 58,
): Promise<{ products: MakeupProduct[]; cachedUntil: Date }> {
  const now = Date.now()
  const cached = getCache()
  if (
    cached &&
    now < cached.expiresAt &&
    cached.products.length >= minProducts
  ) {
    return {
      products: cached.products,
      cachedUntil: new Date(cached.expiresAt),
    }
  }

  const revalidateSec = Math.floor(CATALOG_MEDIA_CACHE_TTL_MS / 1000)

  const res = await fetch(MAKEUP_API_PRODUCTS_URL, {
    headers: { Accept: 'application/json' },
    next: { revalidate: revalidateSec },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(
      `Makeup API failed (${res.status}): ${text.slice(0, 200)}`,
    )
  }

  const raw = (await res.json()) as MakeupProduct[]
  const withLinks = raw.filter((p) => p.image_link?.trim())
  const unique = dedupeMakeupPoolByImage(withLinks)
  const products = unique.slice(0, Math.max(minProducts, unique.length))

  const expiresAt = now + CATALOG_MEDIA_CACHE_TTL_MS
  setCache({ expiresAt, products })

  return {
    products,
    cachedUntil: new Date(expiresAt),
  }
}
