'use client'

import { useState } from 'react'
import { GlowButton } from '@/components/common/GlowButton'
import { useAccountsContext } from '@/context/AccountsContext'
import { useSettingsContext } from '@/context/SettingsContext'
import { exportBackup, downloadBackup } from '@/lib/backup'
import { useToast } from '@/hooks/useToast'

export function BackupExport() {
  const { accounts } = useAccountsContext()
  const { settings } = useSettingsContext()
  const { addToast } = useToast()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    if (!password || password !== confirm) {
      addToast('Passwords do not match', 'error')
      return
    }
    if (password.length < 8) {
      addToast('Password must be at least 8 characters', 'error')
      return
    }
    setLoading(true)
    try {
      const content = await exportBackup(
        accounts.map(({ code: _c, nextCode: _n, timeRemaining: _t, progress: _p, ...acc }) => acc),
        settings,
        password
      )
      downloadBackup(content)
      addToast('Backup exported successfully', 'success')
      setPassword('')
      setConfirm('')
    } catch {
      addToast('Export failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-gray-500">
        Create an encrypted backup of all your accounts. Store it somewhere safe.
      </p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Backup password"
        className="w-full bg-[#0f0f0f] border border-white/[0.06] rounded-[10px] px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/20"
      />
      <input
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="Confirm password"
        className="w-full bg-[#0f0f0f] border border-white/[0.06] rounded-[10px] px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/20"
      />
      <GlowButton variant="blue" fullWidth onClick={handleExport} disabled={loading}>
        {loading ? 'Exporting...' : `Export Backup (${accounts.length} accounts)`}
      </GlowButton>
    </div>
  )
}
