import { describe, expect, it } from 'vitest'
import { defaultCatalogFilters } from '@/widgets/catalog-filters'
import { filterProducts } from '../lib/filter-products'
import {
  allBrands,
  allScales,
  allSeries,
  mockProducts,
} from './mock-products'
import type { ProductAvailability } from './types'

const availabilitySet = new Set<ProductAvailability>([
  'in-stock',
  'pre-order',
  'new-release',
])

describe('mockProducts dataset', () => {
  it('has unique ids and valid fields', () => {
    const ids = mockProducts.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)

    for (const p of mockProducts) {
      expect(p.name.length).toBeGreaterThan(0)
      expect(p.series.length).toBeGreaterThan(0)
      expect(p.price).toBeGreaterThan(0)
      expect(availabilitySet.has(p.availability)).toBe(true)
      expect(p.scaleKey.length).toBeGreaterThan(0)
    }
  })

  it('derives sorted facet lists from products', () => {
    expect(allSeries).toEqual(
      [...new Set(mockProducts.map((p) => p.series))].sort(),
    )
    expect(allBrands).toEqual(
      [...new Set(mockProducts.map((p) => p.brand))].sort(),
    )
    expect(allScales.length).toBeGreaterThan(0)
    for (const scale of allScales) {
      expect(mockProducts.some((p) => p.scaleKey === scale)).toBe(true)
    }
  })

  it('returns full catalog with default filters', () => {
    expect(filterProducts(mockProducts, defaultCatalogFilters, 'featured')).toHaveLength(
      mockProducts.length,
    )
  })
})
