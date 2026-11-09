import { describe, expect, it } from 'vitest'
import { defaultCatalogFilters } from '@/shared/model/catalog-filters'
import type { Product } from '../model/types'
import { filterProducts } from './filter-products'

const sample: Product[] = [
  {
    id: '1',
    category: 'Skincare',
    line: 'Hydration',
    name: 'Deep Serum',
    sizeLabel: '50 ml',
    formatKey: 'Serum',
    brand: 'BrandX',
    availability: 'in-stock',
    skinTypes: ['dry', 'normal'],
    fragranceFree: true,
    price: 45,
    images: ['https://example.com/1-a.jpg'],
  },
  {
    id: '2',
    category: 'Makeup',
    line: 'Velvet',
    name: 'Matte Lip',
    sizeLabel: '5 g',
    formatKey: 'Lip',
    brand: 'BrandY',
    availability: 'pre-order',
    skinTypes: ['normal'],
    fragranceFree: false,
    price: 18,
    images: ['https://example.com/2-a.jpg'],
  },
  {
    id: '3',
    category: 'Skincare',
    line: 'Calm',
    name: 'Barrier Cream',
    sizeLabel: '40 g',
    formatKey: 'Moisturizer',
    brand: 'BrandX',
    availability: 'new-release',
    skinTypes: ['sensitive', 'dry'],
    fragranceFree: true,
    price: 32,
    images: ['https://example.com/3-a.jpg'],
  },
]

describe('filterProducts', () => {
  it('filters by category and availability', () => {
    const result = filterProducts(
      sample,
      {
        ...defaultCatalogFilters,
        selectedCategories: ['Skincare'],
        selectedAvailability: ['in-stock'],
      },
      'featured',
    )
    expect(result.map((p) => p.id)).toEqual(['1'])
  })

  it('filters by brand and format together', () => {
    const result = filterProducts(
      sample,
      {
        ...defaultCatalogFilters,
        selectedBrands: ['BrandX'],
        selectedFormats: ['Serum', 'Moisturizer'],
      },
      'featured',
    )
    expect(result.map((p) => p.id)).toEqual(['1', '3'])
  })

  it('filters fragrance-free only', () => {
    const result = filterProducts(
      sample,
      { ...defaultCatalogFilters, fragranceFreeOnly: true },
      'featured',
    )
    expect(result.map((p) => p.id)).toEqual(['1', '3'])
  })

  it('filters by skin type', () => {
    const result = filterProducts(
      sample,
      { ...defaultCatalogFilters, selectedSkinTypes: ['sensitive'] },
      'featured',
    )
    expect(result.map((p) => p.id)).toEqual(['3'])
  })

  it('sorts by price ascending', () => {
    const result = filterProducts(sample, defaultCatalogFilters, 'price-asc')
    expect(result.map((p) => p.price)).toEqual([18, 32, 45])
  })

  it('sorts by name', () => {
    const result = filterProducts(sample, defaultCatalogFilters, 'name')
    expect(result.map((p) => p.name)).toEqual([
      'Barrier Cream',
      'Deep Serum',
      'Matte Lip',
    ])
  })

  it('filters by product name query', () => {
    const result = filterProducts(sample, defaultCatalogFilters, 'featured', 'lip')
    expect(result.map((p) => p.id)).toEqual(['2'])
  })

  it('filters by line search in filters state', () => {
    const result = filterProducts(
      sample,
      { ...defaultCatalogFilters, lineQuery: 'velvet' },
      'featured',
    )
    expect(result.map((p) => p.id)).toEqual(['2'])
  })
})
