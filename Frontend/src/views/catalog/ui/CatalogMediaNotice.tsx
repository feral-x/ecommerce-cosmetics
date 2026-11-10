'use client'

import { useEffect, useState } from 'react'
import type { CatalogMediaMeta } from '@/shared/api/catalog-media'
import { MAKEUP_API_PRODUCTS_URL } from '@/shared/api/makeup/makeup-pool'

type CatalogMediaNoticeProps = {
  media?: CatalogMediaMeta
}

export function CatalogMediaNotice({ media }: CatalogMediaNoticeProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted || !media || media.source === 'local') return null

  if (media.source === 'makeup-api') {
    return (
      <p className="catalog-media-notice" role="note">
        Product photos from{' '}
        <a href={MAKEUP_API_PRODUCTS_URL} target="_blank" rel="noreferrer">
          Makeup API
        </a>{' '}
        ({media.poolSize} items in pool) · cached until{' '}
        {new Date(media.cachedUntil).toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>
    )
  }

  return (
    <p className="catalog-media-notice" role="note">
      Product photos from{' '}
      <a
        href="https://unsplash.com/s/photos/beauty-products"
        target="_blank"
        rel="noreferrer"
      >
        Unsplash
      </a>{' '}
      ({media.query}) · cached until{' '}
      {new Date(media.cachedUntil).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      })}
    </p>
  )
}
