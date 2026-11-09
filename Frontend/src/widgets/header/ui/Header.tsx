'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  isMainNavLinkActive,
  mainNavLinks,
} from '@/shared/lib/catalog-search-params'
import { HeaderCartLink } from '@/entities/cart'
import { UserIcon } from '@/shared/ui/Icons'
import { HeaderSearch } from './HeaderSearch'

export function Header() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const catalogSearch = searchParams.toString()
  const navSearch =
    pathname === '/catalog' && catalogSearch ? `?${catalogSearch}` : ''

  return (
    <header className="relative z-20 overflow-visible border-b border-border-subtle">
      <div className="container mx-auto grid h-20 grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 lg:px-6">
        <Link
          href="/"
          className="header-wordmark"
          aria-label="Hanami J-Beauty, home"
        >
          <span className="header-wordmark__name font-display">Hanami</span>
          <span className="header-wordmark__tag">J-Beauty</span>
        </Link>

        <nav className="hidden justify-center lg:flex" aria-label="Main">
          <ul className="flex list-none gap-1 xl:gap-2">
            {mainNavLinks.map(({ id, label, href }) => {
              const active = isMainNavLinkActive(id, pathname, navSearch)
              return (
                <li key={id}>
                  <Link
                    href={href}
                    className={[
                      'nav-link text-xs font-medium uppercase tracking-[0.12em]',
                      active
                        ? 'nav-link--active text-primary'
                        : 'text-text-secondary hover:text-text-primary',
                    ].join(' ')}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center justify-end gap-4 sm:gap-6">
          <HeaderSearch />
          <HeaderCartLink />
          <Link
            href="/account"
            className="text-text-secondary transition-colors hover:text-primary-soft"
            aria-label="Account"
          >
            <UserIcon />
          </Link>
        </div>
      </div>
    </header>
  )
}
