'use client'

import Image from 'next/image'
import Link from 'next/link'
import { getProductById } from '@/entities/product'
import { BundleAddButton, type EnrichedBundle } from '@/entities/bundle'

type BundleDetailPageViewProps = {
  bundle: EnrichedBundle
}

function formatUsd(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)
}

export function BundleDetailPageView({ bundle }: BundleDetailPageViewProps) {
  return (
    <div className="bundle-detail">
      <div className="container mx-auto px-4 py-8 lg:px-6 lg:py-10">
        <nav className="product-detail__crumb" aria-label="Breadcrumb">
          <Link href="/bundles">Bundles</Link>
          <span aria-hidden> / </span>
          <span>{bundle.title}</span>
        </nav>

        <div className="bundle-detail__mosaic" aria-label="Items in this bundle">
          {bundle.items.map((item) => (
            <div key={item.productId} className="bundle-detail__tile">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 45vw, 15vw"
                  className="bundle-detail__tile-image"
                />
              ) : null}
            </div>
          ))}
        </div>

        <div className="bundle-detail__layout">
          <div className="bundle-detail__main">
            <p className="bundle-detail__brand">{bundle.brandLabel}</p>
            <h1 className="bundle-detail__title font-display">{bundle.title}</h1>
            <p className="bundle-detail__summary">{bundle.summary}</p>
            <div className="bundle-detail__description">
              <p>{bundle.description}</p>
            </div>

            <section className="bundle-detail__items" aria-labelledby="bundle-items-heading">
              <h2 id="bundle-items-heading" className="bundle-detail__items-title">
                What&apos;s inside
              </h2>
              <ul className="bundle-detail__item-list">
                {bundle.items.map((item) => {
                  const product = getProductById(item.productId)
                  return (
                    <li key={item.productId} className="bundle-detail-item">
                      <div className="bundle-detail-item__media">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt=""
                            width={102}
                            height={102}
                            className="bundle-detail-item__image"
                          />
                        ) : null}
                      </div>
                      <div className="bundle-detail-item__body">
                        <h3 className="bundle-detail-item__label">{item.label}</h3>
                        <p className="bundle-detail-item__text">{item.description}</p>
                        {product && (
                          <p className="bundle-detail-item__product-link">
                            <Link href={`/product/${product.id}`}>
                              View {product.brand} — {product.shortDescription}
                            </Link>
                          </p>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>
          </div>

          <aside className="bundle-detail__buy">
            <p className="bundle-detail__save bundle-save-badge bundle-detail__save-badge">
              Save {bundle.savePercent}%
            </p>
            <p className="bundle-detail__prices">
              <span className="bundle-detail__price">{formatUsd(bundle.price)}</span>
              <span className="bundle-detail__compare">
                {formatUsd(bundle.compareAtPrice)}
              </span>
            </p>
            <p className="bundle-detail__buy-note">
              Adds all set items to your cart as one bundle purchase.
            </p>
            <BundleAddButton bundle={bundle} className="bundle-detail__add" />
          </aside>
        </div>
      </div>
    </div>
  )
}
