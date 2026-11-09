import { describe, expect, it } from 'vitest'
import { defaultCatalogFilters } from '@/shared/model/catalog-filters'
import { filterProducts } from '../lib/filter-products'
import {
  allBrands,
  allCategories,
  allFormats,
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
      expect(p.line.length).toBeGreaterThan(0)
      expect(p.category.length).toBeGreaterThan(0)
      expect(p.price).toBeGreaterThan(0)
      expect(availabilitySet.has(p.availability)).toBe(true)
      expect(p.formatKey.length).toBeGreaterThan(0)
      expect(p.images.length).toBeGreaterThan(0)
    }
  })

  it('derives sorted facet lists from products', () => {
    expect(allCategories).toEqual(
      [...new Set(mockProducts.map((p) => p.category))].sort(),
    )
    expect(allBrands).toEqual(
      [...new Set(mockProducts.map((p) => p.brand))].sort(),
    )
    expect(allFormats.length).toBeGreaterThan(0)
    for (const format of allFormats) {
      expect(mockProducts.some((p) => p.formatKey === format)).toBe(true)
    }
  })

  it('returns full catalog with default filters', () => {
    expect(filterProducts(mockProducts, defaultCatalogFilters, 'featured')).toHaveLength(
      mockProducts.length,
    )
  })

  it('has expanded catalog size', () => {
    expect(mockProducts.length).toBeGreaterThanOrEqual(50)
  })
})
