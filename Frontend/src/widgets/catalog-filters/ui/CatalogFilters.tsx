'use client'

import type { ReactNode } from 'react'
import type { ProductAvailability, SkinType } from '@/entities/product'
import { type CatalogFiltersState } from '@/shared/model/catalog-filters'
import { PriceRangeFilter } from './PriceRangeFilter'

type CatalogFiltersProps = {
  categories: string[]
  brands: string[]
  formats: string[]
  filters: CatalogFiltersState
  activeCount: number
  onChange: (next: CatalogFiltersState) => void
  onReset: () => void
}

const availabilityOptions: {
  value: ProductAvailability
  label: string
}[] = [
  { value: 'new-release', label: 'New arrivals' },
  { value: 'in-stock', label: 'In stock' },
  { value: 'pre-order', label: 'Pre-order' },
]

const skinTypeOptions: { value: SkinType; label: string }[] = [
  { value: 'dry', label: 'Dry' },
  { value: 'oily', label: 'Oily' },
  { value: 'combination', label: 'Combination' },
  { value: 'sensitive', label: 'Sensitive' },
  { value: 'normal', label: 'Normal' },
]

function toggleItem<T>(list: T[], item: T): T[] {
  return list.includes(item)
    ? list.filter((x) => x !== item)
    : [...list, item]
}

function filterSectionId(title: string) {
  return `catalog-filter-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
}

function FilterSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  const titleId = filterSectionId(title)
  return (
    <section
      className="catalog-filter-section"
      role="group"
      aria-labelledby={titleId}
    >
      <h3 id={titleId} className="catalog-filter-section__title">
        {title}
      </h3>
      <div className="catalog-filter-section__body">{children}</div>
    </section>
  )
}

export function CatalogFilters({
  categories,
  brands,
  formats,
  filters,
  activeCount,
  onChange,
  onReset,
}: CatalogFiltersProps) {
  return (
    <aside
      className="catalog-filters-panel scrollbar-themed w-full"
      aria-label="Filters"
    >
      <div className="catalog-filters-toolbar flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-text-primary">
            Filters
          </h2>
          <p className="mt-1 text-[11px] text-text-muted" aria-live="polite">
            {activeCount} active
          </p>
        </div>
        <button type="button" onClick={onReset} className="filter-reset-btn">
          Reset
        </button>
      </div>

      <FilterSection title="Product line">
        <input
          type="search"
          placeholder="Search line or product…"
          aria-label="Search product line"
          value={filters.lineQuery}
          onChange={(e) => onChange({ ...filters, lineQuery: e.target.value })}
          className="filter-input"
        />
      </FilterSection>

      <FilterSection title="Category">
        <ul className="catalog-filter-list catalog-filter-list--scroll scrollbar-themed">
          {categories.map((name) => {
            const checked = filters.selectedCategories.includes(name)
            return (
              <li key={name}>
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      onChange({
                        ...filters,
                        selectedCategories: toggleItem(
                          filters.selectedCategories,
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
        <ul className="catalog-filter-list">
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
                <span className="leading-snug">{label}</span>
              </label>
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection title="Product type">
        <ul className="catalog-filter-chips">
          {formats.map((format) => {
            const active = filters.selectedFormats.includes(format)
            return (
              <li key={format}>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...filters,
                      selectedFormats: toggleItem(
                        filters.selectedFormats,
                        format,
                      ),
                    })
                  }
                  className={`filter-chip ${active ? 'filter-chip--active' : ''}`}
                >
                  {format}
                </button>
              </li>
            )
          })}
        </ul>
      </FilterSection>

      <FilterSection title="Brand">
        <ul className="catalog-filter-list catalog-filter-list--scroll-sm scrollbar-themed">
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

      <FilterSection title="Skin type">
        <ul className="catalog-filter-list">
          {skinTypeOptions.map(({ value, label }) => (
            <li key={value}>
              <label className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.selectedSkinTypes.includes(value)}
                  onChange={() =>
                    onChange({
                      ...filters,
                      selectedSkinTypes: toggleItem(
                        filters.selectedSkinTypes,
                        value,
                      ),
                    })
                  }
                  className="filter-checkbox"
                />
                <span className="leading-snug">{label}</span>
              </label>
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection title="Preferences">
        <label className="filter-option">
          <input
            type="checkbox"
            checked={filters.fragranceFreeOnly}
            onChange={(e) =>
              onChange({ ...filters, fragranceFreeOnly: e.target.checked })
            }
            className="filter-checkbox"
          />
          <span className="leading-snug">Fragrance-free only</span>
        </label>
      </FilterSection>

      <FilterSection title="Price (USD)">
        <PriceRangeFilter
          priceMin={filters.priceMin}
          priceMax={filters.priceMax}
          onCommit={({ priceMin, priceMax }) =>
            onChange({ ...filters, priceMin, priceMax })
          }
        />
      </FilterSection>
      <div className="hidden h-6 shrink-0 lg:block" aria-hidden />
    </aside>
  )
}
