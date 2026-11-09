import type { ProductAvailability, SkinType, SortOption } from '@/entities/product'
import {
  CATALOG_PRICE_MAX,
  defaultCatalogFilters,
  type CatalogFiltersState,
} from '@/shared/model/catalog-filters'

const availabilityValues: ProductAvailability[] = [
  'in-stock',
  'pre-order',
  'new-release',
]

const skinTypeValues: SkinType[] = [
  'dry',
  'oily',
  'combination',
  'sensitive',
  'normal',
]

const sortValues: SortOption[] = ['featured', 'price-asc', 'price-desc', 'name']

function parseAvailability(raw: string | null): ProductAvailability[] {
  if (!raw) return []
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter((s): s is ProductAvailability =>
      availabilityValues.includes(s as ProductAvailability),
    )
}

function parseSkinTypes(raw: string | null): SkinType[] {
  if (!raw) return []
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter((s): s is SkinType => skinTypeValues.includes(s as SkinType))
}

function parseSort(raw: string | null): SortOption {
  if (raw && sortValues.includes(raw as SortOption)) {
    return raw as SortOption
  }
  return 'featured'
}

function parsePage(raw: string | null): number {
  const n = Number(raw)
  if (!Number.isFinite(n) || n < 1) return 1
  return Math.floor(n)
}

export type CatalogViewState = {
  filters: CatalogFiltersState
  sort: SortOption
  page: number
  nameQuery: string
}

export function filtersFromSearchParams(search: string): CatalogFiltersState {
  return catalogViewFromSearchParams(search).filters
}

export function catalogViewFromSearchParams(search: string): CatalogViewState {
  const p = new URLSearchParams(search)
  const base = { ...defaultCatalogFilters }

  base.selectedAvailability = parseAvailability(p.get('availability'))
  base.selectedSkinTypes = parseSkinTypes(p.get('skin'))
  base.fragranceFreeOnly = p.get('fragranceFree') === '1'

  const categories = p.get('category')
  if (categories) {
    base.selectedCategories = categories
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  }

  const brands = p.get('brand')
  if (brands) {
    base.selectedBrands = brands.split(',').map((s) => s.trim()).filter(Boolean)
  }

  const formats = p.get('format')
  if (formats) {
    base.selectedFormats = formats.split(',').map((s) => s.trim()).filter(Boolean)
  }

  const min = p.get('min')
  const max = p.get('max')
  if (min != null && min !== '') base.priceMin = Number(min) || 0
  if (max != null && max !== '') {
    base.priceMax = Number(max) || base.priceMax
  }

  const lineQ = p.get('lineQ')
  if (lineQ) base.lineQuery = lineQ

  const nameQuery = p.get('q')?.trim() ?? ''

  return {
    filters: base,
    sort: parseSort(p.get('sort')),
    page: parsePage(p.get('page')),
    nameQuery,
  }
}

/** Ключ bootstrap-query: только параметры, влияющие на фасеты/каталог с API. */
export function catalogBootstrapSearchKey(search: string): string {
  const p = new URLSearchParams(search)
  for (const key of ['sort', 'page', 'lineQ', 'q']) {
    p.delete(key)
  }
  return p.toString()
}

export function searchParamsFromFilters(
  filters: CatalogFiltersState,
): URLSearchParams {
  const p = new URLSearchParams()

  if (filters.selectedAvailability.length > 0) {
    p.set('availability', filters.selectedAvailability.join(','))
  }
  if (filters.selectedSkinTypes.length > 0) {
    p.set('skin', filters.selectedSkinTypes.join(','))
  }
  if (filters.fragranceFreeOnly) {
    p.set('fragranceFree', '1')
  }
  if (filters.selectedCategories.length > 0) {
    p.set('category', filters.selectedCategories.join(','))
  }
  if (filters.selectedBrands.length > 0) {
    p.set('brand', filters.selectedBrands.join(','))
  }
  if (filters.selectedFormats.length > 0) {
    p.set('format', filters.selectedFormats.join(','))
  }
  if (filters.priceMin > 0) p.set('min', String(filters.priceMin))
  if (filters.priceMax < CATALOG_PRICE_MAX) {
    p.set('max', String(filters.priceMax))
  }
  if (filters.lineQuery.trim()) {
    p.set('lineQ', filters.lineQuery.trim())
  }

  return p
}

export function searchParamsFromCatalogView(
  state: CatalogViewState,
  preserved?: { spotlight?: string | null },
): URLSearchParams {
  const p = searchParamsFromFilters(state.filters)
  if (state.sort !== 'featured') p.set('sort', state.sort)
  if (state.page > 1) p.set('page', String(state.page))
  if (state.nameQuery.trim()) p.set('q', state.nameQuery.trim())
  if (preserved?.spotlight) p.set('spotlight', preserved.spotlight)
  return p
}

export type MainNavId = 'browse' | 'bundles' | 'new-releases' | 'pre-orders'

/** @deprecated use mainNavLinks */
export type CatalogNavPreset = MainNavId

export const mainNavLinks: {
  id: MainNavId
  label: string
  href: string
}[] = [
  { id: 'browse', label: 'Shop All', href: '/catalog' },
  { id: 'bundles', label: 'Bundles', href: '/bundles' },
  {
    id: 'new-releases',
    label: 'New Arrivals',
    href: '/catalog?availability=new-release',
  },
  {
    id: 'pre-orders',
    label: 'Pre-Order',
    href: '/catalog?availability=pre-order',
  },
]

/** @deprecated use mainNavLinks */
export const catalogNavLinks = mainNavLinks.map((link) => ({
  preset: link.id,
  label: link.label,
  search: link.href.replace(/^\/catalog/, '') || '',
}))

export function isMainNavLinkActive(
  id: MainNavId,
  pathname: string,
  search: string,
): boolean {
  if (id === 'bundles') return pathname === '/bundles'
  if (pathname !== '/catalog') return false
  const p = new URLSearchParams(search)

  switch (id) {
    case 'browse':
      return (
        !p.get('availability') &&
        !p.get('spotlight') &&
        !p.get('skin') &&
        !p.get('fragranceFree') &&
        !p.get('category') &&
        !p.get('brand') &&
        !p.get('format') &&
        !p.get('min') &&
        !p.get('max') &&
        !p.get('lineQ') &&
        !p.get('q') &&
        !p.get('sort') &&
        !p.get('page')
      )
    case 'new-releases':
      return p.get('availability') === 'new-release'
    case 'pre-orders':
      return p.get('availability') === 'pre-order'
    default:
      return false
  }
}

/** @deprecated use isMainNavLinkActive */
export const isCatalogNavPresetActive = isMainNavLinkActive
