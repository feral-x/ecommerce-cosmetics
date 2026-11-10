'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  isMainNavLinkActive,
  mainNavLinks,
} from '@/shared/lib/catalog-search-params'
import { HeaderCartLink } from '@/entities/cart'
import { UserIcon } from '@/shared/ui/Icons'
import { HeaderMobileMenu } from './HeaderMobileMenu'
import { HeaderSearch } from './HeaderSearch'

export function Header() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const catalogSearch = searchParams.toString()
  const navSearch =
    pathname === '/catalog' && catalogSearch ? `?${catalogSearch}` : ''

  if (pathname === '/search') {
    return null
  }

  return (
    <header className="site-header relative z-20 overflow-visible border-b border-border-subtle">
      <div className="site-header__bar container mx-auto flex h-16 min-w-0 items-center justify-between gap-2 px-3 sm:px-4 lg:grid lg:h-20 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-4 lg:px-6">
        <div className="flex min-w-0 max-w-[58%] items-center gap-1.5 sm:max-w-none sm:gap-2">
          <HeaderMobileMenu />
          <Link
            href="/catalog"
            className="header-wordmark min-w-0 truncate"
            aria-label="Hanami J-Beauty, shop catalog"
          >
            <span className="header-wordmark__name font-display">Hanami</span>
            <span className="header-wordmark__tag">J-Beauty</span>
          </Link>
        </div>

        <nav className="header-desktop-nav hidden justify-center lg:flex" aria-label="Main">
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

        <div className="site-header__utilities flex shrink-0 items-center justify-end gap-4 lg:gap-6">
          <HeaderSearch />
          <HeaderCartLink />
          <Link
            href="/account"
            className="header-utility-btn text-text-secondary transition-colors hover:text-primary-soft"
            aria-label="Account"
          >
            <UserIcon />
          </Link>
        </div>
      </div>
    </header>
  )
}
