'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../../amplify/data/resource'

// Generate the data client for GraphQL operations - with error handling
let client: any = null

const getClient = () => {
  if (!client) {
    try {
      client = generateClient<Schema>()
    } catch (error) {
      console.error('Failed to generate Amplify client:', error)
      return null
    }
  }
  return client
}

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
  rank?: number | string
  
  // Theme system support
  themeId: string
  themeHistory?: Array<{ themeId: string; timestamp: string; changedBy: string }>
  customThemeConfig?: Record<string, any>
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
    
    const amplifyClient = getClient()
    if (!amplifyClient) {
      console.error('Amplify client not available')
      return
    }
    
    setLoading(true)
    try {
      const userEmail = user.signInDetails?.loginId || user.username
      const games: Game[] = []
      const processedGameYears = new Set()
      
      // Search for games by multiple criteria to find all user records
      const searchQueries = [
        // Search by user_id matching current username
        amplifyClient.models.TwelveDaysUser.list({
          filter: {
            user_id: { eq: user.username }
          }
        }),
        // Search by cognito_email matching current user email
        amplifyClient.models.TwelveDaysUser.list({
          filter: {
            cognito_email: { eq: userEmail }
          }
        })
      ]
      
      // If email is different from username, also search by user_id = email
      if (userEmail !== user.username) {
        searchQueries.push(
          amplifyClient.models.TwelveDaysUser.list({
            filter: {
              user_id: { eq: userEmail }
            }
          })
        )
      }
      
      // Execute all search queries
      const searchResults = await Promise.allSettled(searchQueries)
      
      // Combine all results and deduplicate
      const allUserRecords: any[] = []
      const seenRecords = new Set()
      
      searchResults.forEach(result => {
        if (result.status === 'fulfilled' && result.value.data) {
          result.value.data.forEach((record: any) => {
            const key = `${record.PK}-${record.SK}`
            if (!seenRecords.has(key)) {
              seenRecords.add(key)
              allUserRecords.push(record)
            }
          })
        }
      })
      
      // Process each user record to build game objects
      for (const userRecord of allUserRecords) {
        const gameYear = userRecord.PK?.replace('GAME#', '') || ''
        
        // Avoid duplicate games for the same year
        if (processedGameYears.has(gameYear)) continue
        processedGameYears.add(gameYear)
        
        // Extract game ID from SK if present (format: USER#ALY, USER#NICHOLAS, etc.)
        const userId = userRecord.SK?.replace('USER#', '') || ''
        const gameId = `GAME_${gameYear}_${userId}`
        
        // Determine game name based on year
        let gameName = `Christmas ${gameYear}`
        if (gameYear === '2024') {
          gameName = 'Family Christmas 2024'
        }
        
        // Get all participants for this game year to calculate rank
        let userRank: number | undefined = undefined
        try {
          const allParticipantsResponse = await amplifyClient.models.TwelveDaysUser.list({
            filter: {
              PK: { eq: `GAME#${gameYear}` }
            }
          })
          
          // Calculate ranks by sorting participants by total points
          const participantsWithPoints = allParticipantsResponse.data
            .filter((participant: any) => participant && participant.user_id) // Filter out null records
            .map((participant: any) => ({
              userId: participant.user_id || '',
              points: (parseInt(String(participant.points || '0')) + parseInt(String(participant.bonus_points || '0'))),
              record: participant
            }))
            .sort((a: any, b: any) => b.points - a.points) // Sort by points descending
          
          // Find current user's rank
          const currentUserEmail = user.signInDetails?.loginId || user.username
          const userIndex = participantsWithPoints.findIndex((p: any) => 
            p.record.cognito_email === currentUserEmail || 
            p.record.user_id === user.username ||
            p.record.user_id === currentUserEmail
          )
          
          if (userIndex >= 0) {
            userRank = userIndex + 1 // Rank is 1-based
          }
          
        } catch (error) {
          console.error(`Error calculating rank for ${gameYear}:`, error)
        }
        
        // Create game object from available data
        const game: Game = {
          gameId: gameId,
          gameName: gameName,
          year: parseInt(gameYear),
          startDate: `${gameYear}-12-13`,
          adminMode: false, // Will determine from admin table later
          adminUserId: undefined,
          inviteCode: '', // Will get from game metadata
          participantCount: 1, // Will count later
          userRole: 'participant',
          subscriptionStatus: gameYear === '2024' ? 'paid' : 'trial',
          joinedLate: false,
          rank: userRank,
          
          // Theme system defaults
          themeId: 'christmas', // Default theme
          themeHistory: [],
          customThemeConfig: {}
        }
        
        games.push(game)
      }
      
      // Sort games by year (newest first)
      games.sort((a, b) => b.year - a.year)
      
      setUserGames(games)
    } catch (error) {
      console.error('Error fetching user games:', error)
      setUserGames([])
    } finally {
      setLoading(false)
    }
  }

  const refreshUserProfile = async () => {
    if (!user || !currentGame) return
    
    const amplifyClient = getClient()
    if (!amplifyClient) {
      console.error('Amplify client not available')
      return
    }
    
    try {
      // Get all users in this game to calculate proper rank
      const allUsersResponse = await amplifyClient.models.TwelveDaysUser.list({
        filter: {
          PK: { eq: `GAME#${currentGame.year}` }
        }
      })
      
      // Find the current user's data
      let userData = null
      const email = user.signInDetails?.loginId || user.username
      
      if (currentGame.year === 2024) {
        // For 2024 data, search by multiple possible user identifiers
        userData = allUsersResponse.data
          .filter((record: any) => record && record.cognito_email && record.user_id) // Filter out null records
          .find((record: any) => 
            record.cognito_email === email || 
            record.user_id === user.username ||
            record.user_id === email
          )
      } else {
        // For current year games, search by standard SK format
        userData = allUsersResponse.data
          .filter((record: any) => record && record.SK && record.user_id) // Filter out null records
          .find((record: any) => 
            record.SK === `USER#${user.username}`
          )
      }
      
      if (!userData) {
        setUserProfile(null)
        return
      }
      
      // Calculate ranks for all users
      const rankedUsers = allUsersResponse.data
        .filter((record: any) => record && record.user_id && record.points !== undefined) // Filter out null records
        .map((record: any) => {
          const points = parseInt(record.points?.toString() || '0')
          const bonusPoints = parseInt(record.bonus_points?.toString() || '0')
          const totalPoints = points + bonusPoints
          return {
            userId: record.user_id,
            totalPoints,
            record
          }
        })
        .sort((a: any, b: any) => b.totalPoints - a.totalPoints) // Sort by points descending
        .map((user: any, index: any) => ({
          ...user,
          rank: index + 1 // Assign rank based on position (1st = rank 1, last = rank N)
        }))
      
      // Find the current user's rank
      const currentUserRanking = rankedUsers.find((rankedUser: any) => 
        rankedUser.userId === userData.user_id
      )
      
      const userRank = currentUserRanking?.rank || rankedUsers.length
      
      // Process the user's data
      const challengeStatus = (userData.challenge_status || {}) as Record<string, string>
      const submissionData = (userData.submission_data || {}) as Record<string, any>
      const cosmetics = (userData.cosmetics || {}) as Record<string, any>
      
      // Convert DynamoDB numbers to regular numbers
      const points = parseInt(userData.points?.toString() || '0')
      const bonusPoints = parseInt(userData.bonus_points?.toString() || '0')
      const jinglebells = parseInt(userData.jinglebells?.toString() || '0')
      
      setUserProfile({
        userId: userData.user_id,
        nickname: userData.nickname,
        nameplateStyle: userData.nameplate_style || 'default',
        points: points,
        bonusPoints: bonusPoints,
        rank: userRank, // Use calculated rank instead of stored rank
        jinglebells: jinglebells,
        cosmetics: cosmetics,
        challengeStatus: challengeStatus,
        submissionData: submissionData
      })
      
    } catch (error) {
      console.error('Error fetching user profile:', error)
      setUserProfile(null)
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
