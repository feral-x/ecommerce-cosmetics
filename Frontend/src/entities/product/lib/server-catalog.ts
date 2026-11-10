import type { Product } from '../model/types'
import { loadMakeupCatalogBootstrap } from './load-makeup-catalog-bootstrap'

export async function getServerCatalogProducts(): Promise<Product[]> {
  const bootstrap = await loadMakeupCatalogBootstrap()
  return bootstrap.products
}

export async function getServerProductById(
  id: string,
): Promise<Product | undefined> {
  const products = await getServerCatalogProducts()
  return products.find((product) => product.id === id)
}

export async function getServerProductIds(): Promise<string[]> {
  const products = await getServerCatalogProducts()
  return products.map((product) => product.id)
}
