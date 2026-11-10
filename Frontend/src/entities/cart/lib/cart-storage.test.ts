import { afterEach, describe, expect, it } from 'vitest'
import {
  CARTS_KEY,
  GUEST_CART_ID,
  SESSION_KEY,
  writeCartForUser,
  writeSessionUser,
} from '@/entities/user/lib/user-storage'
import { readCartFromStorage, writeCartToStorage } from './cart-storage'

describe('cart-storage', () => {
  afterEach(() => {
    window.localStorage.removeItem(CARTS_KEY)
    window.localStorage.removeItem(SESSION_KEY)
    window.localStorage.removeItem('hanami-cart-v1')
  })

  it('reads guest cart when no session', () => {
    writeCartForUser(GUEST_CART_ID, { a: 2 })
    expect(readCartFromStorage()).toEqual({ a: 2 })
  })

  it('reads signed-in user cart', () => {
    writeSessionUser({
      phoneKey: '79001112233',
      confirmedAt: new Date().toISOString(),
    })
    writeCartForUser('79001112233', { p1: 1 })
    expect(readCartFromStorage()).toEqual({ p1: 1 })
  })

  it('writes to active user', () => {
    writeCartToStorage({ p1: 3, 'bundle:b1': 1 })
    expect(readCartFromStorage()).toEqual({ p1: 3, 'bundle:b1': 1 })
  })
})
