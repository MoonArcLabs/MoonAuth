'use client'

import { useState, useCallback } from 'react'
import { Modal } from '@/components/common/Modal'
import { QRScanner } from './QRScanner'
import { ManualEntryForm } from './ManualEntryForm'
import type { ParsedOtpAuth } from '@/lib/totp'
import { GlowButton } from '@/components/common/GlowButton'
import { TimerRing } from './TimerRing'
import { useTOTP } from '@/hooks/useTOTP'

interface AddAccountModalProps {
  open: boolean
  onClose: () => void
  onAdd: (parsed: ParsedOtpAuth) => Promise<void>
}

type Tab = 'scan' | 'manual'
type Step = 'select' | 'scan' | 'manual' | 'confirm'

function ConfirmStep({ parsed, onConfirm, onBack }: { parsed: ParsedOtpAuth; onConfirm: () => void; onBack: () => void }) {
  const { code, timeRemaining } = useTOTP({
    secret: parsed.secret,
    algorithm: parsed.algorithm,
    digits: parsed.digits,
    period: parsed.period,
  })
  const mid = parsed.digits / 2
  return (
    <div className="px-5 py-5 flex flex-col gap-5">
      <div className="bg-[#111] rounded-[16px] border border-white/[0.06] p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#7c5cfc]/20 border border-[#7c5cfc]/30 flex items-center justify-center text-lg font-bold text-[#7c5cfc]">
          {(parsed.issuer || parsed.label).charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-semibold text-white">{parsed.issuer || parsed.label}</div>
          {parsed.issuer && <div className="text-sm text-gray-500">{parsed.label}</div>}
        </div>
      </div>

      <div className="flex items-center justify-between bg-[#0a0a0a] rounded-[12px] px-4 py-4 border border-white/[0.04]">
        <span className="font-mono text-3xl font-bold text-white tracking-wider">
          {code.slice(0, mid)} {code.slice(mid)}
        </span>
        <TimerRing timeRemaining={timeRemaining} period={parsed.period} size={40} />
      </div>

      <div className="flex gap-3">
        <GlowButton variant="ghost" fullWidth onClick={onBack}>Back</GlowButton>
        <GlowButton variant="purple" fullWidth onClick={onConfirm}>Save Account</GlowButton>
      </div>
    </div>
  )
}

export function AddAccountModal({ open, onClose, onAdd }: AddAccountModalProps) {
  const [step, setStep] = useState<Step>('select')
  const [pending, setPending] = useState<ParsedOtpAuth | null>(null)
  const [scanning, setScanning] = useState(false)

  const reset = useCallback(() => {
    setStep('select')
    setPending(null)
    setScanning(false)
  }, [])

  const handleClose = useCallback(() => {
    reset()
    onClose()
  }, [reset, onClose])

  const handleQRSuccess = useCallback((parsed: ParsedOtpAuth) => {
    setScanning(false)
    setPending(parsed)
    setStep('confirm')
  }, [])

  const handleManualSubmit = useCallback((parsed: ParsedOtpAuth) => {
    setPending(parsed)
    setStep('confirm')
  }, [])

  const handleConfirm = useCallback(async () => {
    if (!pending) return
    await onAdd(pending)
    handleClose()
  }, [pending, onAdd, handleClose])

  if (scanning) {
    return (
      <QRScanner
        onSuccess={handleQRSuccess}
        onClose={() => setScanning(false)}
        onManualEntry={() => { setScanning(false); setStep('manual') }}
      />
    )
  }

  return (
    <Modal open={open} onClose={handleClose} title={step === 'confirm' ? 'Confirm Account' : 'Add Account'}>
      {step === 'select' && (
        <div className="px-5 py-5 flex flex-col gap-3">
          <button
            onClick={() => setScanning(true)}
            className="flex items-center gap-4 p-4 bg-[#111] rounded-[12px] border border-white/[0.06] hover:bg-[#161616] transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-full bg-[#7c5cfc]/15 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="2" width="6" height="6" rx="1" stroke="#7c5cfc" strokeWidth="1.5" />
                <rect x="12" y="2" width="6" height="6" rx="1" stroke="#7c5cfc" strokeWidth="1.5" />
                <rect x="2" y="12" width="6" height="6" rx="1" stroke="#7c5cfc" strokeWidth="1.5" />
                <rect x="14" y="14" width="2" height="2" fill="#7c5cfc" />
                <rect x="12" y="12" width="2" height="2" fill="#7c5cfc" />
                <rect x="16" y="12" width="2" height="2" fill="#7c5cfc" />
                <rect x="12" y="16" width="2" height="2" fill="#7c5cfc" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-white text-sm">Scan QR Code</div>
              <div className="text-xs text-gray-500 mt-0.5">Use your camera to scan</div>
            </div>
          </button>

          <button
            onClick={() => setStep('manual')}
            className="flex items-center gap-4 p-4 bg-[#111] rounded-[12px] border border-white/[0.06] hover:bg-[#161616] transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-full bg-[#4f8ef7]/15 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 5h14M3 10h14M3 15h8" stroke="#4f8ef7" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-white text-sm">Enter Manually</div>
              <div className="text-xs text-gray-500 mt-0.5">Type your secret key</div>
            </div>
          </button>

          <div className="pt-1 pb-2">
            <GlowButton variant="ghost" fullWidth onClick={handleClose}>Cancel</GlowButton>
          </div>
        </div>
      )}

      {step === 'manual' && (
        <ManualEntryForm onSubmit={handleManualSubmit} onCancel={() => setStep('select')} />
      )}

      {step === 'confirm' && pending && (
        <ConfirmStep parsed={pending} onConfirm={handleConfirm} onBack={() => setStep('select')} />
      )}
    </Modal>
  )
}
