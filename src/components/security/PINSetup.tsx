'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { sanitizePIN } from '@/lib/sanitize'
import { GlowButton } from '@/components/common/GlowButton'

interface PINSetupProps {
  onComplete: (pin: string) => Promise<void>
  onCancel: () => void
}

type Step = 'enter' | 'confirm'

function PINDots({ value, length = 6 }: { value: string; length?: number }) {
  return (
    <div className="flex gap-3 justify-center" aria-hidden="true">
      {Array.from({ length }).map((_, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full transition-colors ${i < value.length ? 'bg-[#7c5cfc]' : 'bg-white/10'}`}
        />
      ))}
    </div>
  )
}

const NUMPAD = ['1','2','3','4','5','6','7','8','9','','0','⌫'] as const

export function PINSetup({ onComplete, onCancel }: PINSetupProps) {
  const [step, setStep] = useState<Step>('enter')
  const [pin, setPIN] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const current = step === 'enter' ? pin : confirm
  const setter = step === 'enter' ? setPIN : setConfirm

  const handleKey = useCallback((key: string) => {
    setError('')
    if (key === '⌫') {
      setter((v) => v.slice(0, -1))
      return
    }
    if (current.length >= 8) return
    const next = sanitizePIN(current + key)
    setter(next)

    if (next.length >= 4 && step === 'enter') {
      if (next.length === pin.length + 1 || next.length >= 4) {
        // Wait for user to press next
      }
    }
  }, [current, step, pin.length, setter])

  const handleNext = useCallback(async () => {
    if (step === 'enter') {
      if (pin.length < 4) { setError('PIN must be at least 4 digits'); return }
      setStep('confirm')
    } else {
      if (confirm !== pin) { setError('PINs do not match'); setConfirm(''); return }
      setLoading(true)
      try {
        await onComplete(pin)
      } finally {
        setLoading(false)
      }
    }
  }, [step, pin, confirm, onComplete])

  return (
    <div className="flex flex-col items-center gap-6 px-6 py-8">
      <div className="text-center">
        <h2 className="font-sora font-semibold text-xl text-white">
          {step === 'enter' ? 'Create PIN' : 'Confirm PIN'}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {step === 'enter' ? 'Choose a 4–8 digit PIN' : 'Enter your PIN again'}
        </p>
      </div>

      <PINDots value={current} length={Math.max(current.length, 4)} />

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-400"
          role="alert"
        >
          {error}
        </motion.p>
      )}

      <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
        {NUMPAD.map((key, i) => (
          <button
            key={i}
            onClick={() => key && handleKey(key)}
            disabled={!key || loading}
            className={`h-14 rounded-[12px] text-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7c5cfc] ${
              key
                ? 'bg-white/[0.06] text-white hover:bg-white/10 active:bg-white/15'
                : 'invisible'
            }`}
            aria-label={key === '⌫' ? 'Backspace' : key || undefined}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="flex gap-3 w-full max-w-[240px]">
        <GlowButton variant="ghost" fullWidth onClick={onCancel}>Cancel</GlowButton>
        <GlowButton
          variant="purple"
          fullWidth
          onClick={handleNext}
          disabled={current.length < 4 || loading}
        >
          {loading ? 'Setting up...' : step === 'enter' ? 'Next' : 'Confirm'}
        </GlowButton>
      </div>
    </div>
  )
}
