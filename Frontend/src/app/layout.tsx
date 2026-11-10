import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Suspense } from 'react'
import { Header } from '@/widgets/header'
import { fontClassNames } from './fonts'
import { AppProviders } from './providers'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: {
    default: 'Hanami J-Beauty',
    template: '%s · Hanami',
  },
  description:
    'Authentic Japanese cosmetics — skincare, makeup, sun care, and rituals from trusted brands.',
}

function HeaderFallback() {
  return <header className="h-20 border-b border-border-subtle" aria-hidden />
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={fontClassNames}>
      <body>
        <AppProviders>
          <div className="flex min-h-svh flex-col bg-bg">
            <Suspense fallback={<HeaderFallback />}>
              <Header />
            </Suspense>
            <div className="flex min-h-0 flex-1 flex-col">{children}</div>
          </div>
        </AppProviders>
      </body>
    </html>
  )
}
