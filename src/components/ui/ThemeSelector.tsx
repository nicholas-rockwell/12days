'use client'

import React from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { THEMES, ThemeConfig } from '../../types/theme'

interface ThemeSelectorProps {
  className?: string
  showSecretThemes?: boolean
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
  className = '',
  showSecretThemes = false 
}) => {
  const { currentTheme, themeId, setTheme, availableThemes, isSecretTheme, loading } = useTheme()

  // Get themes to display
  const themesToShow: ThemeConfig[] = showSecretThemes 
    ? Object.values(THEMES)
    : availableThemes

  const handleThemeChange = async (newThemeId: string) => {
    if (loading) return
    
    try {
      await setTheme(newThemeId)
    } catch (error) {
      console.error('Failed to change theme:', error)
    }
  }

  if (loading) {
    return (
      <div className={`theme-selector loading ${className}`}>
        <span className="text-muted">Loading themes...</span>
      </div>
    )
  }

  return (
    <div className={`theme-selector ${className}`}>
      <div className="theme-info mb-4">
        <h3 className="heading-theme text-sm mb-2">Current Theme</h3>
        <div className="card-theme p-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{currentTheme.assets.icons.trophy}</span>
            <div>
              <div className="text-primary font-bold">{currentTheme.displayName}</div>
              <div className="text-muted text-xs">{currentTheme.description}</div>
              {isSecretTheme(themeId) && (
                <span className="text-accent text-xs">🔓 Secret Theme</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="theme-grid">
        <h4 className="subheading-theme text-xs mb-3">Available Themes</h4>
        <div className="grid grid-cols-2 gap-2">
          {themesToShow.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              disabled={loading}
              className={`
                theme-option card-theme p-2 text-left transition-all
                ${themeId === theme.id ? 'border-primary ring-2 ring-primary' : ''}
                ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-accent'}
                ${theme.isSecret ? 'border-dashed' : ''}
              `}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{theme.assets.icons.present}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold truncate">{theme.displayName}</div>
                  <div className="text-xs text-muted truncate">{theme.category}</div>
                  {theme.isSecret && (
                    <div className="text-xs text-warning">🔒 Secret</div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {!showSecretThemes && (
        <div className="secret-theme-hint mt-4">
          <div className="card-theme p-2 text-center">
            <p className="text-xs text-muted">
              Secret themes can be unlocked via database manipulation 🎭
            </p>
          </div>
        </div>
      )}

      <div className="theme-debug mt-4 debug-info">
        <h4 className="text-xs text-warning mb-2">Debug Info</h4>
        <div className="text-xs text-muted space-y-1">
          <div>Theme ID: {themeId}</div>
          <div>Font: {currentTheme.font}</div>
          <div>Category: {currentTheme.category}</div>
          <div>Secret: {isSecretTheme(themeId) ? 'Yes' : 'No'}</div>
        </div>
        
        <div className="mt-2">
          <button 
            onClick={() => {
              // Make secret theme function available globally for testing
              if (typeof window !== 'undefined') {
                (window as any).switchToSecretTheme = (themeId: string) => {
                  // Use direct import instead of require for better compatibility
                  import('../../contexts/ThemeContext').then(module => {
                    if (module.switchToSecretTheme) {
                      module.switchToSecretTheme(themeId)
                    }
                  })
                }
              }
            }}
            className="btn-theme text-xs px-2 py-1"
          >
            Debug Console
          </button>
        </div>
      </div>
    </div>
  )
}

export default ThemeSelector
