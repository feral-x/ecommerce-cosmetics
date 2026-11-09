import type { CartState } from '../model/types'

const STORAGE_KEY = 'hanami-cart-v1'

export function readCartFromStorage(): CartState {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed == null) return {}
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).filter(
        ([, value]) => typeof value === 'number' && value > 0,
      ),
    ) as CartState
  } catch {
    return {}
  }
}

export function writeCartToStorage(state: CartState) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
