import type { CatalogFiltersState } from '@/widgets/catalog-filters'
import type { Product, SortOption } from '../model/types'

export function filterProducts(
  products: Product[],
  filters: CatalogFiltersState,
  sort: SortOption,
): Product[] {
  let list = products.filter((p) => {
    if (
      filters.selectedSeries.length > 0 &&
      !filters.selectedSeries.includes(p.series)
    ) {
      return false
    }
    if (
      filters.selectedAvailability.length > 0 &&
      !filters.selectedAvailability.includes(p.availability)
    ) {
      return false
    }
    if (
      filters.selectedScales.length > 0 &&
      !filters.selectedScales.includes(p.scaleKey)
    ) {
      return false
    }
    if (
      filters.selectedBrands.length > 0 &&
      !filters.selectedBrands.includes(p.brand)
    ) {
      return false
    }
    if (filters.matureFilter === 'exclude' && p.mature) return false
    if (filters.matureFilter === 'only' && !p.mature) return false
    if (p.price < filters.priceMin || p.price > filters.priceMax) return false
    return true
  })

  switch (sort) {
    case 'price-asc':
      list = [...list].sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      list = [...list].sort((a, b) => b.price - a.price)
      break
    case 'name':
      list = [...list].sort((a, b) => a.name.localeCompare(b.name))
      break
    default:
      break
  }

  return list
}
