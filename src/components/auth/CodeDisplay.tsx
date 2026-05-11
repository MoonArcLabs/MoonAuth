'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/hooks/useToast'

interface CodeDisplayProps {
  code: string
  digits?: 6 | 8
}

export function CodeDisplay({ code, digits = 6 }: CodeDisplayProps) {
  const [copied, setCopied] = useState(false)
  const { addToast } = useToast()

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      addToast('Code copied', 'success')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      addToast('Copy failed', 'error')
    }
  }, [code, addToast])

  const mid = Math.floor(digits / 2)
  const part1 = code.slice(0, mid)
  const part2 = code.slice(mid)

  return (
    <div className="flex items-center gap-2">
      <AnimatePresence mode="wait">
        <motion.span
          key={code}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="font-mono text-[28px] font-bold text-white tracking-wider tabular-nums"
          aria-label={`Code: ${code.split('').join(' ')}`}
        >
          {part1} {part2}
        </motion.span>
      </AnimatePresence>

      <motion.button
        onClick={handleCopy}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-8 h-8 flex items-center justify-center rounded-[8px] text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Copy code"
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.svg
              key="check"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              width="16" height="16" viewBox="0 0 16 16" fill="none"
            >
              <path d="M3 8l3.5 3.5L13 4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          ) : (
            <motion.svg
              key="copy"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              width="16" height="16" viewBox="0 0 16 16" fill="currentColor"
            >
              <path d="M10 2H3a1 1 0 0 0-1 1v9h1V3h7V2zm3 2H6a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zm0 10H6V5h7v9z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
