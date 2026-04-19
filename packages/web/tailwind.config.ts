import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0B',
        surface: '#141415',
        border: '#1E1E20',
        gold: '#C8A97E',
        'text-primary': '#E8E8EA',
        'text-secondary': '#8A8A8E',
        'text-muted': '#5A5A60',
        'status-green': '#22C55E',
        'status-amber': '#F59E0B',
        'status-red': '#EF4444',
        'status-blue': '#3B82F6',
        'status-purple': '#A855F7',
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        card: '14px',
        button: '10px',
        badge: '6px',
      },
    },
  },
  plugins: [],
}

export default config
