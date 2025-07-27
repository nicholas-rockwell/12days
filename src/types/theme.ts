// Theme System Types and Definitions
// This file defines all available themes and their properties

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  backgroundGradient: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  card: string;
  cardHover: string;
}

export interface ThemeAssets {
  backgroundImage?: string;
  backgroundVideo?: string;
  sounds: {
    presentOpen: string;
    challenge: string;
    success: string;
    click: string;
  };
  icons: {
    currency: string;
    present: string;
    challenge: string;
    trophy: string;
  };
}

export interface ThemeConfig {
  id: string;
  name: string;
  displayName: string;
  description: string;
  colors: ThemeColors;
  assets: ThemeAssets;
  font: string;
  isSecret: boolean;
  unlockCondition?: string;
  category: 'seasonal' | 'event' | 'special' | 'secret' | 'developer';
}

// Theme definitions
export const THEMES: Record<string, ThemeConfig> = {
  christmas: {
    id: 'christmas',
    name: 'christmas',
    displayName: 'Christmas Magic',
    description: 'Classic Christmas theme with festive reds and greens',
    colors: {
      primary: '#dc2626', // red-600
      secondary: '#16a34a', // green-600
      accent: '#f59e0b', // amber-500
      background: '#435649',
      backgroundGradient: 'linear-gradient(135deg, #435649 0%, #2d4934 50%, #435649 100%)',
      text: '#ffffff',
      textSecondary: '#e5e7eb',
      border: '#374151',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      card: 'rgba(255, 255, 255, 0.1)',
      cardHover: 'rgba(255, 255, 255, 0.2)',
    },
    assets: {
      backgroundImage: '/themes/christmas/bg.jpg',
      sounds: {
        presentOpen: '/themes/christmas/sounds/present-open.mp3',
        challenge: '/themes/christmas/sounds/bell.mp3',
        success: '/themes/christmas/sounds/success.mp3',
        click: '/themes/christmas/sounds/click.mp3',
      },
      icons: {
        currency: '🔔',
        present: '🎁',
        challenge: '🎄',
        trophy: '🏆',
      },
    },
    font: "'Press Start 2P', cursive",
    isSecret: false,
    category: 'seasonal',
  },

  halloween: {
    id: 'halloween',
    name: 'halloween',
    displayName: 'Spooky Halloween',
    description: 'Halloween theme with orange and black colors',
    colors: {
      primary: '#f97316', // orange-500
      secondary: '#7c2d12', // orange-900
      accent: '#fbbf24', // amber-400
      background: '#1f2937',
      backgroundGradient: 'linear-gradient(135deg, #1f2937 0%, #111827 50%, #1f2937 100%)',
      text: '#f97316',
      textSecondary: '#d1d5db',
      border: '#374151',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      card: 'rgba(249, 115, 22, 0.1)',
      cardHover: 'rgba(249, 115, 22, 0.2)',
    },
    assets: {
      backgroundImage: '/themes/halloween/bg.jpg',
      sounds: {
        presentOpen: '/themes/halloween/sounds/spooky-open.mp3',
        challenge: '/themes/halloween/sounds/ghost.mp3',
        success: '/themes/halloween/sounds/cackle.mp3',
        click: '/themes/halloween/sounds/click.mp3',
      },
      icons: {
        currency: '🎃',
        present: '👻',
        challenge: '🕷️',
        trophy: '💀',
      },
    },
    font: "'Press Start 2P', cursive",
    isSecret: false,
    category: 'seasonal',
  },

  fourth_july: {
    id: 'fourth_july',
    name: 'fourth_july',
    displayName: 'Independence Day',
    description: 'Patriotic red, white, and blue theme',
    colors: {
      primary: '#dc2626', // red-600
      secondary: '#2563eb', // blue-600
      accent: '#ffffff',
      background: '#1e40af',
      backgroundGradient: 'linear-gradient(135deg, #1e40af 0%, #dc2626 50%, #ffffff 100%)',
      text: '#ffffff',
      textSecondary: '#e5e7eb',
      border: '#374151',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      card: 'rgba(255, 255, 255, 0.15)',
      cardHover: 'rgba(255, 255, 255, 0.25)',
    },
    assets: {
      backgroundImage: '/themes/july4/bg.jpg',
      sounds: {
        presentOpen: '/themes/july4/sounds/firework.mp3',
        challenge: '/themes/july4/sounds/eagle.mp3',
        success: '/themes/july4/sounds/cheer.mp3',
        click: '/themes/july4/sounds/click.mp3',
      },
      icons: {
        currency: '🇺🇸',
        present: '🎆',
        challenge: '🦅',
        trophy: '⭐',
      },
    },
    font: "'Press Start 2P', cursive",
    isSecret: false,
    category: 'event',
  },

  // SECRET THEMES (only accessible via database manipulation)
  matrix: {
    id: 'matrix',
    name: 'matrix',
    displayName: 'Matrix Code',
    description: 'Green code rain like The Matrix',
    colors: {
      primary: '#00ff00', // bright green
      secondary: '#008000', // green
      accent: '#00ff41',
      background: '#000000',
      backgroundGradient: 'linear-gradient(135deg, #000000 0%, #001100 50%, #000000 100%)',
      text: '#00ff00',
      textSecondary: '#008000',
      border: '#00ff00',
      success: '#00ff00',
      warning: '#ffff00',
      error: '#ff0000',
      card: 'rgba(0, 255, 0, 0.1)',
      cardHover: 'rgba(0, 255, 0, 0.2)',
    },
    assets: {
      backgroundImage: '/themes/matrix/bg.gif',
      sounds: {
        presentOpen: '/themes/matrix/sounds/digital.mp3',
        challenge: '/themes/matrix/sounds/blip.mp3',
        success: '/themes/matrix/sounds/access.mp3',
        click: '/themes/matrix/sounds/type.mp3',
      },
      icons: {
        currency: '₿',
        present: '📦',
        challenge: '💻',
        trophy: '👑',
      },
    },
    font: "'Courier New', monospace",
    isSecret: true,
    category: 'secret',
    unlockCondition: 'Database manipulation only',
  },

  developer: {
    id: 'developer',
    name: 'developer',
    displayName: 'Developer Mode',
    description: 'Dark theme optimized for development',
    colors: {
      primary: '#3b82f6', // blue-500
      secondary: '#6366f1', // indigo-500
      accent: '#10b981', // emerald-500
      background: '#0f172a',
      backgroundGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      text: '#f1f5f9',
      textSecondary: '#cbd5e1',
      border: '#475569',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      card: 'rgba(59, 130, 246, 0.1)',
      cardHover: 'rgba(59, 130, 246, 0.2)',
    },
    assets: {
      backgroundImage: '/themes/developer/bg.jpg',
      sounds: {
        presentOpen: '/themes/developer/sounds/deploy.mp3',
        challenge: '/themes/developer/sounds/compile.mp3',
        success: '/themes/developer/sounds/build-success.mp3',
        click: '/themes/developer/sounds/key.mp3',
      },
      icons: {
        currency: '⚡',
        present: '📱',
        challenge: '🚀',
        trophy: '🎯',
      },
    },
    font: "'Fira Code', 'Consolas', monospace",
    isSecret: true,
    category: 'developer',
    unlockCondition: 'Nicholas developer access only',
  },

  debug: {
    id: 'debug',
    name: 'debug',
    displayName: 'Debug Mode',
    description: 'High contrast theme for debugging',
    colors: {
      primary: '#ff00ff', // magenta
      secondary: '#00ffff', // cyan
      accent: '#ffff00', // yellow
      background: '#ffffff',
      backgroundGradient: 'linear-gradient(45deg, #ff00ff 0%, #00ffff 50%, #ffff00 100%)',
      text: '#000000',
      textSecondary: '#333333',
      border: '#000000',
      success: '#00ff00',
      warning: '#ff8800',
      error: '#ff0000',
      card: 'rgba(0, 0, 0, 0.1)',
      cardHover: 'rgba(0, 0, 0, 0.2)',
    },
    assets: {
      backgroundImage: '/themes/debug/bg.png',
      sounds: {
        presentOpen: '/themes/debug/sounds/error.mp3',
        challenge: '/themes/debug/sounds/beep.mp3',
        success: '/themes/debug/sounds/ding.mp3',
        click: '/themes/debug/sounds/click.mp3',
      },
      icons: {
        currency: '🔧',
        present: '📊',
        challenge: '🐛',
        trophy: '✅',
      },
    },
    font: "'Courier New', monospace",
    isSecret: true,
    category: 'developer',
    unlockCondition: 'Debug mode only',
  },
};

export const getTheme = (themeId: string): ThemeConfig => {
  return THEMES[themeId] || THEMES.christmas;
};

export const getAvailableThemes = (includeSecret: boolean = false): ThemeConfig[] => {
  return Object.values(THEMES).filter(theme => includeSecret || !theme.isSecret);
};

export const isSecretTheme = (themeId: string): boolean => {
  return THEMES[themeId]?.isSecret || false;
};
