import type { Metadata } from 'next'
import { SearchPageView } from '@/views/search'

export const metadata: Metadata = {
  title: 'Search · Hanami',
  description: 'Search J-Beauty skincare, makeup, and sun care.',
}

export default function SearchPage() {
  return <SearchPageView />
}
