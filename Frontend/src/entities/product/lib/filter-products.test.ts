import { describe, expect, it } from 'vitest'
import { defaultCatalogFilters } from '@/widgets/catalog-filters'
import type { Product } from '../model/types'
import { filterProducts } from './filter-products'

const sample: Product[] = [
  {
    id: '1',
    series: 'A',
    name: 'Zeta',
    scale: '1/7',
    scaleKey: '1/7',
    brand: 'BrandX',
    availability: 'in-stock',
    mature: false,
    price: 200,
  },
  {
    id: '2',
    series: 'B',
    name: 'Alpha',
    scale: '1/8',
    scaleKey: '1/8',
    brand: 'BrandY',
    availability: 'pre-order',
    mature: true,
    price: 100,
  },
  {
    id: '3',
    series: 'A',
    name: 'Beta',
    scale: '1/7',
    scaleKey: '1/7',
    brand: 'BrandX',
    availability: 'new-release',
    mature: true,
    price: 300,
  },
]

describe('filterProducts', () => {
  it('filters by series and availability', () => {
    const result = filterProducts(
      sample,
      {
        ...defaultCatalogFilters,
        selectedSeries: ['A'],
        selectedAvailability: ['new-release'],
      },
      'featured',
    )
    expect(result.map((p) => p.id)).toEqual(['3'])
  })

  it('hide 18+ excludes mature products', () => {
    const result = filterProducts(
      sample,
      { ...defaultCatalogFilters, matureFilter: 'exclude' },
      'featured',
    )
    expect(result.every((p) => !p.mature)).toBe(true)
    expect(result).toHaveLength(1)
  })

  it('18+ only keeps mature products', () => {
    const result = filterProducts(
      sample,
      { ...defaultCatalogFilters, matureFilter: 'only' },
      'featured',
    )
    expect(result.every((p) => p.mature)).toBe(true)
    expect(result).toHaveLength(2)
  })

  it('sorts by price ascending', () => {
    const result = filterProducts(sample, defaultCatalogFilters, 'price-asc')
    expect(result.map((p) => p.price)).toEqual([100, 200, 300])
  })

  it('sorts by price descending', () => {
    const result = filterProducts(sample, defaultCatalogFilters, 'price-desc')
    expect(result.map((p) => p.price)).toEqual([300, 200, 100])
  })

  it('sorts by name', () => {
    const result = filterProducts(sample, defaultCatalogFilters, 'name')
    expect(result.map((p) => p.name)).toEqual(['Alpha', 'Beta', 'Zeta'])
  })

  it('respects price range', () => {
    const result = filterProducts(
      sample,
      { ...defaultCatalogFilters, priceMin: 150, priceMax: 250 },
      'featured',
    )
    expect(result.map((p) => p.id)).toEqual(['1'])
  })

  it('filters by brand and scale together', () => {
    const result = filterProducts(
      sample,
      {
        ...defaultCatalogFilters,
        selectedBrands: ['BrandX'],
        selectedScales: ['1/7'],
      },
      'featured',
    )
    expect(result.map((p) => p.id)).toEqual(['1', '3'])
  })

  it('keeps source order for featured sort', () => {
    const result = filterProducts(sample, defaultCatalogFilters, 'featured')
    expect(result.map((p) => p.id)).toEqual(['1', '2', '3'])
  })
})
