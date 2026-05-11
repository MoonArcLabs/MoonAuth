'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
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
      const [code, nextCode] = await Promise.all([
        generateTOTP(acc.secret, { algorithm: acc.algorithm, digits: acc.digits, period: acc.period }),
        generateTOTP(acc.secret, { algorithm: acc.algorithm, digits: acc.digits, period: acc.period }),
      ])
      return {
        ...acc,
        code,
        nextCode,
        timeRemaining: getTimeRemaining(acc.period),
        progress: getTimeProgress(acc.period),
      }
    })
  )
}

export function AccountsProvider({ children }: { children: ReactNode }) {
  const [rawAccounts, setRawAccounts] = useState<Account[]>([])
  const [accounts, setAccounts] = useState<AccountWithCode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { cryptoKey } = useSecurityContext()

  const refresh = useCallback(async () => {
    setIsLoading(true)
    try {
      const loaded = await loadAccounts(cryptoKey ?? undefined)
      setRawAccounts(loaded)
      const withCodes = await attachCodes(loaded)
      setAccounts(withCodes)
    } finally {
      setIsLoading(false)
    }
  }, [cryptoKey])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    const interval = setInterval(async () => {
      const withCodes = await attachCodes(rawAccounts)
      setAccounts(withCodes)
    }, 1000)
    return () => clearInterval(interval)
  }, [rawAccounts])

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
      setRawAccounts((prev) => [...prev, account])
      const withCodes = await attachCodes([...rawAccounts, account])
      setAccounts(withCodes)
    },
    [cryptoKey, rawAccounts]
  )

  const updateAccount = useCallback(
    async (id: string, updates: Partial<Account>) => {
      const updated = rawAccounts.map((a) =>
        a.id === id ? { ...a, ...updates, updatedAt: Date.now() } : a
      )
      const target = updated.find((a) => a.id === id)
      if (target) await saveAccount(target, cryptoKey ?? undefined)
      setRawAccounts(updated)
      const withCodes = await attachCodes(updated)
      setAccounts(withCodes)
    },
    [cryptoKey, rawAccounts]
  )

  const deleteAccount = useCallback(
    async (id: string) => {
      await dbDeleteAccount(id)
      const updated = rawAccounts.filter((a) => a.id !== id)
      setRawAccounts(updated)
      const withCodes = await attachCodes(updated)
      setAccounts(withCodes)
    },
    [rawAccounts]
  )

  const importAccounts = useCallback(
    async (toImport: Account[]) => {
      for (const acc of toImport) {
        await saveAccount(acc, cryptoKey ?? undefined)
      }
      const merged = [...rawAccounts, ...toImport.filter((imp) => !rawAccounts.find((a) => a.id === imp.id))]
      setRawAccounts(merged)
      const withCodes = await attachCodes(merged)
      setAccounts(withCodes)
    },
    [cryptoKey, rawAccounts]
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
