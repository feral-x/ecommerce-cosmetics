/** Общий TTL кэша медиа (клиент + серверные пулы). */
export const CATALOG_MEDIA_CACHE_TTL_MS = 30 * 60 * 1000

export type CatalogMediaMeta =
  | {
      source: 'local'
    }
  | {
      source: 'makeup-api'
      cachedUntil: string
      poolSize: number
    }
  | {
      source: 'unsplash'
      query: string
      cachedUntil: string
      poolSize: number
    }

export function isRemoteCatalogMedia(
  media: CatalogMediaMeta | undefined,
): media is Exclude<CatalogMediaMeta, { source: 'local' }> {
  return media?.source === 'makeup-api' || media?.source === 'unsplash'
}
