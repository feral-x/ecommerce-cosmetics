'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { preloadImage } from '../lib/product-image-urls'

const HOVER_INTERVAL_MS = 2_400
const FADE_MS = 1_200

type ProductCardGalleryProps = {
  productId: string
  productName: string
  images: string[]
  variant?: 'catalog' | 'featured'
  /** @deprecated use variant="catalog" */
  compact?: boolean
}

export function ProductCardGallery({
  productId,
  productName,
  images,
  variant,
  compact = false,
}: ProductCardGalleryProps) {
  const resolvedVariant = variant ?? (compact ? 'catalog' : 'featured')
  const isCatalog = resolvedVariant === 'catalog'
  const slides = images.length > 0 ? images : []
  const [activeIndex, setActiveIndex] = useState(0)
  const [loadedCount, setLoadedCount] = useState(1)
  const [isHovering, setIsHovering] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const readyIndicesRef = useRef(new Set<number>())
  const slidesRef = useRef(slides)
  slidesRef.current = slides

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const onChange = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const markImageReady = useCallback((index: number) => {
    readyIndicesRef.current.add(index)
  }, [])

  const requestSlideLoad = useCallback((index: number) => {
    const list = slidesRef.current
    if (index < 0 || index >= list.length) return
    if (readyIndicesRef.current.has(index)) return

    setLoadedCount((prev) => Math.max(prev, index + 1))
    void preloadImage(list[index]!).then(() => {
      readyIndicesRef.current.add(index)
    })
  }, [])

  const tryAdvanceSlide = useCallback(() => {
    setActiveIndex((prev) => {
      const list = slidesRef.current
      if (list.length <= 1) return prev

      const next = (prev + 1) % list.length
      if (!readyIndicesRef.current.has(next)) {
        requestSlideLoad(next)
        return prev
      }

      requestSlideLoad((next + 1) % list.length)
      return next
    })
  }, [requestSlideLoad])

  const clearHoverInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const onEnter = useCallback(() => {
    setIsHovering(true)
    if (slides.length <= 1 || reduceMotion) return

    requestSlideLoad(1)

    clearHoverInterval()
    intervalRef.current = setInterval(tryAdvanceSlide, HOVER_INTERVAL_MS)
  }, [
    clearHoverInterval,
    reduceMotion,
    requestSlideLoad,
    slides.length,
    tryAdvanceSlide,
  ])

  const onLeave = useCallback(() => {
    setIsHovering(false)
    clearHoverInterval()
    setActiveIndex(0)
  }, [clearHoverInterval])

  useEffect(() => () => clearHoverInterval(), [clearHoverInterval])

  if (slides.length === 0) {
    return (
      <div className="flex size-full items-center justify-center p-8">
        <span
          className={`text-primary-soft/25 select-none font-medium ${isCatalog ? 'text-3xl' : 'text-5xl'}`}
        >
          {productName.charAt(0)}
        </span>
      </div>
    )
  }

  return (
    <div
      className="product-card-gallery relative size-full"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      tabIndex={-1}
      aria-hidden={isCatalog}
      aria-label={
        isCatalog ? undefined : `${productName} photos, ${slides.length} images`
      }
    >
      {slides.slice(0, loadedCount).map((src, index) => (
        <Image
          key={`${productId}-${src}`}
          src={src}
          alt=""
          fill
          sizes={
            isCatalog
              ? '(max-width: 640px) 45vw, (max-width: 1280px) 20vw, 12vw'
              : '(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw'
          }
          className="object-cover object-center transition-opacity ease-in-out"
          style={{
            transitionDuration: `${FADE_MS}ms`,
            opacity: index === activeIndex ? 1 : 0,
          }}
          onLoad={() => markImageReady(index)}
        />
      ))}

      {slides.length > 1 && isHovering && !reduceMotion && (
        <div
          className={`product-card-gallery__dots ${isCatalog ? 'product-card-gallery__dots--catalog' : ''}`}
          aria-hidden
        >
          {slides.map((_, index) => (
            <span
              key={index}
              className={
                index === activeIndex
                  ? 'product-card-gallery__dot is-active'
                  : 'product-card-gallery__dot'
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
