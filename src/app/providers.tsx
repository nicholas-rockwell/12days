'use client'

import { Amplify } from 'aws-amplify'
import { Authenticator } from '@aws-amplify/ui-react'
import { GameProvider } from '@/contexts/GameContext'
import '@aws-amplify/ui-react/styles.css'

// Configure Amplify (this will be populated when you run amplify generate)
Amplify.configure({
  Auth: {
    Cognito: {
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-west-2',
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || '',
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || '',
    }
  },
  API: {
    REST: {
      TwelveDaysAPI: {
        endpoint: process.env.NEXT_PUBLIC_API_ENDPOINT || '',
        region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-west-2',
      }
    }
  },
  Storage: {
    S3: {
      bucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET || '',
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-west-2',
    }
  }
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Authenticator.Provider>
      <GameProvider>
        {children}
      </GameProvider>
    </Authenticator.Provider>
  )
}
