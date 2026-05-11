'use client'

import { motion } from 'framer-motion'

interface BottomBarProps {
  onAdd: () => void
}

export function BottomBar({ onAdd }: BottomBarProps) {
  return (
    <div className="px-4 pt-3 border-t border-white/[0.04]" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}>
      <motion.button
        onClick={onAdd}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="w-full h-12 flex items-center justify-center gap-2 bg-[#7c5cfc] rounded-[12px] text-white font-medium text-sm shadow-glow-purple transition-colors hover:bg-[#8d6ffd]"
        aria-label="Add account"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
          <path d="M9 2a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H3a1 1 0 1 1 0-2h5V3a1 1 0 0 1 1-1z" />
        </svg>
        Add Account
      </motion.button>
    </div>
  )
}
