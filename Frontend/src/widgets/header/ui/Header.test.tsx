import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Header } from './Header'

function renderHeader(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Header />
    </MemoryRouter>,
  )
}

describe('Header', () => {
  it('links utility actions to stub routes', () => {
    renderHeader('/')

    expect(screen.getByRole('link', { name: 'Search' })).toHaveAttribute('href', '/search')
    expect(screen.getByRole('link', { name: 'Cart' })).toHaveAttribute('href', '/cart')
    expect(screen.getByRole('link', { name: 'Account' })).toHaveAttribute('href', '/account')
  })

  it('marks New Releases active on catalog preset URL', () => {
    renderHeader('/catalog?availability=new-release')

    const link = screen.getByRole('link', { name: 'New Releases' })
    expect(link.className).toContain('nav-link--active')
    expect(screen.getByRole('link', { name: 'Browse Figures' }).className).not.toContain(
      'nav-link--active',
    )
  })

  it('marks Browse Figures active on clean catalog URL', () => {
    renderHeader('/catalog')

    expect(screen.getByRole('link', { name: 'Browse Figures' }).className).toContain(
      'nav-link--active',
    )
  })
})
