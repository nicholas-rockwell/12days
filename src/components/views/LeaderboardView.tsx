'use client'

import { useState, useEffect } from 'react'
import { useGame } from '@/contexts/GameContext'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../../../amplify/data/resource'

// Generate the data client for GraphQL operations - with error handling
let client: any = null

const getClient = () => {
  if (!client) {
    try {
      client = generateClient<Schema>()
    } catch (error) {
      console.error('Failed to generate Amplify client for LeaderboardView:', error)
      return null
    }
  }
  return client
}

interface LeaderboardEntry {
  rank: number
  userId: string
  nickname: string
  points: number
  bonusPoints: number
  jinglebells: number
  nameplateStyle: string
  cosmetics: any
  challengesCompleted: number
  lastActive: string
}

interface LeaderboardViewProps {
  onNavigateToGames?: () => void
}

export function LeaderboardView({ onNavigateToGames }: LeaderboardViewProps = {}) {
  const { currentGame } = useGame()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (currentGame) {
      loadLeaderboard()
    }
  }, [currentGame])
  
  const loadLeaderboard = async () => {
    if (!currentGame) return
    
    const amplifyClient = getClient()
    if (!amplifyClient) {
      console.error('Amplify client not available for leaderboard')
      setLeaderboard([])
      setLoading(false)
      return
    }
    
    setLoading(true)
    try {
      // Use the current game year for loading leaderboard data
      const year = currentGame.year
      
      // Get all users for this game year
      const usersResponse = await amplifyClient.models.TwelveDaysUser.list({
        filter: {
          PK: {
            eq: `GAME#${year}`
          }
        }
      })
      
      // Process and sort the users
      const entries: LeaderboardEntry[] = usersResponse.data
        .filter((user: any) => user && user.user_id && user.nickname) // Filter out null/invalid records
        .map((user: any) => {
          // Handle DynamoDB data structure properly - parse JSON strings
          let challengeStatus: Record<string, string> = {}
          try {
            if (typeof user.challenge_status === 'string') {
              challengeStatus = JSON.parse(user.challenge_status)
            } else if (user.challenge_status && typeof user.challenge_status === 'object') {
              challengeStatus = user.challenge_status as Record<string, string>
            }
          } catch (e) {
            challengeStatus = {}
          }
          
          const completedChallenges = Object.values(challengeStatus).filter(
            status => status === 'completed'
          ).length
          
          // Convert DynamoDB numbers to regular numbers
          const points = parseInt(user.points?.toString() || '0')
          const bonusPoints = parseInt(user.bonus_points?.toString() || '0')
          const jinglebells = parseInt(user.jinglebells?.toString() || '0')
          
          // Parse cosmetics if it's a JSON string
          let cosmetics = {}
          try {
            if (typeof user.cosmetics === 'string') {
              cosmetics = JSON.parse(user.cosmetics)
            } else if (user.cosmetics && typeof user.cosmetics === 'object') {
              cosmetics = user.cosmetics
            }
          } catch (e) {
            cosmetics = {}
          }
          
          return {
            rank: 0, // Will be calculated after sorting
            userId: user.user_id,
            nickname: user.nickname,
            points: points,
            bonusPoints: bonusPoints,
            jinglebells: jinglebells,
            nameplateStyle: user.nameplate_style || 'default',
            cosmetics: cosmetics,
            challengesCompleted: completedChallenges,
            lastActive: user.updated_at || user.created_at || ''
          }
        })
        // Sort by total points (points + bonus_points) descending
        .sort((a: LeaderboardEntry, b: LeaderboardEntry) => (b.points + b.bonusPoints) - (a.points + a.bonusPoints))
        // Assign ranks based on actual position (1st place = rank 1, last place = rank N)
        .map((entry: LeaderboardEntry, index: number) => ({ ...entry, rank: index + 1 }))
      
      setLeaderboard(entries)
    } catch (error) {
      console.error('Error loading leaderboard:', error)
      setLeaderboard([])
    } finally {
      setLoading(false)
    }
  }
  
  const getRankDisplay = (rank: number) => {
    const getSuffix = (num: number) => {
      const lastDigit = num % 10
      const lastTwoDigits = num % 100
      
      if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return 'th'
      
      switch (lastDigit) {
        case 1: return 'st'
        case 2: return 'nd'
        case 3: return 'rd'
        default: return 'th'
      }
    }
    
    const suffix = getSuffix(rank)
    
    return (
      <span style={{ position: 'relative', display: 'inline-block' }}>
        {rank}
        <sup style={{ 
          fontSize: '0.6em', 
          verticalAlign: 'top',
          lineHeight: '1',
          marginLeft: '0.1em'
        }}>
          {suffix}
        </sup>
      </span>
    )
  }
  
  const getNameplateStyle = (style: string, cosmetics: any) => {
    // Parse cosmetics if it exists
    const userCosmetics = cosmetics ? (typeof cosmetics === 'string' ? JSON.parse(cosmetics) : cosmetics) : {}
    
    // Get equipped cosmetics (new structure)
    const equipped = userCosmetics.equipped || {}
    const selectedBackground = equipped.background || userCosmetics.selected_background || 'default'
    const selectedBorder = equipped.border || userCosmetics.selected_border || 'default'
    const selectedNameplate = equipped.nameplate || userCosmetics.selected_nameplate || style || 'default'
    
    // Build CSS classes based on equipped cosmetics
    let bgClass = 'rgba(255, 255, 255, 0.1)' // default background
    let borderClass = 'var(--gold)' // default border
    let nameplateEffect = ''
    
    // Background styles
    switch (selectedBackground) {
      case 'gold':
        bgClass = 'linear-gradient(135deg, rgba(255, 224, 102, 0.2), rgba(255, 193, 7, 0.3))'
        break
      case 'silver':
        bgClass = 'linear-gradient(135deg, rgba(192, 192, 192, 0.2), rgba(169, 169, 169, 0.3))'
        break
      case 'bronze':
        bgClass = 'linear-gradient(135deg, rgba(205, 127, 50, 0.2), rgba(184, 115, 51, 0.3))'
        break
      case 'festive':
        bgClass = 'linear-gradient(135deg, rgba(220, 20, 60, 0.2), rgba(34, 139, 34, 0.2))'
        break
      case 'snow':
        bgClass = 'linear-gradient(135deg, rgba(248, 248, 255, 0.3), rgba(230, 230, 250, 0.2))'
        break
      case 'candy_cane':
        bgClass = 'linear-gradient(45deg, rgba(220, 20, 60, 0.2) 25%, rgba(255, 255, 255, 0.2) 25%, rgba(255, 255, 255, 0.2) 50%, rgba(220, 20, 60, 0.2) 50%)'
        break
      case 'holly':
        bgClass = 'linear-gradient(135deg, rgba(34, 139, 34, 0.3), rgba(0, 100, 0, 0.2))'
        break
      default:
        bgClass = 'rgba(255, 255, 255, 0.1)'
    }
    
    // Border styles
    switch (selectedBorder) {
      case 'gold':
        borderClass = '#ffd700'
        break
      case 'silver':
        borderClass = '#c0c0c0'
        break
      case 'bronze':
        borderClass = '#cd7f32'
        break
      case 'candy_cane':
        borderClass = '#dc143c'
        break
      case 'holly':
        borderClass = '#228b22'
        break
      case 'sparkle':
        borderClass = '#ffd700'
        nameplateEffect = 'sparkle'
        break
      case 'ice':
        borderClass = '#b0e0e6'
        break
      case 'fire':
        borderClass = '#ff4500'
        nameplateEffect = 'glow'
        break
      default:
        borderClass = 'var(--gold)'
    }
    
    return {
      background: bgClass,
      borderColor: borderClass,
      effect: nameplateEffect
    }
  }

  if (!currentGame) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--burgundy)' }}>Leaderboard</h2>
        <div className="bg-white/10 rounded-lg p-6 text-center">
          <div className="text-6xl mb-4">🎮</div>
          <p className="text-white mb-4">No games available to view leaderboard.</p>
          <button
            onClick={() => {
              if (onNavigateToGames) {
                onNavigateToGames()
              }
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Create Your First Game
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">      
      {/* Leaderboard Content - Scrollable */}
      {loading ? (
        <div className="game-card text-center flex-shrink-0">
          <div className="game-text">Loading leaderboard...</div>
          <div className="game-spinner mx-auto mt-4"></div>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="game-card text-center flex-shrink-0">
          <p className="game-text">No participants found for {currentGame.year}.</p>
        </div>
      ) : (
        <div className="leaderboardContainer">
          {leaderboard.map((entry) => {
            const cardStyle = getNameplateStyle(entry.nameplateStyle, entry.cosmetics)
            
            return (
              <div
                key={entry.userId}
                className="leaderboardPlayerCard"
                style={{
                  background: cardStyle.background,
                  borderColor: cardStyle.borderColor,
                  border: `2px solid ${cardStyle.borderColor}`,
                  borderRadius: '8px',
                  padding: 'clamp(0.4rem, 1.2vw, 0.8rem)',
                  margin: '0.4rem 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backdropFilter: 'blur(4px)',
                  boxShadow: cardStyle.effect === 'sparkle' ? '0 0 15px rgba(255, 215, 0, 0.6)' : cardStyle.effect === 'glow' ? '0 0 15px rgba(255, 69, 0, 0.6)' : '0 2px 8px rgba(0,0,0,0.2)',
                  animation: cardStyle.effect === 'sparkle' ? 'sparkle 2s infinite' : cardStyle.effect === 'glow' ? 'glow 2s infinite' : 'none',
                  transition: 'box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.4)'
                }}
                onMouseLeave={(e) => {
                  const defaultShadow = cardStyle.effect === 'sparkle' ? '0 0 15px rgba(255, 215, 0, 0.6)' : cardStyle.effect === 'glow' ? '0 0 15px rgba(255, 69, 0, 0.6)' : '0 2px 8px rgba(0,0,0,0.2)'
                  e.currentTarget.style.boxShadow = defaultShadow
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.4rem, 1.2vw, 1rem)', flex: 1 }}>
                  <div style={{ 
                    fontSize: 'clamp(0.8rem, 2.2vw, 1.4rem)', 
                    fontWeight: 'bold', 
                    minWidth: 'clamp(2rem, 5vw, 3rem)', 
                    textAlign: 'center',
                    color: 'var(--gold)',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(255,255,255,0.3)',
                    fontFamily: "'Press Start 2P', cursive"
                  }}>
                    {getRankDisplay(entry.rank)}
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ 
                      fontFamily: "'Press Start 2P', cursive",
                      color: 'var(--burgundy)',
                      fontSize: 'clamp(0.5rem, 1.4vw, 0.9rem)',
                      margin: '0 0 0.3rem 0',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.7), -1px -1px 2px rgba(255,255,255,0.4), 0 0 8px rgba(255,255,255,0.2)',
                      fontWeight: 'bold'
                    }}>
                      {entry.nickname}
                    </h3>
                    <div style={{ 
                      fontSize: 'clamp(0.35rem, 1.1vw, 0.6rem)', 
                      color: 'var(--burgundy)',
                      opacity: 0.9,
                      textShadow: '1px 1px 3px rgba(0,0,0,0.6), -1px -1px 1px rgba(255,255,255,0.3)'
                    }}>
                      {entry.challengesCompleted} completed
                    </div>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right', minWidth: 'clamp(3.5rem, 9vw, 6rem)' }}>
                  <div style={{ 
                    color: 'var(--burgundy)',
                    fontSize: 'clamp(0.6rem, 1.8vw, 1rem)',
                    fontWeight: 'bold',
                    fontFamily: "'Press Start 2P', cursive",
                    textShadow: '2px 2px 4px rgba(0,0,0,0.7), -1px -1px 2px rgba(255,255,255,0.4), 0 0 6px rgba(255,255,255,0.2)'
                  }}>
                    {entry.points + entry.bonusPoints} pts
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
