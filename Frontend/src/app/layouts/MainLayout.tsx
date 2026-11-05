import { Outlet } from 'react-router-dom'
import { Header } from '@/widgets/header'

export function MainLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-bg">
      <Header />
      <div className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  )
}
