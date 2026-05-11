'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { AccountWithCode } from '@/types/account'
import { AccountCard } from './AccountCard'
import { EmptyState } from './EmptyState'

interface AccountListProps {
  accounts: AccountWithCode[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onAdd: () => void
  isFiltered: boolean
}

export function AccountList({ accounts, onEdit, onDelete, onAdd, isFiltered }: AccountListProps) {
  if (accounts.length === 0 && !isFiltered) {
    return <EmptyState onAdd={onAdd} />
  }

  if (accounts.length === 0 && isFiltered) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-gray-500 text-sm">No accounts match your search</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3" role="list" aria-label="Authenticator accounts">
      <AnimatePresence initial={false}>
        {accounts.map((account, i) => (
          <motion.div
            key={account.id}
            role="listitem"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
            transition={{
              enter: { delay: i * 0.03, type: 'spring', damping: 25, stiffness: 400 },
              exit: { duration: 0.2 },
            }}
          >
            <AccountCard account={account} onEdit={onEdit} onDelete={onDelete} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
