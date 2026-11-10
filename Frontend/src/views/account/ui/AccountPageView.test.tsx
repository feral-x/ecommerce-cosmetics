import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { CartProvider } from '@/entities/cart'
import { CARTS_KEY, SESSION_KEY } from '@/entities/user/lib/user-storage'
import { AccountPageView } from './AccountPageView'

describe('AccountPageView', () => {
  afterEach(() => {
    window.localStorage.removeItem(CARTS_KEY)
    window.localStorage.removeItem(SESSION_KEY)
  })

  it('shows phone sign-in when session is missing', async () => {
    render(
      <CartProvider>
        <AccountPageView />
      </CartProvider>,
    )

    await waitFor(() => {
      expect(screen.getByText(/sign in with your phone/i)).toBeInTheDocument()
    })
  })

  it('shows profile after sign-in', async () => {
    const user = userEvent.setup()
    render(
      <CartProvider>
        <AccountPageView />
      </CartProvider>,
    )

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/\+7 \(900\) 123-45-67/i)).toBeInTheDocument()
    })

    await user.type(
      screen.getByPlaceholderText(/\+7 \(900\) 123-45-67/i),
      '79001112233',
    )
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(
      screen.getByRole('heading', { name: '+7 (900) 111-22-33' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Orders')).toBeInTheDocument()
  })
})
