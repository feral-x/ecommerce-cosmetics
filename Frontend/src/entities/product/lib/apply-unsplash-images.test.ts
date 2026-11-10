import { describe, expect, it } from 'vitest'
import type { UnsplashPhoto } from '@/shared/api/unsplash/types'
import type { Product } from '../model/types'
import { applyUnsplashImagesToProducts } from './apply-unsplash-images'

const sampleProduct: Product = {
  id: '1',
  category: 'Skincare',
  line: 'Test',
  name: 'Test',
  shortDescription: 'Test',
  sizeLabel: '50 ml',
  formatKey: 'Serum',
  brand: 'Brand',
  availability: 'in-stock',
  skinTypes: ['normal'],
  fragranceFree: true,
  price: 10,
  description: 'Desc',
  images: ['/mock/cosmetics/01.jpg', '/mock/cosmetics/02.jpg'],
}

const pool: UnsplashPhoto[] = [
  {
    id: 'a',
    alt_description: null,
    description: null,
    urls: {
      raw: '',
      full: '',
      regular: 'https://images.unsplash.com/a',
      small: '',
      thumb: '',
    },
    user: { name: 'Annie', links: { html: 'https://unsplash.com/@annie' } },
    links: { html: 'https://unsplash.com/photos/a' },
  },
]

describe('applyUnsplashImagesToProducts', () => {
  it('replaces local urls with unsplash pool', () => {
    const [next] = applyUnsplashImagesToProducts([sampleProduct], pool)
    expect(next!.images[0]).toBe('https://images.unsplash.com/a')
  })
})
