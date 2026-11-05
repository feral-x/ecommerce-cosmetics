import { screen } from '@testing-library/react'
import { expect } from 'vitest'

/** Catalog summary line splits count and label into separate nodes. */
export function expectFigureCount(count: number) {
  const summary = screen.getByText('figures').closest('p')
  expect(summary?.textContent?.replace(/\s+/g, ' ').trim()).toBe(`${count} figures`)
}
