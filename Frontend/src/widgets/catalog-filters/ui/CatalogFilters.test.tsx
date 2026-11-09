import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import {
  defaultCatalogFilters,
  type CatalogFiltersState,
} from '@/shared/model/catalog-filters'
import { CatalogFilters } from './CatalogFilters'

const baseProps = {
  categories: ['Skincare', 'Makeup', 'Sun Care'],
  brands: ['Shiseido', 'SK-II'],
  formats: ['Essence', 'Serum', 'Sunscreen'],
  filters: defaultCatalogFilters,
  activeCount: 0,
}

describe('CatalogFilters', () => {
  it('filters line search updates query', async () => {
    const user = userEvent.setup()

    function Harness() {
      const [filters, setFilters] = useState<CatalogFiltersState>(
        defaultCatalogFilters,
      )
      return (
        <CatalogFilters
          {...baseProps}
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(defaultCatalogFilters)}
        />
      )
    }

    render(<Harness />)

    await user.type(screen.getByPlaceholderText(/search line/i), 'ultimune')
    expect(screen.getByDisplayValue('ultimune')).toBeInTheDocument()
  })

  it('calls onReset from reset button', async () => {
    const user = userEvent.setup()
    const onReset = vi.fn()
    render(
      <CatalogFilters
        {...baseProps}
        activeCount={2}
        onChange={vi.fn()}
        onReset={onReset}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Reset' }))
    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it('groups filter sections with accessible labels', () => {
    render(
      <CatalogFilters
        {...baseProps}
        onChange={vi.fn()}
        onReset={vi.fn()}
      />,
    )
    expect(screen.getByRole('group', { name: 'Category' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Skin type' })).toBeInTheDocument()
  })

  it('always shows active filter count including zero', () => {
    const onChange = vi.fn()
    const onReset = vi.fn()
    const { rerender } = render(
      <CatalogFilters
        {...baseProps}
        activeCount={0}
        onChange={onChange}
        onReset={onReset}
      />,
    )
    expect(screen.getByText('0 active')).toBeInTheDocument()

    rerender(
      <CatalogFilters
        {...baseProps}
        activeCount={3}
        onChange={onChange}
        onReset={onReset}
      />,
    )
    expect(screen.getByText('3 active')).toBeInTheDocument()
  })
})
