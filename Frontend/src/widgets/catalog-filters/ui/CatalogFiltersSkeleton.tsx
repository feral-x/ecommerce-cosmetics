import { Skeleton } from '@/shared/ui/Skeleton'

function FilterBlock({ lines }: { lines: number }) {
  return (
    <section className="catalog-filter-section">
      <Skeleton className="h-2.5 w-24" />
      <div className="catalog-filter-section__body mt-2.5 space-y-2">
        {Array.from({ length: lines }, (_, i) => (
          <Skeleton key={i} className={`h-9 ${i === 0 ? 'w-full' : 'w-[92%]'}`} />
        ))}
      </div>
    </section>
  )
}

export function CatalogFiltersSkeleton() {
  return (
    <aside
      className="catalog-filters-panel scrollbar-themed w-full"
      aria-busy="true"
      aria-label="Loading filters"
    >
      <div className="catalog-filters-toolbar flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-14" />
        </div>
        <Skeleton className="h-8 w-14 rounded-md" />
      </div>

      <FilterBlock lines={1} />
      <FilterBlock lines={6} />

      <section className="catalog-filter-section">
        <Skeleton className="h-2.5 w-28" />
        <div className="catalog-filter-section__body mt-2.5 flex flex-wrap gap-2">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-8 w-12 rounded-lg" />
          ))}
        </div>
      </section>

      <FilterBlock lines={5} />

      <section className="catalog-filter-section">
        <Skeleton className="h-2.5 w-20" />
        <div className="catalog-filter-section__body mt-2.5 grid grid-cols-2 gap-3">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <Skeleton className="mt-4 h-1.5 w-full rounded-full" />
      </section>

      <FilterBlock lines={3} />
      <div className="hidden h-6 shrink-0 lg:block" aria-hidden />
    </aside>
  )
}
