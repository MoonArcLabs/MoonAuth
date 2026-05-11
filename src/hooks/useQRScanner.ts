import { useState, useRef, useCallback, useEffect } from 'react'
import jsQR from 'jsqr'
import { parseQRCode } from '@/lib/qr'
import type { ParsedOtpAuth } from '@/lib/totp'

export type ScannerState = 'idle' | 'requesting' | 'scanning' | 'success' | 'error'

interface UseQRScannerResult {
  state: ScannerState
  error: string | null
  parsed: ParsedOtpAuth | null
  videoRef: React.RefObject<HTMLVideoElement | null>
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  startScanner: () => Promise<void>
  stopScanner: () => void
}

export function useQRScanner(onSuccess?: (parsed: ParsedOtpAuth) => void): UseQRScannerResult {
  const [state, setState] = useState<ScannerState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [parsed, setParsed] = useState<ParsedOtpAuth | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const stopScanner = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    if (mountedRef.current) setState('idle')
  }, [])

  const scan = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      rafRef.current = requestAnimationFrame(scan)
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const result = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    })

    if (result) {
      const p = parseQRCode(result.data)
      if (p) {
        setState('success')
        setParsed(p)
        stopScanner()
        onSuccess?.(p)
        return
      }
    }

    rafRef.current = requestAnimationFrame(scan)
  }, [onSuccess, stopScanner])

  const startScanner = useCallback(async () => {
    setState('requesting')
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
      setState('scanning')
      rafRef.current = requestAnimationFrame(scan)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Camera access denied'
      setError(msg)
      setState('error')
    }
  }, [scan])

  useEffect(() => {
    return () => stopScanner()
  }, [stopScanner])

  return { state, error, parsed, videoRef, canvasRef, startScanner, stopScanner }
}
