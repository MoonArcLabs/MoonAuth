'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { GlowButton } from '@/components/common/GlowButton'

interface BiometricPromptProps {
  onAuthenticate: () => Promise<boolean>
  onFallbackPIN: () => void
}

export function BiometricPrompt({ onAuthenticate, onFallbackPIN }: BiometricPromptProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAuth = async () => {
    setLoading(true)
    setError('')
    try {
      const ok = await onAuthenticate()
      if (!ok) setError('Biometric authentication failed')
    } catch {
      setError('Authentication unavailable')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 py-8 px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-20 h-20 rounded-full bg-[#7c5cfc]/15 border border-[#7c5cfc]/30 flex items-center justify-center"
      >
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path d="M18 6C11.4 6 6 11.4 6 18M18 6c6.6 0 12 5.4 12 12M18 6v4M6 18h4M18 30v-4M30 18h-4" stroke="#7c5cfc" strokeWidth="2" strokeLinecap="round" />
          <path d="M11 18a7 7 0 0 1 14 0" stroke="#7c5cfc" strokeWidth="2" strokeLinecap="round" />
          <circle cx="18" cy="18" r="3" fill="#7c5cfc" />
        </svg>
      </motion.div>

      <div className="text-center">
        <h3 className="font-sora font-semibold text-white">Biometric Unlock</h3>
        <p className="text-sm text-gray-500 mt-1">Use your fingerprint or face to unlock</p>
      </div>

      {error && (
        <p className="text-sm text-red-400 text-center" role="alert">{error}</p>
      )}

      <div className="flex flex-col gap-3 w-full">
        <GlowButton variant="purple" fullWidth onClick={handleAuth} disabled={loading}>
          {loading ? 'Authenticating...' : 'Authenticate'}
        </GlowButton>
        <GlowButton variant="ghost" fullWidth onClick={onFallbackPIN}>
          Use PIN instead
        </GlowButton>
      </div>
    </div>
  )
}
