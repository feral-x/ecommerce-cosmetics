'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import {
  buildCartRows,
  cartGrandTotal,
  cartShipping,
  cartSubtotal,
  useCart,
} from '@/entities/cart'
import {
  formatPhoneDisplay,
  updateOrderStatusForUser,
  upsertOrderForUser,
} from '@/entities/user'
import { CheckoutIdentifyView } from './CheckoutIdentifyView'
import { CheckoutOrderAside } from './CheckoutOrderAside'
import {
  createDemoOrderId,
  scheduleFakePaymentComplete,
} from '@/entities/order/lib/fake-payment'
import type { OrderPaymentStatus } from '@/entities/order/model/types'
import { formatUsd } from '@/shared/lib/format-usd'
import { Spinner } from '@/shared/ui/Spinner'
import { ArrowRightIcon, ShieldCheckIcon } from '@/shared/ui/Icons'

const emptyContact = {
  email: '',
  fullName: '',
  address: '',
  city: '',
  postal: '',
}

function PaymentStatusBadge({ status }: { status: OrderPaymentStatus }) {
  if (status === 'idle') return null

  const labels: Record<Exclude<OrderPaymentStatus, 'idle'>, string> = {
    pending: 'Pending',
    complete: 'Complete',
    canceled: 'Canceled',
  }

  const label = labels[status]

  return (
    <span
      className={`checkout-status-badge checkout-status-badge--${status}`}
      role="status"
      aria-label={label}
    >
      {label}
    </span>
  )
}

