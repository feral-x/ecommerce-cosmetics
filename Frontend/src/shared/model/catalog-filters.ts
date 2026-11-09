import type { ProductAvailability, SkinType } from '@/entities/product'

export const CATALOG_PRICE_MAX = 300

export type CatalogFiltersState = {
  lineQuery: string
  selectedCategories: string[]
  selectedFormats: string[]
  selectedBrands: string[]
  selectedAvailability: ProductAvailability[]
  selectedSkinTypes: SkinType[]
  fragranceFreeOnly: boolean
  priceMin: number
  priceMax: number
}

export const defaultCatalogFilters: CatalogFiltersState = {
  lineQuery: '',
  selectedCategories: [],
  selectedFormats: [],
  selectedBrands: [],
  selectedAvailability: [],
  selectedSkinTypes: [],
  fragranceFreeOnly: false,
  priceMin: 0,
  priceMax: CATALOG_PRICE_MAX,
}

export function countActiveFilters(filters: CatalogFiltersState): number {
  let n = 0
  if (filters.selectedCategories.length) n += 1
  if (filters.selectedAvailability.length) n += 1
  if (filters.selectedFormats.length) n += 1
  if (filters.selectedBrands.length) n += 1
  if (filters.selectedSkinTypes.length) n += 1
  if (filters.fragranceFreeOnly) n += 1
  if (filters.priceMin > 0 || filters.priceMax < CATALOG_PRICE_MAX) n += 1
  return n
}
