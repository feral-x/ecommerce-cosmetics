import { Skeleton } from '@/shared/ui/Skeleton'

export function CatalogToolbarSkeleton() {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Skeleton className="h-5 w-28" />
      <Skeleton className="h-10 w-44 rounded-lg" />
    </div>
  )
}
