import { describe, expect, it } from 'vitest'
import type { MakeupProduct } from '@/shared/api/makeup/types'
import { mockProducts } from '../model/mock-products'
import {
  applyMakeupImagesToProducts,
  normalizeMakeupImageUrl,
} from './apply-makeup-images'

const poolItem: MakeupProduct = {
  id: 1,
  brand: 'colourpop',
  name: 'Test',
  price: '5.0',
  image_link: 'https://cdn.shopify.com/test.jpg',
  api_featured_image: '//s3.amazonaws.com/donovanbailey/featured.jpg',
}

describe('applyMakeupImagesToProducts', () => {
  it('normalizes protocol-relative urls', () => {
    expect(normalizeMakeupImageUrl('//cdn.example.com/a.jpg')).toBe(
      'https://cdn.example.com/a.jpg',
    )
  })

  it('prefers featured image when patching mocks', () => {
    const next = applyMakeupImagesToProducts(mockProducts.slice(0, 1), [
      poolItem,
    ])
    expect(next[0]!.images[0]).toBe(
      'https://s3.amazonaws.com/donovanbailey/featured.jpg',
    )
  })
})
