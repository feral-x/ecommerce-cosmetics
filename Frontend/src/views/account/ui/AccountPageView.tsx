'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useCart } from '@/entities/cart'
import {
  formatPhoneDisplay,
  PhoneIdentifyForm,
  readOrdersForUser,
  type OrderStatus,
  type StoredOrder,
} from '@/entities/user'
import { formatUsd } from '@/shared/lib/format-usd'
import { Spinner } from '@/shared/ui/Spinner'

const STATUS_FILTERS: { id: 'all' | OrderStatus; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'complete', label: 'Paid' },
  { id: 'pending', label: 'Pending' },
  { id: 'canceled', label: 'Canceled' },
]

function formatOrderDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`account-order-badge account-order-badge--${status}`}
      role="status"
    >
      {status === 'complete'
        ? 'Paid'
        : status === 'pending'
          ? 'Pending'
          : 'Canceled'}
    </span>
  )
}

export function AccountPageView() {
  const {
    confirmUserPhone,
    isUserIdentified,
    userPhoneKey,
    totalItems,
    signOutUser,
  } = useCart()
  const [hydrated, setHydrated] = useState(false)
  const [orders, setOrders] = useState<StoredOrder[]>([])
  const [filter, setFilter] = useState<'all' | OrderStatus>('all')

  const reloadOrders = useCallback(() => {
    if (!userPhoneKey) {
      setOrders([])
      return
    }
    setOrders(readOrdersForUser(userPhoneKey))
  }, [userPhoneKey])

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    reloadOrders()
  }, [reloadOrders])

  const filteredOrders = useMemo(() => {
    if (filter === 'all') return orders
    return orders.filter((o) => o.status === filter)
  }, [orders, filter])

  const counts = useMemo(() => {
    return {
      complete: orders.filter((o) => o.status === 'complete').length,
      pending: orders.filter((o) => o.status === 'pending').length,
      canceled: orders.filter((o) => o.status === 'canceled').length,
    }
  }, [orders])

  if (!hydrated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center lg:px-6">
        <Spinner className="mx-auto" />
      </div>
    )
  }

  if (!isUserIdentified || !userPhoneKey) {
    return (
      <div className="container mx-auto px-4 py-8 lg:px-6 lg:py-10">
        <PhoneIdentifyForm
          eyebrow="Your account"
          title="Sign in with your phone"
          lead="No password in this demo — your number links your cart and order history in this browser."
          submitLabel="Sign in"
          onConfirm={confirmUserPhone}
          footer={
            <Link href="/catalog" className="checkout-back-link">
              Continue browsing
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="account-page">
      <div className="container mx-auto px-4 py-8 lg:px-6 lg:py-10">
        <header className="account-page__header">
          <div>
            <p className="landing-eyebrow">Account</p>
            <h1 className="font-display text-3xl text-text-primary">
              {formatPhoneDisplay(userPhoneKey)}
            </h1>
            <p className="account-page__lead">
              Demo profile on this device ·{' '}
              {totalItems > 0 ? (
                <Link href="/cart" className="landing-text-link">
                  {totalItems} items in cart
                </Link>
              ) : (
                'Cart is empty'
              )}
            </p>
          </div>
          <button
            type="button"
            className="filter-reset-btn"
            onClick={() => {
              signOutUser()
            }}
          >
            Sign out
          </button>
        </header>

        <section className="account-stats" aria-label="Order statistics">
          <div className="account-stat">
            <span className="account-stat__value">{counts.complete}</span>
            <span className="account-stat__label">Paid</span>
          </div>
          <div className="account-stat">
            <span className="account-stat__value">{counts.pending}</span>
            <span className="account-stat__label">Pending</span>
          </div>
          <div className="account-stat">
            <span className="account-stat__value">{counts.canceled}</span>
            <span className="account-stat__label">Canceled</span>
          </div>
        </section>

        <section className="account-orders" aria-labelledby="account-orders-title">
          <h2 id="account-orders-title" className="account-orders__title">
            Orders
          </h2>
          <ul className="account-orders__filters" role="tablist">
            {STATUS_FILTERS.map(({ id, label }) => (
              <li key={id}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={filter === id}
                  className={
                    filter === id
                      ? 'account-orders__filter account-orders__filter--active'
                      : 'account-orders__filter'
                  }
                  onClick={() => setFilter(id)}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          {filteredOrders.length === 0 ? (
            <p className="account-orders__empty">
              No orders in this view yet.{' '}
              <Link href="/catalog">Shop the catalog</Link> or{' '}
              <Link href="/checkout">go to checkout</Link>.
            </p>
          ) : (
            <ul className="account-orders__list">
              {filteredOrders.map((order) => (
                <li key={order.id} className="account-order-card">
                  <div className="account-order-card__head">
                    <p className="account-order-card__id">{order.id}</p>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="account-order-card__meta">
                    {formatOrderDate(order.updatedAt)}
                    {order.fullName ? ` · ${order.fullName}` : ''}
                  </p>
                  <p className="account-order-card__email">{order.email}</p>
                  <p className="account-order-card__total">
                    {formatUsd(order.total)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
