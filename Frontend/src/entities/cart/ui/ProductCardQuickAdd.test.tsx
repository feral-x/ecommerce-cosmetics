import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CartProvider } from './CartProvider'
import { ProductCardQuickAdd } from './ProductCardQuickAdd'

describe('ProductCardQuickAdd', () => {
  it('adds on cart click then steps quantity with trash at one', async () => {
    const user = userEvent.setup()
    render(
      <CartProvider>
        <ProductCardQuickAdd productId="p1" />
      </CartProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Add to cart' }))
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remove from cart' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Increase quantity' }))
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Decrease quantity' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Decrease quantity' }))
    expect(screen.getByText('1')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Remove from cart' }))
    expect(screen.getByRole('button', { name: 'Add to cart' })).toBeInTheDocument()
  })

  it('does not bubble clicks to parent (card link)', async () => {
    const user = userEvent.setup()
    const onParentClick = vi.fn()
    render(
      <CartProvider>
        <div onClick={onParentClick} role="presentation">
          <ProductCardQuickAdd productId="p3" />
        </div>
      </CartProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Add to cart' }))
    expect(onParentClick).not.toHaveBeenCalled()
  })
})
