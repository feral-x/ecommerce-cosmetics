import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ProductDetailGallery } from './ProductDetailGallery'

describe('ProductDetailGallery', () => {
  it('switches main image when thumbnail is clicked', async () => {
    const user = userEvent.setup()
    render(
      <ProductDetailGallery
        productId="42"
        productName="Test lotion"
        images={['/mock/cosmetics/01.jpg', '/mock/cosmetics/02.jpg']}
      />,
    )

    const region = screen.getByRole('region', { name: /image 1 of 2/i })
    expect(region).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Show photo 2' }))
    expect(
      screen.getByRole('region', { name: /image 2 of 2/i }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Previous photo' }))
    expect(
      screen.getByRole('region', { name: /image 1 of 2/i }),
    ).toBeInTheDocument()
  })
})
