import type { Product, ProductAvailability } from '../model/types'

/** Стабильные id витрины (~58 SKU) — Makeup API не отдаёт availability. */
const DEMO_PRE_ORDER_IDS = new Set(['4', '17', '29', '44'])
const DEMO_NEW_RELEASE_IDS = new Set([
  '2',
  '5',
  '8',
  '12',
  '16',
  '22',
  '27',
  '33',
  '41',
  '50',
])

export function demoAvailabilityForCatalogId(id: string): ProductAvailability {
  if (DEMO_PRE_ORDER_IDS.has(id)) return 'pre-order'
  if (DEMO_NEW_RELEASE_IDS.has(id)) return 'new-release'
  return 'in-stock'
}

export function applyDemoAvailability(products: Product[]): Product[] {
  return products.map((product) => ({
    ...product,
    availability: demoAvailabilityForCatalogId(product.id),
  }))
}
