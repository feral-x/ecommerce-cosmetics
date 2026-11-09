export type BundleItem = {
  productId: string
  /** Имя позиции в контексте набора */
  label: string
  description: string
}

export type Bundle = {
  id: string
  title: string
  brandLabel: string
  /** Короткий тизер на карточке в списке */
  summary: string
  /** Полное описание набора */
  description: string
  price: number
  compareAtPrice: number
  items: BundleItem[]
  /** ID товаров, которые кладём в корзину при покупке набора */
  cartProductIds: string[]
  stockLimit?: number
}
