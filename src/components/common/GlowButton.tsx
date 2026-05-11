'use client'

import { ReactNode, ButtonHTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'purple' | 'blue' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

const variants = {
  purple: 'bg-[#7c5cfc] hover:bg-[#8d6ffd] text-white shadow-glow-purple border border-[#7c5cfc]/50',
  blue: 'bg-[#4f8ef7] hover:bg-[#6a9ff8] text-white shadow-glow-blue border border-[#4f8ef7]/50',
  danger: 'bg-[#ef4444]/10 hover:bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30',
  ghost: 'bg-white/5 hover:bg-white/10 text-[#f0f0f0] border border-white/10',
}

const sizes = {
  sm: 'px-3 py-2 text-sm min-h-[36px]',
  md: 'px-4 py-3 text-sm min-h-[44px]',
  lg: 'px-6 py-4 text-base min-h-[52px]',
}

export function GlowButton({
  children,
  variant = 'purple',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: GlowButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', damping: 25, stiffness: 400 }}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium rounded-[12px] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7c5cfc]',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {children}
    </motion.button>
  )
}
