'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@/shared/ui/Icons'
import { preloadImage } from '../lib/product-image-urls'
import { isRemoteProductImage } from '../lib/is-remote-product-image'

const SLIDE_INTERVAL_MS = 4_200
const FADE_MS = 700
const MANUAL_PAUSE_MS = 12_000

type ProductDetailGalleryProps = {
  productId: string
  productName: string
  images: string[]
}

export function ProductDetailGallery({
  productId,
  productName,
  images,
}: ProductDetailGalleryProps) {
  const [slideSrc, setSlideSrc] = useState<string[]>(() =>
    images.length > 0 ? images : [],
  )
  const slides = slideSrc.length > 0 ? slideSrc : []
  const [activeIndex, setActiveIndex] = useState(0)
  const [loadedCount, setLoadedCount] = useState(1)
  const [reduceMotion, setReduceMotion] = useState(false)
  const pauseUntilRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const slidesRef = useRef(slides)
  slidesRef.current = slides

  useEffect(() => {
    setSlideSrc(images.length > 0 ? images : [])
    setActiveIndex(0)
    setLoadedCount(1)
  }, [images, productId])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const onChange = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const requestSlideLoad = useCallback((index: number) => {
    const list = slidesRef.current
    if (index < 0 || index >= list.length) return
    setLoadedCount((prev) => Math.max(prev, index + 1))
    void preloadImage(list[index]!)
  }, [])

  const advanceSlide = useCallback(() => {
    if (Date.now() < pauseUntilRef.current) return
    if (slidesRef.current.length <= 1) return

    setActiveIndex((prev) => {
      const next = (prev + 1) % slidesRef.current.length
      requestSlideLoad(next)
      requestSlideLoad((next + 1) % slidesRef.current.length)
      return next
    })
  }, [requestSlideLoad])

  const clearIntervalRef = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    if (slides.length <= 1 || reduceMotion) {
      clearIntervalRef()
      return
    }

    requestSlideLoad(1)
    clearIntervalRef()
    intervalRef.current = setInterval(advanceSlide, SLIDE_INTERVAL_MS)
    return clearIntervalRef
  }, [advanceSlide, clearIntervalRef, reduceMotion, requestSlideLoad, slides.length])

  const goToSlide = useCallback(
    (index: number) => {
      if (slides.length === 0) return
      pauseUntilRef.current = Date.now() + MANUAL_PAUSE_MS
      const nextIndex = ((index % slides.length) + slides.length) % slides.length
      setActiveIndex(nextIndex)
      requestSlideLoad(nextIndex)
      requestSlideLoad((nextIndex + 1) % slides.length)
    },
    [requestSlideLoad, slides.length],
  )

  const goPrevious = useCallback(() => {
    goToSlide(activeIndex - 1)
  }, [activeIndex, goToSlide])

  const goNextManual = useCallback(() => {
    goToSlide(activeIndex + 1)
  }, [activeIndex, goToSlide])

  if (slides.length === 0) {
    return (
      <div className="product-detail-gallery product-detail-gallery--empty">
        <div className="product-detail-gallery__stage">
          <span className="product-detail-gallery__placeholder" aria-hidden>
            {productName.charAt(0)}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      className="product-detail-gallery"
      data-testid="product-detail-gallery"
    >
      <div className="product-detail-gallery__stage-wrap">
        <div
          className="product-detail-gallery__stage"
          role="region"
          aria-live="polite"
          aria-label={`${productName}, image ${activeIndex + 1} of ${slides.length}`}
        >
          {slides.slice(0, loadedCount).map((src, index) => (
            <Image
              key={`${productId}-${index}-${src}`}
              src={src}
              alt=""
              fill
              unoptimized={isRemoteProductImage(src)}
              sizes="(max-width: 1023px) 100vw, 50vw"
              className="product-detail-gallery__image product-detail-gallery__image--fade"
              priority={index === 0}
              loading={index === 0 ? 'eager' : 'lazy'}
              style={{
                ['--gallery-fade-ms' as string]: `${FADE_MS}ms`,
                opacity: index === activeIndex ? 1 : 0,
              }}
              onError={() => {}}
            />
          ))}
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              className="product-detail-gallery__nav product-detail-gallery__nav--prev"
              onClick={goPrevious}
              aria-label="Previous photo"
            >
              <ChevronLeftIcon size="sm" />
            </button>
            <button
              type="button"
              className="product-detail-gallery__nav product-detail-gallery__nav--next"
              onClick={goNextManual}
              aria-label="Next photo"
            >
              <ChevronRightIcon size="sm" />
            </button>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <ul
          className="product-detail-gallery__thumbs"
          role="tablist"
          aria-label={`${productName} photo thumbnails`}
        >
          {slides.map((src, index) => {
            const selected = index === activeIndex
            return (
              <li key={`${productId}-thumb-${src}`} role="presentation">
                <button
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-label={`Show photo ${index + 1}`}
                  className={
                    selected
                      ? 'product-detail-gallery__thumb is-active'
                      : 'product-detail-gallery__thumb'
                  }
                  onClick={() => goToSlide(index)}
                >
                  <Image
                    src={src}
                    alt=""
                    width={72}
                    height={72}
                    unoptimized={isRemoteProductImage(src)}
                    className="product-detail-gallery__thumb-image"
                    onError={() => {}}
                  />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
