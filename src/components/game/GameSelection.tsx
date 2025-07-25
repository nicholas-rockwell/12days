'use client'

import { useState } from 'react'
import { useGame } from '@/contexts/GameContext'

export function GameSelection() {
  const { userGames, setCurrentGame } = useGame()
  const [showCreateGame, setShowCreateGame] = useState(false)
  const [showJoinGame, setShowJoinGame] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-4">
          🎄 Welcome to 12Days! 🎄
        </h1>
        <p className="text-xl text-green-100 mb-2">
          Your Seasonal Challenge Adventure Awaits
        </p>
        <p className="text-white/80">
          Join games with friends and family, or create your own!
        </p>
      </div>

      {/* User's Games */}
      {userGames.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Your Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userGames.map((game) => (
              <div
                key={game.gameId}
                className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                onClick={() => setCurrentGame(game)}
              >
                <h3 className="text-xl font-bold text-white mb-2">
                  {game.gameName}
                </h3>
                <div className="text-green-100 text-sm space-y-1">
                  <p>🗓️ Started: {new Date(game.startDate).toLocaleDateString()}</p>
                  <p>👥 {game.participantCount} participants</p>
                  <p>🎭 Role: {game.userRole === 'admin' ? '👑 Admin' : '🎮 Participant'}</p>
                  <p>💳 Status: {game.subscriptionStatus}</p>
                </div>
                <div className="mt-4">
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                    Enter Game →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <button
          onClick={() => setShowCreateGame(true)}
          className="bg-red-600 hover:bg-red-700 text-white p-6 rounded-lg font-bold text-lg transition-colors"
        >
          🎮 Create New Game
        </button>
        
        <button
          onClick={() => setShowJoinGame(true)}
          className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg font-bold text-lg transition-colors"
        >
          🎯 Join Existing Game
        </button>
      </div>

      {/* Placeholder for Create/Join Game Modals */}
      {showCreateGame && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Create New Game</h3>
            <p className="text-gray-600 mb-4">
              Game creation form will be implemented here with all the features we discussed.
            </p>
            <button
              onClick={() => setShowCreateGame(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showJoinGame && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Join Game</h3>
            <p className="text-gray-600 mb-4">
              Join game form will be implemented here with invite code input.
            </p>
            <button
              onClick={() => setShowJoinGame(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
