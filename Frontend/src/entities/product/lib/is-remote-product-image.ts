export function isRemoteProductImage(src: string): boolean {
  return /^https?:\/\//i.test(src)
}
