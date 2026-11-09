import { getProductById } from '@/entities/product'
import type { Bundle, BundleItem } from '../model/types'
import { mockBundles } from '../model/mock-bundles'

export type EnrichedBundleItem = BundleItem & {
  imageUrl: string | null
}

export type EnrichedBundle = Omit<Bundle, 'items'> & {
  savePercent: number
  items: EnrichedBundleItem[]
}

function enrichItem(item: BundleItem): EnrichedBundleItem {
  const product = getProductById(item.productId)
  return {
    ...item,
    imageUrl: product?.images[0] ?? null,
  }
}

function enrichBundle(bundle: Bundle): EnrichedBundle {
  const savePercent = Math.max(
    5,
    Math.round(
      ((bundle.compareAtPrice - bundle.price) / bundle.compareAtPrice) * 100,
    ),
  )
  return {
    ...bundle,
    savePercent,
    items: bundle.items.map(enrichItem),
  }
}

export function getAllBundles(): EnrichedBundle[] {
  return mockBundles.map(enrichBundle)
}

export function getBundleById(id: string): EnrichedBundle | undefined {
  const raw = mockBundles.find((b) => b.id === id)
  return raw ? enrichBundle(raw) : undefined
}

export function getAllBundleIds(): string[] {
  return mockBundles.map((b) => b.id)
}
