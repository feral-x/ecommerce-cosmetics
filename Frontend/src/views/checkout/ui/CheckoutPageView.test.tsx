import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CartProvider } from '@/entities/cart'
import * as fakePayment from '@/entities/order/lib/fake-payment'
import {
  CARTS_KEY,
  GUEST_CART_ID,
  SESSION_KEY,
} from '@/entities/user/lib/user-storage'
import { CheckoutPageView } from './CheckoutPageView'

function seedCartWithUser() {
  window.localStorage.setItem(
    CARTS_KEY,
    JSON.stringify({ '79001112233': { '1': 1 } }),
  )
  window.localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      phoneKey: '79001112233',
      confirmedAt: new Date().toISOString(),
    }),
  )
}

async function signInCheckoutUser(user: ReturnType<typeof userEvent.setup>) {
  await user.type(
    screen.getByPlaceholderText(/\+7 \(900\) 123-45-67/i),
    '89001112233',
  )
  await user.click(
    screen.getByRole('button', { name: /confirm & continue/i }),
  )
}

describe('CheckoutPageView', () => {
  afterEach(() => {
    window.localStorage.removeItem('hanami-cart-v1')
    window.localStorage.removeItem(CARTS_KEY)
    window.localStorage.removeItem(SESSION_KEY)
    vi.restoreAllMocks()
  })

  it('asks for phone before checkout form', async () => {
    window.localStorage.setItem(
      CARTS_KEY,
      JSON.stringify({ [GUEST_CART_ID]: { '1': 1 } }),
    )
    const user = userEvent.setup()

    render(
      <CartProvider>
        <CheckoutPageView />
      </CartProvider>,
    )

    expect(screen.getByText(/confirm your phone/i)).toBeInTheDocument()
    await signInCheckoutUser(user)
    expect(screen.getByRole('heading', { name: 'Checkout' })).toBeInTheDocument()
  })

  it('shows validation when paying without contact info', async () => {
    seedCartWithUser()
    const user = userEvent.setup()

    render(
      <CartProvider>
        <CheckoutPageView />
      </CartProvider>,
    )

    await user.click(screen.getByRole('button', { name: /pay/i }))
    expect(
      screen.getByText(/enter your email and full name/i),
    ).toBeInTheDocument()
  })

  it('enters pending and can cancel payment', async () => {
    seedCartWithUser()
    vi.spyOn(fakePayment, 'scheduleFakePaymentComplete').mockImplementation(
      () => () => undefined,
    )
    const user = userEvent.setup()

    render(
      <CartProvider>
        <CheckoutPageView />
      </CartProvider>,
    )

    await user.type(screen.getByPlaceholderText(/you@example.com/i), 'a@b.co')
    await user.type(screen.getByPlaceholderText(/yuki tanaka/i), 'Test User')
    await user.click(screen.getByRole('button', { name: /pay/i }))

    expect(screen.getByTestId('checkout-pending')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /cancel payment/i }))
    expect(screen.getByText(/payment canceled/i)).toBeInTheDocument()
    expect(screen.getByRole('status', { name: 'Canceled' })).toBeInTheDocument()
  })
})
