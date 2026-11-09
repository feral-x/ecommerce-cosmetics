'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  readCartFromStorage,
  writeCartToStorage,
} from '../lib/cart-storage'
import { bundleCartLineId } from '../lib/bundle-cart-line'
import type { CartState } from '../model/types'

type CartContextValue = {
  lines: CartState
  totalItems: number
  getQuantity: (productId: string) => number
  getBundleQuantity: (bundleId: string) => number
  addProduct: (productId: string, quantity: number) => void
  addBundle: (bundleId: string, quantity?: number) => void
  removeBundle: (bundleId: string) => void
  setProductQuantity: (productId: string, quantity: number) => void
}

const CartContext = createContext<CartContextValue | null>(null)

function normalizeQuantity(quantity: number) {
  return Math.max(0, Math.floor(quantity))
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartState>(() => readCartFromStorage())

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
      totalItems,
      getQuantity,
      getBundleQuantity,
      addProduct,
      addBundle,
      removeBundle,
      setProductQuantity,
    }),
    [
      lines,
      totalItems,
      getQuantity,
      getBundleQuantity,
      addProduct,
      addBundle,
      removeBundle,
      setProductQuantity,
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
