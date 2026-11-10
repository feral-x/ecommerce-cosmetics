import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { defaultCatalogFilters } from '@/shared/model/catalog-filters'
import { PriceRangeFilter } from './PriceRangeFilter'

describe('PriceRangeFilter', () => {
  it('does not commit to parent while dragging range', () => {
    const onCommit = vi.fn()
    render(
      <PriceRangeFilter
        priceMin={defaultCatalogFilters.priceMin}
        priceMax={defaultCatalogFilters.priceMax}
        onCommit={onCommit}
      />,
    )

    const maxSlider = screen.getByLabelText('Maximum price')
    fireEvent.change(maxSlider, { target: { value: '120' } })
    expect(onCommit).not.toHaveBeenCalled()
    expect(screen.getByText('$0 – $120')).toBeInTheDocument()

    fireEvent.pointerUp(maxSlider)
    expect(onCommit).toHaveBeenCalledWith({ priceMin: 0, priceMax: 120 })
  })

  it('commits min range on pointer up and keeps order', () => {
    const onCommit = vi.fn()
    render(
      <PriceRangeFilter
        priceMin={0}
        priceMax={200}
        onCommit={onCommit}
      />,
    )

    const minSlider = screen.getByLabelText('Minimum price')
    fireEvent.change(minSlider, { target: { value: '80' } })
    fireEvent.pointerUp(minSlider)
    expect(onCommit).toHaveBeenCalledWith({ priceMin: 80, priceMax: 200 })
  })

  it('commits number fields on blur', () => {
    const onCommit = vi.fn()
    render(
      <PriceRangeFilter
        priceMin={0}
        priceMax={300}
        onCommit={onCommit}
      />,
    )

    const toField = screen.getByLabelText('To')
    fireEvent.change(toField, { target: { value: '95' } })
    fireEvent.blur(toField)
    expect(onCommit).toHaveBeenCalledWith({ priceMin: 0, priceMax: 95 })
  })
})
