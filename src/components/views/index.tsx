'use client'

import React, { useState, useEffect } from 'react'
import { useGame } from '@/contexts/GameContext'
import { useAuthenticator } from '@aws-amplify/ui-react'

// LeaderboardView - The leaderboard showing all players
export function LeaderboardView() {
  const { currentGame } = useGame()

  if (!currentGame) {
    return (
      <div className="profileSection">
        <h2 className="subHeader">🏆 Leaderboard</h2>
        <div style={{ fontSize: '0.8rem', textAlign: 'center', padding: '2rem' }}>
          Loading leaderboard...
        </div>
      </div>
    )
  }

  // For now, create mock participants data
  const sortedParticipants = [
    { id: '1', email: 'player1@example.com', score: 250, bonusPoints: 50, jinglebells: 25 },
    { id: '2', email: 'player2@example.com', score: 200, bonusPoints: 30, jinglebells: 20 },
    { id: '3', email: 'player3@example.com', score: 150, bonusPoints: 25, jinglebells: 15 }
  ]

  return (
    <div>
      <div className="profileSection">
        <h2 className="subHeader" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          🏆 Christmas Leaderboard
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {sortedParticipants.map((participant, index) => {
            const totalScore = (participant.score || 0) + (participant.bonusPoints || 0)
            const isTopThree = index < 3
            const medals = ['🥇', '🥈', '🥉']
            
            return (
              <div
                key={participant.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  borderRadius: '12px',
                  backgroundColor: isTopThree ? 'rgba(255, 224, 102, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  border: isTopThree ? '2px solid #ffe066' : '2px solid rgba(255, 255, 255, 0.2)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {isTopThree && (
                  <div style={{
                    position: 'absolute',
                    top: '-2px',
                    left: '-2px',
                    right: '-2px',
                    bottom: '-2px',
                    background: 'linear-gradient(45deg, #ffe066, #ffd700, #ffe066)',
                    borderRadius: '12px',
                    zIndex: -1,
                    animation: 'borderGlow 2s ease-in-out infinite alternate'
                  }}></div>
                )}
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    fontSize: isTopThree ? '1.5rem' : '1rem',
                    fontWeight: 'bold',
                    minWidth: '2rem'
                  }}>
                    {isTopThree ? medals[index] : `#${index + 1}`}
                  </div>
                  
                  <div>
                    <div style={{ 
                      fontSize: '0.8rem', 
                      fontWeight: 'bold',
                      color: isTopThree ? '#000' : '#fff'
                    }}>
                      {participant.email?.split('@')[0] || 'Anonymous'}
                    </div>
                    <div style={{ 
                      fontSize: '0.6rem', 
                      color: isTopThree ? '#666' : '#999'
                    }}>
                      {participant.jinglebells || 0} 🔔 jingle bells
                    </div>
                  </div>
                </div>
                
                <div style={{ 
                  fontSize: '1rem', 
                  fontWeight: 'bold',
                  color: isTopThree ? '#000' : '#ffe066'
                }}>
                  {totalScore.toLocaleString()} pts
                </div>
              </div>
            )
          })}
        </div>
        
        {sortedParticipants.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            fontSize: '0.8rem', 
            color: '#999', 
            padding: '2rem' 
          }}>
            No participants yet. Be the first to join!
          </div>
        )}
      </div>
      
      <div className="profileSection">
        <h3 className="subHeader" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
          📊 Competition Stats
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '1rem',
          fontSize: '0.6rem'
        }}>
          <div style={{ textAlign: 'center', padding: '1rem', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>👥</div>
            <div style={{ fontWeight: 'bold' }}>{sortedParticipants.length}</div>
            <div>Total Players</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎯</div>
            <div style={{ fontWeight: 'bold' }}>
              {sortedParticipants.length > 0 ? Math.max(...sortedParticipants.map(p => (p.score || 0) + (p.bonusPoints || 0))).toLocaleString() : 0}
            </div>
            <div>Top Score</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ShopView - The present shop for purchasing items
export function ShopView() {
  const { userProfile } = useGame()
  const [selectedPresent, setSelectedPresent] = useState<string | null>(null)
  const [purchaseStatus, setPurchaseStatus] = useState<'idle' | 'purchasing' | 'success' | 'error'>('idle')

  const presents = [
    {
      id: 'mystery_box',
      name: 'Mystery Box',
      description: 'A surprise gift that could contain bonus points or special items!',
      cost: 50,
      emoji: '🎁',
      rarity: 'common'
    },
    {
      id: 'golden_bell',
      name: 'Golden Bell',
      description: 'Doubles your next challenge reward!',
      cost: 100,
      emoji: '🔔',
      rarity: 'rare'
    },
    {
      id: 'candy_cane',
      name: 'Candy Cane',
      description: 'Sweet treat that gives you 25 bonus points instantly!',
      cost: 75,
      emoji: '🍭',
      rarity: 'common'
    },
    {
      id: 'snow_globe',
      name: 'Snow Globe',
      description: 'Magical item that unlocks a special challenge!',
      cost: 150,
      emoji: '🌨️',
      rarity: 'epic'
    }
  ]

  const handlePurchase = async (presentId: string) => {
    const present = presents.find(p => p.id === presentId)
    if (!present || !userProfile) return

    if ((userProfile.jinglebells || 0) < present.cost) {
      setPurchaseStatus('error')
      setTimeout(() => setPurchaseStatus('idle'), 2000)
      return
    }

    setPurchaseStatus('purchasing')
    setSelectedPresent(presentId)

    try {
      // Mock purchase - in real app this would call the backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPurchaseStatus('success')
      setTimeout(() => {
        setPurchaseStatus('idle')
        setSelectedPresent(null)
      }, 2000)
    } catch (error) {
      console.error('Purchase failed:', error)
      setPurchaseStatus('error')
      setTimeout(() => setPurchaseStatus('idle'), 2000)
    }
  }

  return (
    <div>
      <div className="profileSection">
        <h2 className="subHeader" style={{ textAlign: 'center', marginBottom: '1rem' }}>
          🎄 Christmas Present Shop
        </h2>
        
        <div style={{ 
          textAlign: 'center', 
          fontSize: '0.8rem', 
          marginBottom: '1.5rem',
          padding: '1rem',
          borderRadius: '12px',
          backgroundColor: 'rgba(255, 224, 102, 0.2)',
          border: '2px solid #ffe066'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔔</div>
          <div style={{ fontWeight: 'bold' }}>Your Jingle Bells: {userProfile?.jinglebells || 0}</div>
          <div style={{ fontSize: '0.6rem', marginTop: '0.5rem' }}>
            Complete challenges to earn more jingle bells!
          </div>
        </div>
      </div>

      <div className="profileSection">
        <h3 className="subHeader" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
          🛍️ Available Presents
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1rem' 
        }}>
          {presents.map((present) => {
            const canAfford = (userProfile?.jinglebells || 0) >= present.cost
            const isSelected = selectedPresent === present.id
            const isPurchasing = purchaseStatus === 'purchasing' && isSelected
            const isSuccess = purchaseStatus === 'success' && isSelected
            const isError = purchaseStatus === 'error' && isSelected

            return (
              <div
                key={present.id}
                style={{
                  padding: '1.5rem',
                  borderRadius: '12px',
                  backgroundColor: present.rarity === 'epic' ? 'rgba(138, 43, 226, 0.2)' : 
                                  present.rarity === 'rare' ? 'rgba(255, 215, 0, 0.2)' : 
                                  'rgba(255, 255, 255, 0.1)',
                  border: present.rarity === 'epic' ? '2px solid #8a2be2' : 
                          present.rarity === 'rare' ? '2px solid #ffd700' : 
                          '2px solid rgba(255, 255, 255, 0.2)',
                  textAlign: 'center',
                  position: 'relative',
                  opacity: canAfford ? 1 : 0.6,
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: '1rem',
                  animation: isPurchasing ? 'presentPulse 0.5s ease-in-out infinite alternate' : 
                            isSuccess ? 'bounce 0.6s ease-in-out' : 'none'
                }}>
                  {isSuccess ? '✅' : isError ? '❌' : present.emoji}
                </div>
                
                <h4 style={{ 
                  fontSize: '0.8rem', 
                  fontWeight: 'bold', 
                  marginBottom: '0.5rem',
                  color: present.rarity === 'epic' ? '#da70d6' : 
                         present.rarity === 'rare' ? '#ffd700' : '#fff'
                }}>
                  {present.name}
                </h4>
                
                <p style={{ 
                  fontSize: '0.6rem', 
                  color: '#ccc', 
                  marginBottom: '1rem',
                  lineHeight: '1.4'
                }}>
                  {present.description}
                </p>
                
                <div style={{ 
                  fontSize: '0.7rem', 
                  fontWeight: 'bold', 
                  marginBottom: '1rem',
                  color: '#ffe066'
                }}>
                  🔔 {present.cost} Jingle Bells
                </div>
                
                <button
                  onClick={() => handlePurchase(present.id)}
                  disabled={!canAfford || isPurchasing}
                  className="actionButton"
                  style={{
                    fontSize: '0.6rem',
                    padding: '0.8rem 1.5rem',
                    width: '100%',
                    opacity: !canAfford || isPurchasing ? 0.5 : 1,
                    cursor: !canAfford || isPurchasing ? 'not-allowed' : 'pointer',
                    backgroundColor: isSuccess ? '#5a9340' : 
                                   isError ? '#8e1b3a' : undefined
                  }}
                >
                  {isPurchasing ? '🔄 Purchasing...' : 
                   isSuccess ? '✅ Purchased!' : 
                   isError ? '❌ Purchase Failed' :
                   canAfford ? `🛒 Buy ${present.name}` : '💰 Not Enough Bells'}
                </button>
              </div>
            )
          })}
        </div>
      </div>
      
      {purchaseStatus === 'error' && (
        <div className="profileSection" style={{ 
          textAlign: 'center', 
          backgroundColor: 'rgba(142, 27, 58, 0.2)',
          border: '2px solid #8e1b3a'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>😞</div>
          <div style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
            Oops! Something went wrong with your purchase.
          </div>
        </div>
      )}
    </div>
  )
}

// ChallengeView - The challenge interface
export function ChallengeView() {
  const [currentDay, setCurrentDay] = useState(1)
  const [todayChallenge, setTodayChallenge] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [challengeStarted, setChallengeStarted] = useState(false)
  const [challengeAnswer, setChallengeAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [challengeSubmitted, setChallengeSubmitted] = useState(false)
  
  useEffect(() => {
    loadTodayChallenge()
  }, [currentDay])

  // Auto-submit if user navigates away
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (challengeStarted && !challengeSubmitted) {
        setChallengeSubmitted(true)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [challengeStarted, challengeSubmitted])
  
  const loadTodayChallenge = async () => {
    setLoading(true)
    try {
      // Calculate current day based on date
      const now = new Date()
      const startDate = new Date('2025-12-13')
      const daysDiff = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      const actualDay = Math.max(1, Math.min(12, daysDiff + 1))
      setCurrentDay(actualDay)
      
      // Sample trivia questions for testing
      const triviaQuestions = [
        {
          question: "What color is Rudolph's nose?",
          options: ["Red", "Green", "Blue", "Yellow"],
          correct: 0
        },
        {
          question: "In which city was Jesus born?",
          options: ["Nazareth", "Jerusalem", "Bethlehem", "Galilee"],
          correct: 2
        },
        {
          question: "What do children typically leave for Santa on Christmas Eve?",
          options: ["Carrots", "Candy", "Cookies and milk", "Pie"],
          correct: 2
        }
      ]
      
      const randomQuestion = triviaQuestions[actualDay % triviaQuestions.length]
      
      // Check if challenge was already submitted (simulate with localStorage)
      const submittedKey = `challenge_${actualDay}_submitted`
      const wasSubmitted = localStorage.getItem(submittedKey) === 'true'
      
      // Load challenge for current day
      setTodayChallenge({
        day: actualDay,
        type: 'trivia',
        title: `Challenge ${actualDay}`,
        description: 'Christmas Trivia Time!',
        question: randomQuestion.question,
        options: randomQuestion.options,
        correctAnswer: randomQuestion.correct,
        isUnlocked: true,
        isCompleted: wasSubmitted,
        basePoints: 50,
        jinglebellReward: 10
      })

      setChallengeSubmitted(wasSubmitted)
    } catch (error) {
      console.error('Error loading challenge:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const startChallenge = () => {
    setChallengeStarted(true)
    setChallengeAnswer('')
    setShowResult(false)
    setIsCorrect(false)
  }
  
  const submitAnswer = () => {
    if (!todayChallenge || challengeAnswer === '') return
    
    const answerIndex = parseInt(challengeAnswer)
    const correct = answerIndex === todayChallenge.correctAnswer
    
    setIsCorrect(correct)
    setShowResult(true)
    setChallengeSubmitted(true)
    
    // Save submission state
    const submittedKey = `challenge_${todayChallenge.day}_submitted`
    localStorage.setItem(submittedKey, 'true')
    
    // Reset after showing result
    setTimeout(() => {
      setTodayChallenge((prev: any) => ({ ...prev, isCompleted: true }))
      setChallengeStarted(false)
      setShowResult(false)
    }, 3000)
  }
  
  if (loading) {
    return (
      <div className="profileSection">
        <h2 className="subHeader">Loading Challenge...</h2>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎄</div>
      </div>
    )
  }

  if (challengeSubmitted || (todayChallenge && todayChallenge.isCompleted)) {
    return (
      <div className="submittedMessage">
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
        <div>Challenge Submitted!</div>
        <div style={{ fontSize: '0.6rem', marginTop: '1rem' }}>
          Come back tomorrow for the next challenge.
        </div>
      </div>
    )
  }
  
  return (
    <div>
      {/* Challenge Progress */}
      <div className="profileSection">
        <h3 className="subHeader" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
          Challenge Progress
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(6, 1fr)', 
          gap: '0.5rem',
          marginBottom: '1rem' 
        }}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(day => (
            <div
              key={day}
              style={{
                textAlign: 'center',
                padding: '0.5rem',
                borderRadius: '8px',
                fontSize: '0.6rem',
                fontWeight: 'bold',
                backgroundColor: day === currentDay ? '#ffe066' : 
                                day < currentDay ? '#5a9340' : '#666',
                color: day === currentDay ? '#000' : '#fff',
                transform: day === currentDay ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.2s ease'
              }}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Today's Challenge */}
      {todayChallenge && (
        <div className="profileSection">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h3 className="subHeader" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
              🎄 {todayChallenge.title}
            </h3>
            <p style={{ fontSize: '0.6rem', color: '#666' }}>
              {todayChallenge.description}
            </p>
          </div>
          
          {!challengeStarted ? (
            <div style={{ textAlign: 'center' }}>
              <div className="profileSection" style={{ margin: '1rem 0', padding: '1rem' }}>
                <h4 style={{ fontSize: '0.7rem', marginBottom: '0.5rem' }}>Rewards:</h4>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '1rem',
                  fontSize: '0.6rem'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎯</div>
                    <div style={{ fontWeight: 'bold' }}>{todayChallenge.basePoints}</div>
                    <div>Base Points</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔔</div>
                    <div style={{ fontWeight: 'bold' }}>{todayChallenge.jinglebellReward}</div>
                    <div>Jingle Bells</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚡</div>
                    <div style={{ fontWeight: 'bold' }}>+25%</div>
                    <div>Speed Bonus</div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={startChallenge}
                className="actionButton"
                style={{ fontSize: '0.7rem', padding: '1rem 2rem' }}
              >
                🚀 Start {todayChallenge.title}
              </button>
            </div>
          ) : (
            <div>
              {!showResult ? (
                <div>
                  <div className="profileSection" style={{ margin: '1rem 0' }}>
                    <h4 style={{ fontSize: '0.8rem', marginBottom: '1rem', fontWeight: 'bold' }}>
                      {todayChallenge.question}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {todayChallenge.options.map((option: string, index: number) => (
                        <label
                          key={index}
                          style={{
                            display: 'block',
                            cursor: 'pointer',
                            padding: '0.8rem',
                            borderRadius: '8px',
                            border: challengeAnswer === index.toString() ? 
                              '2px solid #ffe066' : '2px solid #ccc',
                            backgroundColor: challengeAnswer === index.toString() ? 
                              'rgba(255, 224, 102, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <input
                            type="radio"
                            name="challenge-answer"
                            value={index}
                            checked={challengeAnswer === index.toString()}
                            onChange={(e) => setChallengeAnswer(e.target.value)}
                            style={{ display: 'none' }}
                          />
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            fontSize: '0.7rem'
                          }}>
                            <div style={{
                              width: '1rem',
                              height: '1rem',
                              borderRadius: '50%',
                              border: '2px solid #666',
                              marginRight: '0.5rem',
                              backgroundColor: challengeAnswer === index.toString() ? 
                                '#ffe066' : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              {challengeAnswer === index.toString() && (
                                <div style={{
                                  width: '0.4rem',
                                  height: '0.4rem',
                                  borderRadius: '50%',
                                  backgroundColor: '#000'
                                }}></div>
                              )}
                            </div>
                            <span>{option}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <button
                      onClick={submitAnswer}
                      disabled={challengeAnswer === ''}
                      className="actionButton"
                      style={{ 
                        fontSize: '0.7rem',
                        opacity: challengeAnswer === '' ? 0.5 : 1,
                        cursor: challengeAnswer === '' ? 'not-allowed' : 'pointer'
                      }}
                    >
                      ✅ Submit Answer
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '4rem', 
                    marginBottom: '1rem',
                    animation: isCorrect ? 'bounce 1s infinite' : 'none'
                  }}>
                    {isCorrect ? '🎉' : '😞'}
                  </div>
                  <h4 style={{ 
                    fontSize: '1rem', 
                    fontWeight: 'bold', 
                    marginBottom: '0.5rem',
                    color: isCorrect ? '#5a9340' : '#8e1b3a'
                  }}>
                    {isCorrect ? 'Correct!' : 'Not quite right'}
                  </h4>
                  <p style={{ fontSize: '0.6rem' }}>
                    {isCorrect 
                      ? `You earned ${todayChallenge.basePoints} points and ${todayChallenge.jinglebellReward} jingle bells!`
                      : `The correct answer was: ${todayChallenge.options[todayChallenge.correctAnswer]}`
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ProfileView - Profile management and testing tools
export function ProfileView() {
  const { userProfile, currentGame } = useGame()
  const { user, signOut } = useAuthenticator((context) => [context.user])
  const [displayName, setDisplayName] = useState('')
  const [updating, setUpdating] = useState(false)

  // Import ThemeSelector component
  const [ThemeSelector, setThemeSelector] = useState<React.ComponentType<any> | null>(null)
  
  useEffect(() => {
    // Dynamically import ThemeSelector to avoid SSR issues
    import('@/components/ui/ThemeSelector').then((module) => {
      setThemeSelector(() => module.ThemeSelector)
    })
  }, [])

  useEffect(() => {
    // Use nickname from profile
    if (userProfile?.nickname) {
      setDisplayName(userProfile.nickname)
    }
  }, [userProfile])

  const handleUpdateProfile = async () => {
    if (!displayName.trim()) return
    
    setUpdating(true)
    try {
      // This would update the profile in the backend
      setTimeout(() => {
        setUpdating(false)
      }, 1000)
    } catch (error) {
      console.error('Error updating profile:', error)
      setUpdating(false)
    }
  }

  return (
    <div>
      <div className="profileSection">
        <h2 className="subHeader" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          Your Profile
        </h2>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          marginBottom: '2rem' 
        }}>
          <div style={{ 
            fontSize: '4rem', 
            marginBottom: '1rem',
            padding: '1rem',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 224, 102, 0.2)',
            border: '3px solid #ffe066',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '6rem',
            height: '6rem'
          }}>
          </div>
          
          <h3 style={{ 
            fontSize: '1rem', 
            fontWeight: 'bold', 
            marginBottom: '0.5rem' 
          }}>
            {userProfile?.nickname || user?.username || 'Santa\'s Helper'}
          </h3>
          
          <p style={{ 
            fontSize: '0.6rem', 
            color: '#999',
            marginBottom: '1rem'
          }}>
            {user?.signInDetails?.loginId || 'santa@northpole.com'}
          </p>
        </div>
      </div>

      <div className="profileSection">
        <h3 className="subHeader" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
          Your Stats
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ 
            textAlign: 'center', 
            padding: '1rem', 
            borderRadius: '12px',
            backgroundColor: 'rgba(90, 147, 64, 0.2)',
            border: '2px solid #5a9340'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--burgundy)' }}>
              {((userProfile?.points || 0) + (userProfile?.bonusPoints || 0)).toLocaleString()}
            </div>
            <div style={{ fontSize: '0.6rem' }}>Total Points</div>
          </div>
          
          <div style={{ 
            textAlign: 'center', 
            padding: '1rem', 
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 224, 102, 0.2)',
            border: '2px solid #ffe066'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--gold)' }}>
              {userProfile?.jinglebells || 0}
            </div>
            <div style={{ fontSize: '0.6rem' }}>Jingle Bells</div>
          </div>
        </div>
      </div>

      <div className="profileSection">
        <h3 className="subHeader" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
          Customize Profile
        </h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '0.6rem', 
            marginBottom: '0.5rem',
            color: '#ccc'
          }}>
            Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter your display name"
            style={{
              width: '100%',
              padding: '0.8rem',
              borderRadius: '8px',
              border: '2px solid #ccc',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontSize: '0.7rem',
              fontFamily: '"Press Start 2P", monospace'
            }}
          />
        </div>
        
        <button
          onClick={handleUpdateProfile}
          disabled={updating || !displayName.trim()}
          className="actionButton"
          style={{
            fontSize: '0.6rem',
            width: '100%',
            opacity: updating || !displayName.trim() ? 0.5 : 1,
            cursor: updating || !displayName.trim() ? 'not-allowed' : 'pointer'
          }}
        >
          {updating ? 'Updating...' : 'Update Profile'}
        </button>
      </div>
      
      <div className="profileSection">
        <h3 className="subHeader" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
          Game Info
        </h3>
        
        <div style={{ fontSize: '0.6rem', color: '#ccc' }}>
          <p><strong>Game Code:</strong> {currentGame?.inviteCode || 'Not joined'}</p>
          <p><strong>Game Name:</strong> {currentGame?.gameName || 'Unknown'}</p>
          <p><strong>Joined:</strong> {userProfile ? 'Active Player' : 'Not joined'}</p>
        </div>
      </div>
      
      {/* Theme Testing Section */}
      <div className="profileSection">
        <h3 style={{ 
          color: '#9333ea', 
          marginBottom: '1rem', 
          fontSize: '0.7rem',
          textAlign: 'center'
        }}>
          🎨 Theme Settings
        </h3>
        <div style={{ 
          fontSize: '0.6rem', 
          color: '#ccc', 
          marginBottom: '1rem',
          textAlign: 'center' 
        }}>
          Test different themes for the game. Theme changes affect the visual appearance instantly.
        </div>
        {ThemeSelector && <ThemeSelector />}
      </div>
      
      {/* Logout Section */}
      <div className="profileSection">
        <button
          onClick={() => signOut()}
          style={{
            width: '100%',
            padding: '1rem',
            borderRadius: '8px',
            border: '2px solid #dc3545',
            backgroundColor: 'rgba(220, 53, 69, 0.2)',
            color: '#dc3545',
            fontSize: '0.7rem',
            fontFamily: '"Press Start 2P", monospace',
            cursor: 'pointer',
            transition: 'all 0.2s',
            textAlign: 'center',
            fontWeight: 'bold'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.3)'
            e.currentTarget.style.borderColor = '#ff1e2d'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.2)'
            e.currentTarget.style.borderColor = '#dc3545'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  )
}

// AdminView - Administrative functions
export function AdminView() {
  return (
    <div className="profileSection">
      <h2 className="subHeader" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        Admin Dashboard
      </h2>
      
      <div style={{ 
        padding: '2rem', 
        borderRadius: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold', color: 'var(--burgundy)' }}>
          ADMIN
        </div>
        <p style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
          Admin functionality coming soon!
        </p>
        <ul style={{ 
          textAlign: 'left', 
          fontSize: '0.6rem', 
          color: '#ccc',
          listStyle: 'none',
          padding: 0
        }}>
          <li style={{ marginBottom: '0.5rem' }}>• Participant progress tracking and statistics</li>
          <li style={{ marginBottom: '0.5rem' }}>• Custom challenge creation and editing</li>
          <li style={{ marginBottom: '0.5rem' }}>• Manual scoring for text-response challenges</li>
          <li style={{ marginBottom: '0.5rem' }}>• Game settings and configuration management</li>
          <li style={{ marginBottom: '0.5rem' }}>• Free access code generation</li>
        </ul>
      </div>
    </div>
  )
}
