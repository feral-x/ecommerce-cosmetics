type SpinnerProps = {
  className?: string
  label?: string
}

export function Spinner({ className = '', label = 'Loading' }: SpinnerProps) {
  return (
    <div
      className={`inline-flex flex-col items-center gap-3 ${className}`.trim()}
      role="status"
      aria-label={label}
    >
      <span className="catalog-spinner" aria-hidden />
      <span className="sr-only">{label}</span>
    </div>
  )
}
