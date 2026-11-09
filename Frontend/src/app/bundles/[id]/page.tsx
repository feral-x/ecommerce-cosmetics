import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllBundleIds, getBundleById } from '@/entities/bundle'
import { BundleDetailPageView } from '@/views/bundles/ui/BundleDetailPageView'

type BundleRouteProps = {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return getAllBundleIds().map((id) => ({ id }))
}

export async function generateMetadata({
  params,
}: BundleRouteProps): Promise<Metadata> {
  const { id } = await params
  const bundle = getBundleById(id)
  if (!bundle) return { title: 'Bundle not found' }
  return {
    title: `${bundle.title} · Bundles · Hanami`,
    description: bundle.summary,
  }
}

export default async function BundleDetailPage({ params }: BundleRouteProps) {
  const { id } = await params
  const bundle = getBundleById(id)
  if (!bundle) notFound()

  return <BundleDetailPageView bundle={bundle} />
}
