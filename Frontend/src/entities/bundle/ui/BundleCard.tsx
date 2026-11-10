'use client'

import Image from 'next/image'
import Link from 'next/link'
import { isRemoteProductImage } from '@/entities/product/lib/is-remote-product-image'
import type { EnrichedBundle } from '../lib/enrich-bundle'
import { BundleAddButton } from './BundleAddButton'

type BundleCardProps = {
  bundle: EnrichedBundle
}

function formatUsd(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)
}

export function BundleCard({ bundle }: BundleCardProps) {
  const href = `/bundles/${bundle.id}`
  const mosaicMod =
    bundle.items.length === 3
      ? 'bundle-card__mosaic--three'
      : 'bundle-card__mosaic--four'

  return (
    <article className="bundle-card">
      <div className="bundle-card__layout">
        <Link
          href={href}
          className={`bundle-card__mosaic ${mosaicMod}`}
          aria-label={bundle.title}
        >
          <span className="bundle-card__save bundle-save-badge">
            Save {bundle.savePercent}%
          </span>
          {bundle.items.map((item) => (
            <span key={item.productId} className="bundle-card__tile">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt=""
                  fill
                  sizes="(max-width: 767px) 40vw, 7rem"
                  className="bundle-card__tile-image"
                  unoptimized={isRemoteProductImage(item.imageUrl)}
                />
              ) : (
                <span className="bundle-card__tile-fallback" aria-hidden>
                  ·
                </span>
              )}
            </span>
          ))}
        </Link>

        <div className="bundle-card__body">
          <div className="bundle-card__copy">
            <p className="bundle-card__brand">{bundle.brandLabel}</p>
            <h2 className="bundle-card__title">
              <Link href={href}>{bundle.title}</Link>
            </h2>
            <p className="bundle-card__summary">{bundle.summary}</p>
            <p className="bundle-card__description">{bundle.description}</p>
          </div>

          <div className="bundle-card__footer">
            <p className="bundle-card__more">
              <Link href={href}>See what&apos;s inside</Link>
            </p>
            <div className="bundle-card__aside">
              <p className="bundle-card__prices">
                <span className="bundle-card__price">{formatUsd(bundle.price)}</span>
                <span className="bundle-card__compare">
                  {formatUsd(bundle.compareAtPrice)}
                </span>
              </p>
              <BundleAddButton bundle={bundle} />
              <Link href={href} className="bundle-card__details-link">
                Bundle details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
