import { vi } from 'vitest'

export const nextNavigationMock = {
  pathname: '/',
  search: '',
  push: vi.fn(),
  replace: vi.fn(),
}

export function resetNextNavigationMock() {
  nextNavigationMock.pathname = '/'
  nextNavigationMock.search = ''
  nextNavigationMock.push.mockClear()
  nextNavigationMock.replace.mockClear()
}
