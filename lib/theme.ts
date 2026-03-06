// Theme configuration for consistent styling across the app
export const theme = {
  colors: {
    // Primary colors
    primary: {
      gold: '#D4AF37',
      goldHover: '#c9a227',
      goldDark: '#b8911f',
    },
    // Background colors
    background: {
      dark: '#0F1310',
      card: '#171C18',
      cardHover: '#1a1a1a',
    },
    // Border colors
    border: {
      default: '#26322B',
      light: 'rgba(255, 255, 255, 0.2)',
      dark: '#3a3a3a',
    },
    // Text colors
    text: {
      primary: '#FFFFFF',
      secondary: '#9FB3A6',
      muted: '#7C8C83',
      dark: 'rgb(156 163 175)',
    },
    // Status colors
    status: {
      success: '#00c853',
      successHover: '#00b347',
      error: '#E53935',
      warning: '#FFA726',
      info: '#1e90ff',
      infoHover: '#1a7fd6',
    },
  },
  // Common spacing values
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
  },
  // Border radius
  borderRadius: {
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },
  // Transitions
  transitions: {
    default: 'all 0.3s ease',
    fast: 'all 0.15s ease',
    slow: 'all 0.5s ease',
  },
} as const;

export type Theme = typeof theme;
