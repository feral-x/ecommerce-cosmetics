import { queryOptions } from '@tanstack/react-query'
import { resolveProductList } from '../lib/product-catalog-snapshot'
import type { Product } from '../model/types'

export const PRODUCT_SEARCH_MIN_LENGTH = 2
export const PRODUCT_SEARCH_MAX_RESULTS = 8

type SearchLoader = (query: string) => Promise<Product[]>

let searchLoader: SearchLoader | null = null

async function loadSearchProducts(query: string): Promise<Product[]> {
  const q = query.trim().toLowerCase()
  if (q.length < PRODUCT_SEARCH_MIN_LENGTH) return []

  return resolveProductList()
    .filter((p) => p.name.toLowerCase().includes(q))
    .slice(0, PRODUCT_SEARCH_MAX_RESULTS)
}

/** Поиск фигурок по названию (имитация API бэкенда). */
export async function searchProductsByName(query: string): Promise<Product[]> {
  const loader = searchLoader ?? loadSearchProducts
  return loader(query)
}

export function setProductSearchLoader(loader: SearchLoader | null) {
  searchLoader = loader
}

export function productSearchQueryOptions(query: string) {
  const trimmed = query.trim()
  return queryOptions({
    queryKey: ['catalog', 'search', trimmed] as const,
    queryFn: () => searchProductsByName(trimmed),
    enabled: trimmed.length >= PRODUCT_SEARCH_MIN_LENGTH,
    staleTime: 30_000,
    placeholderData: (previous) => previous,
  })
}
