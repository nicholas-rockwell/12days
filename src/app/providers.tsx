'use client'

import { Amplify } from 'aws-amplify'
import { Authenticator } from '@aws-amplify/ui-react'
import { GameProvider } from '@/contexts/GameContext'
import '@aws-amplify/ui-react/styles.css'

// Minimal Amplify configuration for frontend-only deployment
// This will be replaced with actual backend outputs when backend is deployed
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || 'us-west-2_placeholder',
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || 'placeholder',
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-west-2',
    }
  }
}

// Only configure Amplify if we have real environment variables
if (process.env.NEXT_PUBLIC_USER_POOL_ID && process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID) {
  Amplify.configure(amplifyConfig)
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Authenticator.Provider>
      <GameProvider>
        {children}
      </GameProvider>
    </Authenticator.Provider>
  )
}
