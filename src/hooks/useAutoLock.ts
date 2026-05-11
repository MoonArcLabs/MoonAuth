import { useEffect, useRef, useCallback } from 'react'
import { useSecurityContext } from '@/context/SecurityContext'
import { useSettingsContext } from '@/context/SettingsContext'

export function useAutoLock() {
  const { lock, hasPIN, isLocked } = useSecurityContext()
  const { settings } = useSettingsContext()
  const lastActivityRef = useRef(Date.now())
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now()
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    const ms = settings.security.autoLockTimeout * 1000
    if (hasPIN && ms > 0) {
      timeoutRef.current = setTimeout(() => lock(), ms)
    }
  }, [settings.security.autoLockTimeout, hasPIN, lock])

  useEffect(() => {
    if (!hasPIN || isLocked) return

    const events = ['pointermove', 'keydown', 'touchstart', 'click'] as const
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }))
    resetTimer()

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && hasPIN) {
        const ms = settings.security.autoLockTimeout * 1000
        if (ms > 0 && Date.now() - lastActivityRef.current > ms) lock()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer))
      document.removeEventListener('visibilitychange', handleVisibility)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [resetTimer, hasPIN, isLocked, lock, settings.security.autoLockTimeout])
}
