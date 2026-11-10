import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CartProvider } from '@/entities/cart'
import { queryClient } from '@/shared/lib/query-client'
import { BundlesPageView } from './BundlesPageView'

describe('BundlesPageView', () => {
  it('renders bundle cards without catalog filters', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <BundlesPageView />
        </CartProvider>
      </QueryClientProvider>,
    )

    expect(screen.getByRole('heading', { name: 'Bundles' })).toBeInTheDocument()
    expect(screen.queryByRole('complementary', { name: 'Filters' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('article').length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: /see what's inside/i })[0]).toHaveAttribute(
      'href',
      expect.stringMatching(/^\/bundles\//),
    )
  })
})
