import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '@/app/layouts/MainLayout'
import { CatalogPage } from '@/pages/catalog'
import { LandingPage } from '@/pages/landing'
import { StubPage } from '@/pages/stub'

const stubRoutes = ['search', 'cart', 'account'] as const

export const appRoutes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'catalog',
        element: <CatalogPage />,
      },
      ...stubRoutes.map((segment) => ({
        path: segment,
        element: <StubPage />,
      })),
    ],
  },
]

export const router = createBrowserRouter(appRoutes)
