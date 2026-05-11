import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sora: ['var(--font-sora)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      colors: {
        bg: {
          primary: '#000000',
          secondary: '#0a0a0a',
          card: '#111111',
          'card-hover': '#161616',
          modal: '#0d0d0d',
          input: '#0f0f0f',
        },
        accent: {
          blue: '#4f8ef7',
          purple: '#7c5cfc',
        },
        silver: '#c0c0c0',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      borderRadius: {
        card: '16px',
        button: '12px',
        input: '10px',
        modal: '20px',
      },
      animation: {
        'scan-line': 'scanLine 2s linear infinite',
        'pulse-ring': 'pulseRing 1s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        scanLine: {
          '0%': { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        pulseRing: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)',
        modal: '0 25px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.06)',
        'glow-purple': '0 0 30px rgba(124,92,252,0.2), 0 0 60px rgba(124,92,252,0.08)',
        'glow-blue': '0 0 30px rgba(79,142,247,0.15)',
      },
    },
  },
  plugins: [],
}

export default config
