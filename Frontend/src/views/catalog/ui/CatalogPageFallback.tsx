import { ProductCardLoader } from '@/entities/product'
import { CatalogFiltersSkeleton } from '@/widgets/catalog-filters'
import { CatalogPageHeader } from './CatalogPageHeader'
import { CatalogToolbarSkeleton } from './CatalogToolbarSkeleton'
import {
  CATALOG_PAGE_SIZE,
  CATALOG_PRODUCT_GRID,
} from '../model/catalog-layout'

const PAGE_SIZE = CATALOG_PAGE_SIZE

/** Suspense fallback — тот же каркас, что и при загрузке данных в CatalogPage. */
export function CatalogPageFallback() {
  return (
    <div className="container mx-auto px-4 py-8 lg:px-6 lg:py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start lg:gap-12">
        <CatalogFiltersSkeleton />
        <div className="min-w-0">
          <CatalogPageHeader />
          <CatalogToolbarSkeleton />
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
        </div>
      </div>
    </div>
  )
}
