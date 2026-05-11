'use client'

import { useState, useCallback } from 'react'
import { Modal } from '@/components/common/Modal'
import { GlowButton } from '@/components/common/GlowButton'
import type { Account } from '@/types/account'
import { sanitizeName, sanitizeIssuer } from '@/lib/sanitize'

interface EditAccountModalProps {
  account: Account | null
  open: boolean
  onClose: () => void
  onSave: (id: string, updates: Partial<Account>) => Promise<void>
}

export function EditAccountModal({ account, open, onClose, onSave }: EditAccountModalProps) {
  const [name, setName] = useState(account?.name ?? '')
  const [issuer, setIssuer] = useState(account?.issuer ?? '')
  const [saving, setSaving] = useState(false)

  const handleSave = useCallback(async () => {
    if (!account) return
    setSaving(true)
    try {
      await onSave(account.id, {
        name: sanitizeName(name),
        issuer: sanitizeIssuer(issuer),
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }, [account, name, issuer, onSave, onClose])

  const handleOpen = useCallback(() => {
    setName(account?.name ?? '')
    setIssuer(account?.issuer ?? '')
  }, [account])

  return (
    <Modal open={open} onClose={onClose} title="Edit Account">
      <div className="px-5 py-5 flex flex-col gap-4" onAnimationStart={handleOpen}>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5" htmlFor="edit-name">
            Account Name
          </label>
          <input
            id="edit-name"
            type="text"
            value={name}
            onChange={(e) => setName(sanitizeName(e.target.value))}
            maxLength={64}
            className="w-full bg-[#0f0f0f] border border-white/[0.06] rounded-[10px] px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/20"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5" htmlFor="edit-issuer">
            Service / Issuer
          </label>
          <input
            id="edit-issuer"
            type="text"
            value={issuer}
            onChange={(e) => setIssuer(sanitizeIssuer(e.target.value))}
            maxLength={64}
            className="w-full bg-[#0f0f0f] border border-white/[0.06] rounded-[10px] px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/20"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <GlowButton variant="ghost" fullWidth onClick={onClose}>Cancel</GlowButton>
          <GlowButton variant="purple" fullWidth onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </GlowButton>
        </div>
      </div>
    </Modal>
  )
}
