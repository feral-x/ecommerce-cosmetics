import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { mockProducts } from '@/entities/product'
import { expectFigureCount } from '@/test/matchers'
import { CatalogPage } from './CatalogPage'

function renderCatalog(initialEntry: string) {
  const router = createMemoryRouter(
    [{ path: '/catalog', element: <CatalogPage /> }],
    { initialEntries: [initialEntry] },
  )
  const view = render(<RouterProvider router={router} />)
  return { ...view, router }
}

describe('CatalogPage', () => {
  it('shows total figure count for unfiltered catalog', () => {
    renderCatalog('/catalog')
    expectFigureCount(mockProducts.length)
    expect(screen.getByRole('heading', { name: 'Browse Figures' })).toBeInTheDocument()
  })

  it('syncs availability from URL to sidebar checkboxes', () => {
    renderCatalog('/catalog?availability=pre-order')
    const preOrder = screen.getByRole('checkbox', { name: /pre-order/i })
    expect(preOrder).toBeChecked()
  })

  it('updates URL when toggling availability', async () => {
    const user = userEvent.setup()
    const { router } = renderCatalog('/catalog')

    await user.click(screen.getByRole('checkbox', { name: /new releases/i }))

    expect(router.state.location.search).toContain('availability=new-release')
  })

  it('filters listing when URL preset is new-release', () => {
    renderCatalog('/catalog?availability=new-release')
    const expected = mockProducts.filter((p) => p.availability === 'new-release')
    expectFigureCount(expected.length)
    for (const p of expected) {
      expect(screen.getByRole('heading', { name: p.name })).toBeInTheDocument()
    }
  })

  it('paginates at 9 items per page', async () => {
    const user = userEvent.setup()
    renderCatalog('/catalog')

    const pageNav = screen.getByRole('navigation', { name: 'Pagination' })
    expect(within(pageNav).getByRole('button', { name: '2' })).toBeInTheDocument()

    const firstPageName = mockProducts[0]!.name
    expect(screen.getByRole('heading', { name: firstPageName })).toBeInTheDocument()

    await user.click(within(pageNav).getByRole('button', { name: '2' }))

    const page2Start = mockProducts[9]!
    expect(screen.getByRole('heading', { name: page2Start.name })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: firstPageName })).not.toBeInTheDocument()
  })

  it('shows empty state and clears filters', async () => {
    const user = userEvent.setup()
    renderCatalog('/catalog?series=Nonexistent%20Series')

    expect(screen.getByText('No figures match your filters.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    expectFigureCount(mockProducts.length)
  })

  it('changes sort order via select', async () => {
    const user = userEvent.setup()
    renderCatalog('/catalog')

    await user.selectOptions(screen.getByLabelText('Sort'), 'price-asc')
    const prices = screen.getAllByRole('article').map((card) => {
      const priceEl = within(card).getByText(/^\$\d+$/)
      return Number(priceEl.textContent!.replace('$', ''))
    })

    const sorted = [...prices].sort((a, b) => a - b)
    expect(prices).toEqual(sorted)
  })
})
