'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import type { AppSettings } from '@/types/settings'
import { DEFAULT_SETTINGS } from '@/types/settings'
import { saveSettings, loadSettings } from '@/lib/storage'

interface SettingsContextValue {
  settings: AppSettings
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>
  updateSecurity: (updates: Partial<AppSettings['security']>) => Promise<void>
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)

  useEffect(() => {
    loadSettings().then((s) => {
      if (s) setSettings(s)
    })
  }, [])

  const updateSettings = useCallback(async (updates: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates }
      saveSettings(next)
      return next
    })
  }, [])

  const updateSecurity = useCallback(async (updates: Partial<AppSettings['security']>) => {
    setSettings((prev) => {
      const next = { ...prev, security: { ...prev.security, ...updates } }
      saveSettings(next)
      return next
    })
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, updateSecurity }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettingsContext(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettingsContext must be used within SettingsProvider')
  return ctx
}
