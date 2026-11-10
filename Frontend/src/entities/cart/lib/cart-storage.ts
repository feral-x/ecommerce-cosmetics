import {
  GUEST_CART_ID,
  readSessionUser,
} from '@/entities/user/lib/user-storage'
import type { CartState } from '../model/types'
import {
  readCartForUser,
  writeCartForUser,
} from '@/entities/user/lib/user-storage'

function activeCartUserId() {
  if (typeof window === 'undefined') return GUEST_CART_ID
  return readSessionUser()?.phoneKey ?? GUEST_CART_ID
}

export function readCartFromStorage(): CartState {
  return readCartForUser(activeCartUserId())
}

export function writeCartToStorage(state: CartState) {
  writeCartForUser(activeCartUserId(), state)
}
