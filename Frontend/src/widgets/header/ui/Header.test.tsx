import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CartProvider } from '@/entities/cart'
import { queryClient } from '@/shared/lib/query-client'
import { nextNavigationMock } from '@/test/navigation-test-state'
import { Header } from './Header'

function renderHeader() {
  return render(
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Header />
      </CartProvider>
    </QueryClientProvider>,
  )
}

describe('Header', () => {
  it('links mobile search to /search and desktop search opens inline', () => {
    renderHeader()

    expect(
      screen.getByRole('link', { name: 'Hanami J-Beauty, shop catalog' }),
    ).toHaveAttribute('href', '/catalog')
    expect(screen.getByRole('link', { name: 'Search' })).toHaveAttribute(
      'href',
      '/search',
    )
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Cart' })).toHaveAttribute('href', '/cart')
    expect(screen.getByRole('link', { name: 'Account' })).toHaveAttribute('href', '/account')
  })

  it('marks New Arrivals active on catalog preset URL', () => {
    nextNavigationMock.pathname = '/catalog'
    nextNavigationMock.search = 'availability=new-release'
    renderHeader()

    const link = screen.getByRole('link', { name: 'New Arrivals' })
    expect(link.className).toContain('nav-link--active')
    expect(screen.getByRole('link', { name: 'Shop All' }).className).not.toContain(
      'nav-link--active',
    )
  })

  it('marks Bundles active on /bundles', () => {
    nextNavigationMock.pathname = '/bundles'
    nextNavigationMock.search = ''
    renderHeader()

    expect(screen.getByRole('link', { name: 'Bundles' }).className).toContain(
      'nav-link--active',
    )
  })

  it('marks Shop All active on clean catalog URL', () => {
    nextNavigationMock.pathname = '/catalog'
    nextNavigationMock.search = ''
    renderHeader()

    expect(screen.getByRole('link', { name: 'Shop All' }).className).toContain(
      'nav-link--active',
    )
  })
})
