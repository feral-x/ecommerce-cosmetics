'use client'

import { useEffect, useId, useState } from 'react'
import type { CatalogFiltersState } from '@/shared/model/catalog-filters'
import { CloseIcon } from '@/shared/ui/Icons'
import { CatalogFilters } from './CatalogFilters'

type CatalogMobileFiltersProps = {
  categories: string[]
  brands: string[]
  formats: string[]
  filters: CatalogFiltersState
  activeCount: number
  onChange: (next: CatalogFiltersState) => void
  onReset: () => void
}

export function CatalogMobileFilters(props: CatalogMobileFiltersProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const { activeCount } = props

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <div className="catalog-mobile-toolbar lg:hidden">
        <button
          type="button"
          className="catalog-mobile-filters-btn"
          onClick={() => setOpen(true)}
        >
          Filters
          {activeCount > 0 ? (
            <span className="catalog-mobile-filters-btn__badge" aria-hidden>
              {activeCount}
            </span>
          ) : null}
        </button>
      </div>

      {open ? (
        <>
          <button
            type="button"
            className="mobile-sheet-backdrop"
            aria-label="Close filters"
            onClick={() => setOpen(false)}
          />
          <aside
            id={panelId}
            className="catalog-filters-sheet scrollbar-themed"
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
          >
            <div className="catalog-filters-sheet__head">
              <h2 className="catalog-filters-sheet__title">Filters</h2>
              <button
                type="button"
                className="catalog-filters-sheet__close"
                onClick={() => setOpen(false)}
                aria-label="Close filters"
              >
                <CloseIcon size="sm" />
              </button>
            </div>
            <div className="catalog-filters-sheet__body">
              <CatalogFilters {...props} />
            </div>
            <div className="catalog-filters-sheet__footer">
              <button
                type="button"
                className="landing-cta-primary catalog-filters-sheet__apply"
                onClick={() => setOpen(false)}
              >
                Show results
              </button>
            </div>
          </aside>
        </>
      ) : null}
    </>
  )
}
