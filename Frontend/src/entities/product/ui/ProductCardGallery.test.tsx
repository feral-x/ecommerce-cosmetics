import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ProductCardGallery } from './ProductCardGallery'

describe('ProductCardGallery', () => {
  it('renders only first image in dom initially', () => {
    render(
      <ProductCardGallery
        productId="t1"
        productName="Test"
        images={[
          '/mock/cosmetics/01.jpg',
          '/mock/cosmetics/02.jpg',
          '/mock/cosmetics/03.jpg',
        ]}
      />,
    )

    expect(screen.getByLabelText(/test photos, 3 images/i)).toBeInTheDocument()
    expect(document.querySelectorAll('img')).toHaveLength(1)
  })

  it('preloads next image on hover', async () => {
    const user = userEvent.setup()
    const preloadSpy = vi.spyOn(window, 'Image').mockImplementation(function ImageMock() {
      return {} as HTMLImageElement
    })

    render(
      <ProductCardGallery
        productId="t2"
        productName="Hover"
        images={['/mock/cosmetics/01.jpg', '/mock/cosmetics/02.jpg']}
      />,
    )

    await user.hover(screen.getByLabelText(/hover photos/i))

    expect(preloadSpy).toHaveBeenCalled()
    preloadSpy.mockRestore()
  })
})
