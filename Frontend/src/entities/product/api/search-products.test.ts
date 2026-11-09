import { describe, expect, it } from 'vitest'
import { mockProducts } from '../model/mock-products'
import { searchProductsByName } from './search-products'

describe('searchProductsByName', () => {
  it('returns empty for short query', async () => {
    expect(await searchProductsByName('s')).toEqual([])
  })

  it('matches product names case-insensitively', async () => {
    const results = await searchProductsByName('essence')
    expect(results.length).toBeGreaterThan(0)
    expect(results.every((p) => p.name.toLowerCase().includes('essence'))).toBe(
      true,
    )
    expect(results[0]?.name).toBe(
      mockProducts.find((p) => /essence/i.test(p.name))?.name,
    )
  })
})
