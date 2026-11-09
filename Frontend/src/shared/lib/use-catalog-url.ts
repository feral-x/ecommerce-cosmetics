'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export function useCatalogUrl() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const catalogSearch = searchParams.toString()

  const setCatalogSearch = useCallback(
    (next: URLSearchParams, options?: { replace?: boolean }) => {
      const qs = next.toString()
      const href = qs ? `${pathname}?${qs}` : pathname
      if (options?.replace) router.replace(href, { scroll: false })
      else router.push(href, { scroll: false })
    },
    [pathname, router],
  )

  const clearCatalogSearch = useCallback(() => {
    router.push(pathname, { scroll: false })
  }, [pathname, router])

  return { catalogSearch, searchParams, setCatalogSearch, clearCatalogSearch }
}
