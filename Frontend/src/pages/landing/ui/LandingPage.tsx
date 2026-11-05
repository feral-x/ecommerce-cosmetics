import { LandingHero } from '@/widgets/landing-hero'

export function LandingPage() {
  return (
    <main className="flex min-h-0 flex-1 flex-col lg:h-[calc(100svh-5rem)] lg:overflow-hidden">
      <LandingHero />
    </main>
  )
}
