import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { CARTS_KEY, SESSION_KEY } from '@/entities/user/lib/user-storage'
import { bundleCartLineId } from '../lib/bundle-cart-line'
import { CartProvider, useCart } from './CartProvider'

function CartProbe() {
  const {
    getQuantity,
    getBundleQuantity,
    addProduct,
    addBundle,
    setProductQuantity,
    totalItems,
  } = useCart()
  return (
    <div>
      <span data-testid="total">{totalItems}</span>
      <span data-testid="p1">{getQuantity('p1')}</span>
      <span data-testid="bundle">{getBundleQuantity('b1')}</span>
      <button type="button" onClick={() => addProduct('p1', 2)}>
        add-p1
      </button>
      <button type="button" onClick={() => setProductQuantity('p1', 0)}>
        clear-p1
      </button>
      <button type="button" onClick={() => addBundle('b1')}>
        add-bundle
      </button>
      <button type="button" onClick={() => setProductQuantity('p1', -3)}>
        neg-p1
      </button>
    </div>
  )
}

describe('CartProvider', () => {
  afterEach(() => {
    window.localStorage.removeItem('hanami-cart-v1')
    window.localStorage.removeItem(CARTS_KEY)
    window.localStorage.removeItem(SESSION_KEY)
  })

  it('accumulates product qty and tracks bundle lines separately', async () => {
    const user = userEvent.setup()
    render(
      <CartProvider>
        <CartProbe />
      </CartProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'add-p1' }))
    expect(screen.getByTestId('p1')).toHaveTextContent('2')
    expect(screen.getByTestId('total')).toHaveTextContent('2')

    await user.click(screen.getByRole('button', { name: 'add-bundle' }))
    expect(screen.getByTestId('bundle')).toHaveTextContent('1')
    expect(screen.getByTestId('total')).toHaveTextContent('3')

    await user.click(screen.getByRole('button', { name: 'neg-p1' }))
    expect(screen.getByTestId('p1')).toHaveTextContent('0')
    expect(screen.getByTestId('total')).toHaveTextContent('1')
    expect(bundleCartLineId('b1')).toBe('bundle:b1')
  })
})
