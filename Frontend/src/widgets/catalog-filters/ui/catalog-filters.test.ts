import { describe, expect, it } from 'vitest'
import { countActiveFilters, defaultCatalogFilters } from './CatalogFilters'

describe('countActiveFilters', () => {
  it('returns 0 for defaults', () => {
    expect(countActiveFilters(defaultCatalogFilters)).toBe(0)
  })

  it('counts grouped filter dimensions', () => {
    expect(
      countActiveFilters({
        ...defaultCatalogFilters,
        selectedSeries: ['One Piece'],
        matureFilter: 'only',
        priceMin: 50,
      }),
    ).toBe(3)
  })
})
