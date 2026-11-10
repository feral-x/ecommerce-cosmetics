'use client'

import Link from 'next/link'
import { useCart } from '@/entities/cart'
import { PhoneIdentifyForm } from '@/entities/user/ui/PhoneIdentifyForm'

export function CheckoutIdentifyView() {
  const { confirmUserPhone, totalItems } = useCart()

  if (totalItems === 0) {
    return (
      <div className="checkout-identify checkout-identify--empty">
        <h1 className="font-display text-2xl text-text-primary">Your cart is empty</h1>
        <Link href="/catalog" className="landing-cta-primary mt-6 inline-flex">
          Browse shop
        </Link>
      </div>
    )
  }

  return (
    <PhoneIdentifyForm
      eyebrow="Before checkout"
      title="Confirm your phone"
      lead="Your number becomes your account ID — we'll save your cart and orders in this browser."
      submitLabel="Confirm & continue"
      onConfirm={confirmUserPhone}
      footer={
        <Link href="/cart" className="checkout-back-link">
          Back to cart
        </Link>
      }
    />
  )
}
