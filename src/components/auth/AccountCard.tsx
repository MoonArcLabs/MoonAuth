'use client'

import { memo, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { AccountWithCode } from '@/types/account'
import { TimerRing } from './TimerRing'
import { CodeDisplay } from './CodeDisplay'

interface AccountCardProps {
  account: AccountWithCode
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

const AVATAR_COLORS = [
  '#4f8ef7', '#7c5cfc', '#22c55e', '#f59e0b', '#ef4444',
  '#06b6d4', '#8b5cf6', '#ec4899', '#f97316', '#14b8a6',
]

function getAvatarColor(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

export const AccountCard = memo(function AccountCard({ account, onEdit, onDelete }: AccountCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const color = account.color ?? getAvatarColor(account.id)
  const initial = (account.issuer || account.name).charAt(0).toUpperCase()

  const handleMenuToggle = useCallback(() => setMenuOpen((v) => !v), [])
  const handleEdit = useCallback(() => { setMenuOpen(false); onEdit(account.id) }, [onEdit, account.id])
  const handleDelete = useCallback(() => { setMenuOpen(false); onDelete(account.id) }, [onDelete, account.id])

  return (
    <motion.article
      layout
      className="relative bg-[#111111] border border-white/[0.04] rounded-[16px] p-4 shadow-card hover:bg-[#161616] transition-colors"
      aria-label={`${account.issuer || account.name} account. Code: ${account.code}. Expires in ${account.timeRemaining} seconds.`}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-sora font-bold text-sm"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        >
          {account.icon || initial}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <div className="font-semibold text-[15px] text-white truncate">{account.issuer || account.name}</div>
              {account.issuer && (
                <div className="text-[13px] text-gray-500 truncate">{account.name}</div>
              )}
            </div>
            <TimerRing timeRemaining={account.timeRemaining} period={account.period} size={36} />
          </div>

          <div className="mt-2 flex items-center justify-between">
            <CodeDisplay code={account.code} digits={account.digits} />

            <div className="relative">
              <motion.button
                onClick={handleMenuToggle}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 flex items-center justify-center rounded-[8px] text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Account options"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="8" cy="3" r="1.5" />
                  <circle cx="8" cy="8" r="1.5" />
                  <circle cx="8" cy="13" r="1.5" />
                </svg>
              </motion.button>

              <AnimatePresence>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} aria-hidden="true" />
                    <motion.div
                      role="menu"
                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1 z-20 bg-[#1a1a1a] border border-white/[0.08] rounded-[12px] shadow-modal overflow-hidden min-w-[120px]"
                    >
                      <button
                        role="menuitem"
                        onClick={handleEdit}
                        className="w-full px-4 py-2.5 text-sm text-left text-[#f0f0f0] hover:bg-white/5 transition-colors flex items-center gap-2"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                          <path d="M11.3 1.3a1 1 0 0 1 1.4 1.4L4 11.4l-2 .6.6-2L11.3 1.3z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        role="menuitem"
                        onClick={handleDelete}
                        className="w-full px-4 py-2.5 text-sm text-left text-[#ef4444] hover:bg-red-500/10 transition-colors flex items-center gap-2"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                          <path d="M5 2h4V1a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v1zM1 3h12v1H12l-.9 8.1A1 1 0 0 1 10 13H4a1 1 0 0 1-1-.9L2 4H1V3z" />
                        </svg>
                        Delete
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
})
