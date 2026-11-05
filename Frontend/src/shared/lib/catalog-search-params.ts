import type { ProductAvailability } from '@/entities/product'
import type { CatalogFiltersState } from '@/widgets/catalog-filters'
import { defaultCatalogFilters } from '@/widgets/catalog-filters'

const availabilityValues: ProductAvailability[] = [
  'in-stock',
  'pre-order',
  'new-release',
]

const matureValues = ['all', 'exclude', 'only'] as const

function parseAvailability(raw: string | null): ProductAvailability[] {
  if (!raw) return []
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter((s): s is ProductAvailability =>
      availabilityValues.includes(s as ProductAvailability),
    )
}

function parseMature(raw: string | null): CatalogFiltersState['matureFilter'] {
  if (raw && matureValues.includes(raw as (typeof matureValues)[number])) {
    return raw as CatalogFiltersState['matureFilter']
  }
  return 'all'
}

export function filtersFromSearchParams(
  search: string,
): CatalogFiltersState {
  const p = new URLSearchParams(search)
  const base = { ...defaultCatalogFilters }

  base.selectedAvailability = parseAvailability(p.get('availability'))
  base.matureFilter = parseMature(p.get('mature'))

  const series = p.get('series')
  if (series) {
    base.selectedSeries = series.split(',').map((s) => s.trim()).filter(Boolean)
  }

  const brands = p.get('brand')
  if (brands) {
    base.selectedBrands = brands.split(',').map((s) => s.trim()).filter(Boolean)
  }

  const scales = p.get('scale')
  if (scales) {
    base.selectedScales = scales.split(',').map((s) => s.trim()).filter(Boolean)
  }

  const min = p.get('min')
  const max = p.get('max')
  if (min != null && min !== '') base.priceMin = Number(min) || 0
  if (max != null && max !== '') base.priceMax = Number(max) || base.priceMax

  return base
}

export function searchParamsFromFilters(
  filters: CatalogFiltersState,
): URLSearchParams {
  const p = new URLSearchParams()

  if (filters.selectedAvailability.length > 0) {
    p.set('availability', filters.selectedAvailability.join(','))
  }
  if (filters.matureFilter !== 'all') {
    p.set('mature', filters.matureFilter)
  }
  if (filters.selectedSeries.length > 0) {
    p.set('series', filters.selectedSeries.join(','))
  }
  if (filters.selectedBrands.length > 0) {
    p.set('brand', filters.selectedBrands.join(','))
  }
  if (filters.selectedScales.length > 0) {
    p.set('scale', filters.selectedScales.join(','))
  }
  if (filters.priceMin > 0) p.set('min', String(filters.priceMin))
  if (filters.priceMax < 500) p.set('max', String(filters.priceMax))

  return p
}

export type CatalogNavPreset =
  | 'browse'
  | 'collections'
  | 'new-releases'
  | 'pre-orders'

export const catalogNavLinks: {
  preset: CatalogNavPreset
  label: string
  search: string
}[] = [
  { preset: 'browse', label: 'Browse Figures', search: '' },
  { preset: 'collections', label: 'Collections', search: '?view=collections' },
  {
    preset: 'new-releases',
    label: 'New Releases',
    search: '?availability=new-release',
  },
  {
    preset: 'pre-orders',
    label: 'Pre-Orders',
    search: '?availability=pre-order',
  },
]

export function isCatalogNavPresetActive(
  preset: CatalogNavPreset,
  pathname: string,
  search: string,
): boolean {
  if (pathname !== '/catalog') return false
  const p = new URLSearchParams(search)

  switch (preset) {
    case 'browse':
      return (
        !p.get('availability') &&
        !p.get('view') &&
        !p.get('mature') &&
        !p.get('series') &&
        !p.get('brand') &&
        !p.get('scale') &&
        !p.get('min') &&
        !p.get('max')
      )
    case 'collections':
      return p.get('view') === 'collections'
    case 'new-releases':
      return p.get('availability') === 'new-release'
    case 'pre-orders':
      return p.get('availability') === 'pre-order'
    default:
      return false
  }
}
