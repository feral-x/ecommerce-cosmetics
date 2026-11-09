import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CatalogPage } from '@/views/catalog'
import { CatalogPageFallback } from '@/views/catalog/ui/CatalogPageFallback'

export const metadata: Metadata = {
  title: 'Shop J-Beauty',
  description:
    'Shop Japanese cosmetics — filter by category, product type, brand, skin type, and price.',
}

export default function CatalogRoutePage() {
  return (
    <Suspense fallback={<CatalogPageFallback />}>
      <CatalogPage />
    </Suspense>
  )
}
