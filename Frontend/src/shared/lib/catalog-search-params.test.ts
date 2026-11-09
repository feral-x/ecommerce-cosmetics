import { describe, expect, it } from 'vitest'
import {
  catalogViewFromSearchParams,
  filtersFromSearchParams,
  isCatalogNavPresetActive,
  searchParamsFromCatalogView,
  searchParamsFromFilters,
} from './catalog-search-params'
import type { ProductAvailability } from '@/entities/product'
import {
  CATALOG_PRICE_MAX,
  defaultCatalogFilters,
} from '@/shared/model/catalog-filters'

describe('filtersFromSearchParams', () => {
  it('returns defaults for empty query', () => {
    expect(filtersFromSearchParams('')).toEqual(defaultCatalogFilters)
  })

  it('parses availability and skin types', () => {
    const f = filtersFromSearchParams('?availability=pre-order&skin=dry,sensitive')
    expect(f.selectedAvailability).toEqual(['pre-order'])
    expect(f.selectedSkinTypes).toEqual(['dry', 'sensitive'])
  })

  it('parses fragrance-free flag', () => {
    expect(filtersFromSearchParams('?fragranceFree=1').fragranceFreeOnly).toBe(true)
  })

  it('ignores invalid availability tokens', () => {
    const f = filtersFromSearchParams('?availability=pre-order,invalid')
    expect(f.selectedAvailability).toEqual(['pre-order'])
  })

  it('parses category, brand, format, price, line search', () => {
    const f = filtersFromSearchParams(
      '?category=Skincare,Makeup&brand=SK-II,Shiseido&format=Essence,Serum&min=20&max=120&lineQ=ultimune',
    )
    expect(f.selectedCategories).toEqual(['Skincare', 'Makeup'])
    expect(f.selectedBrands).toEqual(['SK-II', 'Shiseido'])
    expect(f.selectedFormats).toEqual(['Essence', 'Serum'])
    expect(f.priceMin).toBe(20)
    expect(f.priceMax).toBe(120)
    expect(f.lineQuery).toBe('ultimune')
  })
})

describe('catalogViewFromSearchParams', () => {
  it('parses sort and page', () => {
    const view = catalogViewFromSearchParams('?sort=price-asc&page=3')
    expect(view.sort).toBe('price-asc')
    expect(view.page).toBe(3)
  })

  it('parses product name query', () => {
    const view = catalogViewFromSearchParams('?q=Essence')
    expect(view.nameQuery).toBe('Essence')
  })

  it('round-trips catalog view', () => {
    const view = {
      filters: {
        ...defaultCatalogFilters,
        lineQuery: 'gokujyun',
        selectedAvailability: ['in-stock'] satisfies ProductAvailability[],
        selectedCategories: ['Skincare'],
        fragranceFreeOnly: true,
        priceMax: 150,
      },
      sort: 'name' as const,
      page: 2,
      nameQuery: 'Lotion',
    }
    const restored = catalogViewFromSearchParams(
      searchParamsFromCatalogView(view).toString(),
    )
    expect(restored).toEqual(view)
  })
})

describe('searchParamsFromFilters', () => {
  it('round-trips availability and skin', () => {
    const filters = {
      ...defaultCatalogFilters,
      selectedAvailability: ['pre-order'] satisfies ProductAvailability[],
      selectedSkinTypes: ['oily' as const],
    }
    const p = searchParamsFromFilters(filters)
    expect(filtersFromSearchParams(p.toString()).selectedAvailability).toEqual(
      filters.selectedAvailability,
    )
    expect(filtersFromSearchParams(p.toString()).selectedSkinTypes).toEqual([
      'oily',
    ])
  })

  it('omits default price max from URL', () => {
    const p = searchParamsFromFilters(defaultCatalogFilters)
    expect(p.get('max')).toBeNull()
    const withCap = searchParamsFromFilters({
      ...defaultCatalogFilters,
      priceMax: 80,
    })
    expect(withCap.get('max')).toBe('80')
    expect(CATALOG_PRICE_MAX).toBe(300)
  })

  it('round-trips filter fields including line search', () => {
    const filters = {
      ...defaultCatalogFilters,
      lineQuery: 'mild',
      selectedBrands: ['FANCL'],
      selectedFormats: ['Cleanser'],
    }
  expect(filtersFromSearchParams(searchParamsFromFilters(filters).toString())).toEqual(
      filters,
    )
  })
})

describe('isCatalogNavPresetActive', () => {
  it('detects pre-orders preset', () => {
    expect(isCatalogNavPresetActive('pre-orders', '/catalog', '?availability=pre-order')).toBe(
      true,
    )
  })

  it('detects bundles nav on bundles route', () => {
    expect(isCatalogNavPresetActive('bundles', '/bundles', '')).toBe(true)
    expect(isCatalogNavPresetActive('bundles', '/catalog', '')).toBe(false)
  })

  it('browse is active on clean catalog url', () => {
    expect(isCatalogNavPresetActive('browse', '/catalog', '')).toBe(true)
    expect(isCatalogNavPresetActive('browse', '/catalog', '?category=Skincare')).toBe(
      false,
    )
  })
})
