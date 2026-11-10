import { CATALOG_MEDIA_CACHE_TTL_MS } from '../catalog-media'
import type { UnsplashPhoto, UnsplashSearchResponse } from './types'

/** Как на https://unsplash.com/s/photos/beauty-products */
export const UNSPLASH_BEAUTY_QUERY = 'beauty products'

export const UNSPLASH_CACHE_TTL_MS = CATALOG_MEDIA_CACHE_TTL_MS

type CacheEntry = {
  expiresAt: number
  photos: UnsplashPhoto[]
}

const globalForCache = globalThis as typeof globalThis & {
  __hanamiUnsplashCache?: CacheEntry | null
}

function getCache(): CacheEntry | null {
  return globalForCache.__hanamiUnsplashCache ?? null
}

function setCache(entry: CacheEntry) {
  globalForCache.__hanamiUnsplashCache = entry
}

async function searchPhotosPage(
  accessKey: string,
  page: number,
): Promise<UnsplashPhoto[]> {
  const params = new URLSearchParams({
    query: UNSPLASH_BEAUTY_QUERY,
    per_page: '30',
    page: String(page),
    content_filter: 'high',
    orientation: 'squarish',
  })

  const res = await fetch(
    `https://api.unsplash.com/search/photos?${params.toString()}`,
    {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
        'Accept-Version': 'v1',
      },
      next: { revalidate: 0 },
    },
  )

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(
      `Unsplash search failed (${res.status}): ${text.slice(0, 200)}`,
    )
  }

  const data = (await res.json()) as UnsplashSearchResponse
  return data.results ?? []
}

/** Серверный пул фото с жёстким TTL 30 мин (один поиск = 1–2 запроса к API). */
export async function getUnsplashBeautyPool(
  accessKey: string,
  minPhotos = 30,
): Promise<{ photos: UnsplashPhoto[]; cachedUntil: Date }> {
  const now = Date.now()
  const cached = getCache()
  if (cached && now < cached.expiresAt && cached.photos.length >= minPhotos) {
    return {
      photos: cached.photos,
      cachedUntil: new Date(cached.expiresAt),
    }
  }

  const page1 = await searchPhotosPage(accessKey, 1)
  let photos = [...page1]

  if (photos.length < minPhotos) {
    const page2 = await searchPhotosPage(accessKey, 2)
    photos = [...photos, ...page2]
  }

  const expiresAt = now + UNSPLASH_CACHE_TTL_MS
  setCache({ expiresAt, photos })

  return {
    photos,
    cachedUntil: new Date(expiresAt),
  }
}
