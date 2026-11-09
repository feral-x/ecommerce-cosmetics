import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CartProvider } from '@/entities/cart'
import * as catalogBootstrap from '@/entities/product/api/catalog-bootstrap'
import { mockProducts } from '@/entities/product'
import { queryClient } from '@/shared/lib/query-client'
import { nextNavigationMock } from '@/test/navigation-test-state'
import { expectProductCount } from '@/test/matchers'
import { CatalogPage } from './CatalogPage'

function renderCatalog() {
  return render(
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <CatalogPage />
      </CartProvider>
    </QueryClientProvider>,
  )
}

describe('CatalogPage', () => {
  beforeEach(() => {
    nextNavigationMock.pathname = '/catalog'
  })

  it('shows loading placeholders then catalog content', async () => {
    vi.spyOn(catalogBootstrap, 'fetchCatalogBootstrap').mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                products: mockProducts,
                categories: [],
                brands: [],
                formats: [],
              }),
            80,
          ),
        ),
    )

    renderCatalog()
    expect(screen.getByLabelText('Loading filters')).toBeInTheDocument()
    expect(
      await screen.findByRole('heading', { name: 'Filters', level: 2 }),
    ).toBeInTheDocument()

    vi.restoreAllMocks()
  })

  it('shows total product count for unfiltered catalog', async () => {
    nextNavigationMock.search = ''
    renderCatalog()
    await screen.findByRole('heading', { name: 'Filters', level: 2 })
    expectProductCount(mockProducts.length)
    expect(screen.getByRole('heading', { name: 'Shop J-Beauty' })).toBeInTheDocument()
  })

  it('syncs availability from URL to sidebar checkboxes', async () => {
    nextNavigationMock.search = 'availability=pre-order'
    renderCatalog()
    await screen.findByRole('heading', { name: 'Filters', level: 2 })
    const preOrder = screen.getByRole('checkbox', { name: /pre-order/i })
    expect(preOrder).toBeChecked()
  })

  it('updates URL when toggling availability', async () => {
    const user = userEvent.setup()
    nextNavigationMock.search = ''
    renderCatalog()
    await screen.findByRole('heading', { name: 'Filters', level: 2 })

    await user.click(screen.getByRole('checkbox', { name: /new arrivals/i }))

    expect(nextNavigationMock.push).toHaveBeenCalled()
    const href = String(nextNavigationMock.push.mock.calls.at(-1)?.[0])
    expect(href).toContain('availability=new-release')
  })

  it('filters listing when URL preset is new-release', async () => {
    nextNavigationMock.search = 'availability=new-release'
    renderCatalog()
    await screen.findByRole('heading', { name: 'Filters', level: 2 })
    const expected = mockProducts.filter((p) => p.availability === 'new-release')
    expectProductCount(expected.length)
    for (const p of expected) {
      expect(screen.getByRole('heading', { name: p.name })).toBeInTheDocument()
    }
  })

  it('paginates at 15 items per page', async () => {
    const user = userEvent.setup()
    nextNavigationMock.search = ''
    renderCatalog()
    await screen.findByRole('heading', { name: 'Filters', level: 2 })

    const pageNav = screen.getByRole('navigation', { name: 'Pagination' })
    expect(within(pageNav).getByRole('button', { name: '2' })).toBeInTheDocument()

    const firstPageName = mockProducts[0]!.name
    expect(screen.getByRole('heading', { name: firstPageName })).toBeInTheDocument()

    await user.click(within(pageNav).getByRole('button', { name: '2' }))

    expect(nextNavigationMock.push).toHaveBeenCalled()
    expect(String(nextNavigationMock.push.mock.calls.at(-1)?.[0])).toContain('page=2')
  })

  it('shows empty state and clears filters', async () => {
    const user = userEvent.setup()
    nextNavigationMock.search = 'q=zzzz-no-match'
    renderCatalog()
    await screen.findByRole('heading', { name: 'Filters', level: 2 })

    expect(screen.getByText('No products match your filters.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(nextNavigationMock.push).toHaveBeenCalledWith('/catalog', {
      scroll: false,
    })
  })

  it('updates URL when changing sort', async () => {
    const user = userEvent.setup()
    nextNavigationMock.search = ''
    renderCatalog()
    await screen.findByRole('heading', { name: 'Filters', level: 2 })

    await user.selectOptions(screen.getByLabelText('Sort'), 'price-asc')

    expect(nextNavigationMock.push).toHaveBeenCalled()
    expect(String(nextNavigationMock.push.mock.calls.at(-1)?.[0])).toContain(
      'sort=price-asc',
    )
  })

  it('shows error UI and retries when bootstrap fails', async () => {
    const user = userEvent.setup()
    const isolatedClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    let allowFetch = false
    catalogBootstrap.setCatalogBootstrapLoader(() => {
      if (!allowFetch) {
        return Promise.reject(new Error('network'))
      }
      return Promise.resolve({
        products: mockProducts,
        categories: [],
        brands: [],
        formats: [],
      })
    })

    try {
      render(
        <QueryClientProvider client={isolatedClient}>
          <CartProvider>
            <CatalogPage />
          </CartProvider>
        </QueryClientProvider>,
      )

      expect(
        await screen.findByRole('alert'),
      ).toHaveTextContent(/couldn't load the catalog/i)
      expect(screen.queryByLabelText('Loading products')).not.toBeInTheDocument()

      allowFetch = true
      await user.click(screen.getByRole('button', { name: /^retry$/i }))

      await screen.findByRole('heading', { name: 'Filters', level: 2 })
      expectProductCount(mockProducts.length)
    } finally {
      catalogBootstrap.setCatalogBootstrapLoader(null)
    }
  })

  it('keeps product grid while facets refetch after filter change', async () => {
    let fetchCount = 0
    vi.spyOn(catalogBootstrap, 'fetchCatalogBootstrap').mockImplementation(
      () =>
        new Promise((resolve) => {
          fetchCount += 1
          const delayMs = fetchCount === 1 ? 0 : 200
          setTimeout(
            () =>
              resolve({
                products: mockProducts,
                categories: ['Skincare'],
                brands: [],
                formats: [],
              }),
            delayMs,
          )
        }),
    )

    nextNavigationMock.search = ''
    const view = renderCatalog()
    await screen.findByRole('heading', { name: 'Filters', level: 2 })
    const anchorName = mockProducts[0]!.name
    expect(screen.getByRole('heading', { name: anchorName })).toBeInTheDocument()

    nextNavigationMock.search = 'availability=new-release'
    view.rerender(
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <CatalogPage />
        </CartProvider>
      </QueryClientProvider>,
    )

    expect(await screen.findByLabelText('Loading filters')).toBeInTheDocument()
    const stillVisible = mockProducts.find((p) => p.availability === 'new-release')!
    expect(
      screen.getByRole('heading', { name: stillVisible.name }),
    ).toBeInTheDocument()
    expect(screen.queryByLabelText('Loading products')).not.toBeInTheDocument()

    await screen.findByRole('heading', { name: 'Filters', level: 2 })
    vi.restoreAllMocks()
  })
})
