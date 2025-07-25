'use client'

import { useState } from 'react'
import { useGame } from '@/contexts/GameContext'
import { NavigationBar } from '@/components/navigation/NavigationBar'
import { GameSelection } from '@/components/game/GameSelection'
import { LeaderboardView } from '@/components/views/LeaderboardView'
import { ShopView } from '@/components/views/ShopView'
import { ChallengeView } from '@/components/views/ChallengeView'
import { ProfileView } from '@/components/views/ProfileView'
import { AdminView } from '@/components/views/AdminView'

type ViewType = 'games' | 'leaderboard' | 'shop' | 'challenge' | 'profile' | 'admin'

export function Dashboard() {
  const { currentGame, userProfile, loading } = useGame()
  const [currentView, setCurrentView] = useState<ViewType>('games')

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-green-600 to-blue-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-6xl mb-4">🎄</div>
          <h2 className="text-2xl font-bold mb-2">Loading your 12Days experience...</h2>
          <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!currentGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-green-600 to-blue-600">
        <NavigationBar 
          currentView={currentView} 
          onViewChange={setCurrentView}
          showGameNavigation={false}
        />
        <GameSelection />
      </div>
    )
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'leaderboard':
        return <LeaderboardView />
      case 'shop':
        return <ShopView />
      case 'challenge':
        return currentGame.userRole === 'admin' ? <AdminView /> : <ChallengeView />
      case 'profile':
        return <ProfileView />
      case 'admin':
        return <AdminView />
      default:
        return <GameSelection />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-green-600 to-blue-600">
      <NavigationBar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        showGameNavigation={true}
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Game Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6 border border-white/20">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {currentGame.gameName}
              </h1>
              <p className="text-green-100">
                {currentGame.userRole === 'admin' ? '👑 Admin' : '🎮 Participant'} • 
                Started {new Date(currentGame.startDate).toLocaleDateString()}
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-yellow-300 font-bold text-lg">
                🔔 {userProfile?.jinglebells || 0} Jinglebells
              </div>
              <div className="text-white text-sm">
                Rank #{userProfile?.rank || '-'} • {userProfile?.points || 0} points
              </div>
            </div>
          </div>
        </div>

        {/* Current View */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg min-h-[600px]">
          {renderCurrentView()}
        </div>
      </main>

      {/* Christmas decorations */}
      <div className="fixed bottom-4 left-4 text-6xl animate-bounce">
        🎁
      </div>
      <div className="fixed bottom-4 right-4 text-6xl animate-pulse">
        ⭐
      </div>
    </div>
  )
}
