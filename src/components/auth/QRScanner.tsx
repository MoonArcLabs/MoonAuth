'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQRScanner } from '@/hooks/useQRScanner'
import type { ParsedOtpAuth } from '@/lib/totp'

interface QRScannerProps {
  onSuccess: (parsed: ParsedOtpAuth) => void
  onClose: () => void
  onManualEntry: () => void
}

export function QRScanner({ onSuccess, onClose, onManualEntry }: QRScannerProps) {
  const { state, error, videoRef, canvasRef, startScanner, stopScanner } = useQRScanner(onSuccess)

  useEffect(() => {
    startScanner()
    return () => stopScanner()
  }, [startScanner, stopScanner])

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="relative flex-1 overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
          aria-label="Camera viewfinder"
        />
        <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/40 to-black/80 pointer-events-none" />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-safe-top pt-4">
          <span className="font-sora font-semibold text-white text-lg">Scan QR Code</span>
          <button
            onClick={() => { stopScanner(); onClose() }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white"
            aria-label="Close scanner"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M15.3 4.7a1 1 0 0 0-1.4 0L10 8.6 6.1 4.7A1 1 0 0 0 4.7 6.1L8.6 10l-3.9 3.9a1 1 0 1 0 1.4 1.4L10 11.4l3.9 3.9a1 1 0 0 0 1.4-1.4L11.4 10l3.9-3.9a1 1 0 0 0 0-1.4z" />
            </svg>
          </button>
        </div>

        {/* Scan frame */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-64 h-64">
            {/* Corner brackets */}
            {(['tl', 'tr', 'bl', 'br'] as const).map((corner) => (
              <motion.div
                key={corner}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className={`absolute w-8 h-8 ${
                  corner === 'tl' ? 'top-0 left-0 border-t-2 border-l-2' :
                  corner === 'tr' ? 'top-0 right-0 border-t-2 border-r-2' :
                  corner === 'bl' ? 'bottom-0 left-0 border-b-2 border-l-2' :
                  'bottom-0 right-0 border-b-2 border-r-2'
                } border-[#7c5cfc] rounded-[2px]`}
              />
            ))}

            {/* Scan line */}
            {state === 'scanning' && (
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#7c5cfc] to-transparent animate-scan-line" />
            )}
          </div>
        </div>

        {state === 'requesting' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white/60 text-sm">Requesting camera access...</div>
          </div>
        )}

        {state === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="text-red-400 text-sm">{error}</div>
            <p className="text-white/60 text-sm">Camera access is required to scan QR codes.</p>
          </div>
        )}

        {state === 'success' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center"
            >
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M6 18l8 8L30 8" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col items-center gap-3 px-4 py-6 bg-black/90 pb-safe-bottom">
        <p className="text-white/60 text-sm">Point your camera at a QR code</p>
        <button
          onClick={() => { stopScanner(); onManualEntry() }}
          className="text-[#7c5cfc] text-sm font-medium underline underline-offset-2"
        >
          Enter manually instead
        </button>
      </div>
    </div>
  )
}
