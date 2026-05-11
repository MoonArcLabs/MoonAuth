import { useState, useEffect } from 'react'
import { INSTALL_DISMISSED_KEY } from '@/lib/constants'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function useInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [isDismissed, setIsDismissed] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem(INSTALL_DISMISSED_KEY) === 'true'
    setIsDismissed(dismissed)

    const ua = navigator.userAgent
    const ios = /iPhone|iPad|iPod/.test(ua) && !('MSStream' in window)
    setIsIOS(ios)
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true)
    setIsStandalone(standalone)

    const handler = (e: Event) => {
      e.preventDefault()
      setPromptEvent(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const install = async () => {
    if (!promptEvent) return
    await promptEvent.prompt()
    const { outcome } = await promptEvent.userChoice
    if (outcome === 'accepted') setPromptEvent(null)
  }

  const dismiss = () => {
    localStorage.setItem(INSTALL_DISMISSED_KEY, 'true')
    setIsDismissed(true)
  }

  const shouldShow = !isDismissed && !isStandalone && (!!promptEvent || isIOS)

  return { shouldShow, isIOS, install, dismiss }
}
