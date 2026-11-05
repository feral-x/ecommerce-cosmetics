export type ProductAvailability = 'in-stock' | 'pre-order' | 'new-release'

export type Product = {
  id: string
  series: string
  name: string
  scale: string
  scaleKey: '1/7' | '1/8' | '1/4'
  brand: string
  availability: ProductAvailability
  /** Контент 18+ (откровенная/sculpt) */
  mature: boolean
  price: number
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name'
