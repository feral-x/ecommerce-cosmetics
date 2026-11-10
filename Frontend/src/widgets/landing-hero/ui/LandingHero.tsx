import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/entities/product'
import { isRemoteProductImage } from '@/entities/product/lib/is-remote-product-image'
import { ArrowRightIcon } from '@/shared/ui/Icons'

type LandingHeroProps = {
  featuredProducts: Product[]
}

export function LandingHero({ featuredProducts }: LandingHeroProps) {
  return (
    <section className="landing-hero" aria-labelledby="landing-hero-title">
      <div className="landing-hero__glow" aria-hidden />
      <div className="landing-hero__inner container relative mx-auto grid gap-10 px-4 py-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-12 lg:px-6 lg:py-10">
        <div className="landing-hero__copy animate-fade-in-up">
          <p className="landing-eyebrow landing-eyebrow--hero">
            Hanami · J-Beauty
          </p>
          <h1
            id="landing-hero-title"
            className="landing-hero__title font-display"
          >
            Quiet luxury for skin that breathes.
          </h1>
          <p className="landing-hero__lead">
            Essences, serums, and sun care from Japan&apos;s most trusted
            houses — curated like a Ginza beauty hall, shoppable from home.
          </p>
          <div className="landing-hero__actions">
            <Link href="/catalog" className="landing-cta-primary">
              Shop the collection
              <ArrowRightIcon size="sm" />
            </Link>
            <Link
              href="/catalog?availability=new-release"
              className="landing-cta-ghost"
            >
              New arrivals
            </Link>
          </div>
          <dl className="landing-hero__stats">
            <div>
              <dt>Authenticity</dt>
              <dd>Official JP brands</dd>
            </div>
            <div>
              <dt>Ritual-first</dt>
              <dd>Texture-led formulas</dd>
            </div>
            <div>
              <dt>Protection</dt>
              <dd>SPF you&apos;ll wear daily</dd>
            </div>
          </dl>
        </div>

        <div
          className="landing-hero__mosaic animate-fade-in-up animation-delay-300"
          aria-label="Featured products"
        >
          {featuredProducts.map((product, index) => {
            const productHref = `/product/${product.id}`
            const brandHref = `/catalog?brand=${encodeURIComponent(product.brand)}`
            return (
              <figure
                key={product.id}
                className={`landing-hero__tile landing-hero__tile--${index + 1}`}
              >
                <Link
                  href={productHref}
                  className="landing-hero__tile-media landing-hero__tile-link"
                  aria-label={`${product.brand}, ${product.name}`}
                >
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]!}
                      alt=""
                      fill
                      unoptimized={isRemoteProductImage(product.images[0]!)}
                      sizes="(max-width: 1024px) 42vw, 22vw"
                      className="object-cover object-center"
                      priority={index === 0}
                    />
                  ) : null}
                </Link>
                <figcaption className="landing-hero__tile-caption">
                  <Link href={brandHref} className="landing-hero__tile-brand">
                    {product.brand}
                  </Link>
                  <Link href={productHref} className="landing-hero__tile-format">
                    {product.formatKey}
                  </Link>
                </figcaption>
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
