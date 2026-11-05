import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { StubPage } from './StubPage'

describe('StubPage', () => {
  it.each([
    ['/search', 'Search'],
    ['/cart', 'Cart'],
    ['/account', 'Account'],
  ])('renders coming soon for %s', (path, title) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <StubPage />
      </MemoryRouter>,
    )
    expect(screen.getByText('Coming soon')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/')
  })
})
