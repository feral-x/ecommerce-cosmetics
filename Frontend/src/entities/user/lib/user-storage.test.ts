import { afterEach, describe, expect, it } from 'vitest'
import {
  CARTS_KEY,
  GUEST_CART_ID,
  LEGACY_CART_KEY,
  migrateGuestCartToUser,
  ORDERS_KEY,
  readCartForUser,
  readOrdersForUser,
  SESSION_KEY,
  updateOrderStatusForUser,
  upsertOrderForUser,
  writeCartForUser,
  writeSessionUser,
} from './user-storage'

describe('user-storage carts', () => {
  afterEach(() => {
    window.localStorage.removeItem(CARTS_KEY)
    window.localStorage.removeItem(SESSION_KEY)
    window.localStorage.removeItem(ORDERS_KEY)
    window.localStorage.removeItem(LEGACY_CART_KEY)
  })

  it('migrates guest cart to user on sign-in', () => {
    writeCartForUser(GUEST_CART_ID, { '1': 2 })
    migrateGuestCartToUser('79001112233')
    writeSessionUser({
      phoneKey: '79001112233',
      confirmedAt: new Date().toISOString(),
    })
    expect(readCartForUser('79001112233')).toEqual({ '1': 2 })
    expect(readCartForUser(GUEST_CART_ID)).toEqual({})
  })
})

describe('user-storage orders', () => {
  afterEach(() => {
    window.localStorage.removeItem(ORDERS_KEY)
  })

  it('tracks pending → complete and canceled', () => {
    const phone = '79001112233'
    const now = new Date().toISOString()
    upsertOrderForUser(phone, {
      id: 'HAN-1',
      total: 50,
      email: 'a@b.co',
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    })
    updateOrderStatusForUser(phone, 'HAN-1', 'complete')
    expect(readOrdersForUser(phone)[0]?.status).toBe('complete')

    upsertOrderForUser(phone, {
      id: 'HAN-2',
      total: 80,
      email: 'a@b.co',
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    })
    updateOrderStatusForUser(phone, 'HAN-2', 'canceled')
    expect(readOrdersForUser(phone).find((o) => o.id === 'HAN-2')?.status).toBe(
      'canceled',
    )
  })
})
