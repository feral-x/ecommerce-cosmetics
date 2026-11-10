export type UnsplashPhotoUrls = {
  raw: string
  full: string
  regular: string
  small: string
  thumb: string
}

export type UnsplashPhotoUser = {
  name: string
  links: { html: string }
}

export type UnsplashPhoto = {
  id: string
  alt_description: string | null
  description: string | null
  urls: UnsplashPhotoUrls
  user: UnsplashPhotoUser
  links: { html: string }
}

export type UnsplashSearchResponse = {
  total: number
  results: UnsplashPhoto[]
}
