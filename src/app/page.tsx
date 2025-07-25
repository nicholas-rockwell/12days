'use client'

import { useAuthenticator } from '@aws-amplify/ui-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { AuthPage } from '@/components/auth/AuthPage'
import { Dashboard } from '@/components/dashboard/Dashboard'

export default function HomePage() {
  const { user, signOut } = useAuthenticator((context) => [context.user])
  const router = useRouter()

  if (!user) {
    return <AuthPage />
  }

  return <Dashboard />
}
