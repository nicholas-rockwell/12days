'use client'

import { useAuthenticator } from '@aws-amplify/ui-react'
import { useGame } from '@/contexts/GameContext'

interface NavigationBarProps {
  currentView: string
  onViewChange: (view: string) => void
  showGameNavigation: boolean
}

export function NavigationBar({ currentView, onViewChange, showGameNavigation }: NavigationBarProps) {
  const { signOut } = useAuthenticator()
  const { currentGame, userProfile, userGames, setCurrentGame } = useGame()

  const navItems = showGameNavigation ? [
    { id: 'leaderboard', label: '🏆 Leaderboard', icon: '🏆' },
    { id: 'shop', label: '🛍️ Shop', icon: '🛍️' },
    { id: 'challenge', label: currentGame?.userRole === 'admin' ? '👑 Admin' : '🎮 Challenge', icon: currentGame?.userRole === 'admin' ? '👑' : '🎮' },
    { id: 'profile', label: '👤 Profile', icon: '👤' },
  ] : []

  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="text-white font-bold text-xl cursor-pointer hover:text-yellow-300 transition-colors"
            onClick={() => onViewChange('games')}
          >
            🎄 12Days
          </div>

          {/* Game Selection Dropdown */}
          {showGameNavigation && userGames.length > 0 && (
            <div className="flex-1 max-w-xs mx-4">
              <select
                value={currentGame?.gameId || ''}
                onChange={(e) => {
                  const game = userGames.find(g => g.gameId === e.target.value)
                  if (game) setCurrentGame(game)
                }}
                className="w-full bg-white/20 text-white border border-white/30 rounded-md px-3 py-2 text-sm"
              >
                <option value="" disabled>Select Game</option>
                {userGames.map(game => (
                  <option key={game.gameId} value={game.gameId} className="text-black">
                    {game.gameName} ({game.year})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Navigation Items */}
          {showGameNavigation && (
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === item.id
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
          )}

          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            {showGameNavigation && userProfile && (
              <div className="hidden sm:block text-right">
                <div className="text-yellow-300 font-bold text-sm">
                  🔔 {userProfile.jinglebells}
                </div>
                <div className="text-white/80 text-xs">
                  {userProfile.nickname}
                </div>
              </div>
            )}
            
            <button
              onClick={signOut}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showGameNavigation && (
          <div className="md:hidden pb-4">
            <div className="flex space-x-1 overflow-x-auto">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                    currentView === item.id
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
