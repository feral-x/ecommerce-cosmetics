import type { Product } from '@/entities/product'
import { loadMakeupCatalogBootstrap } from '@/entities/product/lib/load-makeup-catalog-bootstrap'
import { LandingHero } from '@/widgets/landing-hero'
import { LandingSections } from '@/widgets/landing-sections'

function pickArrivals(products: Product[]): Product[] {
  return products
    .filter(
      (p) =>
        p.availability === 'new-release' || p.availability === 'in-stock',
    )
    .slice(0, 5)
}

export async function LandingPage() {
  let featured: Product[] = []
  let arrivals: Product[] = []

  try {
    const bootstrap = await loadMakeupCatalogBootstrap()
    featured = bootstrap.products.slice(0, 3)
    arrivals = pickArrivals(bootstrap.products)
  } catch (err) {
    console.error('[landing] catalog unavailable:', err)
  }

  return (
    <main className="flex flex-1 flex-col">
      <LandingHero featuredProducts={featured} />
      <LandingSections arrivals={arrivals} />
    </main>
  )
}
