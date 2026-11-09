import { describe, expect, it } from 'vitest'
import { getAllBundles, getBundleById } from './enrich-bundle'

describe('bundles', () => {
  it('lists bundles with item images and savings', () => {
    const bundles = getAllBundles()
    expect(bundles.length).toBeGreaterThan(0)
    for (const bundle of bundles) {
      expect(bundle.items.length).toBeGreaterThan(0)
      expect(bundle.savePercent).toBeGreaterThan(0)
      expect(bundle.description.length).toBeGreaterThan(40)
    }
  })

  it('loads bundle by id', () => {
    const bundle = getBundleById('j-beauty-first-ritual')
    expect(bundle?.title).toMatch(/first/i)
    expect(bundle?.items).toHaveLength(4)
  })
})
