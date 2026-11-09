import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { CartProvider } from '@/entities/cart'
import { getBundleById } from '../lib/enrich-bundle'
import { BundleAddButton } from './BundleAddButton'

describe('BundleAddButton', () => {
  it('adds bundle as single cart line and shows in-cart state', async () => {
    const user = userEvent.setup()
    const bundle = getBundleById('j-beauty-first-ritual')
    expect(bundle).toBeDefined()

    render(
      <CartProvider>
        <BundleAddButton bundle={bundle!} />
      </CartProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Add bundle' }))
    expect(screen.getByText('In cart')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Remove' }))
    expect(screen.getByRole('button', { name: 'Add bundle' })).toBeInTheDocument()
  })
})
