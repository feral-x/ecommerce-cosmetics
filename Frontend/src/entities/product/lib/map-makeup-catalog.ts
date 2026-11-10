import { normalizeMakeupImageUrl } from '@/shared/api/makeup/dedupe-pool'
import type { MakeupProduct } from '@/shared/api/makeup/types'
import type {
  Product,
  ProductCategory,
  ProductFormat,
  SkinType,
} from '../model/types'

const FORMAT_BY_TYPE: Record<string, ProductFormat> = {
  lipstick: 'Lip',
  lip_liner: 'Lip',
  lip_gloss: 'Lip',
  lip_stain: 'Lip',
  foundation: 'Face',
  blush: 'Face',
  bronzer: 'Face',
  concealer: 'Face',
  contour: 'Face',
  highlighter: 'Face',
  face_primer: 'Face',
  setting_spray: 'Face',
  mascara: 'Eye',
  eyeliner: 'Eye',
  eyebrow: 'Eye',
  eyeshadow: 'Eye',
  eye_primer: 'Eye',
  nail_polish: 'Nail',
  nail_treatment: 'Nail',
  shampoo: 'Shampoo',
  conditioner: 'Shampoo',
  hair_spray: 'Hair Oil',
  hair_oil: 'Hair Oil',
  perfume: 'Fragrance',
  fragrance: 'Fragrance',
  moisturizer: 'Moisturizer',
  cleanser: 'Cleanser',
  toner: 'Toner',
  serum: 'Serum',
  mask: 'Mask',
  sunscreen: 'Sunscreen',
}

function shortLabel(text: string, max = 72): string {
  const t = text.trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1).trim()}…`
}

function parsePrice(raw: string | undefined): number {
  const n = Number.parseFloat(raw ?? '')
  return Number.isFinite(n) ? n : 0
}

function mapFormat(productType: string | undefined): ProductFormat {
  const key = productType?.trim().toLowerCase() ?? ''
  return FORMAT_BY_TYPE[key] ?? 'Face'
}

function mapCategory(format: ProductFormat): ProductCategory {
  switch (format) {
    case 'Shampoo':
    case 'Hair Oil':
      return 'Hair Care'
    case 'Fragrance':
      return 'Fragrance'
    case 'Nail':
      return 'Nail'
    case 'Sunscreen':
      return 'Sun Care'
    case 'Lip':
      return 'Lip Care'
    case 'Eye':
      return 'Eye Care'
    default:
      return 'Makeup'
  }
}

function mapSkinTypes(hint: string): SkinType[] {
  const text = hint.toLowerCase()
  const out: SkinType[] = []
  if (text.includes('dry')) out.push('dry')
  if (text.includes('oily')) out.push('oily')
  if (text.includes('sensitive')) out.push('sensitive')
  if (out.length === 0) out.push('normal')
  return out
}

/** S3 featured image живее shopify image_link — один стабильный URL на карточку. */
export function makeupProductImages(item: MakeupProduct): string[] {
  const featured = item.api_featured_image
    ? normalizeMakeupImageUrl(item.api_featured_image)
    : ''
  const link = item.image_link ? normalizeMakeupImageUrl(item.image_link) : ''
  if (featured) return [featured]
  if (link) return [link]
  return []
}

export function mapMakeupProductToCatalog(
  item: MakeupProduct,
  catalogId: string,
): Product | null {
  const images = makeupProductImages(item)
  if (images.length === 0) return null

  const formatKey = mapFormat(item.product_type)
  const brand = item.brand?.trim() || 'Beauty'
  const name = item.name?.trim() || 'Cosmetic item'
  const detailHint = `${item.description ?? ''} ${item.product_type ?? ''}`

  return {
    id: catalogId,
    category: mapCategory(formatKey),
    line: brand,
    name,
    shortDescription: shortLabel(name),
    sizeLabel: 'Standard',
    formatKey,
    brand,
    availability: 'in-stock',
    skinTypes: mapSkinTypes(detailHint),
    fragranceFree: detailHint.includes('vegan'),
    price: parsePrice(item.price),
    description:
      item.description?.trim() ||
      `${name} — ${brand} (${item.product_type ?? 'cosmetics'}).`,
    images,
  }
}

export function mapMakeupPoolToCatalog(
  pool: MakeupProduct[],
  limit = 58,
): Product[] {
  const products: Product[] = []
  for (const item of pool) {
    if (products.length >= limit) break
    const mapped = mapMakeupProductToCatalog(item, String(products.length + 1))
    if (mapped) products.push(mapped)
  }
  return products
}

export function catalogFacetsFromProducts(products: Product[]) {
  return {
    categories: [...new Set(products.map((p) => p.category))].sort(),
    brands: [...new Set(products.map((p) => p.brand))].sort(),
    formats: [...new Set(products.map((p) => p.formatKey))].sort(),
  }
}
