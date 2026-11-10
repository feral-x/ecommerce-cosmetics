import type { CartState } from '@/entities/cart/model/types'
import type { OrderStatus, StoredOrder } from '../model/order-types'

export const SESSION_KEY = 'hanami-session-v1'
export const CARTS_KEY = 'hanami-carts-v1'
export const ORDERS_KEY = 'hanami-orders-v1'
/** @deprecated legacy single cart */
export const LEGACY_CART_KEY = 'hanami-cart-v1'

export const GUEST_CART_ID = '__guest__'

export type SessionUser = {
  phoneKey: string
  confirmedAt: string
}

export type { OrderStatus, StoredOrder }

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function readSessionUser(): SessionUser | null {
  const data = readJson<SessionUser | null>(SESSION_KEY, null)
  if (!data?.phoneKey) return null
  return data
}

export function writeSessionUser(user: SessionUser | null) {
  if (typeof window === 'undefined') return
  if (!user) {
    window.localStorage.removeItem(SESSION_KEY)
    return
  }
  writeJson(SESSION_KEY, user)
}

type CartsByUser = Record<string, CartState>

function sanitizeCartState(raw: unknown): CartState {
  if (typeof raw !== 'object' || raw == null) return {}
  return Object.fromEntries(
    Object.entries(raw as Record<string, unknown>).filter(
      ([, value]) => typeof value === 'number' && value > 0,
    ),
  ) as CartState
}

export function readAllCarts(): CartsByUser {
  return readJson<CartsByUser>(CARTS_KEY, {})
}

export function readCartForUser(userId: string): CartState {
  const carts = readAllCarts()
  if (carts[userId]) return sanitizeCartState(carts[userId])

  if (userId === GUEST_CART_ID) {
    const legacy = readLegacyCart()
    if (Object.keys(legacy).length > 0) return legacy
  }

  return {}
}

function readLegacyCart(): CartState {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(LEGACY_CART_KEY)
    if (!raw) return {}
    return sanitizeCartState(JSON.parse(raw))
  } catch {
    return {}
  }
}

export function writeCartForUser(userId: string, state: CartState) {
  const carts = readAllCarts()
  if (Object.keys(state).length === 0) {
    delete carts[userId]
  } else {
    carts[userId] = state
  }
  writeJson(CARTS_KEY, carts)
  if (userId !== GUEST_CART_ID) {
    window.localStorage.removeItem(LEGACY_CART_KEY)
  }
}

export function mergeCarts(into: CartState, from: CartState): CartState {
  const next = { ...into }
  for (const [lineId, qty] of Object.entries(from)) {
    next[lineId] = (next[lineId] ?? 0) + qty
  }
  return next
}

export function migrateGuestCartToUser(phoneKey: string) {
  const guest = readCartForUser(GUEST_CART_ID)
  const existing = readCartForUser(phoneKey)
  const merged = mergeCarts(existing, guest)
  writeCartForUser(phoneKey, merged)
  writeCartForUser(GUEST_CART_ID, {})
}

function normalizeOrder(raw: Record<string, unknown>): StoredOrder | null {
  const id = raw.id
  const total = raw.total
  const email = raw.email
  const createdAt = raw.createdAt
  if (
    typeof id !== 'string' ||
    typeof total !== 'number' ||
    typeof email !== 'string' ||
    typeof createdAt !== 'string'
  ) {
    return null
  }
  const status = raw.status
  const normalizedStatus: OrderStatus =
    status === 'pending' || status === 'canceled' || status === 'complete'
      ? status
      : 'complete'
  const updatedAt =
    typeof raw.updatedAt === 'string' ? raw.updatedAt : createdAt
  return {
    id,
    total,
    email,
    fullName: typeof raw.fullName === 'string' ? raw.fullName : undefined,
    status: normalizedStatus,
    createdAt,
    updatedAt,
  }
}

export function readOrdersForUser(phoneKey: string): StoredOrder[] {
  const all = readJson<Record<string, unknown[]>>(ORDERS_KEY, {})
  const list = all[phoneKey] ?? []
  return list
    .map((item) =>
      typeof item === 'object' && item != null
        ? normalizeOrder(item as Record<string, unknown>)
        : null,
    )
    .filter((o): o is StoredOrder => o != null)
}

function writeOrdersForUser(phoneKey: string, orders: StoredOrder[]) {
  const all = readJson<Record<string, StoredOrder[]>>(ORDERS_KEY, {})
  all[phoneKey] = orders
  writeJson(ORDERS_KEY, all)
}

export function upsertOrderForUser(phoneKey: string, order: StoredOrder) {
  const list = readOrdersForUser(phoneKey)
  const idx = list.findIndex((o) => o.id === order.id)
  if (idx >= 0) {
    list[idx] = order
  } else {
    list.unshift(order)
  }
  writeOrdersForUser(phoneKey, list)
}

export function updateOrderStatusForUser(
  phoneKey: string,
  orderId: string,
  status: OrderStatus,
) {
  const list = readOrdersForUser(phoneKey)
  const order = list.find((o) => o.id === orderId)
  if (!order) return
  upsertOrderForUser(phoneKey, {
    ...order,
    status,
    updatedAt: new Date().toISOString(),
  })
}

/** @deprecated use upsertOrderForUser */
export function appendOrderForUser(
  phoneKey: string,
  order: Omit<StoredOrder, 'status' | 'updatedAt'> & { status?: OrderStatus },
) {
  const now = new Date().toISOString()
  upsertOrderForUser(phoneKey, {
    ...order,
    status: order.status ?? 'complete',
    updatedAt: now,
  })
}
