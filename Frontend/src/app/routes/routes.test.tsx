import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { mockProducts } from '@/entities/product'
import { expectFigureCount } from '@/test/matchers'
import { appRoutes } from './index'

function renderAt(path: string) {
  const router = createMemoryRouter(appRoutes, { initialEntries: [path] })
  return render(<RouterProvider router={router} />)
}

describe('app routes', () => {
  it('renders landing at /', () => {
    renderAt('/')
    expect(screen.getByRole('link', { name: /explore collection/i })).toBeInTheDocument()
  })

  it('renders catalog at /catalog', () => {
    renderAt('/catalog')
    expect(screen.getByRole('heading', { name: 'Browse Figures' })).toBeInTheDocument()
  })

  it('renders pre-order preset at /catalog?availability=pre-order', () => {
    renderAt('/catalog?availability=pre-order')
    const preOrderCount = mockProducts.filter((p) => p.availability === 'pre-order').length
    expectFigureCount(preOrderCount)
  })

  it.each(['/search', '/cart', '/account'])('renders stub page at %s', (path) => {
    renderAt(path)
    expect(screen.getByText('Coming soon')).toBeInTheDocument()
  })
})
