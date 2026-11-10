'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { CartProvider } from '@/entities/cart'
import { CatalogBootstrapWarmup } from '@/entities/product/ui/CatalogBootstrapWarmup'
import { getQueryClient } from '@/shared/lib/query-client'

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(getQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <CatalogBootstrapWarmup />
      <CartProvider>{children}</CartProvider>
    </QueryClientProvider>
  )
}
