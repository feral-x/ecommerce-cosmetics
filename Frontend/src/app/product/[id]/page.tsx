import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllProductIds, getProductById } from '@/entities/product'
import { ProductPageView } from '@/views/product'

type ProductPageProps = {
  params: Promise<{ id: string }>
}

export function generateStaticParams() {
  return getAllProductIds().map((id) => ({ id }))
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = getProductById(id)
  if (!product) return { title: 'Product' }
  return {
    title: product.name,
    description: product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = getProductById(id)
  if (!product) notFound()
  return <ProductPageView product={product} />
}
