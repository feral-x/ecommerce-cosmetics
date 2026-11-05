import { describe, expect, it } from 'vitest'
import {
  filtersFromSearchParams,
  isCatalogNavPresetActive,
  searchParamsFromFilters,
} from './catalog-search-params'
import type { ProductAvailability } from '@/entities/product'
import { defaultCatalogFilters } from '@/widgets/catalog-filters'

describe('filtersFromSearchParams', () => {
  it('returns defaults for empty query', () => {
    expect(filtersFromSearchParams('')).toEqual(defaultCatalogFilters)
  })

  it('parses availability and mature', () => {
    const f = filtersFromSearchParams('?availability=pre-order&mature=only')
    expect(f.selectedAvailability).toEqual(['pre-order'])
    expect(f.matureFilter).toBe('only')
  })

  it('falls back mature filter when query is invalid', () => {
    expect(filtersFromSearchParams('?mature=maybe').matureFilter).toBe('all')
  })

  it('ignores invalid availability tokens', () => {
    const f = filtersFromSearchParams('?availability=pre-order,invalid')
    expect(f.selectedAvailability).toEqual(['pre-order'])
  })

  it('parses series, brand, scale, price', () => {
    const f = filtersFromSearchParams(
      '?series=Genshin%20Impact,One%20Piece&brand=Alter&scale=1/7&min=100&max=300',
    )
    expect(f.selectedSeries).toEqual(['Genshin Impact', 'One Piece'])
    expect(f.selectedBrands).toEqual(['Alter'])
    expect(f.selectedScales).toEqual(['1/7'])
    expect(f.priceMin).toBe(100)
    expect(f.priceMax).toBe(300)
  })
})

describe('searchParamsFromFilters', () => {
  it('round-trips availability and mature', () => {
    const filters = {
      ...defaultCatalogFilters,
      selectedAvailability: ['new-release' as const],
      matureFilter: 'exclude' as const,
    }
    const p = searchParamsFromFilters(filters)
    expect(p.get('availability')).toBe('new-release')
    expect(p.get('mature')).toBe('exclude')
  })

  it('omits default mature and full price range', () => {
    const p = searchParamsFromFilters(defaultCatalogFilters)
    expect(p.get('mature')).toBeNull()
    expect(p.get('min')).toBeNull()
    expect(p.get('max')).toBeNull()
  })

  it('round-trips filter fields except local series search', () => {
    const filters = {
      ...defaultCatalogFilters,
      seriesQuery: 'local-only',
      selectedSeries: ['Genshin Impact'],
      selectedBrands: ['Alter'],
      selectedScales: ['1/8'],
      selectedAvailability: ['in-stock', 'pre-order'] satisfies ProductAvailability[],
      matureFilter: 'exclude' as const,
      priceMin: 120,
      priceMax: 400,
    }
    const restored = filtersFromSearchParams(
      searchParamsFromFilters(filters).toString(),
    )
    expect(restored).toEqual({ ...filters, seriesQuery: '' })
  })
})

describe('isCatalogNavPresetActive', () => {
  it('highlights browse only on clean catalog url', () => {
    expect(isCatalogNavPresetActive('browse', '/catalog', '')).toBe(true)
    expect(isCatalogNavPresetActive('browse', '/catalog', '?availability=pre-order')).toBe(
      false,
    )
    expect(isCatalogNavPresetActive('browse', '/', '')).toBe(false)
  })

  it('highlights menu presets from query', () => {
    expect(
      isCatalogNavPresetActive('new-releases', '/catalog', '?availability=new-release'),
    ).toBe(true)
    expect(
      isCatalogNavPresetActive('pre-orders', '/catalog', '?availability=pre-order'),
    ).toBe(true)
    expect(
      isCatalogNavPresetActive('collections', '/catalog', '?view=collections'),
    ).toBe(true)
  })
})
