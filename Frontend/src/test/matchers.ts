import { screen } from '@testing-library/react'
import { expect } from 'vitest'

/** Catalog summary line splits count and label into separate nodes. */
export function expectProductCount(count: number) {
  const summary = screen.getByText('products').closest('p')
  expect(summary?.textContent?.replace(/\s+/g, ' ').trim()).toBe(`${count} products`)
}

/** @deprecated */
export const expectFigureCount = expectProductCount
