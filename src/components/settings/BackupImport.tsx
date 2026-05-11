'use client'

import { useState, useRef } from 'react'
import { GlowButton } from '@/components/common/GlowButton'
import { useAccountsContext } from '@/context/AccountsContext'
import { importBackup } from '@/lib/backup'
import { useToast } from '@/hooks/useToast'

export function BackupImport() {
  const { importAccounts } = useAccountsContext()
  const { addToast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleImport = async () => {
    if (!file || !password) { addToast('Select a file and enter the password', 'error'); return }
    setLoading(true)
    try {
      const text = await file.text()
      const payload = await importBackup(text, password)
      await importAccounts(payload.accounts)
      addToast(`Imported ${payload.accounts.length} accounts`, 'success')
      setFile(null)
      setPassword('')
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Import failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-gray-500">Import a .moonauth backup file.</p>
      <button
        onClick={() => inputRef.current?.click()}
        className="w-full border border-dashed border-white/10 rounded-[10px] px-3 py-3 text-sm text-gray-500 hover:border-white/20 hover:text-gray-400 transition-colors text-left"
        aria-label="Choose backup file"
      >
        {file ? file.name : 'Choose .moonauth file'}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".moonauth,application/json"
        className="hidden"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        aria-label="Backup file input"
      />
      {file && (
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Backup password"
          className="w-full bg-[#0f0f0f] border border-white/[0.06] rounded-[10px] px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/20"
        />
      )}
      <GlowButton
        variant="ghost"
        fullWidth
        onClick={handleImport}
        disabled={!file || !password || loading}
      >
        {loading ? 'Importing...' : 'Import Backup'}
      </GlowButton>
    </div>
  )
}
