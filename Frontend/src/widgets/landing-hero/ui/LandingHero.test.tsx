import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { LandingHero } from './LandingHero'

describe('LandingHero', () => {
  it('links primary CTAs to catalog routes', () => {
    render(
      <MemoryRouter>
        <LandingHero />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /explore collection/i })).toHaveAttribute(
      'href',
      '/catalog',
    )
    expect(screen.getByRole('link', { name: /browse pre-orders/i })).toHaveAttribute(
      'href',
      '/catalog?availability=pre-order',
    )
  })
})
