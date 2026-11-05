import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import {
  CatalogFilters,
  defaultCatalogFilters,
  type CatalogFiltersState,
} from './CatalogFilters'

const baseProps = {
  series: ['Genshin Impact', 'One Piece'],
  brands: ['Alter'],
  scales: ['1/7', '1/8'],
  filters: defaultCatalogFilters,
  activeCount: 0,
}

describe('CatalogFilters', () => {
  it('filters series list by search query', async () => {
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

    await user.type(screen.getByPlaceholderText(/search series/i), 'genshin')

    expect(screen.queryByText('One Piece')).not.toBeInTheDocument()
    expect(screen.getByText('Genshin Impact')).toBeInTheDocument()
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

  it('shows active filter count', () => {
    render(
      <CatalogFilters
        {...baseProps}
        activeCount={3}
        onChange={vi.fn()}
        onReset={vi.fn()}
      />,
    )
    expect(screen.getByText('3 active')).toBeInTheDocument()
  })
})
