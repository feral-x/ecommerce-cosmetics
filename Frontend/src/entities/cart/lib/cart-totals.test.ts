import { describe, expect, it } from 'vitest'
import {
  cartGrandTotal,
  cartShipping,
  cartSubtotal,
  amountUntilFreeShipping,
} from './cart-totals'

describe('cart totals', () => {
  it('computes subtotal and free shipping threshold', () => {
    const rows = [{ unitPrice: 40, quantity: 2 }]
    const subtotal = cartSubtotal(rows)
    expect(subtotal).toBe(80)
    expect(cartShipping(subtotal)).toBe(0)
    expect(amountUntilFreeShipping(50)).toBe(25)
    expect(cartGrandTotal(50, cartShipping(50))).toBe(55.99)
  })
})
