'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AccountList } from '@/components/auth/AccountList'
import { AddAccountModal } from '@/components/auth/AddAccountModal'
import { EditAccountModal } from '@/components/auth/EditAccountModal'
import { DeleteConfirmModal } from '@/components/auth/DeleteConfirmModal'
import { Header } from '@/components/layout/Header'
import { BottomBar } from '@/components/layout/BottomBar'
import { SearchBar } from '@/components/auth/SearchBar'
import { SettingsPanel } from '@/components/settings/SettingsPanel'
import { LockScreen } from '@/components/security/LockScreen'
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow'
import { InstallPrompt } from '@/components/layout/InstallPrompt'
import { Spinner } from '@/components/common/Spinner'
import { useAccountsContext } from '@/context/AccountsContext'
import { useSecurityContext } from '@/context/SecurityContext'
import { useSearch } from '@/hooks/useSearch'
import { useAutoLock } from '@/hooks/useAutoLock'
import { ONBOARDING_KEY } from '@/lib/constants'
import type { Account } from '@/types/account'
import type { ParsedOtpAuth } from '@/lib/totp'

export default function HomePage() {
  const { accounts, isLoading, addAccount, updateAccount, deleteAccount } = useAccountsContext()
  const { isLocked, hasPIN, lock } = useSecurityContext()
  const { query, setQuery, filtered, clear } = useSearch(accounts)
  const [addOpen, setAddOpen] = useState(false)
  const [editAccount, setEditAccount] = useState<Account | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Account | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [onboarding, setOnboarding] = useState(false)

  useAutoLock()

  useEffect(() => {
    const done = localStorage.getItem(ONBOARDING_KEY)
    if (!done) setOnboarding(true)
  }, [])

  const handleEdit = useCallback(
    (id: string) => {
      const acc = accounts.find((a) => a.id === id)
      if (acc) setEditAccount(acc)
    },
    [accounts]
  )

  const handleDelete = useCallback(
    (id: string) => {
      const acc = accounts.find((a) => a.id === id)
      if (acc) setDeleteTarget(acc)
    },
    [accounts]
  )

  const handleAdd = useCallback(
    async (parsed: ParsedOtpAuth) => {
      await addAccount(parsed)
    },
    [addAccount]
  )

  if (onboarding) {
    return <OnboardingFlow onComplete={() => setOnboarding(false)} />
  }

  if (isLocked) {
    return <LockScreen />
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col h-dvh max-h-dvh bg-black"
    >
      <Header
        onSettings={() => setSettingsOpen(true)}
        onLock={lock}
        hasPIN={hasPIN}
      />

      <div className="px-4 pt-3 pb-2">
        <SearchBar query={query} onChange={setQuery} onClear={clear} />
      </div>

      <main className="flex-1 overflow-y-auto px-4 pb-2 scrollbar-hide">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-20"
            >
              <Spinner size={32} className="text-[#7c5cfc]" />
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <AccountList
                accounts={filtered}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={() => setAddOpen(true)}
                isFiltered={!!query}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomBar onAdd={() => setAddOpen(true)} />

      <AddAccountModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAdd}
      />

      <EditAccountModal
        account={editAccount}
        open={!!editAccount}
        onClose={() => setEditAccount(null)}
        onSave={updateAccount}
      />

      <DeleteConfirmModal
        account={deleteTarget}
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={deleteAccount}
      />

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <InstallPrompt />
    </motion.div>
  )
}
