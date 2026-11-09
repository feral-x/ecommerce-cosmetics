import type { Metadata } from 'next'
import { BundlesPageView } from '@/views/bundles'

export const metadata: Metadata = {
  title: 'Bundles · Hanami',
  description:
    'Curated J-Beauty sets and kits at bundle pricing — no filters, just ready-made rituals.',
}

export default function BundlesPage() {
  return <BundlesPageView />
}
