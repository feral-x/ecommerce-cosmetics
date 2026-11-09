import { queryOptions } from '@tanstack/react-query'
import {
  allBrands,
  allCategories,
  allFormats,
  mockProducts,
} from '../model/mock-products'

export type CatalogBootstrap = {
  products: typeof mockProducts
  categories: string[]
  brands: string[]
  formats: string[]
}

export type CatalogFacets = Pick<CatalogBootstrap, 'categories' | 'brands' | 'formats'>

const MOCK_LOAD_MS =
  process.env.NODE_ENV === 'test' || process.env.VITEST === 'true'
    ? 0
    : process.env.NODE_ENV === 'development'
      ? 0
      : 750

let inflightBootstrap: Promise<CatalogBootstrap> | null = null

type BootstrapLoader = () => Promise<CatalogBootstrap>

let bootstrapLoader: BootstrapLoader | null = null

async function loadCatalogBootstrap(): Promise<CatalogBootstrap> {
  if (!inflightBootstrap) {
    inflightBootstrap = (async () => {
      try {
        if (MOCK_LOAD_MS > 0) {
          await new Promise((resolve) => setTimeout(resolve, MOCK_LOAD_MS))
        }

        return {
          products: mockProducts,
          categories: allCategories,
          brands: allBrands,
          formats: allFormats,
        }
      } finally {
        inflightBootstrap = null
      }
    })()
  }

  return inflightBootstrap
}

/** Имитация bootstrap-ответа бэка: товары + фасеты фильтров. */
export async function fetchCatalogBootstrap(): Promise<CatalogBootstrap> {
  const loader = bootstrapLoader ?? loadCatalogBootstrap
  return loader()
}

/** Переопределение загрузчика (Vitest). */
export function setCatalogBootstrapLoader(loader: BootstrapLoader | null) {
  bootstrapLoader = loader
  inflightBootstrap = null
}

export function catalogProductsQueryOptions() {
  return queryOptions({
    queryKey: ['catalog', 'bootstrap', 'products'] as const,
    queryFn: () => fetchCatalogBootstrap(),
    select: (data) => data.products,
    staleTime: 60_000,
  })
}

export function catalogFacetsQueryOptions(facetKey: string) {
  return queryOptions({
    queryKey: ['catalog', 'facets', facetKey] as const,
    queryFn: () => fetchCatalogBootstrap(),
    select: (data): CatalogFacets => ({
      categories: data.categories,
      brands: data.brands,
      formats: data.formats,
    }),
    staleTime: 60_000,
    placeholderData: (previous) => previous,
  })
}

/** @deprecated — используйте catalogProductsQueryOptions / catalogFacetsQueryOptions */
export function catalogBootstrapQueryKey(catalogSearch: string) {
  return ['catalog', 'bootstrap', catalogSearch] as const
}

/** @deprecated — используйте catalogProductsQueryOptions / catalogFacetsQueryOptions */
export function catalogBootstrapQueryOptions(catalogSearch: string) {
  return queryOptions({
    queryKey: catalogBootstrapQueryKey(catalogSearch),
    queryFn: () => fetchCatalogBootstrap(),
    staleTime: 60_000,
    placeholderData: (previous) => previous,
  })
}
