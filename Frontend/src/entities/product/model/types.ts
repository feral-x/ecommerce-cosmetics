export type ProductAvailability = 'in-stock' | 'pre-order' | 'new-release'

export type ProductCategory =
  | 'Skincare'
  | 'Makeup'
  | 'Hair Care'
  | 'Body Care'
  | 'Sun Care'
  | 'Fragrance'
  | 'Lip Care'
  | 'Eye Care'
  | "Men's Care"
  | 'Kits & Sets'
  | 'Bath & Wellness'
  | 'Nail'
  | 'Tools'

export type ProductFormat =
  | 'Cleanser'
  | 'Toner'
  | 'Essence'
  | 'Serum'
  | 'Moisturizer'
  | 'Mask'
  | 'Sunscreen'
  | 'Lip'
  | 'Eye'
  | 'Face'
  | 'Shampoo'
  | 'Hair Oil'
  | 'Body'
  | 'Nail'
  | 'Kit'
  | 'Fragrance'
  | 'Tool'

export type SkinType = 'dry' | 'oily' | 'combination' | 'sensitive' | 'normal'

export type Product = {
  id: string
  category: ProductCategory
  line: string
  name: string
  /** Короткое имя для карточки каталога (обрезка на бэке). */
  shortDescription: string
  /** Объём / формат для карточки, напр. «160 ml» */
  sizeLabel: string
  formatKey: ProductFormat
  brand: string
  availability: ProductAvailability
  skinTypes: SkinType[]
  fragranceFree: boolean
  /** Для бейджа «N in stock» в каталоге */
  stockCount?: number
  price: number
  description: string
  images: string[]
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name'
