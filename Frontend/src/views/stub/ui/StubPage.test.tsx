import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StubPage } from './StubPage'

describe('StubPage', () => {
  it.each([
    ['Search'],
    ['Cart'],
    ['Account'],
  ])('renders coming soon for %s', (title) => {
    render(<StubPage title={title} />)
    expect(screen.getByText('Coming soon')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/')
  })
})
