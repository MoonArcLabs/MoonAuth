'use client'

import { motion } from 'framer-motion'
import { LogoFull } from '@/components/common/Logo'

interface HeaderProps {
  onSettings: () => void
  onLock: () => void
  hasPIN: boolean
}

export function Header({ onSettings, onLock, hasPIN }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 h-12 border-b border-white/[0.04]">
      <LogoFull />
      <div className="flex items-center gap-1">
        {hasPIN && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onLock}
            className="w-9 h-9 flex items-center justify-center rounded-[10px] text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Lock app"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
              <path d="M13 8V6a4 4 0 1 0-8 0v2H3v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8h-2zm-6-2a2 2 0 1 1 4 0v2H7V6zm2 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
            </svg>
          </motion.button>
        )}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onSettings}
          className="w-9 h-9 flex items-center justify-center rounded-[10px] text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Settings"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
            <path d="M9 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm7-2a7 7 0 0 0-.08-1l1.5-1.17-1.5-2.6-1.75.7A7 7 0 0 0 13 4.1L12.5 2h-3L9 4.1a7 7 0 0 0-1.17.83L6.08 4.23l-1.5 2.6 1.5 1.17A7 7 0 0 0 6 9a7 7 0 0 0 .08 1L4.58 11.17l1.5 2.6 1.75-.7A7 7 0 0 0 9 13.9l.5 2.1h3l.5-2.1a7 7 0 0 0 1.17-.83l1.75.7 1.5-2.6L15.92 10A7 7 0 0 0 16 9z" />
          </svg>
        </motion.button>
      </div>
    </header>
  )
}
