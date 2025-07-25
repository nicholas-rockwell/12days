'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuthenticator } from '@aws-amplify/ui-react'

export interface Game {
  gameId: string
  gameName: string
  year: number
  startDate: string
  adminMode: boolean
  adminUserId?: string
  inviteCode: string
  participantCount: number
  userRole: 'participant' | 'admin'
  subscriptionStatus: 'trial' | 'paid' | 'free_access' | 'pending_payment'
  joinedLate: boolean
  catchUpWindow?: string
}

export interface UserProfile {
  userId: string
  nickname: string
  nameplateStyle: string
  points: number
  bonusPoints: number
  rank: number
  jinglebells: number
  cosmetics: Record<string, any>
  challengeStatus: Record<string, string>
  submissionData: Record<string, any>
}

interface GameContextType {
  // Current game state
  currentGame: Game | null
  setCurrentGame: (game: Game | null) => void
  
  // User's games
  userGames: Game[]
  setUserGames: (games: Game[]) => void
  
  // User profile
  userProfile: UserProfile | null
  setUserProfile: (profile: UserProfile | null) => void
  
  // App state
  loading: boolean
  setLoading: (loading: boolean) => void
  
  // Functions
  refreshUserGames: () => Promise<void>
  refreshUserProfile: () => Promise<void>
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthenticator((context) => [context.user])
  
  const [currentGame, setCurrentGame] = useState<Game | null>(null)
  const [userGames, setUserGames] = useState<Game[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUserGames = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      // TODO: Call API to get user's games
      // const response = await API.get('TwelveDaysAPI', '/user-games', {})
      // setUserGames(response.games)
      
      // Mock data for now
      setUserGames([
        {
          gameId: 'GAME_DEMO123',
          gameName: 'Family Christmas 2025',
          year: 2025,
          startDate: '2025-12-13',
          adminMode: false,
          inviteCode: 'FAM2025',
          participantCount: 8,
          userRole: 'participant',
          subscriptionStatus: 'trial',
          joinedLate: false
        }
      ])
    } catch (error) {
      console.error('Error fetching user games:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshUserProfile = async () => {
    if (!user || !currentGame) return
    
    try {
      // TODO: Call API to get user profile for current game
      // const response = await API.get('TwelveDaysAPI', `/game-profile/${currentGame.gameId}`, {})
      // setUserProfile(response.profile)
      
      // Mock data for now
      setUserProfile({
        userId: user.username || 'USER',
        nickname: user.username || 'Player',
        nameplateStyle: 'default',
        points: 150,
        bonusPoints: 25,
        rank: 3,
        jinglebells: 275,
        cosmetics: {},
        challengeStatus: {
          'day1': 'completed',
          'day2': 'completed',
          'day3': 'missed'
        },
        submissionData: {}
      })
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  useEffect(() => {
    if (user) {
      refreshUserGames()
    }
  }, [user])

  useEffect(() => {
    if (currentGame) {
      refreshUserProfile()
    }
  }, [currentGame])

  const value: GameContextType = {
    currentGame,
    setCurrentGame,
    userGames,
    setUserGames,
    userProfile,
    setUserProfile,
    loading,
    setLoading,
    refreshUserGames,
    refreshUserProfile
  }

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}
