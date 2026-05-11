'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useToastContext } from '@/context/ToastContext'
import type { ToastType } from '@/context/ToastContext'

const icons: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
}

const colors: Record<ToastType, string> = {
  success: 'border-green-500/30 bg-green-500/10 text-green-400',
  error: 'border-red-500/30 bg-red-500/10 text-red-400',
  warning: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
  info: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastContext()

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none" role="status" aria-live="polite">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-[12px] border text-sm font-medium shadow-lg backdrop-blur-sm ${colors[toast.type]}`}
            onClick={() => removeToast(toast.id)}
          >
            <span className="text-base">{icons[toast.type]}</span>
            <span className="text-[#f0f0f0] text-sm">{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
