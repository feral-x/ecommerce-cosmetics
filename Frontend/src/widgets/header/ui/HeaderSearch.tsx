'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import {
  PRODUCT_SEARCH_MIN_LENGTH,
  productSearchQueryOptions,
} from '@/entities/product/api/search-products'
import { useDebouncedValue } from '@/shared/lib/use-debounced-value'
import { SearchIcon } from '@/shared/ui/Icons'

const DEBOUNCE_MS = 350

export function HeaderSearch() {
  const router = useRouter()
  const listboxId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS)

  const trimmedDebounced = debouncedQuery.trim()
  const searchQuery = useQuery(productSearchQueryOptions(debouncedQuery))

  const showResults =
    open &&
    trimmedDebounced.length >= PRODUCT_SEARCH_MIN_LENGTH &&
    (searchQuery.isFetching || searchQuery.data != null || searchQuery.isError)

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
  }, [])

  const openSearch = useCallback(() => {
    setOpen(true)
  }, [])

  useEffect(() => {
    if (!open) return
    const id = window.requestAnimationFrame(() => inputRef.current?.focus())
    return () => window.cancelAnimationFrame(id)
  }, [open])

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      const root = rootRef.current
      if (root && !root.contains(event.target as Node)) {
        close()
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open, close])

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      close()
    }
  }

  const goToCatalogMatch = (name: string) => {
    close()
    router.push(`/catalog?q=${encodeURIComponent(name)}`, { scroll: false })
  }

  return (
    <div
      ref={rootRef}
      className={[
        'header-search-wrap',
        open ? 'header-search-wrap--open' : '',
      ].join(' ')}
    >
      {open ? (
        <div className="header-search-open">
          <div className="header-search-field">
            <SearchIcon size="sm" className="header-search-field__icon" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="Search products…"
              className="header-search-input"
              role="combobox"
              aria-expanded={showResults}
              aria-controls={showResults ? listboxId : undefined}
              aria-autocomplete="list"
              aria-label="Search cosmetics by name"
              autoComplete="off"
              enterKeyHint="search"
            />
            <button
              type="button"
              className="header-search-field__close"
              onClick={close}
              aria-label="Close search"
            >
              <span aria-hidden>×</span>
            </button>
          </div>

          {showResults && (
            <div
              className="header-search-results"
              role="region"
              aria-label="Search results"
            >
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
                          {product.brand} · {product.formatKey} · $
                          {product.price}
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
                onClick={close}
              >
                View all in shop
              </Link>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          className="header-utility-btn text-text-secondary transition-colors hover:text-primary-soft"
          aria-label="Search"
          onClick={openSearch}
        >
          <SearchIcon />
        </button>
      )}
    </div>
  )
}
