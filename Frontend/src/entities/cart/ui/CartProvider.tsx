'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  readCartFromStorage,
  writeCartToStorage,
} from '../lib/cart-storage'
import {
  GUEST_CART_ID,
  migrateGuestCartToUser,
  readCartForUser,
  readSessionUser,
  writeSessionUser,
} from '@/entities/user/lib/user-storage'
import { bundleCartLineId } from '../lib/bundle-cart-line'
import type { CartState } from '../model/types'

type CartContextValue = {
  lines: CartState
  userPhoneKey: string | null
  isUserIdentified: boolean
  confirmUserPhone: (phoneKey: string) => void
  totalItems: number
  getQuantity: (productId: string) => number
  getBundleQuantity: (bundleId: string) => number
  addProduct: (productId: string, quantity: number) => void
  addBundle: (bundleId: string, quantity?: number) => void
  removeBundle: (bundleId: string) => void
  setProductQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  signOutUser: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function normalizeQuantity(quantity: number) {
  return Math.max(0, Math.floor(quantity))
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [userPhoneKey, setUserPhoneKey] = useState<string | null>(null)
  const [lines, setLines] = useState<CartState>({})

  useEffect(() => {
    setUserPhoneKey(readSessionUser()?.phoneKey ?? null)
    setLines(readCartFromStorage())
  }, [])

  const confirmUserPhone = useCallback((phoneKey: string) => {
    migrateGuestCartToUser(phoneKey)
    writeSessionUser({
      phoneKey,
      confirmedAt: new Date().toISOString(),
    })
    setUserPhoneKey(phoneKey)
    setLines(readCartForUser(phoneKey))
  }, [])

  const addProduct = useCallback(
    (productId: string, quantity: number) => {
      const q = normalizeQuantity(quantity)
      if (q < 1) return
      setLines((prev) => {
        const next = { ...prev, [productId]: (prev[productId] ?? 0) + q }
        writeCartToStorage(next)
        return next
      })
    },
    [],
  )

  const setProductQuantity = useCallback(
    (productId: string, quantity: number) => {
      const q = normalizeQuantity(quantity)
      setLines((prev) => {
        const next = { ...prev }
        if (q < 1) {
          delete next[productId]
        } else {
          next[productId] = q
        }
        writeCartToStorage(next)
        return next
      })
    },
    [],
  )

  const clearCart = useCallback(() => {
    setLines(() => {
      writeCartToStorage({})
      return {}
    })
  }, [])

  const signOutUser = useCallback(() => {
    writeSessionUser(null)
    setUserPhoneKey(null)
    setLines(readCartForUser(GUEST_CART_ID))
  }, [])

  const getQuantity = useCallback(
    (productId: string) => lines[productId] ?? 0,
    [lines],
  )

  const getBundleQuantity = useCallback(
    (bundleId: string) => lines[bundleCartLineId(bundleId)] ?? 0,
    [lines],
  )

  const addBundle = useCallback(
    (bundleId: string, quantity = 1) => {
      addProduct(bundleCartLineId(bundleId), quantity)
    },
    [addProduct],
  )

  const removeBundle = useCallback(
    (bundleId: string) => {
      setProductQuantity(bundleCartLineId(bundleId), 0)
    },
    [setProductQuantity],
  )

  const totalItems = useMemo(
    () => Object.values(lines).reduce((sum, qty) => sum + qty, 0),
    [lines],
  )

  const value = useMemo(
    () => ({
      lines,
      userPhoneKey,
      isUserIdentified: userPhoneKey != null,
      confirmUserPhone,
      totalItems,
      getQuantity,
      getBundleQuantity,
      addProduct,
      addBundle,
      removeBundle,
      setProductQuantity,
      clearCart,
      signOutUser,
    }),
    [
      lines,
      userPhoneKey,
      confirmUserPhone,
      totalItems,
      signOutUser,
      getQuantity,
      getBundleQuantity,
      addProduct,
      addBundle,
      removeBundle,
      setProductQuantity,
      clearCart,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider')
  }
  return ctx
}
