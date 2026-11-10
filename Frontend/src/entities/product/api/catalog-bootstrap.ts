import { queryOptions } from '@tanstack/react-query'
import {
  CATALOG_MEDIA_CACHE_TTL_MS,
  isRemoteCatalogMedia,
  type CatalogMediaMeta,
} from '@/shared/api/catalog-media'
import { setCatalogProductSnapshot } from '../lib/product-catalog-snapshot'
import type { Product } from '../model/types'

export type CatalogBootstrap = {
  products: Product[]
  categories: string[]
  brands: string[]
  formats: string[]
  media?: CatalogMediaMeta
}

export type CatalogFacets = Pick<CatalogBootstrap, 'categories' | 'brands' | 'formats'>

const CLIENT_CATALOG_CACHE_KEY = 'hanami-catalog-bootstrap-v5'

type ClientCacheEntry = {
  expiresAt: number
  data: CatalogBootstrap
}

type BootstrapLoader = () => Promise<CatalogBootstrap>

let bootstrapLoader: BootstrapLoader | null = null

export function readClientBootstrapCache(): CatalogBootstrap | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(CLIENT_CATALOG_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ClientCacheEntry
    if (Date.now() > parsed.expiresAt) {
      window.sessionStorage.removeItem(CLIENT_CATALOG_CACHE_KEY)
      return null
    }
    return parsed.data
  } catch {
    return null
  }
}

function writeClientBootstrapCache(data: CatalogBootstrap) {
  if (typeof window === 'undefined') return
  const entry: ClientCacheEntry = {
    expiresAt: Date.now() + CATALOG_MEDIA_CACHE_TTL_MS,
    data,
  }
  window.sessionStorage.setItem(CLIENT_CATALOG_CACHE_KEY, JSON.stringify(entry))
}

async function fetchCatalogBootstrapFromApi(): Promise<CatalogBootstrap> {
  const cached = readClientBootstrapCache()
  if (cached && isRemoteCatalogMedia(cached.media)) {
    setCatalogProductSnapshot(cached.products, cached.media)
    return cached
  }

  const res = await fetch('/api/catalog/bootstrap', {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })

  if (!res.ok) {
    throw new Error(`Catalog bootstrap failed (${res.status})`)
  }

  const data = (await res.json()) as CatalogBootstrap
  writeClientBootstrapCache(data)
  setCatalogProductSnapshot(data.products, data.media)
  return data
}

async function loadCatalogBootstrap(): Promise<CatalogBootstrap> {
  const isTest =
    process.env.NODE_ENV === 'test' || process.env.VITEST === 'true'
  if (isTest || typeof window === 'undefined') {
    throw new Error('Catalog bootstrap is client-only without a test loader')
  }

  return fetchCatalogBootstrapFromApi()
}

/** Bootstrap каталога из Makeup API (кэш 30 мин в sessionStorage). */
export async function fetchCatalogBootstrap(): Promise<CatalogBootstrap> {
  const loader = bootstrapLoader ?? loadCatalogBootstrap
  return loader()
}

/** Переопределение загрузчика (Vitest). */
export function setCatalogBootstrapLoader(loader: BootstrapLoader | null) {
  bootstrapLoader = loader
}

export const CATALOG_BOOTSTRAP_STALE_MS = CATALOG_MEDIA_CACHE_TTL_MS

export const catalogBootstrapQueryKey = ['catalog', 'bootstrap'] as const

function catalogBootstrapQueryFn(): Promise<CatalogBootstrap> {
  return fetchCatalogBootstrap()
}

export const catalogBootstrapQueryOptions = queryOptions({
  queryKey: catalogBootstrapQueryKey,
  queryFn: catalogBootstrapQueryFn,
  placeholderData: () => readClientBootstrapCache() ?? undefined,
  staleTime: CATALOG_BOOTSTRAP_STALE_MS,
  gcTime: CATALOG_BOOTSTRAP_STALE_MS,
  refetchOnMount: false,
  refetchOnReconnect: false,
})

/** @deprecated — используйте catalogBootstrapQueryKey + catalogFacetsQueryOptions */
export function catalogBootstrapSearchQueryKey(catalogSearch: string) {
  return ['catalog', 'bootstrap', catalogSearch] as const
}
