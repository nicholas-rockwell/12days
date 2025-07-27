'use client'

import { useState } from 'react'
import { useGame } from '@/contexts/GameContext'

export function GameSelection() {
  const { userGames, setCurrentGame } = useGame()
  const [showCreateGame, setShowCreateGame] = useState(false)
  const [showJoinGame, setShowJoinGame] = useState(false)

  return (
    <div className="gameSelectionContainer">
      {/* Snowflakes Animation */}
      <div className="snowflakes" aria-hidden="true">
        {[...Array(50)].map((_, i) => (
          <div 
            key={i}
            className="snowflake"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* Welcome Header */}
      <div className="gameSelectionHeader">
        <h1 className="gameSelectionTitle">
          🎄 Welcome to 12Days! 🎄
        </h1>
        <p className="gameSelectionSubtitle">
          Your Seasonal Challenge Adventure Awaits
        </p>
        <p className="gameSelectionDescription">
          Join games with friends and family, or create your own magical Christmas experience!
        </p>
      </div>

      {/* Your Games Section */}
      {userGames.length > 0 && (
        <div className="yourGamesSection">
          <div className="yourGamesHeader">
            <h2 className="yourGamesTitle">🎮 Your Games</h2>
          </div>
          
          <div className="gamesGrid">
            {userGames
              .sort((a, b) => b.year - a.year) // Sort newest first
              .map((game) => {
                const isLegacyGame = game.year < new Date().getFullYear()
                
                return (
                  <div
                    key={game.gameId}
                    className={`gameSelectionCard ${isLegacyGame ? 'legacyGame' : ''}`}
                    onClick={() => setCurrentGame(game)}
                  >
                    <div className="gameCardHeader">
                      <h3 className="gameCardTitle">
                        {game.gameName}
                      </h3>
                    </div>
                    
                    <div className="gameCardDetails">
                      <div className="gameCardInfo">
                        <span className="gameCardLabel">Rank:</span>
                        <span className="gameCardValue">{game.rank || 'N/A'}</span>
                      </div>
                      <div className="gameCardInfo">
                        <span className="gameCardLabel">Year:</span>
                        <span className="gameCardValue">{game.year}</span>
                      </div>
                      <div className="gameCardInfo">
                        <span className="gameCardLabel">Role:</span>
                        <span className="gameCardValue">
                          {game.userRole === 'admin' ? 'Admin' : 'Participant'}
                        </span>
                      </div>
                      <div className="gameCardInfo">
                        <span className="gameCardLabel">Status:</span>
                        <span className="gameCardValue">
                          {isLegacyGame ? 'Completed' : 'Active'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="gameCardButton">
                      {isLegacyGame ? 'View Results →' : 'Enter Game →'}
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="gameSelectionActions">
        <button
          onClick={() => setShowCreateGame(true)}
          className="gameSelectionButton createButton"
        >
          <div className="buttonIcon">🎮</div>
          <div className="buttonLabel">Create New Game</div>
        </button>
        
        <button
          onClick={() => setShowJoinGame(true)}
          className="gameSelectionButton joinButton"
        >
          <div className="buttonIcon">🎯</div>
          <div className="buttonLabel">Join Existing Game</div>
        </button>
      </div>

      {/* Placeholder for Create/Join Game Modals */}
      {showCreateGame && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h3 className="modalTitle">🎄 Create New Game</h3>
            <p className="modalDescription">
              Start your own magical Christmas challenge! Set up teams, customize rules, and spread the holiday cheer.
            </p>
            <button
              onClick={() => setShowCreateGame(false)}
              className="gameSelectionButton"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showJoinGame && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h3 className="modalTitle">🎯 Join Existing Game</h3>
            <p className="modalDescription">
              Enter your invite code to join friends and family in their festive adventure!
            </p>
            <button
              onClick={() => setShowJoinGame(false)}  
              className="gameSelectionButton"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
