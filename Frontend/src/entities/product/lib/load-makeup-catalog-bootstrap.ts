import type { CatalogMediaMeta } from '@/shared/api/catalog-media'
import { getMakeupProductPool } from '@/shared/api/makeup/makeup-pool'
import type { CatalogBootstrap } from '../api/catalog-bootstrap'
import {
  catalogFacetsFromProducts,
  mapMakeupPoolToCatalog,
} from './map-makeup-catalog'
import { CATALOG_MIN_PRODUCTS, CATALOG_POOL_SIZE } from './catalog-pool-size'

export async function loadMakeupCatalogBootstrap(): Promise<CatalogBootstrap> {
  const { products: pool, cachedUntil } = await getMakeupProductPool(
    CATALOG_POOL_SIZE,
  )
  const products = mapMakeupPoolToCatalog(pool, CATALOG_POOL_SIZE)
  if (products.length < CATALOG_MIN_PRODUCTS) {
    throw new Error(
      `Makeup catalog too small (${products.length} < ${CATALOG_MIN_PRODUCTS})`,
    )
  }

  const facets = catalogFacetsFromProducts(products)
  const media: CatalogMediaMeta = {
    source: 'makeup-api',
    cachedUntil: cachedUntil.toISOString(),
    poolSize: pool.length,
  }

  return {
    ...facets,
    products,
    media,
  }
}
