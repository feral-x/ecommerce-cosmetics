import type { ReactNode } from 'react'
import type { ProductAvailability } from '@/entities/product'

export type CatalogFiltersState = {
  seriesQuery: string
  selectedSeries: string[]
  selectedScales: string[]
  selectedBrands: string[]
  selectedAvailability: ProductAvailability[]
  /** all | скрыть 18+ | только 18+ */
  matureFilter: 'all' | 'exclude' | 'only'
  priceMin: number
  priceMax: number
}

type CatalogFiltersProps = {
  series: string[]
  brands: string[]
  scales: string[]
  filters: CatalogFiltersState
  activeCount: number
  onChange: (next: CatalogFiltersState) => void
  onReset: () => void
}

const priceMaxLimit = 500

const availabilityOptions: {
  value: ProductAvailability
  label: string
}[] = [
  { value: 'new-release', label: 'New releases' },
  { value: 'in-stock', label: 'In stock' },
  { value: 'pre-order', label: 'Pre-order' },
]

function toggleItem<T>(list: T[], item: T): T[] {
  return list.includes(item)
    ? list.filter((x) => x !== item)
    : [...list, item]
}

function FilterSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="border-t border-border-subtle pt-8 first:border-t-0 first:pt-0">
      <h3 className="text-xs font-medium uppercase tracking-wider text-text-secondary">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  )
}

export function CatalogFilters({
  series,
  brands,
  scales,
  filters,
  activeCount,
  onChange,
  onReset,
}: CatalogFiltersProps) {
  const filteredSeries = series.filter((s) =>
    s.toLowerCase().includes(filters.seriesQuery.trim().toLowerCase()),
  )

  return (
    <aside className="catalog-filters-panel scrollbar-themed w-full">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-text-primary">
            Filters
          </h2>
          {activeCount > 0 && (
            <p className="mt-1 text-[11px] text-text-muted">
              {activeCount} active
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onReset}
          className="filter-reset-btn"
        >
          Reset
        </button>
      </div>

      <FilterSection title="Series">
        <input
          type="search"
          placeholder="Search series…"
          value={filters.seriesQuery}
          onChange={(e) =>
            onChange({ ...filters, seriesQuery: e.target.value })
          }
          className="filter-input"
        />
        <ul className="scrollbar-themed mt-3 max-h-[13.25rem] space-y-0.5 overflow-y-auto pr-1">
          {filteredSeries.map((name) => {
            const checked = filters.selectedSeries.includes(name)
            return (
              <li key={name}>
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      onChange({
                        ...filters,
                        selectedSeries: toggleItem(
                          filters.selectedSeries,
                          name,
                        ),
                      })
                    }
                    className="filter-checkbox"
                  />
                  <span className="leading-snug">{name}</span>
                </label>
              </li>
            )
          })}
        </ul>
      </FilterSection>

      <FilterSection title="Availability">
        <ul className="space-y-0.5">
          {availabilityOptions.map(({ value, label }) => (
            <li key={value}>
              <label className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.selectedAvailability.includes(value)}
                  onChange={() =>
                    onChange({
                      ...filters,
                      selectedAvailability: toggleItem(
                        filters.selectedAvailability,
                        value,
                      ),
                    })
                  }
                  className="filter-checkbox"
                />
                {label}
              </label>
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection title="Scale">
        <ul className="flex flex-wrap gap-2">
          {scales.map((scale) => {
            const active = filters.selectedScales.includes(scale)
            return (
              <li key={scale}>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...filters,
                      selectedScales: toggleItem(
                        filters.selectedScales,
                        scale,
                      ),
                    })
                  }
                  className={`filter-chip ${active ? 'filter-chip--active' : ''}`}
                >
                  {scale}
                </button>
              </li>
            )
          })}
        </ul>
      </FilterSection>

      <FilterSection title="Brand">
        <ul className="scrollbar-themed max-h-36 space-y-0.5 overflow-y-auto pr-1">
          {brands.map((brand) => (
            <li key={brand}>
              <label className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.selectedBrands.includes(brand)}
                  onChange={() =>
                    onChange({
                      ...filters,
                      selectedBrands: toggleItem(
                        filters.selectedBrands,
                        brand,
                      ),
                    })
                  }
                  className="filter-checkbox"
                />
                <span className="leading-snug">{brand}</span>
              </label>
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection title="Price (USD)">
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-[11px] text-text-muted">Min</span>
            <input
              type="number"
              min={0}
              max={filters.priceMax}
              value={filters.priceMin}
              onChange={(e) =>
                onChange({
                  ...filters,
                  priceMin: Math.min(
                    Number(e.target.value) || 0,
                    filters.priceMax,
                  ),
                })
              }
              className="filter-input mt-1 tabular-nums"
            />
          </label>
          <label className="block">
            <span className="text-[11px] text-text-muted">Max</span>
            <input
              type="number"
              min={filters.priceMin}
              max={priceMaxLimit}
              value={filters.priceMax}
              onChange={(e) =>
                onChange({
                  ...filters,
                  priceMax: Math.max(
                    Number(e.target.value) || priceMaxLimit,
                    filters.priceMin,
                  ),
                })
              }
              className="filter-input mt-1 tabular-nums"
            />
          </label>
        </div>
        <input
          type="range"
          min={0}
          max={priceMaxLimit}
          value={filters.priceMax}
          onChange={(e) =>
            onChange({ ...filters, priceMax: Number(e.target.value) })
          }
          className="filter-range mt-4"
          aria-label="Maximum price"
        />
      </FilterSection>

      <FilterSection title="Content">
        <ul className="space-y-0.5">
          {(
            [
              ['all', 'All figures'],
              ['exclude', 'Hide 18+'],
              ['only', '18+ only'],
            ] as const
          ).map(([value, label]) => (
            <li key={value}>
              <label className="filter-option">
                <input
                  type="radio"
                  name="matureFilter"
                  checked={filters.matureFilter === value}
                  onChange={() =>
                    onChange({ ...filters, matureFilter: value })
                  }
                  className="filter-checkbox"
                />
                {label}
              </label>
            </li>
          ))}
        </ul>
      </FilterSection>
      <div className="hidden h-6 shrink-0 lg:block" aria-hidden />
    </aside>
  )
}

export const defaultCatalogFilters: CatalogFiltersState = {
  seriesQuery: '',
  selectedSeries: [],
  selectedScales: [],
  selectedBrands: [],
  selectedAvailability: [],
  matureFilter: 'all',
  priceMin: 0,
  priceMax: 500,
}

export function countActiveFilters(filters: CatalogFiltersState): number {
  let n = 0
  if (filters.selectedSeries.length) n += 1
  if (filters.selectedAvailability.length) n += 1
  if (filters.selectedScales.length) n += 1
  if (filters.selectedBrands.length) n += 1
  if (filters.matureFilter !== 'all') n += 1
  if (filters.priceMin > 0 || filters.priceMax < 500) n += 1
  return n
}
