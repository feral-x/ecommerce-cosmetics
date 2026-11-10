import type { Metadata } from 'next'
import { AccountPageView } from '@/views/account'

export const metadata: Metadata = {
  title: 'Account',
}

export default function AccountPage() {
  return <AccountPageView />
}
