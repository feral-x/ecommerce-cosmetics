import { describe, expect, it } from 'vitest'
import {
  PRODUCT_CARD_SHORT_DESCRIPTION_MAX,
  buildShortDescription,
} from './product-short-label'

describe('buildShortDescription', () => {
  it('returns name unchanged when within limit', () => {
    expect(buildShortDescription('Hydrating Essence')).toBe('Hydrating Essence')
  })

  it('truncates long names with ellipsis', () => {
    const long =
      'Skincare Milk SPF50+ PA++++ Ultra Long Product Name For Testing'
    const short = buildShortDescription(long)
    expect(short.length).toBeLessThanOrEqual(PRODUCT_CARD_SHORT_DESCRIPTION_MAX)
    expect(short.endsWith('…')).toBe(true)
  })
})
