'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useId, useState } from 'react'
import {
  isMainNavLinkActive,
  mainNavLinks,
} from '@/shared/lib/catalog-search-params'
import { CloseIcon, MenuIcon } from '@/shared/ui/Icons'

export function HeaderMobileMenu() {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const catalogSearch = searchParams.toString()
  const navSearch =
    pathname === '/catalog' && catalogSearch ? `?${catalogSearch}` : ''

  useEffect(() => {
    setOpen(false)
  }, [pathname, catalogSearch])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="header-mobile-menu lg:hidden">
      <button
        type="button"
        className="header-mobile-menu__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <CloseIcon size="md" /> : <MenuIcon size="md" />}
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="mobile-sheet-backdrop"
            aria-label="Dismiss navigation menu"
            onClick={() => setOpen(false)}
          />
          <nav
            id={panelId}
            className="mobile-nav-sheet"
            aria-label="Main"
            role="dialog"
            aria-modal="true"
          >
            <p className="mobile-nav-sheet__eyebrow">Navigate</p>
            <ul className="mobile-nav-sheet__list">
              <li>
                <Link
                  href="/"
                  className="mobile-nav-sheet__link"
                  onClick={() => setOpen(false)}
                >
                  Home
                </Link>
              </li>
              {mainNavLinks.map(({ id, label, href }) => {
                const active = isMainNavLinkActive(id, pathname, navSearch)
                return (
                  <li key={id}>
                    <Link
                      href={href}
                      className={[
                        'mobile-nav-sheet__link',
                        active ? 'mobile-nav-sheet__link--active' : '',
                      ].join(' ')}
                      onClick={() => setOpen(false)}
                    >
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </>
      ) : null}
    </div>
  )
}
