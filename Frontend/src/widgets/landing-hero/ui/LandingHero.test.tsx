import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { mockProducts } from '@/entities/product/model/mock-products'
import { LandingHero } from './LandingHero'

describe('LandingHero', () => {
  it('links mosaic tiles to product and brand catalog', () => {
    render(<LandingHero />)
    const featured = mockProducts.slice(0, 3)

    for (const product of featured) {
      expect(
        screen.getByRole('link', {
          name: new RegExp(product.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
        }),
      ).toHaveAttribute('href', `/product/${product.id}`)

      expect(
        screen.getByRole('link', { name: product.brand }),
      ).toHaveAttribute(
        'href',
        `/catalog?brand=${encodeURIComponent(product.brand)}`,
      )
    }
  })
})
