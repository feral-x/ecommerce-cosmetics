import { describe, expect, it } from 'vitest'
import { bundleCartLineId } from './bundle-cart-line'
import { buildCartRows } from './cart-lines'

describe('buildCartRows', () => {
  it('maps product and bundle lines with images', () => {
    const rows = buildCartRows({
      '1': 2,
      [bundleCartLineId('hydration-heroes')]: 1,
    })

    expect(rows).toHaveLength(2)
    const product = rows.find((r) => r.kind === 'product')
    const bundle = rows.find((r) => r.kind === 'bundle')
    expect(product?.quantity).toBe(2)
    expect(product?.imageUrl).toMatch(/^https:\/\//)
    expect(bundle?.href).toBe('/bundles/hydration-heroes')
  })
})
