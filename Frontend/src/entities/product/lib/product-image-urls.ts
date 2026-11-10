/** @deprecated Remote catalog only — no local placeholder pool. */
export function buildProductImageUrls(_productId: string, _count: number): string[] {
  return []
}

/** true = загрузилось, false = 404/сеть (без throw — чтоб не ронять hover/preload). */
export function preloadImage(url: string): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(true)
  return new Promise((resolve) => {
    const img = new window.Image()
    img.decoding = 'async'
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
  })
}
