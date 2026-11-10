'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { catalogBootstrapQueryOptions, type Product } from '@/entities/product'
import { ProductPageView } from './ProductPageView'
import { Spinner } from '@/shared/ui/Spinner'

type ProductPageClientProps = {
  product: Product
}

export function ProductPageClient({ product }: ProductPageClientProps) {
  const { data: bootstrap, isLoading } = useQuery(catalogBootstrapQueryOptions)

  const resolved = useMemo(
    () => bootstrap?.products.find((p) => p.id === product.id) ?? product,
    [bootstrap?.products, product],
  )

  if (
    isLoading &&
    !bootstrap &&
    !product.images.some((src) => src.startsWith('http'))
  ) {
    return (
      <div className="container mx-auto flex justify-center py-24">
        <Spinner />
      </div>
    )
  }

  return <ProductPageView product={resolved} />
}
