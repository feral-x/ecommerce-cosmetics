import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProductCard } from './ProductCard'
import type { Product } from '../model/types'

const product: Product = {
  id: '1',
  series: 'Test Series',
  name: 'Test Figure',
  scale: '1/7 Scale Figure',
  scaleKey: '1/7',
  brand: 'Test Brand',
  availability: 'in-stock',
  mature: false,
  price: 199,
}

describe('ProductCard', () => {
  it('renders product metadata', () => {
    render(<ProductCard product={product} />)
    expect(screen.getByRole('heading', { name: 'Test Figure' })).toBeInTheDocument()
    expect(screen.getByText('Test Series')).toBeInTheDocument()
    expect(screen.getByText('$199')).toBeInTheDocument()
    expect(screen.getByText('In stock')).toBeInTheDocument()
  })

  it('does not show 18+ badge on card', () => {
    render(<ProductCard product={{ ...product, mature: true }} />)
    expect(screen.queryByText('18+')).not.toBeInTheDocument()
  })

  it.each([
    ['pre-order', 'Pre-order'],
    ['new-release', 'New release'],
  ] as const)('shows availability label %s', (availability, label) => {
    render(<ProductCard product={{ ...product, availability }} />)
    expect(screen.getByText(label)).toBeInTheDocument()
  })
})
