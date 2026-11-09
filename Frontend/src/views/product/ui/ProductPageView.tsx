'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart, QuantityStepper } from '@/entities/cart'
import type { Product } from '@/entities/product'
import { ProductDetailGallery } from '@/entities/product/ui/ProductDetailGallery'
import { getProductReviews } from '@/entities/product/lib/product-reviews.mock'
import { ProductReviewsSection } from './ProductReviewsSection'

type ProductPageViewProps = {
  product: Product
}

export function ProductPageView({ product }: ProductPageViewProps) {
  const { addProduct } = useCart()
  const [qty, setQty] = useState(1)
  const maxQty = product.stockCount ?? 99

  const priceLabel = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: product.price % 1 === 0 ? 0 : 2,
  }).format(product.price)

  const handleAdd = () => {
    if (qty < 1) return
    addProduct(product.id, qty)
  }

  const { average, count } = getProductReviews(product.id)

  return (
    <div className="product-detail">
      <div className="product-detail__hero container mx-auto px-4 py-8 lg:px-6 lg:py-10">
        <nav className="product-detail__crumb" aria-label="Breadcrumb">
          <Link href="/catalog">Shop</Link>
          <span aria-hidden> / </span>
          <span>{product.category}</span>
        </nav>

        <div className="product-detail__grid">
          <div className="product-detail__media">
          <ProductDetailGallery
            productId={product.id}
            productName={product.name}
            images={product.images}
          />
          </div>

          <div className="product-detail__info">
          <p className="product-detail__brand">{product.brand}</p>
          <h1 className="product-detail__title font-display">{product.name}</h1>
          <p className="product-detail__meta">
            {product.formatKey} · {product.sizeLabel}
          </p>
          <p className="product-detail__rating">
            <a href="#product-reviews" className="product-detail__rating-link">
              <span className="product-detail__rating-value">
                {average.toFixed(1)}
              </span>
              <span aria-hidden> · </span>
              <span>{count} reviews</span>
            </a>
          </p>
          <p className="product-detail__price">{priceLabel}</p>
          <p className="product-detail__description">{product.description}</p>

          <ul className="product-detail__tags">
            {product.skinTypes.map((skin) => (
              <li key={skin}>{skin} skin</li>
            ))}
            {product.fragranceFree && <li>Fragrance-free</li>}
            <li>{product.availability.replace('-', ' ')}</li>
          </ul>

          <div className="product-detail__purchase">
            <QuantityStepper
              value={qty}
              min={0}
              max={maxQty}
              onChange={setQty}
              aria-label="Quantity to add"
            />
            <button
              type="button"
              className="landing-cta-primary product-detail__add-btn"
              disabled={qty < 1}
              onClick={handleAdd}
            >
              Add to cart
            </button>
          </div>
          {qty < 1 && (
            <p className="product-detail__qty-hint" role="status">
              Select at least 1 item to add to cart.
            </p>
          )}
          </div>
        </div>
      </div>

      <div className="product-detail__reviews-band">
        <div className="product-detail__reviews-inner container mx-auto px-4 lg:px-6">
          <ProductReviewsSection productId={product.id} />
        </div>
      </div>
    </div>
  )
}
