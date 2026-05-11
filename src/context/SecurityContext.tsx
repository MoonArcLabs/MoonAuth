'use client'

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react'
import {
  generateSalt,
  generateKey,
  hashPIN,
  verifyPIN,
} from '@/lib/crypto'
import {
  saveSecurityConfig,
  loadSecurityConfig,
  reEncryptAccounts,
  loadAccounts,
} from '@/lib/storage'

interface SecurityContextValue {
  isLocked: boolean
  hasPIN: boolean
  cryptoKey: CryptoKey | null
  lock: () => void
  unlock: (pin: string) => Promise<boolean>
  setupPIN: (pin: string) => Promise<void>
  removePIN: () => Promise<void>
  checkBiometricAvailable: () => Promise<boolean>
  unlockWithBiometric: () => Promise<boolean>
}

const SecurityContext = createContext<SecurityContextValue | null>(null)

export function SecurityProvider({ children }: { children: ReactNode }) {
  const [isLocked, setIsLocked] = useState(false)
  const [hasPIN, setHasPIN] = useState(false)
  const [cryptoKey, setCryptoKey] = useState<CryptoKey | null>(null)
  const keyRef = useRef<CryptoKey | null>(null)

  const lock = useCallback(() => {
    keyRef.current = null
    setCryptoKey(null)
    setIsLocked(true)
  }, [])

  const unlock = useCallback(async (pin: string): Promise<boolean> => {
    const config = await loadSecurityConfig()
    if (!config) return false

    const salt = Uint8Array.from(atob(config.salt), (c) => c.charCodeAt(0))
    const valid = await verifyPIN(pin, salt, config.pinHash)
    if (!valid) return false

    const key = await generateKey(pin, salt)
    keyRef.current = key
    setCryptoKey(key)
    setIsLocked(false)
    return true
  }, [])

  const setupPIN = useCallback(async (pin: string): Promise<void> => {
    const salt = await generateSalt()
    const saltB64 = btoa(String.fromCharCode(...salt))
    const pinHash = await hashPIN(pin, salt)
    const newKey = await generateKey(pin, salt)

    const existing = await loadAccounts(keyRef.current ?? undefined)
    await reEncryptAccounts(existing, newKey, salt)

    await saveSecurityConfig({ salt: saltB64, pinHash })
    keyRef.current = newKey
    setCryptoKey(newKey)
    setHasPIN(true)
  }, [])

  const removePIN = useCallback(async (): Promise<void> => {
    const existing = await loadAccounts(keyRef.current ?? undefined)
    keyRef.current = null
    setCryptoKey(null)
    setHasPIN(false)
    // Re-encrypt with device key (no PIN)
    const { generateSalt: gs, generateDeviceKey: gdk } = await import('@/lib/crypto')
    const salt = await gs()
    const { DEVICE_SALT_KEY } = await import('@/lib/constants')
    localStorage.setItem(DEVICE_SALT_KEY, btoa(String.fromCharCode(...salt)))
    const key = await gdk(salt)
    await reEncryptAccounts(existing, key, salt)
  }, [])

  const checkBiometricAvailable = useCallback(async (): Promise<boolean> => {
    try {
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
    } catch {
      return false
    }
  }, [])

  const unlockWithBiometric = useCallback(async (): Promise<boolean> => {
    return false
  }, [])

  return (
    <SecurityContext.Provider
      value={{
        isLocked,
        hasPIN,
        cryptoKey,
        lock,
        unlock,
        setupPIN,
        removePIN,
        checkBiometricAvailable,
        unlockWithBiometric,
      }}
    >
      {children}
    </SecurityContext.Provider>
  )
}

export function useSecurityContext(): SecurityContextValue {
  const ctx = useContext(SecurityContext)
  if (!ctx) throw new Error('useSecurityContext must be used within SecurityProvider')
  return ctx
}
