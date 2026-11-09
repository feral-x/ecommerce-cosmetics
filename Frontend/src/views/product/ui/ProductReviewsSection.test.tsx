import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ProductReviewsSection } from './ProductReviewsSection'

describe('ProductReviewsSection', () => {
  it('filters reviews when a star row is clicked', async () => {
    const user = userEvent.setup()
    render(<ProductReviewsSection productId="3" />)

    const filterFiveStar = screen.getByRole('button', {
      name: /^5 stars,/,
    })
    await user.click(filterFiveStar)

    expect(screen.getByText(/Showing 5-star reviews/i)).toBeInTheDocument()

    await user.click(filterFiveStar)
    expect(screen.getByText(/Showing recent reviews/i)).toBeInTheDocument()
  })
})
