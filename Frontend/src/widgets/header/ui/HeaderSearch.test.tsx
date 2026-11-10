import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import * as searchProducts from '@/entities/product/api/search-products'
import { mockProducts } from '@/entities/product/model/mock-products'
import { queryClient } from '@/shared/lib/query-client'
import { nextNavigationMock } from '@/test/navigation-test-state'
import { HeaderSearch } from './HeaderSearch'

function renderSearch() {
  return render(
    <QueryClientProvider client={queryClient}>
      <HeaderSearch />
    </QueryClientProvider>,
  )
}

describe('HeaderSearch', () => {
  it('expands inline search on desktop', async () => {
    const user = userEvent.setup()
    renderSearch()

    expect(screen.getByRole('link', { name: 'Search' })).toHaveAttribute(
      'href',
      '/search',
    )
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Search' }))
    expect(
      screen.getByRole('combobox', { name: /search cosmetics/i }),
    ).toBeInTheDocument()
  })

  it('debounces backend search and shows results', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

    let calls = 0
    searchProducts.setProductSearchLoader(async () => {
      calls += 1
      return [mockProducts[0]!]
    })

    try {
      renderSearch()
      await user.click(screen.getByRole('button', { name: 'Search' }))
      await user.type(
        screen.getByRole('combobox', { name: /search cosmetics/i }),
        'Facial',
      )

      expect(calls).toBe(0)
      await vi.advanceTimersByTimeAsync(350)

      await waitFor(() => expect(calls).toBe(1))
      expect(
        await screen.findByRole('option', { name: /Facial Treatment Essence/i }),
      ).toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  it('navigates to catalog with query when picking a result', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

    vi.spyOn(searchProducts, 'searchProductsByName').mockResolvedValue([
      mockProducts[0]!,
    ])

    renderSearch()
    await user.click(screen.getByRole('button', { name: 'Search' }))
    await user.type(
      screen.getByRole('combobox', { name: /search cosmetics/i }),
      'Facial',
    )
    await vi.advanceTimersByTimeAsync(350)
    await user.click(
      await screen.findByRole('option', { name: /Facial Treatment Essence/i }),
    )

    expect(nextNavigationMock.push).toHaveBeenCalled()
    expect(String(nextNavigationMock.push.mock.calls.at(-1)?.[0])).toContain(
      'catalog?q=Facial',
    )
    vi.useRealTimers()
  })
})
