import { describe, expect, it } from 'vitest'
import { formatPhoneDisplay, normalizePhoneKey, validatePhoneInput } from './phone'

describe('phone', () => {
  it('normalizes digits and validates length', () => {
    expect(normalizePhoneKey('+7 (900) 111-22-33')).toBe('79001112233')
    expect(validatePhoneInput('123').ok).toBe(false)
    expect(validatePhoneInput('89001112233').ok).toBe(true)
  })

  it('formats ru numbers', () => {
    expect(formatPhoneDisplay('79001112233')).toBe('+7 (900) 111-22-33')
  })
})
