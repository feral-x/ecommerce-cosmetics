'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ProductSearchPanel } from '@/widgets/product-search/ui/ProductSearchPanel'
import { ChevronLeftIcon } from '@/shared/ui/Icons'

export function SearchPageView() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') router.back()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [router])

  return (
    <div className="search-page">
      <div className="search-page__top">
        <button
          type="button"
          className="search-page__back"
          onClick={() => router.back()}
        >
          <ChevronLeftIcon size="sm" />
          <span>Back</span>
        </button>
      </div>

      <div className="search-page__body">
        <h1 className="search-page__title font-display">Search</h1>
        <ProductSearchPanel
          variant="page"
          query={query}
          onQueryChange={setQuery}
          autoFocus
        />
        {query.trim().length < 2 ? (
          <p className="search-page__hint">
            Type at least 2 characters to search by product or brand.
          </p>
        ) : null}
      </div>
    </div>
  )
}
