'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../../amplify/data/resource'
import { THEMES, ThemeConfig, getTheme } from '../types/theme'

// Generate the data client for GraphQL operations - with error handling
let client: any = null

const getClient = () => {
  if (!client) {
    try {
      client = generateClient<Schema>()
    } catch (error) {
      console.error('Failed to generate Amplify client for ThemeContext:', error)
      return null
    }
  }
  return client
}

interface ThemeContextType {
  // Current theme
  currentTheme: ThemeConfig
  themeId: string
  
  // Theme management
  setTheme: (themeId: string) => Promise<void>
  availableThemes: ThemeConfig[]
  
  // Theme utilities
  isSecretTheme: (themeId: string) => boolean
  canAccessTheme: (themeId: string) => boolean
  
  // Loading state
  loading: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthenticator((context) => [context.user])
  
  const [themeId, setThemeIdState] = useState<string>('christmas')
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(THEMES.christmas)
  const [loading, setLoading] = useState(true)
  
  // Get available themes (excluding secret themes for regular users)
  const availableThemes = Object.values(THEMES).filter(theme => !theme.isSecret)

  // Check if user can access a theme
  const canAccessTheme = (themeId: string): boolean => {
    const theme = THEMES[themeId]
    if (!theme) return false
    
    // Non-secret themes are always accessible
    if (!theme.isSecret) return true
    
    // Secret themes require special conditions
    // For now, we'll implement basic logic, but this could be expanded
    if (themeId === 'developer' || themeId === 'matrix' || themeId === 'debug') {
      // These are only accessible via database manipulation
      // The actual theme switching will happen when we detect the theme in the database
      return false
    }
    
    return false
  }

  // Check if a theme is secret
  const isSecretTheme = (themeId: string): boolean => {
    return THEMES[themeId]?.isSecret || false
  }

  // Load theme from database
  const loadThemeFromDatabase = async () => {
    if (!user?.userId) return

    try {
      // First try to get theme from GameMetadata
      const { data: gameMetadata } = await client.models.GameMetadata.list({
        filter: { theme_id: { ne: "" } }
      })
      
      if (gameMetadata && gameMetadata.length > 0) {
        const metadata = gameMetadata[0]
        if (metadata.theme_id && THEMES[metadata.theme_id]) {
          setThemeIdState(metadata.theme_id)
          setCurrentTheme(getTheme(metadata.theme_id))
          applyThemeToDocument(metadata.theme_id)
          return
        }
      }

      // Fallback: Check user's individual theme selection
      const { data: users } = await client.models.TwelveDaysUser.list({
        filter: { user_id: { eq: user.userId } }
      })
      
      if (users && users.length > 0) {
        const userRecord = users[0]
        if (userRecord.selected_theme && THEMES[userRecord.selected_theme]) {
          setThemeIdState(userRecord.selected_theme)
          setCurrentTheme(getTheme(userRecord.selected_theme))
          applyThemeToDocument(userRecord.selected_theme)
          return
        }
      }
    } catch (error) {
      // Use localStorage fallback
    }

    // Fallback to localStorage
    const savedTheme = localStorage.getItem('selectedTheme')
    if (savedTheme && THEMES[savedTheme]) {
      setThemeIdState(savedTheme)
      setCurrentTheme(getTheme(savedTheme))
      applyThemeToDocument(savedTheme)
    }
  }

  // Set theme and persist to database
  const setTheme = async (newThemeId: string): Promise<void> => {
    // Validate theme exists
    if (!THEMES[newThemeId]) {
      return
    }

    setLoading(true)
    try {
      // Store in localStorage as fallback
      localStorage.setItem('selectedTheme', newThemeId)
      
      // Update database if user is authenticated
      if (user?.userId) {
        try {
          // Update the user's individual theme preference
          const { data: users } = await client.models.TwelveDaysUser.list({
            filter: { user_id: { eq: user.userId } }
          })
          
          if (users && users.length > 0) {
            const userRecord = users[0]
            await client.models.TwelveDaysUser.update({
              PK: userRecord.PK,
              SK: userRecord.SK,
              selected_theme: newThemeId
            })
          }
        } catch (dbError) {
        }
      }
      
      // Update state
      setThemeIdState(newThemeId)
      setCurrentTheme(getTheme(newThemeId))
      
      // Apply theme to document root
      applyThemeToDocument(newThemeId)
      
    } catch (error) {
      console.error('Error setting theme:', error)
    } finally {
      setLoading(false)
    }
  }

  // Apply theme to document by adding/removing CSS classes
  const applyThemeToDocument = (themeId: string) => {
    const body = document.body
    const html = document.documentElement
    
    // Remove all existing theme classes
    Object.keys(THEMES).forEach(id => {
      body.classList.remove(`theme-${id}`)
      html.classList.remove(`theme-${id}`)
    })
    
    // Add new theme class
    body.classList.add(`theme-${themeId}`)
    html.classList.add(`theme-${themeId}`)
    
    // Set CSS custom properties for dynamic styling
    const theme = getTheme(themeId)
    const root = document.documentElement
    
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value)
    })
    
    // Set font family
    root.style.setProperty('--theme-font', theme.font)
  }

  // Load theme from game metadata or localStorage
  const loadTheme = async () => {
    setLoading(true)
    try {
      let savedThemeId = 'christmas' // default
      
      if (user) {
        // Try to load theme from database first
        await loadThemeFromDatabase()
      } else {
        // For non-authenticated users, check localStorage
        const localTheme = localStorage.getItem('selectedTheme')
        if (localTheme && THEMES[localTheme]) {
          setThemeIdState(localTheme)
          setCurrentTheme(getTheme(localTheme))
          applyThemeToDocument(localTheme)
        }
      }
      
      // Check if it's a secret theme that was set via URL
      const urlParams = new URLSearchParams(window.location.search)
      const urlTheme = urlParams.get('theme')
      if (urlTheme && THEMES[urlTheme]) {
        setThemeIdState(urlTheme)
        setCurrentTheme(getTheme(urlTheme))
        applyThemeToDocument(urlTheme)
      }
      
    } catch (error) {
      console.error('Error loading theme:', error)
      // Fallback to default theme
      setThemeIdState('christmas')
      setCurrentTheme(THEMES.christmas)
      applyThemeToDocument('christmas')
    } finally {
      setLoading(false)
    }
  }

  // Load theme on mount and when user changes
  useEffect(() => {
    loadTheme()
  }, [user])

  // Listen for theme changes via custom events (for database manipulation)
  useEffect(() => {
    const handleThemeChange = (event: CustomEvent) => {
      const newThemeId = event.detail.themeId
      if (THEMES[newThemeId]) {
        setTheme(newThemeId)
      }
    }

    window.addEventListener('themeChange', handleThemeChange as EventListener)
    return () => {
      window.removeEventListener('themeChange', handleThemeChange as EventListener)
    }
  }, [])

  const contextValue: ThemeContextType = {
    currentTheme,
    themeId,
    setTheme,
    availableThemes,
    isSecretTheme,
    canAccessTheme,
    loading,
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Utility function to manually trigger theme change (for database manipulation)
export const triggerThemeChange = (themeId: string) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('themeChange', { 
      detail: { themeId } 
    }))
  }
}

// Export for use in admin functions or database manipulation
export const switchToSecretTheme = (themeId: string) => {
  if (THEMES[themeId]?.isSecret) {
    triggerThemeChange(themeId)
    localStorage.setItem('selectedTheme', themeId)
  }
}
