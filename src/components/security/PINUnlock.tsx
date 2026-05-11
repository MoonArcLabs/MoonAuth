'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { sanitizePIN } from '@/lib/sanitize'
import { MAX_PIN_ATTEMPTS, PIN_COOLDOWN_BASE } from '@/lib/constants'
import { LogoFull } from '@/components/common/Logo'

interface PINUnlockProps {
  onUnlock: (pin: string) => Promise<boolean>
  onForgot: () => void
}

const NUMPAD = ['1','2','3','4','5','6','7','8','9','','0','⌫'] as const

export function PINUnlock({ onUnlock, onForgot }: PINUnlockProps) {
  const [pin, setPIN] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [cooldown, setCooldown] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setInterval(() => setCooldown((v) => Math.max(0, v - 1)), 1000)
    return () => clearInterval(t)
  }, [cooldown])

  const handleKey = useCallback((key: string) => {
    if (cooldown > 0 || loading) return
    setError('')
    if (key === '⌫') { setPIN((v) => v.slice(0, -1)); return }
    if (pin.length >= 8) return
    const next = sanitizePIN(pin + key)
    setPIN(next)
  }, [pin, cooldown, loading])

  const handleSubmit = useCallback(async () => {
    if (pin.length < 4 || loading || cooldown > 0) return
    setLoading(true)
    try {
      const ok = await onUnlock(pin)
      if (!ok) {
        const newAttempts = attempts + 1
        setAttempts(newAttempts)
        setPIN('')
        if (newAttempts >= MAX_PIN_ATTEMPTS) {
          const wait = PIN_COOLDOWN_BASE * Math.pow(2, newAttempts - MAX_PIN_ATTEMPTS)
          setCooldown(wait)
          setError(`Too many attempts. Wait ${wait}s.`)
        } else {
          setError(`Incorrect PIN. ${MAX_PIN_ATTEMPTS - newAttempts} attempt${MAX_PIN_ATTEMPTS - newAttempts === 1 ? '' : 's'} left.`)
        }
      }
    } finally {
      setLoading(false)
    }
  }, [pin, attempts, cooldown, loading, onUnlock])

  useEffect(() => {
    if (pin.length >= 4 && !loading && cooldown === 0) {
      handleSubmit()
    }
  }, [pin, handleSubmit, loading, cooldown])

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-8 px-6">
      <LogoFull />

      <div className="text-center">
        <p className="text-sm text-gray-500">Enter your PIN to unlock</p>
      </div>

      <div className="flex gap-3 justify-center" aria-label={`${pin.length} digits entered`} role="status">
        {Array.from({ length: Math.max(pin.length, 4) }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors ${i < pin.length ? 'bg-[#7c5cfc]' : 'bg-white/10'}`}
          />
        ))}
      </div>

      {(error || cooldown > 0) && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-400 text-center"
          role="alert"
        >
          {cooldown > 0 ? `Too many attempts. Try again in ${cooldown}s.` : error}
        </motion.p>
      )}

      <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
        {NUMPAD.map((key, i) => (
          <button
            key={i}
            onClick={() => key && handleKey(key)}
            disabled={!key || loading || cooldown > 0}
            className={`h-14 rounded-[12px] text-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7c5cfc] ${
              key && cooldown === 0
                ? 'bg-white/[0.06] text-white hover:bg-white/10 active:bg-white/15'
                : key
                ? 'bg-white/[0.03] text-gray-600'
                : 'invisible'
            }`}
            aria-label={key === '⌫' ? 'Backspace' : key || undefined}
          >
            {key}
          </button>
        ))}
      </div>

      <button
        onClick={onForgot}
        className="text-sm text-gray-500 hover:text-white transition-colors underline underline-offset-2"
      >
        Forgot PIN? (clears all data)
      </button>
    </div>
  )
}
