'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  useEffect,
  useId,
  useRef,
  type KeyboardEvent,
} from 'react'
import {
  PRODUCT_SEARCH_MIN_LENGTH,
  productSearchQueryOptions,
} from '@/entities/product/api/search-products'
import { useDebouncedValue } from '@/shared/lib/use-debounced-value'
import { SearchIcon } from '@/shared/ui/Icons'

const DEBOUNCE_MS = 350

type ProductSearchPanelProps = {
  query: string
  onQueryChange: (value: string) => void
  autoFocus?: boolean
  variant?: 'header' | 'page'
  onPickResult?: () => void
  showClose?: boolean
  onClose?: () => void
}

export function ProductSearchPanel({
  query,
  onQueryChange,
  autoFocus = false,
  variant = 'header',
  onPickResult,
  showClose = false,
  onClose,
}: ProductSearchPanelProps) {
  const router = useRouter()
  const listboxId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS)
  const trimmedDebounced = debouncedQuery.trim()
  const searchQuery = useQuery(productSearchQueryOptions(debouncedQuery))

  const showResults =
    trimmedDebounced.length >= PRODUCT_SEARCH_MIN_LENGTH &&
    (searchQuery.isFetching || searchQuery.data != null || searchQuery.isError)

  useEffect(() => {
    if (!autoFocus) return
    const id = window.requestAnimationFrame(() => inputRef.current?.focus())
    return () => window.cancelAnimationFrame(id)
  }, [autoFocus])

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && trimmedDebounced.length >= PRODUCT_SEARCH_MIN_LENGTH) {
      event.preventDefault()
      router.push(`/catalog?q=${encodeURIComponent(trimmedDebounced)}`)
      onPickResult?.()
    }
  }

  const goToCatalogMatch = (name: string) => {
    onPickResult?.()
    router.push(`/catalog?q=${encodeURIComponent(name)}`, { scroll: false })
  }

  const fieldClass =
    variant === 'page' ? 'search-page__field' : 'header-search-field'
  const inputClass =
    variant === 'page' ? 'search-page__input' : 'header-search-input'
  const resultsClass =
    variant === 'page'
      ? 'search-page__results'
      : 'header-search-results'

  return (
    <div className={variant === 'page' ? 'search-page__panel' : 'header-search-open'}>
      <div className={fieldClass}>
        <SearchIcon size="sm" className="header-search-field__icon" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={onInputKeyDown}
          placeholder="Search products…"
          className={inputClass}
          role="combobox"
          aria-expanded={showResults}
          aria-controls={showResults ? listboxId : undefined}
          aria-autocomplete="list"
          aria-label="Search cosmetics by name"
          autoComplete="off"
          enterKeyHint="search"
        />
        {showClose ? (
          <button
            type="button"
            className="header-search-field__close"
            onClick={onClose}
            aria-label="Close search"
          >
            <span aria-hidden>×</span>
          </button>
        ) : null}
      </div>

      {showResults ? (
        <div className={resultsClass} role="region" aria-label="Search results">
          {searchQuery.isError ? (
            <p className="header-search-results__hint" role="alert">
              Search failed. Try again.
            </p>
          ) : searchQuery.isFetching && !searchQuery.data?.length ? (
            <div className="header-search-results__loading" role="status">
              <span
                className="catalog-spinner h-5 w-5 border-[1.5px]"
                aria-hidden
              />
              <span className="text-sm text-text-muted">Searching…</span>
            </div>
          ) : (searchQuery.data?.length ?? 0) === 0 ? (
            <p className="header-search-results__hint">No products found.</p>
          ) : (
            <ul
              id={listboxId}
              className="header-search-results__list"
              role="listbox"
            >
              {searchQuery.data?.map((product) => (
                <li key={product.id} role="presentation">
                  <button
                    type="button"
                    role="option"
                    className="header-search-results__item"
                    onClick={() => goToCatalogMatch(product.name)}
                  >
                    <span className="header-search-results__name">
                      {product.name}
                    </span>
                    <span className="header-search-results__meta">
                      {product.brand} · {product.formatKey} · ${product.price}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <Link
            href={
              trimmedDebounced
                ? `/catalog?q=${encodeURIComponent(trimmedDebounced)}`
                : '/catalog'
            }
            className="header-search-results__all"
            onClick={onPickResult}
          >
            View all in shop
          </Link>
        </div>
      ) : null}
    </div>
  )
}
