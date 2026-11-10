/** Цифры-only ключ для хранения корзины. */
export function normalizePhoneKey(raw: string) {
  const digits = raw.replace(/\D/g, '')
  if (digits.length < 10) return null
  return digits
}

export function formatPhoneDisplay(phoneKey: string) {
  if (phoneKey.length === 11 && phoneKey.startsWith('7')) {
    return `+7 (${phoneKey.slice(1, 4)}) ${phoneKey.slice(4, 7)}-${phoneKey.slice(7, 9)}-${phoneKey.slice(9)}`
  }
  if (phoneKey.length === 10) {
    return `+1 (${phoneKey.slice(0, 3)}) ${phoneKey.slice(3, 6)}-${phoneKey.slice(6)}`
  }
  return `+${phoneKey}`
}

export function validatePhoneInput(raw: string) {
  const key = normalizePhoneKey(raw)
  if (!key) {
    return { ok: false as const, error: 'Enter at least 10 digits.' }
  }
  return { ok: true as const, phoneKey: key }
}
