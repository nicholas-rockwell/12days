'use client'

import { useState, useEffect } from 'react'
import { useGame } from '@/contexts/GameContext'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { NavigationBar } from '@/components/navigation/NavigationBar'
import { GameSelection } from '@/components/game/GameSelection'
import { LeaderboardView } from '@/components/views/LeaderboardView'
import { ShopView } from '@/components/views/ShopView'
import { ChallengeView } from '@/components/views/ChallengeView'
import { ProfileView } from '@/components/views/ProfileView'
import { AdminView } from '@/components/views/AdminView'

type ViewType = 'games' | 'leaderboard' | 'shop' | 'challenge' | 'profile' | 'admin'

export function Dashboard() {
  const { currentGame, userProfile, loading, userGames, setCurrentGame } = useGame()
  const { signOut } = useAuthenticator()
  const [currentView, setCurrentView] = useState<ViewType>('games')
  const [showSnowflakes, setShowSnowflakes] = useState(false)

  useEffect(() => {
    setShowSnowflakes(true) // Only show snowflakes on client
  }, [])

  // Update the current view when entering/leaving a game
  useEffect(() => {
    if (currentGame && currentView === 'games') {
      // When entering a game, switch to challenge view by default
      setCurrentView('challenge')
    } else if (!currentGame && currentView !== 'games') {
      // When leaving a game, switch back to games view
      setCurrentView('games')
    }
  }, [currentGame, currentView])

  // Type-safe wrapper for onViewChange
  const handleViewChange = (view: string) => {
    if (['games', 'leaderboard', 'shop', 'challenge', 'profile', 'admin'].includes(view)) {
      setCurrentView(view as ViewType)
    }
  }

  const handleGameChange = (gameId: string) => {
    if (gameId === 'new') {
      // Handle creating new game
      setCurrentView('games')
      return
    }
    
    const game = userGames.find(g => g.gameId === gameId)
    if (game) {
      setCurrentGame(game)
    }
  }

  const handleLogout = () => {
    signOut()
  }

  // Generate snowflakes
  const snowflakes = showSnowflakes
    ? Array.from({ length: 20 }).map((_, i) => (
        <span
          key={i}
          className="snowflake"
          style={{
            left: `${Math.random() * 100}vw`,
            animationDuration: `${3 + Math.random() * 5}s`,
            fontSize: `${1 + Math.random() * 2}em`
          }}
        >❄️</span>
      ))
    : null

  const getPageTitle = () => {
    switch (currentView) {
      case 'leaderboard':
        return 'Leaderboard'
      case 'shop':
        return 'Present Shop'
      case 'challenge':
        return 'Challenge'
      case 'profile':
        return 'Profile'
      case 'admin':
        return 'Admin Panel'
      default:
        return '12Days Christmas'
    }
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'leaderboard':
        return <LeaderboardView onNavigateToGames={() => setCurrentView('games')} />
      case 'shop':
        return <ShopView />
      case 'challenge':
        return currentGame?.userRole === 'admin' ? <AdminView /> : <ChallengeView />
      case 'profile':
        return <ProfileView />
      case 'admin':
        return <AdminView />
      default:
        return <GameSelection />
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="profileSection" style={{ marginTop: '5rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎄</div>
          <h2 className="subHeader">Loading your 12Days experience...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      {snowflakes}
      
      {/* Fixed Header - Hide for GameSelection */}
      {currentView !== 'games' && (
        <>
          <div className="fixedHeaderBox">
            <h1 className="gameHeader">{getPageTitle()}</h1>
            
            <div className="headerControls">
              {userGames.length > 0 && (
                <select
                  value={currentGame?.gameId || ''}
                  onChange={(e) => handleGameChange(e.target.value)}
                  className="gameDropdown"
                >
                  <option value="" disabled>Select Game</option>
                  {userGames.map(game => (
                    <option key={game.gameId} value={game.gameId}>
                      {game.gameName} ({game.year})
                    </option>
                  ))}
                  <option value="new">+ Create New Game</option>
                </select>
              )}
            </div>
          </div>
          
          {/* Bells Display Tab */}
          <div className="bellsTab">
            🔔 {userProfile?.jinglebells || 0}
          </div>
        </>
      )}

      {/* Content */}
      <div className="contentBox">
        {renderCurrentView()}
      </div>

      {/* Bottom Navigation */}
      {currentGame && (
        <NavigationBar 
          currentView={currentView} 
          onViewChange={handleViewChange}
        />
      )}
    </div>
  )
}
