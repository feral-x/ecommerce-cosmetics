const BUNDLE_LINE_PREFIX = 'bundle:'

export function bundleCartLineId(bundleId: string): string {
  return `${BUNDLE_LINE_PREFIX}${bundleId}`
}

export function isBundleCartLine(lineId: string): boolean {
  return lineId.startsWith(BUNDLE_LINE_PREFIX)
}

export function parseBundleIdFromCartLine(lineId: string): string | null {
  if (!isBundleCartLine(lineId)) return null
  return lineId.slice(BUNDLE_LINE_PREFIX.length)
}
