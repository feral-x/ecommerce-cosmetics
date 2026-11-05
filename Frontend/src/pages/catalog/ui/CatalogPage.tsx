import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { filterProducts } from '@/entities/product/lib/filter-products'
import {
  ProductCard,
  allBrands,
  allScales,
  allSeries,
  mockProducts,
  type SortOption,
} from '@/entities/product'
import {
  filtersFromSearchParams,
  searchParamsFromFilters,
} from '@/shared/lib/catalog-search-params'
import {
  CatalogFilters,
  countActiveFilters,
  defaultCatalogFilters,
  type CatalogFiltersState,
} from '@/widgets/catalog-filters'

const PAGE_SIZE = 9

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState<CatalogFiltersState>(() =>
    filtersFromSearchParams(searchParams.toString()),
  )
  const [sort, setSort] = useState<SortOption>('featured')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setFilters((prev) => ({
      ...filtersFromSearchParams(searchParams.toString()),
      seriesQuery: prev.seriesQuery,
    }))
    setPage(1)
  }, [searchParams])

  const activeFilterCount = countActiveFilters(filters)

  const filtered = useMemo(
    () => filterProducts(mockProducts, filters, sort),
    [filters, sort],
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )

  const pushFilters = (next: CatalogFiltersState) => {
    setFilters(next)
    setPage(1)
    setSearchParams(searchParamsFromFilters(next), { replace: false })
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:px-6 lg:py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start lg:gap-12">
        <CatalogFilters
          series={allSeries}
          brands={allBrands}
          scales={allScales}
          filters={filters}
          activeCount={activeFilterCount}
          onChange={pushFilters}
          onReset={() => {
            setFilters(defaultCatalogFilters)
            setPage(1)
            setSearchParams({}, { replace: false })
          }}
        />

        <div className="min-w-0">
          <header className="mb-8 lg:mb-10">
            <h1 className="font-display text-3xl text-text-primary sm:text-4xl">
              Browse Figures
            </h1>
            <p className="mt-2 max-w-xl text-sm text-text-secondary">
              Premium figures from Japan, Korea, and China — official releases,
              new drops, and pre-orders.
            </p>
          </header>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-text-muted">
              <span className="font-medium text-text-secondary">
                {filtered.length}
              </span>{' '}
              figures
            </p>
            <label className="flex cursor-pointer items-center gap-3 text-sm text-text-secondary">
              Sort
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as SortOption)
                  setPage(1)
                }}
                className="filter-input cursor-pointer py-2"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </label>
          </div>

          {pageItems.length === 0 ? (
            <div className="rounded-xl border border-border-subtle bg-surface px-6 py-16 text-center">
              <p className="text-text-secondary">No figures match your filters.</p>
              <button
                type="button"
                onClick={() => {
                  setFilters(defaultCatalogFilters)
                  setSearchParams({})
                }}
                className="filter-reset-btn mt-4"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <ul className="grid list-none grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {pageItems.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          )}

          {totalPages > 1 && (
            <nav
              className="mt-10 flex items-center justify-center gap-2"
              aria-label="Pagination"
            >
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="pagination-btn"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={`pagination-btn min-w-9 ${
                    n === safePage ? 'pagination-btn--active' : ''
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="pagination-btn"
              >
                Next
              </button>
            </nav>
          )}
        </div>
      </div>
    </div>
  )
}
