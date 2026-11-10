'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useRef } from 'react'
import {
  ProductCard,
  ProductCardLoader,
  catalogBootstrapQueryOptions,
  catalogBootstrapQueryKey,
  type SortOption,
} from '@/entities/product'
import { filterProducts } from '@/entities/product/lib/filter-products'
import {
  catalogViewFromSearchParams,
  searchParamsFromCatalogView,
} from '@/shared/lib/catalog-search-params'
import { useCatalogUrl } from '@/shared/lib/use-catalog-url'
import {
  countActiveFilters,
  type CatalogFiltersState,
} from '@/shared/model/catalog-filters'
import {
  CatalogFilters,
  CatalogFiltersSkeleton,
  CatalogMobileFilters,
} from '@/widgets/catalog-filters'
import { CatalogPageError } from './CatalogPageError'
import { CatalogPageHeader } from './CatalogPageHeader'
import { CatalogMediaNotice } from './CatalogMediaNotice'
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

  const queryClient = useQueryClient()
  const catalogQuery = useQuery(catalogBootstrapQueryOptions)
  const productsRegionRef = useRef<HTMLDivElement>(null)
  const lastPageRef = useRef<number | null>(null)

  useEffect(() => {
    if (process.env.VITEST === 'true') return
    void queryClient.refetchQueries({ queryKey: catalogBootstrapQueryKey })
  }, [queryClient])

  const products = catalogQuery.data?.products ?? []
  const facets = catalogQuery.data
    ? {
        categories: catalogQuery.data.categories,
        brands: catalogQuery.data.brands,
        formats: catalogQuery.data.formats,
      }
    : undefined

  const hasCatalog = catalogQuery.data !== undefined
  const isInitialLoad = catalogQuery.isLoading

  const showFacetsSkeleton = isInitialLoad

  const catalogLoadError =
    catalogQuery.isError && catalogQuery.data === undefined

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

  useEffect(() => {
    if (process.env.VITEST === 'true') return
    if (lastPageRef.current === null) {
      lastPageRef.current = safePage
      return
    }
    if (lastPageRef.current === safePage) return
    lastPageRef.current = safePage

    const region = productsRegionRef.current
    if (!region) return

    const headerOffset =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--site-header-height',
        ),
      ) || 64
    const top =
      region.getBoundingClientRect().top + window.scrollY - headerOffset - 8

    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    region.focus({ preventScroll: true })
  }, [safePage])

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
    const onlyPriceChanged =
      patch.filters !== undefined &&
      patch.sort === undefined &&
      patch.page === undefined &&
      (() => {
        const prev = current.filters
        const f = patch.filters!
        return (
          f.lineQuery === prev.lineQuery &&
          f.selectedCategories === prev.selectedCategories &&
          f.selectedFormats === prev.selectedFormats &&
          f.selectedBrands === prev.selectedBrands &&
          f.selectedAvailability === prev.selectedAvailability &&
          f.selectedSkinTypes === prev.selectedSkinTypes &&
          f.fragranceFreeOnly === prev.fragranceFreeOnly &&
          (f.priceMin !== prev.priceMin || f.priceMax !== prev.priceMax)
        )
      })()
    setCatalogSearch(searchParamsFromCatalogView(next, { spotlight }), {
      replace: onlyPriceChanged,
    })
  }

  const showEmpty =
    !isInitialLoad && !catalogLoadError && hasCatalog && pageItems.length === 0

  const retryCatalog = () => {
    void catalogQuery.refetch()
  }

  const filtersProps =
    facets && !catalogLoadError
      ? {
          categories: facets.categories,
          brands: facets.brands,
          formats: facets.formats,
          filters,
          activeCount: activeFilterCount,
          onChange: (next: CatalogFiltersState) =>
            applyCatalogView({ filters: next }),
          onReset: clearCatalogSearch,
        }
      : null

  return (
    <div className="container mx-auto px-4 py-6 lg:px-6 lg:py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start lg:gap-12">
        <div className="hidden lg:block">
          {catalogLoadError || showFacetsSkeleton || !facets ? (
            <CatalogFiltersSkeleton />
          ) : (
            <CatalogFilters {...filtersProps!} />
          )}
        </div>

        <div className="min-w-0">
          <CatalogPageHeader />
          {filtersProps && !showFacetsSkeleton ? (
            <CatalogMobileFilters {...filtersProps} />
          ) : null}
          <CatalogMediaNotice media={catalogQuery.data?.media} />

          {isInitialLoad ? (
            <CatalogToolbarSkeleton />
          ) : (
            <div className="catalog-page-toolbar">
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

          <div
            ref={productsRegionRef}
            tabIndex={-1}
            className="catalog-products-region outline-none"
            aria-label="Product results"
          >
            {catalogLoadError ? (
              <CatalogPageError
                onRetry={retryCatalog}
                isRetrying={catalogQuery.isFetching}
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
                <p className="text-text-secondary">
                  No products match your filters.
                </p>
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
                {pageItems.map((product, index) => (
                  <li key={product.id}>
                    <ProductCard
                      product={product}
                      imagePriority={index < 4}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {!isInitialLoad && !catalogLoadError && totalPages > 1 && (
            <nav
              className="catalog-pagination mt-10 flex items-center justify-center"
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
