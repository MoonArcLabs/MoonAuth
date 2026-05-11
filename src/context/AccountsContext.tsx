'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from 'react'
import type { Account, AccountWithCode } from '@/types/account'
import type { ParsedOtpAuth } from '@/lib/totp'
import { generateTOTP, getTimeRemaining, getTimeProgress } from '@/lib/totp'
import { saveAccount, loadAccounts, deleteAccount as dbDeleteAccount } from '@/lib/storage'
import { useSecurityContext } from './SecurityContext'

interface AccountsContextValue {
  accounts: AccountWithCode[]
  isLoading: boolean
  addAccount: (config: ParsedOtpAuth) => Promise<void>
  updateAccount: (id: string, updates: Partial<Account>) => Promise<void>
  deleteAccount: (id: string) => Promise<void>
  importAccounts: (accounts: Account[]) => Promise<void>
  refresh: () => Promise<void>
}

const AccountsContext = createContext<AccountsContextValue | null>(null)

async function attachCodes(accounts: Account[]): Promise<AccountWithCode[]> {
  return Promise.all(
    accounts.map(async (acc) => {
      try {
        const code = await generateTOTP(acc.secret, {
          algorithm: acc.algorithm,
          digits: acc.digits,
          period: acc.period,
        })
        return {
          ...acc,
          code,
          nextCode: code,
          timeRemaining: getTimeRemaining(acc.period),
          progress: getTimeProgress(acc.period),
        }
      } catch {
        return {
          ...acc,
          code: '------',
          nextCode: '------',
          timeRemaining: getTimeRemaining(acc.period),
          progress: getTimeProgress(acc.period),
        }
      }
    })
  )
}

export function AccountsProvider({ children }: { children: ReactNode }) {
  const [rawAccounts, setRawAccounts] = useState<Account[]>([])
  const [accounts, setAccounts] = useState<AccountWithCode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { cryptoKey } = useSecurityContext()
  const rawAccountsRef = useRef<Account[]>([])

  rawAccountsRef.current = rawAccounts

  const refresh = useCallback(async () => {
    setIsLoading(true)
    try {
      const loaded = await loadAccounts(cryptoKey ?? undefined)
      setRawAccounts(loaded)
      rawAccountsRef.current = loaded
      const withCodes = await attachCodes(loaded)
      setAccounts(withCodes)
    } catch {
      // ignore
    } finally {
      setIsLoading(false)
    }
  }, [cryptoKey])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    const interval = setInterval(async () => {
      const current = rawAccountsRef.current
      if (current.length === 0) return
      const withCodes = await attachCodes(current)
      setAccounts(withCodes)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const addAccount = useCallback(
    async (config: ParsedOtpAuth) => {
      const account: Account = {
        id: crypto.randomUUID(),
        name: config.label,
        issuer: config.issuer,
        secret: config.secret,
        algorithm: config.algorithm,
        digits: config.digits,
        period: config.period,
        addedAt: Date.now(),
        updatedAt: Date.now(),
      }
      await saveAccount(account, cryptoKey ?? undefined)
      // Re-read from DB to confirm save succeeded
      const loaded = await loadAccounts(cryptoKey ?? undefined)
      setRawAccounts(loaded)
      rawAccountsRef.current = loaded
      const withCodes = await attachCodes(loaded)
      setAccounts(withCodes)
    },
    [cryptoKey]
  )

  const updateAccount = useCallback(
    async (id: string, updates: Partial<Account>) => {
      const updated = rawAccountsRef.current.map((a) =>
        a.id === id ? { ...a, ...updates, updatedAt: Date.now() } : a
      )
      const target = updated.find((a) => a.id === id)
      if (target) await saveAccount(target, cryptoKey ?? undefined)
      setRawAccounts(updated)
      rawAccountsRef.current = updated
      const withCodes = await attachCodes(updated)
      setAccounts(withCodes)
    },
    [cryptoKey]
  )

  const deleteAccount = useCallback(async (id: string) => {
    await dbDeleteAccount(id)
    const updated = rawAccountsRef.current.filter((a) => a.id !== id)
    setRawAccounts(updated)
    rawAccountsRef.current = updated
    const withCodes = await attachCodes(updated)
    setAccounts(withCodes)
  }, [])

  const importAccounts = useCallback(
    async (toImport: Account[]) => {
      for (const acc of toImport) {
        await saveAccount(acc, cryptoKey ?? undefined)
      }
      const loaded = await loadAccounts(cryptoKey ?? undefined)
      setRawAccounts(loaded)
      rawAccountsRef.current = loaded
      const withCodes = await attachCodes(loaded)
      setAccounts(withCodes)
    },
    [cryptoKey]
  )

  return (
    <AccountsContext.Provider
      value={{ accounts, isLoading, addAccount, updateAccount, deleteAccount, importAccounts, refresh }}
    >
      {children}
    </AccountsContext.Provider>
  )
}

export function useAccountsContext(): AccountsContextValue {
  const ctx = useContext(AccountsContext)
  if (!ctx) throw new Error('useAccountsContext must be used within AccountsProvider')
  return ctx
}
