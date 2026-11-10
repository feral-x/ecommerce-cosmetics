'use client'

import Link from 'next/link'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { SearchIcon } from '@/shared/ui/Icons'
import { ProductSearchPanel } from '@/widgets/product-search/ui/ProductSearchPanel'

export function HeaderSearch() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
  }, [])

  useEffect(() => {
    if (!open) return
    const id = window.requestAnimationFrame(() => {
      rootRef.current?.querySelector('input')?.focus()
    })
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

  return (
    <>
      <Link
        href="/search"
        className="header-search-mobile-link header-utility-btn text-text-secondary transition-colors hover:text-primary-soft lg:hidden"
        aria-label="Search"
      >
        <SearchIcon />
      </Link>

      <div
        ref={rootRef}
        className={[
          'header-search-wrap hidden items-center lg:flex',
          open ? 'header-search-wrap--open' : '',
        ].join(' ')}
      >
        {open ? (
          <ProductSearchPanel
            query={query}
            onQueryChange={setQuery}
            onPickResult={close}
            onClose={close}
            showClose
          />
        ) : (
          <button
            type="button"
            className="header-utility-btn text-text-secondary transition-colors hover:text-primary-soft"
            aria-label="Search"
            onClick={() => setOpen(true)}
          >
            <SearchIcon />
          </button>
        )}
      </div>
    </>
  )
}
