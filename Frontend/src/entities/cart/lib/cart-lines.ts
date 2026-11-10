import { getBundleById } from '@/entities/bundle'
import { getProductById } from '@/entities/product'
import {
  isBundleCartLine,
  parseBundleIdFromCartLine,
} from './bundle-cart-line'
import type { CartState } from '../model/types'

export type CartLineRow = {
  kind: 'product' | 'bundle'
  lineId: string
  id: string
  title: string
  meta: string
  href: string
  imageUrl: string | null
  unitPrice: number
  quantity: number
}

export function buildCartRows(lines: CartState): CartLineRow[] {
  const rows: CartLineRow[] = []

  for (const [lineId, quantity] of Object.entries(lines)) {
    if (isBundleCartLine(lineId)) {
      const bundleId = parseBundleIdFromCartLine(lineId)
      if (!bundleId) continue
      const bundle = getBundleById(bundleId)
      if (!bundle) continue
      rows.push({
        kind: 'bundle',
        lineId,
        id: bundleId,
        title: bundle.title,
        meta: `${bundle.brandLabel} · Bundle`,
        href: `/bundles/${bundleId}`,
        imageUrl: bundle.items[0]?.imageUrl ?? null,
        unitPrice: bundle.price,
        quantity,
      })
      continue
    }

      const product = getProductById(lineId)
    if (!product) continue
    rows.push({
      kind: 'product',
      lineId,
      id: product.id,
      title: product.name,
      meta: `${product.brand} · ${product.sizeLabel}`,
      href: `/product/${product.id}`,
      imageUrl: product.images[0] ?? null,
      unitPrice: product.price,
      quantity,
    })
  }

  return rows
}

export function cartLineReactKey(row: CartLineRow) {
  return row.kind === 'bundle' ? `bundle-${row.id}` : `product-${row.id}`
}
