'use client'

import { useCallback, useEffect, useId, useState } from 'react'
import { CATALOG_PRICE_MAX } from '@/shared/model/catalog-filters'

type PriceRangeFilterProps = {
  priceMin: number
  priceMax: number
  onCommit: (next: { priceMin: number; priceMax: number }) => void
}

function clampPair(min: number, max: number) {
  const ceiling = CATALOG_PRICE_MAX
  let lo = Math.max(0, Math.min(Math.round(min), ceiling))
  let hi = Math.max(0, Math.min(Math.round(max), ceiling))
  if (lo > hi) {
    const swap = lo
    lo = hi
    hi = swap
  }
  return { priceMin: lo, priceMax: hi }
}

export function PriceRangeFilter({
  priceMin,
  priceMax,
  onCommit,
}: PriceRangeFilterProps) {
  const minId = useId()
  const maxId = useId()
  const [draft, setDraft] = useState(() => clampPair(priceMin, priceMax))
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    if (isDragging) return
    setDraft(clampPair(priceMin, priceMax))
  }, [priceMin, priceMax, isDragging])

  const commitDraft = useCallback(() => {
    const next = clampPair(draft.priceMin, draft.priceMax)
    setDraft(next)
    if (next.priceMin !== priceMin || next.priceMax !== priceMax) {
      onCommit(next)
    }
  }, [draft, onCommit, priceMin, priceMax])

  const rangeFillLeft = (draft.priceMin / CATALOG_PRICE_MAX) * 100
  const rangeFillWidth =
    ((draft.priceMax - draft.priceMin) / CATALOG_PRICE_MAX) * 100
  const minThumbOnTop = draft.priceMin > CATALOG_PRICE_MAX * 0.5

  return (
    <div className="price-range-filter">
      <div className="catalog-filter-price-fields grid grid-cols-2 gap-3">
        <label className="block" htmlFor={minId}>
          <span className="text-[11px] text-text-muted">From</span>
          <input
            id={minId}
            type="number"
            min={0}
            max={draft.priceMax}
            value={draft.priceMin}
            onChange={(e) => {
              const next = clampPair(
                Number(e.target.value) || 0,
                draft.priceMax,
              )
              setDraft(next)
            }}
            onBlur={commitDraft}
            className="filter-input mt-1 tabular-nums"
          />
        </label>
        <label className="block" htmlFor={maxId}>
          <span className="text-[11px] text-text-muted">To</span>
          <input
            id={maxId}
            type="number"
            min={draft.priceMin}
            max={CATALOG_PRICE_MAX}
            value={draft.priceMax}
            onChange={(e) => {
              const next = clampPair(
                draft.priceMin,
                Number(e.target.value) || CATALOG_PRICE_MAX,
              )
              setDraft(next)
            }}
            onBlur={commitDraft}
            className="filter-input mt-1 tabular-nums"
          />
        </label>
      </div>

      <div
        className="price-dual-range"
        onPointerUp={commitDraft}
        onPointerLeave={(e) => {
          if (e.buttons !== 0) commitDraft()
        }}
      >
        <div className="price-dual-range__track" aria-hidden>
          <div
            className="price-dual-range__fill"
            style={{
              left: `${rangeFillLeft}%`,
              width: `${rangeFillWidth}%`,
            }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={CATALOG_PRICE_MAX}
          value={draft.priceMin}
          onPointerDown={() => setIsDragging(true)}
          onPointerUp={() => setIsDragging(false)}
          onPointerCancel={() => setIsDragging(false)}
          onChange={(e) => {
            const v = Number(e.target.value)
            setDraft((prev) =>
              clampPair(Math.min(v, prev.priceMax), prev.priceMax),
            )
          }}
          className={[
            'price-dual-range__input',
            'price-dual-range__input--min',
            minThumbOnTop ? 'price-dual-range__input--ontop' : '',
          ].join(' ')}
          aria-label="Minimum price"
          aria-valuemin={0}
          aria-valuemax={draft.priceMax}
          aria-valuenow={draft.priceMin}
        />
        <input
          type="range"
          min={0}
          max={CATALOG_PRICE_MAX}
          value={draft.priceMax}
          onPointerDown={() => setIsDragging(true)}
          onPointerUp={() => setIsDragging(false)}
          onPointerCancel={() => setIsDragging(false)}
          onChange={(e) => {
            const v = Number(e.target.value)
            setDraft((prev) =>
              clampPair(prev.priceMin, Math.max(v, prev.priceMin)),
            )
          }}
          className="price-dual-range__input price-dual-range__input--max"
          aria-label="Maximum price"
          aria-valuemin={draft.priceMin}
          aria-valuemax={CATALOG_PRICE_MAX}
          aria-valuenow={draft.priceMax}
        />
      </div>
      <p className="price-range-filter__hint" aria-live="polite">
        ${draft.priceMin} – ${draft.priceMax}
      </p>
    </div>
  )
}