export function CheckoutPageView() {
  const router = useRouter()
  const { lines, totalItems, clearCart, isUserIdentified, userPhoneKey } =
    useCart()
  const [contact, setContact] = useState(emptyContact)
  const [paymentStatus, setPaymentStatus] = useState<OrderPaymentStatus>('idle')
  const [orderId, setOrderId] = useState<string | null>(null)
  const [completedOrder, setCompletedOrder] = useState<{
    id: string
    total: number
    email: string
  } | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const cancelPaymentRef = useRef<(() => void) | null>(null)

  const rows = useMemo(() => buildCartRows(lines), [lines])
  const subtotal = cartSubtotal(rows)
  const shipping = cartShipping(subtotal)
  const total = cartGrandTotal(subtotal, shipping)

  useEffect(() => {
    return () => {
      cancelPaymentRef.current?.()
    }
  }, [])

  useEffect(() => {
    if (totalItems === 0 && paymentStatus === 'idle') {
      router.replace('/cart')
    }
  }, [totalItems, paymentStatus, router])

  const updateField =
    (field: keyof typeof emptyContact) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setContact((prev) => ({ ...prev, [field]: e.target.value }))
    }

  const handlePay = (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)

    const email = contact.email.trim()
    const fullName = contact.fullName.trim()
    if (!email || !fullName) {
      setFormError('Enter your email and full name to continue.')
      return
    }

    const id = createDemoOrderId()
    const now = new Date().toISOString()
    setOrderId(id)
    setPaymentStatus('pending')

    if (userPhoneKey) {
      upsertOrderForUser(userPhoneKey, {
        id,
        total,
        email,
        fullName: fullName.trim(),
        status: 'pending',
        createdAt: now,
        updatedAt: now,
      })
    }

    cancelPaymentRef.current?.()
    cancelPaymentRef.current = scheduleFakePaymentComplete(() => {
      setCompletedOrder({
        id,
        total,
        email,
      })
      setPaymentStatus('complete')
      if (userPhoneKey) {
        updateOrderStatusForUser(userPhoneKey, id, 'complete')
      }
      clearCart()
      cancelPaymentRef.current = null
    })
  }

  const handleCancelPayment = () => {
    cancelPaymentRef.current?.()
    cancelPaymentRef.current = null
    if (userPhoneKey && orderId) {
      updateOrderStatusForUser(userPhoneKey, orderId, 'canceled')
    }
    setPaymentStatus('canceled')
  }

  const handleRetry = () => {
    setPaymentStatus('idle')
    setOrderId(null)
    setFormError(null)
  }

  if (paymentStatus === 'complete' && completedOrder) {
    return (
      <div className="checkout-result checkout-result--complete">
        <div className="container mx-auto px-4 py-16 lg:px-6 lg:py-20">
          <PaymentStatusBadge status="complete" />
          <h1 className="checkout-result__title font-display">Thank you</h1>
          <p className="checkout-result__lead">
            Your demo order <strong>{completedOrder.id}</strong> is confirmed.
            We&apos;ll send a receipt to {completedOrder.email} when checkout
            is connected to the backend.
          </p>
          <p className="checkout-result__total">
            Paid {formatUsd(completedOrder.total)}
          </p>
          <div className="checkout-result__actions">
            <Link href="/catalog" className="landing-cta-primary">
              Continue shopping
              <ArrowRightIcon size="sm" />
            </Link>
            <Link href="/" className="landing-text-link">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (totalItems === 0 && paymentStatus === 'idle' && !isUserIdentified) {
    return (
      <div className="container mx-auto px-4 py-8 lg:px-6 lg:py-10">
        <CheckoutIdentifyView />
      </div>
    )
  }

  if (totalItems === 0 && paymentStatus !== 'complete') {
    return (
      <div className="container mx-auto px-4 py-16 text-center lg:px-6">
        <Spinner className="mx-auto" />
      </div>
    )
  }

  if (!isUserIdentified) {
    return (
      <div className="checkout-page">
        <div className="container mx-auto px-4 py-8 lg:px-6 lg:py-10">
          <nav className="checkout-crumb" aria-label="Checkout progress">
            <Link href="/cart">Cart</Link>
            <span aria-hidden>›</span>
            <span className="checkout-crumb__active">Sign in</span>
          </nav>
          <CheckoutIdentifyView />
        </div>
      </div>
    )
  }

  const payDisabled = paymentStatus === 'pending'

  return (
    <div className="checkout-page">
      <div className="container mx-auto px-4 py-8 lg:px-6 lg:py-10">
        <nav className="checkout-crumb" aria-label="Checkout progress">
          <Link href="/cart">Cart</Link>
          <span aria-hidden>›</span>
          <span className="checkout-crumb__active">Checkout</span>
        </nav>

        <header className="checkout-page__header">
          <div>
            <h1 className="font-display text-3xl text-text-primary">Checkout</h1>
            <p className="checkout-page__lead">
              {userPhoneKey ? (
                <>
                  Signed in as{' '}
                  <strong>{formatPhoneDisplay(userPhoneKey)}</strong> · cart
                  saved on this device.
                </>
              ) : null}{' '}
              Complete your details and confirm payment.
            </p>
          </div>
          <PaymentStatusBadge status={paymentStatus} />
        </header>

        {paymentStatus === 'canceled' ? (
          <div className="checkout-alert checkout-alert--canceled" role="alert">
            <p>
              <strong>Payment canceled.</strong> Nothing was charged. Your cart
              is unchanged — you can try again when ready.
            </p>
            <button
              type="button"
              className="filter-reset-btn"
              onClick={handleRetry}
            >
              Dismiss &amp; edit details
            </button>
          </div>
        ) : null}

        <div className="cart-layout">
          <div className="checkout-page__main">
            <form className="checkout-form" onSubmit={handlePay} noValidate>
              <fieldset
                className="checkout-fieldset"
                disabled={payDisabled}
              >
                <legend className="checkout-fieldset__legend">Contact</legend>
                <label className="checkout-field">
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    className="filter-input"
                    value={contact.email}
                    onChange={updateField('email')}
                    placeholder="you@example.com"
                    required
                  />
                </label>
                <label className="checkout-field">
                  <span>Full name</span>
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    className="filter-input"
                    value={contact.fullName}
                    onChange={updateField('fullName')}
                    placeholder="Yuki Tanaka"
                    required
                  />
                </label>
              </fieldset>

              <fieldset
                className="checkout-fieldset"
                disabled={payDisabled}
              >
                <legend className="checkout-fieldset__legend">Shipping</legend>
                <label className="checkout-field">
                  <span>Address</span>
                  <input
                    type="text"
                    name="address"
                    autoComplete="street-address"
                    className="filter-input"
                    value={contact.address}
                    onChange={updateField('address')}
                    placeholder="4-2-8 Ginza, Chuo-ku"
                  />
                </label>
                <div className="checkout-field-row">
                  <label className="checkout-field">
                    <span>City</span>
                    <input
                      type="text"
                      name="city"
                      autoComplete="address-level2"
                      className="filter-input"
                      value={contact.city}
                      onChange={updateField('city')}
                      placeholder="Tokyo"
                    />
                  </label>
                  <label className="checkout-field">
                    <span>Postal code</span>
                    <input
                      type="text"
                      name="postal"
                      autoComplete="postal-code"
                      className="filter-input"
                      value={contact.postal}
                      onChange={updateField('postal')}
                      placeholder="104-0061"
                    />
                  </label>
                </div>
              </fieldset>

              <fieldset
                className="checkout-fieldset checkout-fieldset--payment"
                disabled={payDisabled}
              >
                <legend className="checkout-fieldset__legend">
                  Payment (demo)
                </legend>
                <p className="checkout-payment-note">
                  <ShieldCheckIcon size="sm" />
                  Card fields are for layout only — confirming simulates a bank
                  response after a short delay.
                </p>
                <label className="checkout-field">
                  <span>Card number</span>
                  <input
                    type="text"
                    name="card"
                    className="filter-input"
                    defaultValue="4242 4242 4242 4242"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    readOnly
                  />
                </label>
                <div className="checkout-field-row">
                  <label className="checkout-field">
                    <span>Expiry</span>
                    <input
                      type="text"
                      className="filter-input"
                      defaultValue="12/28"
                      autoComplete="cc-exp"
                      readOnly
                    />
                  </label>
                  <label className="checkout-field">
                    <span>CVC</span>
                    <input
                      type="text"
                      className="filter-input"
                      defaultValue="123"
                      autoComplete="cc-csc"
                      readOnly
                    />
                  </label>
                </div>
              </fieldset>

              {formError ? (
                <p className="checkout-form-error" role="alert">
                  {formError}
                </p>
              ) : null}

              <div className="checkout-form__actions">
                <button
                  type="submit"
                  className="landing-cta-primary checkout-pay-btn"
                  disabled={payDisabled}
                >
                  Pay {formatUsd(total)}
                </button>
                <Link href="/cart" className="checkout-back-link">
                  Return to cart
                </Link>
              </div>
            </form>

            {paymentStatus === 'pending' ? (
              <div
                className="checkout-pending-panel"
                role="status"
                aria-live="polite"
                data-testid="checkout-pending"
              >
                <Spinner />
                <div className="checkout-pending-panel__copy">
                  <PaymentStatusBadge status="pending" />
                  <p className="checkout-pending-panel__title">
                    Processing payment…
                  </p>
                  <p className="checkout-pending-panel__meta">
                    Order {orderId} · This usually takes a few seconds in demo
                    mode.
                  </p>
                  <button
                    type="button"
                    className="filter-reset-btn checkout-pending-panel__cancel"
                    onClick={handleCancelPayment}
                  >
                    Cancel payment
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <CheckoutOrderAside lines={lines} />
        </div>
      </div>
    </div>
  )
}
