'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
  ProductCard,
  ProductCardLoader,
  catalogFacetsQueryOptions,
  catalogProductsQueryOptions,
  type SortOption,
} from '@/entities/product'
import { filterProducts } from '@/entities/product/lib/filter-products'
import {
  catalogBootstrapSearchKey,
  catalogViewFromSearchParams,
  searchParamsFromCatalogView,
} from '@/shared/lib/catalog-search-params'
import { useCatalogUrl } from '@/shared/lib/use-catalog-url'
import {
  countActiveFilters,
  type CatalogFiltersState,
} from '@/shared/model/catalog-filters'
import { CatalogFilters, CatalogFiltersSkeleton } from '@/widgets/catalog-filters'
import { CatalogPageError } from './CatalogPageError'
import { CatalogPageHeader } from './CatalogPageHeader'
import { CatalogToolbarSkeleton } from './CatalogToolbarSkeleton'
import {
  CATALOG_PAGE_SIZE,
  CATALOG_PRODUCT_GRID,
} from '../model/catalog-layout'

const PAGE_SIZE = CATALOG_PAGE_SIZE

export function CatalogPage() {
  const { catalogSearch, searchParams, setCatalogSearch, clearCatalogSearch } =
    useCatalogUrl()

  const { filters, sort, page, nameQuery } = useMemo(
    () => catalogViewFromSearchParams(catalogSearch),
    [catalogSearch],
  )

  const facetsKey = useMemo(
    () => catalogBootstrapSearchKey(catalogSearch),
    [catalogSearch],
  )

  const productsQuery = useQuery(catalogProductsQueryOptions())
  const facetsQuery = useQuery(catalogFacetsQueryOptions(facetsKey))

  const products = productsQuery.data ?? []
  const facets = facetsQuery.data

  const hasProducts = productsQuery.data !== undefined
  const isInitialLoad =
    !hasProducts && (productsQuery.isPending || productsQuery.isFetching)

  const showFacetsSkeleton =
    isInitialLoad ||
    (facetsQuery.isFetching && hasProducts && !isInitialLoad)

  const catalogLoadError =
    productsQuery.isError && productsQuery.data === undefined

  const activeFilterCount = countActiveFilters(filters)

  const filtered = useMemo(
    () => filterProducts(products, filters, sort, nameQuery),
    [products, filters, sort, nameQuery],
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )

  const applyCatalogView = (
    patch: Partial<{
      filters: CatalogFiltersState
      sort: SortOption
      page: number
    }>,
  ) => {
    const current = catalogViewFromSearchParams(catalogSearch)
    const next = {
      filters: patch.filters ?? current.filters,
      sort: patch.sort ?? current.sort,
      page: patch.page ?? current.page,
      nameQuery: current.nameQuery,
    }
    if (patch.filters !== undefined && patch.page === undefined) {
      next.page = 1
    }
    const spotlight = searchParams.get('spotlight')
    setCatalogSearch(searchParamsFromCatalogView(next, { spotlight }))
  }

  const showEmpty =
    !isInitialLoad && !catalogLoadError && hasProducts && pageItems.length === 0

  const retryCatalog = () => {
    void productsQuery.refetch()
    void facetsQuery.refetch()
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:px-6 lg:py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start lg:gap-12">
        {catalogLoadError || showFacetsSkeleton || !facets ? (
          <CatalogFiltersSkeleton />
        ) : (
          <CatalogFilters
            categories={facets.categories}
            brands={facets.brands}
            formats={facets.formats}
            filters={filters}
            activeCount={activeFilterCount}
            onChange={(next) => applyCatalogView({ filters: next })}
            onReset={clearCatalogSearch}
          />
        )}

        <div className="min-w-0">
          <CatalogPageHeader />

          {isInitialLoad ? (
            <CatalogToolbarSkeleton />
          ) : (
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p
                className="text-sm text-text-muted"
                aria-live="polite"
                aria-atomic="true"
              >
                <span className="font-medium text-text-secondary">
                  {filtered.length}
                </span>{' '}
                products
              </p>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-text-secondary">
                Sort
                <select
                  value={sort}
                  onChange={(e) =>
                    applyCatalogView({
                      sort: e.target.value as SortOption,
                      page: 1,
                    })
                  }
                  className="filter-input cursor-pointer py-2"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
              </label>
            </div>
          )}

          {catalogLoadError ? (
            <CatalogPageError
              onRetry={retryCatalog}
              isRetrying={productsQuery.isFetching}
            />
          ) : isInitialLoad ? (
            <ul
              className={CATALOG_PRODUCT_GRID}
              aria-busy="true"
              aria-label="Loading products"
            >
              {Array.from({ length: PAGE_SIZE }, (_, i) => (
                <li key={i}>
                  <ProductCardLoader />
                </li>
              ))}
            </ul>
          ) : showEmpty ? (
            <div className="rounded-xl border border-border-subtle bg-surface px-6 py-16 text-center">
              <p className="text-text-secondary">No products match your filters.</p>
              <button
                type="button"
                onClick={clearCatalogSearch}
                className="filter-reset-btn mt-4"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <ul className={CATALOG_PRODUCT_GRID}>
              {pageItems.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          )}

          {!isInitialLoad && !catalogLoadError && totalPages > 1 && (
            <nav
              className="mt-10 flex items-center justify-center gap-2"
              aria-label="Pagination"
            >
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => applyCatalogView({ page: safePage - 1 })}
                className="pagination-btn"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => applyCatalogView({ page: n })}
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
                onClick={() => applyCatalogView({ page: safePage + 1 })}
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
