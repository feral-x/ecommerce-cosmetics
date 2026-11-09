import { describe, expect, it } from 'vitest'
import {
  LOCAL_MOCK_FIGURE_IMAGES,
  buildProductImageUrls,
} from './product-image-urls'

describe('buildProductImageUrls', () => {
  it('returns local public paths', () => {
    const urls = buildProductImageUrls('1', 3)
    expect(urls).toHaveLength(3)
    expect(urls.every((u) => u.startsWith('/mock/cosmetics/'))).toBe(true)
    expect(urls[0]).toBe(LOCAL_MOCK_FIGURE_IMAGES[0])
  })

  it('clamps count to minimum 1 and pool size', () => {
    expect(buildProductImageUrls('1', 0)).toHaveLength(1)
    expect(buildProductImageUrls('1', 99).length).toBeLessThanOrEqual(
      LOCAL_MOCK_FIGURE_IMAGES.length,
    )
  })
})
