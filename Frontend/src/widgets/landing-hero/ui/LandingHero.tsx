import { Link } from 'react-router-dom'
import heroBg from '@/shared/assets/background/bg.jpg'
import {
  ArrowRightIcon,
  CalendarIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
} from '@/shared/ui/Icons'

const trustItems = [
  {
    icon: SparklesIcon,
    title: 'Premium Quality',
    subtitle: 'Official & Licensed',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Secure Collecting',
    subtitle: 'Authentic. Protected.',
  },
  {
    icon: StarIcon,
    title: 'For True Fans',
    subtitle: 'Curated. Exclusive. Elite.',
  },
] as const

export function LandingHero() {
  return (
    <section className="relative flex min-h-[calc(100svh-5rem)] flex-1 flex-col overflow-hidden lg:h-full lg:min-h-0">
      <div
        className="pointer-events-none absolute inset-0 lg:left-[38%]"
        aria-hidden
      >
        <img
          src={heroBg}
          alt=""
          className="size-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-r from-bg via-bg/95 to-bg/20 lg:from-bg lg:via-bg/80 lg:to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-bg via-transparent to-bg/40" />
      </div>

      <div className="container relative mx-auto flex min-h-0 flex-1 flex-col px-4 lg:h-full lg:px-6">
        <div className="flex flex-1 flex-col justify-center py-10 lg:py-6">
          <div className="max-w-xl animate-fade-in-up">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-soft">
              Premium Anime Figures
            </p>
            <h1 className="mt-6 font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              <span className="block text-text-primary">Own the Art.</span>
              <span className="mt-2 block text-primary-soft">
                Collect Beyond.
              </span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-text-secondary animate-fade-in-up animation-delay-150">
              Discover rare, exclusive, and high-quality anime figures from top
              brands and artists. Elevate your collection.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center animate-fade-in-up animation-delay-300">
              <Link
                to="/catalog"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-colors duration-200 hover:bg-primary-hover hover:shadow-[0_0_24px_rgb(124_58_237/0.45)]"
              >
                Explore Collection
                <ArrowRightIcon size="sm" className="text-white" />
              </Link>
              <Link
                to="/catalog?availability=pre-order"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border-subtle px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-text-primary transition-all duration-200 hover:border-primary-soft hover:bg-surface-elevated/50"
              >
                <CalendarIcon size="sm" />
                Browse Pre-Orders
              </Link>
            </div>
          </div>
        </div>

        <footer className="mt-auto shrink-0 pb-8 pt-4 lg:pb-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <ul className="grid max-w-2xl list-none gap-6 sm:grid-cols-3 sm:gap-4 animate-fade-in-up animation-delay-500">
              {trustItems.map(({ icon: Icon, title, subtitle }) => (
                <li key={title} className="flex gap-3">
                  <span className="text-primary">
                    <Icon size="md" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-primary">
                      {title}
                    </p>
                    <p className="mt-0.5 text-xs text-text-muted">{subtitle}</p>
                  </div>
                </li>
              ))}
            </ul>

            <aside
              className="w-full max-w-xs rounded-xl border border-border-subtle bg-surface-elevated/80 p-4 backdrop-blur-sm animate-fade-in-up animation-delay-700 lg:shrink-0"
              aria-label="Social proof"
            >
              <div className="flex items-start gap-3">
                <span className="rounded-lg bg-primary/20 p-2 text-primary">
                  <ShieldCheckIcon size="sm" />
                </span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-text-secondary">
                    Trusted by collectors worldwide
                  </p>
                  <div className="mt-2 flex gap-0.5 text-primary" aria-hidden>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} size="sm" className="fill-primary" />
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </footer>
      </div>
    </section>
  )
}
