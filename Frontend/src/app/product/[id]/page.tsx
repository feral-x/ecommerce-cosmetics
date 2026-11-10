import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getServerProductById,
  getServerProductIds,
} from '@/entities/product/lib/server-catalog'
import { ProductPageClient } from '@/views/product/ui/ProductPageClient'

type ProductPageProps = {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  try {
    const ids = await getServerProductIds()
    return ids.map((id) => ({ id }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getServerProductById(id)
  if (!product) return { title: 'Product' }
  return {
    title: product.name,
    description: product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getServerProductById(id)
  if (!product) notFound()
  return <ProductPageClient product={product} />
}
