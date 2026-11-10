import '@testing-library/jest-dom/vitest'
import { createElement, type ReactNode } from 'react'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
import { setCatalogBootstrapLoader } from '@/entities/product/api/catalog-bootstrap'
import { setProductSearchLoader } from '@/entities/product/api/search-products'
import { setCatalogProductSnapshot } from '@/entities/product/lib/product-catalog-snapshot'
import {
  allBrands,
  allCategories,
  allFormats,
  mockProducts,
} from '@/entities/product/model/mock-products'
import { beforeEach } from 'vitest'
import { queryClient } from '@/shared/lib/query-client'
import { resetNextNavigationMock } from '@/test/navigation-test-state'

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string
    children: ReactNode
  }) => createElement('a', { href, ...props }, children),
}))

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { fill: _fill, priority: _priority, ...rest } = props
    return createElement('img', { alt: '', ...rest })
  },
}))

beforeEach(() => {
  setCatalogBootstrapLoader(() =>
    Promise.resolve({
      products: mockProducts,
      categories: allCategories,
      brands: allBrands,
      formats: allFormats,
    }),
  )
  setCatalogProductSnapshot(mockProducts)
})

afterEach(() => {
  cleanup()
  queryClient.clear()
  setCatalogBootstrapLoader(null)
  setProductSearchLoader(null)
  resetNextNavigationMock()
})

vi.mock('next/navigation', async () => {
  const { nextNavigationMock } = await import('@/test/navigation-test-state')
  return {
    usePathname: () => nextNavigationMock.pathname,
    useSearchParams: () => new URLSearchParams(nextNavigationMock.search),
    useRouter: () => ({
      push: nextNavigationMock.push,
      replace: nextNavigationMock.replace,
    }),
  }
})
