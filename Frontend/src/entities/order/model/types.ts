export type OrderPaymentStatus = 'idle' | 'pending' | 'complete' | 'canceled'

export type CheckoutContact = {
  email: string
  fullName: string
  address: string
  city: string
  postal: string
}
