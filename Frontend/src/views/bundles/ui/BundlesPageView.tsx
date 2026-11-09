'use client'

import Link from 'next/link'
import { BundleCard, getAllBundles } from '@/entities/bundle'

export function BundlesPageView() {
  const bundles = getAllBundles()

  return (
    <div className="bundles-page">
      <div className="container mx-auto px-4 py-8 lg:px-6 lg:py-10">
        <header className="bundles-page__head">
          <p className="bundles-page__eyebrow">Curated value</p>
          <h1 className="bundles-page__title font-display">Bundles</h1>
          <p className="bundles-page__lead">
            Ready-made rituals and travel sets — priced below buying each piece
            on its own. No filters, just pick a set and go.
          </p>
          <p className="bundles-page__shop-link">
            <Link href="/catalog">Browse the full shop</Link>
          </p>
        </header>

        <ul className="bundles-page__grid">
          {bundles.map((bundle) => (
            <li key={bundle.id}>
              <BundleCard bundle={bundle} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
