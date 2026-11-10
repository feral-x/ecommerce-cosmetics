import { loadMakeupCatalogBootstrap } from '@/entities/product/lib/load-makeup-catalog-bootstrap'
import type { CatalogBootstrap } from '@/entities/product/api/catalog-bootstrap'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const body: CatalogBootstrap = await loadMakeupCatalogBootstrap()
    return Response.json(body, {
      headers: {
        'Cache-Control': 'private, max-age=0, must-revalidate',
      },
    })
  } catch (err) {
    console.error('[catalog/bootstrap] Makeup API failed:', err)
    return Response.json(
      { error: 'Catalog unavailable' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
