'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useInstallPrompt } from '@/hooks/useInstallPrompt'

export function InstallPrompt() {
  const { shouldShow, isIOS, install, dismiss } = useInstallPrompt()

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed bottom-20 inset-x-4 z-30 bg-[#111] border border-white/[0.08] rounded-[16px] p-4 shadow-modal"
          role="banner"
          aria-label="Install MoonAuth"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-black border border-white/10 flex items-center justify-center flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" fill="#000" rx="16" />
                <g transform="rotate(15 50 50)">
                  <circle cx="42" cy="50" r="26" fill="white" />
                  <circle cx="57" cy="50" r="22" fill="#000" />
                </g>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-white">Install MoonAuth</div>
              <div className="text-xs text-gray-500 mt-0.5">
                {isIOS
                  ? 'Tap Share → Add to Home Screen'
                  : 'Add to your home screen for the best experience'}
              </div>
            </div>
            <button
              onClick={dismiss}
              className="text-gray-600 hover:text-white transition-colors"
              aria-label="Dismiss install prompt"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M12.7 3.3a1 1 0 0 0-1.4 0L8 6.6 4.7 3.3a1 1 0 0 0-1.4 1.4L6.6 8l-3.3 3.3a1 1 0 1 0 1.4 1.4L8 9.4l3.3 3.3a1 1 0 0 0 1.4-1.4L9.4 8l3.3-3.3a1 1 0 0 0 0-1.4z" />
              </svg>
            </button>
          </div>
          {!isIOS && (
            <button
              onClick={install}
              className="mt-3 w-full h-9 bg-[#7c5cfc]/15 border border-[#7c5cfc]/30 rounded-[10px] text-sm text-[#7c5cfc] font-medium hover:bg-[#7c5cfc]/25 transition-colors"
            >
              Add to Home Screen
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
