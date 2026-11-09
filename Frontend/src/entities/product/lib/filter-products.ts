import type { CatalogFiltersState } from '@/shared/model/catalog-filters'
import type { Product, SortOption } from '../model/types'

export function filterProducts(
  products: Product[],
  filters: CatalogFiltersState,
  sort: SortOption,
  nameQuery = '',
): Product[] {
  const nameQ = nameQuery.trim().toLowerCase()

  let list = products.filter((p) => {
    if (nameQ && !p.name.toLowerCase().includes(nameQ)) {
      return false
    }
    if (
      filters.lineQuery.trim() &&
      !p.line.toLowerCase().includes(filters.lineQuery.trim().toLowerCase()) &&
      !p.name.toLowerCase().includes(filters.lineQuery.trim().toLowerCase())
    ) {
      return false
    }
    if (
      filters.selectedCategories.length > 0 &&
      !filters.selectedCategories.includes(p.category)
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
      filters.selectedFormats.length > 0 &&
      !filters.selectedFormats.includes(p.formatKey)
    ) {
      return false
    }
    if (
      filters.selectedBrands.length > 0 &&
      !filters.selectedBrands.includes(p.brand)
    ) {
      return false
    }
    if (filters.fragranceFreeOnly && !p.fragranceFree) return false
    if (filters.selectedSkinTypes.length > 0) {
      const matchesSkin = filters.selectedSkinTypes.some((s) =>
        p.skinTypes.includes(s),
      )
      if (!matchesSkin) return false
    }
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
