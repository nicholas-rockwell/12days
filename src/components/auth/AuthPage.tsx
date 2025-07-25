'use client'

import { Authenticator } from '@aws-amplify/ui-react'
import { useState } from 'react'

export function AuthPage() {
  const [adminCode, setAdminCode] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-green-600 to-blue-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Christmas-themed header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🎄 12Days 🎄
          </h1>
          <p className="text-xl text-green-100">
            Your Seasonal Challenge Adventure
          </p>
          <div className="mt-4 text-yellow-300">
            ❄️ ⭐ 🎁 ⭐ ❄️
          </div>
        </div>

        {/* Authenticator with custom styling */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <Authenticator
            hideSignUp={false}
            loginMechanisms={['email']}
            signUpAttributes={['nickname']}
            formFields={{
              signUp: {
                nickname: {
                  label: 'Display Name',
                  placeholder: 'Enter your display name',
                  required: true,
                },
              },
            }}
          >
            {({ signOut, user }) => (
              <div className="text-center">
                <p className="text-white mb-4">Welcome, {user?.username}!</p>
                <button
                  onClick={signOut}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </Authenticator>
        </div>

        {/* Admin code section */}
        <div className="mt-6 bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
          <h3 className="text-white font-semibold mb-2">Have an Admin Code?</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              placeholder="Enter admin code"
              className="flex-1 px-3 py-2 rounded-md bg-white/20 text-white placeholder-white/60 border border-white/30"
            />
            <button
              onClick={() => {
                // TODO: Store admin code for later use
                console.log('Admin code:', adminCode)
              }}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Apply
            </button>
          </div>
          <p className="text-green-100 text-sm mt-2">
            Admin codes provide free access to the game
          </p>
        </div>

        {/* Snowfall effect */}
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="snowflake text-white text-2xl absolute"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              ❄️
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
