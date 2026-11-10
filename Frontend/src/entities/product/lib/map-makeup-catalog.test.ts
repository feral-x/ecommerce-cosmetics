import { describe, expect, it } from 'vitest'
import type { MakeupProduct } from '@/shared/api/makeup/types'
import {
  mapMakeupPoolToCatalog,
  mapMakeupProductToCatalog,
} from './map-makeup-catalog'

const sample: MakeupProduct = {
  id: 1048,
  brand: 'colourpop',
  name: 'Lippie Pencil',
  price: '5.0',
  image_link: 'https://cdn.shopify.com/dead.jpg',
  api_featured_image:
    '//s3.amazonaws.com/donovanbailey/products/api_featured_images/test.jpg',
  product_type: 'lip_liner',
  description: 'Vegan pencil.',
}

describe('map-makeup-catalog', () => {
  it('uses S3 featured image, not dead shopify link', () => {
    const p = mapMakeupProductToCatalog(sample, '1')
    expect(p!.images[0]).toBe(
      'https://s3.amazonaws.com/donovanbailey/products/api_featured_images/test.jpg',
    )
    expect(p!.formatKey).toBe('Lip')
    expect(p!.brand).toBe('colourpop')
  })

  it('maps pool to sequential ids', () => {
    const list = mapMakeupPoolToCatalog([sample, { ...sample, id: 2 }], 2)
    expect(list).toHaveLength(2)
    expect(list[0]!.id).toBe('1')
    expect(list[1]!.id).toBe('2')
  })

  it('assigns demo new-release and pre-order labels', () => {
    const pool = Array.from({ length: 20 }, (_, i) => ({
      ...sample,
      id: 9000 + i,
    }))
    const list = mapMakeupPoolToCatalog(pool, 20)
    expect(list.some((p) => p.availability === 'new-release')).toBe(true)
    expect(list.some((p) => p.availability === 'pre-order')).toBe(true)
    expect(list.find((p) => p.id === '2')?.availability).toBe('new-release')
    expect(list.find((p) => p.id === '4')?.availability).toBe('pre-order')
  })
})
