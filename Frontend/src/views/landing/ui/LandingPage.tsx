import { mockProducts } from '@/entities/product'
import { LandingHero } from '@/widgets/landing-hero'
import { LandingSections } from '@/widgets/landing-sections'

export function LandingPage() {
  const arrivals = mockProducts
    .filter(
      (p) =>
        p.availability === 'new-release' || p.availability === 'in-stock',
    )
    .slice(0, 5)

  return (
    <main className="flex flex-1 flex-col">
      <LandingHero />
      <LandingSections arrivals={arrivals} />
    </main>
  )
}
