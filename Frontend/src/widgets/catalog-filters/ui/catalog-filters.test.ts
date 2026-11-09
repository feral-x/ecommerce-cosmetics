import { describe, expect, it } from 'vitest'
import {
  countActiveFilters,
  defaultCatalogFilters,
} from '@/shared/model/catalog-filters'

describe('countActiveFilters', () => {
  it('returns 0 for defaults', () => {
    expect(countActiveFilters(defaultCatalogFilters)).toBe(0)
  })

  it('counts grouped filter dimensions', () => {
    expect(
      countActiveFilters({
        ...defaultCatalogFilters,
        selectedCategories: ['Skincare'],
        fragranceFreeOnly: true,
        priceMin: 50,
      }),
    ).toBe(3)
  })
})
