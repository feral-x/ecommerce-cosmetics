import type { CatalogMediaMeta } from '@/shared/api/catalog-media'
import type { Product } from '../model/types'

const SNAPSHOT_KEY = 'hanami-catalog-snapshot-v4'
const SNAPSHOT_TTL_MS = 30 * 60 * 1000

type SnapshotPayload = {
  expiresAt: number
  products: Product[]
  media?: CatalogMediaMeta
}

let memorySnapshot: SnapshotPayload | null = null

function readSessionSnapshot(): SnapshotPayload | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(SNAPSHOT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SnapshotPayload
    if (Date.now() > parsed.expiresAt) {
      window.sessionStorage.removeItem(SNAPSHOT_KEY)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function writeSessionSnapshot(payload: SnapshotPayload) {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(SNAPSHOT_KEY, JSON.stringify(payload))
}

export function getCatalogProductSnapshot(): Product[] | null {
  const active = memorySnapshot ?? readSessionSnapshot()
  if (!active) return null
  if (Date.now() > active.expiresAt) {
    memorySnapshot = null
    return null
  }
  return active.products
}

export function getCatalogMediaMeta(): CatalogMediaMeta | null {
  const active = memorySnapshot ?? readSessionSnapshot()
  return active?.media ?? null
}

export function setCatalogProductSnapshot(
  products: Product[],
  media?: CatalogMediaMeta,
) {
  const payload: SnapshotPayload = {
    expiresAt: Date.now() + SNAPSHOT_TTL_MS,
    products,
    media,
  }
  memorySnapshot = payload
  writeSessionSnapshot(payload)
}

export function resolveProductById(id: string): Product | undefined {
  const snapshot = getCatalogProductSnapshot()
  if (!snapshot) return undefined
  return snapshot.find((p) => p.id === id)
}

export function resolveProductList(): Product[] {
  return getCatalogProductSnapshot() ?? []
}

function hydrateSnapshotFromSession() {
  if (typeof window === 'undefined') return
  const snap = readSessionSnapshot()
  if (snap) memorySnapshot = snap
}

hydrateSnapshotFromSession()
