import { useState, useEffect } from 'react'
import { generateTOTP, getTimeRemaining, getTimeProgress } from '@/lib/totp'
import type { TOTPConfig, TOTPResult } from '@/types/totp'

export function useTOTP(config: TOTPConfig): TOTPResult {
  const [result, setResult] = useState<TOTPResult>({
    code: '------',
    timeRemaining: getTimeRemaining(config.period),
    progress: getTimeProgress(config.period),
  })

  useEffect(() => {
    let mounted = true
    const update = async () => {
      const code = await generateTOTP(config.secret, {
        algorithm: config.algorithm,
        digits: config.digits,
        period: config.period,
      })
      if (mounted) {
        setResult({
          code,
          timeRemaining: getTimeRemaining(config.period),
          progress: getTimeProgress(config.period),
        })
      }
    }

    update()
    const interval = setInterval(update, 1000)
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [config.secret, config.algorithm, config.digits, config.period])

  return result
}
