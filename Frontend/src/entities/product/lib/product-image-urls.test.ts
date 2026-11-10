import { describe, expect, it } from 'vitest'
import { buildProductImageUrls } from './product-image-urls'

describe('buildProductImageUrls', () => {
  it('returns no local placeholders (remote catalog only)', () => {
    expect(buildProductImageUrls('1', 3)).toEqual([])
    expect(buildProductImageUrls('1', 0)).toEqual([])
  })
})
