'use client'

import Link from 'next/link'
import { ProductCardQuickAdd } from '@/entities/cart'
import type { Product } from '../model/types'
import { ProductCardGallery } from './ProductCardGallery'

type ProductCardProps = {
  product: Product
  imagePriority?: boolean
}

function StatusBadge({ product }: { product: Product }) {
  if (product.availability !== 'pre-order') return null
  return (
    <span className="product-card__badge product-card__badge--preorder">
      Pre-order
    </span>
  )
}

export function ProductCard({ product, imagePriority }: ProductCardProps) {
  const priceLabel = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: product.price % 1 === 0 ? 0 : 2,
  }).format(product.price)

  const href = `/product/${product.id}`

  return (
    <article className="product-card group">
      <div className="product-card__shell product-card__shell--clickable">
        <Link
          href={href}
          className="product-card__link"
          aria-label={`${product.brand}, ${product.name}, ${priceLabel}`}
        >
          <div className="product-card__media">
            <StatusBadge product={product} />
            <div className="product-card__well">
              <ProductCardGallery
                productId={product.id}
                productName={product.name}
                images={product.images}
                variant="catalog"
                imagePriority={imagePriority}
              />
            </div>
          </div>

          <div className="product-card__body">
            <p className="product-card__brand">{product.brand}</p>
            <h3 className="product-card__title type-product-title" title={product.name}>
              {product.shortDescription}
            </h3>
            <p className="product-card__ritual">
              <span>{product.formatKey}</span>
              <span className="product-card__dot" aria-hidden>
                ·
              </span>
              <span>{product.sizeLabel}</span>
              <span className="product-card__dot" aria-hidden>
                ·
              </span>
              <span className="product-card__category-inline">
                {product.category}
              </span>
            </p>
          </div>
        </Link>

        <div className="product-card__footer">
          <Link href={href} className="product-card__price-link" tabIndex={-1}>
            <p className="product-card__price">{priceLabel}</p>
          </Link>
          <ProductCardQuickAdd productId={product.id} />
        </div>
      </div>
    </article>
  )
}
