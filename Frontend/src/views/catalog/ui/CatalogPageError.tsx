type CatalogPageErrorProps = {
  onRetry: () => void
  isRetrying?: boolean
}

export function CatalogPageError({
  onRetry,
  isRetrying = false,
}: CatalogPageErrorProps) {
  return (
    <div
      className="rounded-xl border border-border-subtle bg-surface px-6 py-16 text-center"
      role="alert"
    >
      <p className="text-text-secondary">
        We couldn&apos;t load the catalog. Check your connection and try again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="filter-reset-btn mt-4"
      >
        {isRetrying ? 'Retrying…' : 'Retry'}
      </button>
    </div>
  )
}
