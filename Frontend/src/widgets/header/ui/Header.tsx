import { Link, useLocation } from 'react-router-dom'
import logo from '@/shared/assets/logos/logo.png'
import { CartIcon, SearchIcon, UserIcon } from '@/shared/ui/Icons'
import {
  catalogNavLinks,
  isCatalogNavPresetActive,
} from '@/shared/lib/catalog-search-params'

export function Header() {
  const { pathname, search } = useLocation()

  return (
    <header className="relative z-20 border-b border-border-subtle">
      <div className="container mx-auto grid h-20 grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 lg:px-6">
        <Link
          to="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <img
            src={logo}
            alt=""
            className="size-12 object-contain"
            width={48}
            height={48}
          />
          <div className="hidden leading-snug sm:block">
            <span className="block text-base font-semibold uppercase tracking-normal text-text-primary sm:text-lg">
              FigurineArt
            </span>
            <span className="block text-[11px] font-medium uppercase tracking-[0.12em] text-text-secondary">
              Marketplace
            </span>
          </div>
        </Link>

        <nav className="hidden justify-center lg:flex" aria-label="Main">
          <ul className="flex list-none gap-1 xl:gap-2">
            {catalogNavLinks.map(({ preset, label, search: linkSearch }) => {
              const active = isCatalogNavPresetActive(preset, pathname, search)
              const to = `/catalog${linkSearch}`
              return (
                <li key={preset}>
                  <Link
                    to={to}
                    className={[
                      'nav-link text-xs font-medium uppercase tracking-[0.12em]',
                      active
                        ? 'nav-link--active text-primary-soft'
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
          <Link
            to="/search"
            className="text-text-secondary transition-colors hover:text-primary-soft"
            aria-label="Search"
          >
            <SearchIcon />
          </Link>
          <Link
            to="/cart"
            className="text-text-secondary transition-colors hover:text-primary-soft"
            aria-label="Cart"
          >
            <CartIcon />
          </Link>
          <Link
            to="/account"
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
