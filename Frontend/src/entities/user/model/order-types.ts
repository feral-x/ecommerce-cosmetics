export type OrderStatus = 'pending' | 'complete' | 'canceled'

export type StoredOrder = {
  id: string
  total: number
  email: string
  fullName?: string
  status: OrderStatus
  createdAt: string
  updatedAt: string
}
