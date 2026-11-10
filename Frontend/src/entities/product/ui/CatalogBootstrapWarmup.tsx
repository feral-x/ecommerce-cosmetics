'use client'

import { useQuery } from '@tanstack/react-query'
import { catalogBootstrapQueryOptions } from '../api/catalog-bootstrap'

/** Один раз на вкладку: sessionStorage → snapshot; бандлы/поиск видят те же фото, что каталог. */
export function CatalogBootstrapWarmup() {
  useQuery(catalogBootstrapQueryOptions)
  return null
}
