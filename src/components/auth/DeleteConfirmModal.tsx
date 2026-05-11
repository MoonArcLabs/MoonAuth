'use client'

import { useCallback, useState } from 'react'
import { Modal } from '@/components/common/Modal'
import { GlowButton } from '@/components/common/GlowButton'
import type { Account } from '@/types/account'

interface DeleteConfirmModalProps {
  account: Account | null
  open: boolean
  onClose: () => void
  onConfirm: (id: string) => Promise<void>
}

export function DeleteConfirmModal({ account, open, onClose, onConfirm }: DeleteConfirmModalProps) {
  const [deleting, setDeleting] = useState(false)

  const handleConfirm = useCallback(async () => {
    if (!account) return
    setDeleting(true)
    try {
      await onConfirm(account.id)
      onClose()
    } finally {
      setDeleting(false)
    }
  }, [account, onConfirm, onClose])

  return (
    <Modal open={open} onClose={onClose} title="Delete Account">
      <div className="px-5 py-5 flex flex-col gap-4">
        <p className="text-sm text-gray-400">
          Are you sure you want to delete{' '}
          <span className="text-white font-medium">{account?.issuer || account?.name}</span>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <GlowButton variant="ghost" fullWidth onClick={onClose}>Cancel</GlowButton>
          <GlowButton variant="danger" fullWidth onClick={handleConfirm} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </GlowButton>
        </div>
      </div>
    </Modal>
  )
}
