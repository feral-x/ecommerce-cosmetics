import Link from 'next/link'
import { ProductCard, type Product } from '@/entities/product'
import { ArrowRightIcon } from '@/shared/ui/Icons'

const ritualSteps = [
  {
    step: '01',
    title: 'Cleanse',
    copy: 'Oil and gentle wash without stripping the barrier.',
    href: '/catalog?format=Cleanser',
  },
  {
    step: '02',
    title: 'Prep & essence',
    copy: 'Hydrating lotions and iconic Japanese essences.',
    href: '/catalog?format=Essence',
  },
  {
    step: '03',
    title: 'Treat',
    copy: 'Serums and creams targeted to your skin.',
    href: '/catalog?format=Serum',
  },
  {
    step: '04',
    title: 'Protect',
    copy: 'SPF50+ filters you will actually enjoy wearing.',
    href: '/catalog?format=Sunscreen',
  },
] as const

const concerns = [
  { label: 'New arrivals', href: '/catalog?availability=new-release' },
  { label: 'Sun care', href: '/catalog?category=Sun%20Care' },
  { label: 'Fragrance-free', href: '/catalog' },
  { label: 'Sensitive skin', href: '/catalog' },
  { label: 'Makeup', href: '/catalog?category=Makeup' },
  { label: 'Bundles', href: '/bundles' },
] as const

const houses = [
  'Shiseido',
  'SK-II',
  'Clé de Peau Beauté',
  'SUQQU',
  'ADDICTION',
  'ANESSA',
  'Hada Labo',
  'FANCL',
] as const

type LandingSectionsProps = {
  arrivals: Product[]
}

export function LandingSections({ arrivals }: LandingSectionsProps) {
  return (
    <>
      <section className="landing-brands" aria-label="Featured houses">
        <div className="container mx-auto px-4 lg:px-6">
          <p className="landing-brands__label">Curated Japanese houses</p>
          <ul className="landing-brands__list">
            {houses.map((name) => (
              <li key={name}>
                <span className="landing-brands__item">{name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="landing-ritual" aria-labelledby="landing-ritual-title">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="landing-section-head">
            <p className="landing-eyebrow">The ritual</p>
            <h2 id="landing-ritual-title" className="landing-section-title">
              Four steps, one calm routine
            </h2>
            <p className="landing-section-lead">
              Inspired by J-Beauty counter logic: layer slowly, protect daily,
              choose texture over hype.
            </p>
          </div>
          <ol className="landing-ritual__steps">
            {ritualSteps.map(({ step, title, copy, href }) => (
              <li key={step} className="landing-ritual__step">
                <span className="landing-ritual__index">{step}</span>
                <h3 className="landing-ritual__name">{title}</h3>
                <p className="landing-ritual__copy">{copy}</p>
                <Link href={href} className="landing-text-link">
                  Shop step
                  <ArrowRightIcon size="sm" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        className="landing-arrivals"
        aria-labelledby="landing-arrivals-title"
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="landing-arrivals__head">
            <div>
              <p className="landing-eyebrow">Just landed</p>
              <h2 id="landing-arrivals-title" className="landing-section-title">
                New &amp; notable
              </h2>
            </div>
            <Link
              href="/catalog?availability=new-release"
              className="landing-text-link"
            >
              View all
              <ArrowRightIcon size="sm" />
            </Link>
          </div>

          <ul className="landing-arrivals__grid">
            {arrivals.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="landing-concerns" aria-labelledby="landing-concerns-title">
        <div className="container mx-auto px-4 lg:px-6">
          <p className="landing-eyebrow">Discover</p>
          <h2 id="landing-concerns-title" className="landing-section-title">
            Start with what you need
          </h2>
          <ul className="landing-concerns__grid">
            {concerns.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className="landing-concern-card">
                  <span>{label}</span>
                  <ArrowRightIcon size="sm" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="landing-promise" aria-labelledby="landing-promise-title">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="landing-promise__panel">
            <p className="landing-eyebrow">Hanami promise</p>
            <h2 id="landing-promise-title" className="landing-promise__title">
              Authentic products. Thoughtful curation. Skin-first, always.
            </h2>
            <p className="landing-promise__copy">
              We focus on official Japanese formulas, clear ingredient stories,
              and textures that feel as good as they look — the quiet luxury of
              a Tokyo beauty hall, online.
            </p>
            <Link href="/catalog" className="landing-cta-primary">
              Enter the shop
              <ArrowRightIcon size="sm" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
