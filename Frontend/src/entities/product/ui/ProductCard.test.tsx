import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CartProvider } from '@/entities/cart'
import { ProductCard } from './ProductCard'
import type { Product } from '../model/types'

const product: Product = {
  id: '1',
  category: 'Skincare',
  line: 'Test Line',
  name: 'Hydrating Essence',
  shortDescription: 'Hydrating Essence',
  sizeLabel: '160 ml',
  formatKey: 'Essence',
  brand: 'Test Brand',
  availability: 'in-stock',
  skinTypes: ['normal'],
  fragranceFree: true,
  stockCount: 3,
  price: 199,
  description: 'Test product description.',
  images: ['https://example.com/1.jpg', 'https://example.com/2.jpg'],
}

function renderCard(overrides?: Partial<Product>) {
  return render(
    <CartProvider>
      <ProductCard product={{ ...product, ...overrides }} />
    </CartProvider>,
  )
}

describe('ProductCard', () => {
  it('renders product metadata and product link', () => {
    renderCard()
    expect(
      screen.getByRole('link', {
        name: /Test Brand, Hydrating Essence/i,
      }),
    ).toHaveAttribute('href', '/product/1')
    expect(screen.getByText('Test Brand')).toBeInTheDocument()
    expect(screen.getByText('$199')).toBeInTheDocument()
    expect(screen.queryByText(/left$/i)).not.toBeInTheDocument()
    expect(screen.queryByText('Unscented')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add to cart' })).toBeInTheDocument()
  })

  it('shows Pre-order badge only for pre-order items', () => {
    renderCard({ availability: 'pre-order' })
    expect(screen.getByText('Pre-order')).toBeInTheDocument()
  })

  it('does not show card badges for in-stock or new-release', () => {
    renderCard({ availability: 'new-release' })
    expect(screen.queryByText('Just arrived')).not.toBeInTheDocument()
    renderCard({ availability: 'in-stock', stockCount: 2 })
    expect(screen.queryByText('2 left')).not.toBeInTheDocument()
  })
})
