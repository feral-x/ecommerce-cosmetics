import type { Metadata } from 'next'
import { StubPage } from '@/views/stub'

export const metadata: Metadata = {
  title: 'Account',
}

export default function AccountPage() {
  return <StubPage title="Account" />
}
