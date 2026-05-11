'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { PINUnlock } from './PINUnlock'
import { useSecurityContext } from '@/context/SecurityContext'
import { clearAllData } from '@/lib/storage'
import { GlowButton } from '@/components/common/GlowButton'

export function LockScreen() {
  const { unlock } = useSecurityContext()
  const [showForgot, setShowForgot] = useState(false)
  const [cleared, setCleared] = useState(false)

  const handleForgot = useCallback(async () => {
    const confirmed = window.confirm(
      'This will delete ALL your accounts and settings. Are you absolutely sure?'
    )
    if (!confirmed) return
    await clearAllData()
    setCleared(true)
    window.location.reload()
  }, [])

  if (showForgot) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-6 px-6 z-50"
      >
        <div className="text-center max-w-sm">
          <h2 className="font-sora font-semibold text-xl text-white mb-2">Reset MoonAuth</h2>
          <p className="text-sm text-gray-400">
            This will permanently delete all your accounts, settings, and security data.
            This cannot be undone.
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-[280px]">
          <GlowButton variant="danger" fullWidth onClick={handleForgot}>
            Delete Everything
          </GlowButton>
          <GlowButton variant="ghost" fullWidth onClick={() => setShowForgot(false)}>
            Cancel
          </GlowButton>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50"
    >
      <PINUnlock onUnlock={unlock} onForgot={() => setShowForgot(true)} />
    </motion.div>
  )
}
