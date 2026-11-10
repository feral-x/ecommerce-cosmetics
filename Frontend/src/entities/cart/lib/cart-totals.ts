export const FREE_SHIPPING_THRESHOLD_USD = 75
export const STANDARD_SHIPPING_USD = 5.99

type PricedLine = { unitPrice: number; quantity: number }

export function cartSubtotal(rows: PricedLine[]) {
  return rows.reduce((sum, row) => sum + row.unitPrice * row.quantity, 0)
}

export function cartShipping(subtotal: number) {
  if (subtotal <= 0) return 0
  return subtotal >= FREE_SHIPPING_THRESHOLD_USD ? 0 : STANDARD_SHIPPING_USD
}

export function cartGrandTotal(subtotal: number, shipping: number) {
  return subtotal + shipping
}

export function amountUntilFreeShipping(subtotal: number) {
  if (subtotal <= 0 || subtotal >= FREE_SHIPPING_THRESHOLD_USD) return 0
  return FREE_SHIPPING_THRESHOLD_USD - subtotal
}
