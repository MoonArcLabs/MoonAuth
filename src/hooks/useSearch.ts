import { useState, useMemo, useCallback } from 'react'
import type { AccountWithCode } from '@/types/account'

export function useSearch(accounts: AccountWithCode[]) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return accounts
    const q = query.toLowerCase()
    return accounts.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.issuer.toLowerCase().includes(q)
    )
  }, [accounts, query])

  const clear = useCallback(() => setQuery(''), [])

  return { query, setQuery, filtered, clear }
}
