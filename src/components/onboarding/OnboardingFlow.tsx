'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlowButton } from '@/components/common/GlowButton'
import { LogoFull } from '@/components/common/Logo'
import { ONBOARDING_KEY } from '@/lib/constants'

interface OnboardingFlowProps {
  onComplete: () => void
}

const slides = [
  {
    title: 'Welcome to MoonAuth',
    subtitle: 'Premium two-factor authentication. Your codes, your device.',
    illustration: (
      <svg width="200" height="200" viewBox="0 0 240 240" fill="none" aria-hidden="true">
        <circle cx="120" cy="120" r="80" stroke="white" strokeWidth="1.5" strokeOpacity="0.08" />
        <circle cx="120" cy="120" r="55" stroke="#7c5cfc" strokeWidth="1.5" strokeOpacity="0.2" />
        <g transform="rotate(15 120 120)">
          <circle cx="100" cy="120" r="38" fill="white" fillOpacity="0.9" />
          <circle cx="118" cy="120" r="32" fill="#000" />
        </g>
        <path d="M155 85l12 12M155 97l12-12" stroke="#4f8ef7" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
      </svg>
    ),
  },
  {
    title: 'Bank-grade Encryption',
    subtitle: 'Your secrets are encrypted with AES-256-GCM and never leave your device.',
    illustration: (
      <svg width="200" height="200" viewBox="0 0 240 240" fill="none" aria-hidden="true">
        <rect x="70" y="100" width="100" height="80" rx="10" stroke="white" strokeWidth="1.5" strokeOpacity="0.3" />
        <path d="M95 100V80a25 25 0 0 1 50 0v20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.3" />
        <circle cx="120" cy="138" r="12" fill="#7c5cfc" fillOpacity="0.5" stroke="#7c5cfc" strokeWidth="1.5" />
        <line x1="120" y1="150" x2="120" y2="162" stroke="#7c5cfc" strokeWidth="2" strokeLinecap="round" />
        <path d="M80 115h4M80 125h4M80 135h4M80 145h4" stroke="white" strokeWidth="1.5" strokeOpacity="0.15" strokeLinecap="round" />
        <path d="M156 115h4M156 125h4M156 135h4M156 145h4" stroke="white" strokeWidth="1.5" strokeOpacity="0.15" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Add Your First Account',
    subtitle: 'Scan a QR code or enter your secret manually. Works completely offline.',
    illustration: (
      <svg width="200" height="200" viewBox="0 0 240 240" fill="none" aria-hidden="true">
        <rect x="60" y="30" width="120" height="180" rx="14" stroke="white" strokeWidth="1.5" strokeOpacity="0.2" />
        <rect x="75" y="55" width="90" height="90" rx="6" stroke="#7c5cfc" strokeWidth="1.5" strokeOpacity="0.4" />
        <rect x="82" y="62" width="20" height="20" rx="2" stroke="#7c5cfc" strokeWidth="1.5" strokeOpacity="0.6" />
        <rect x="118" y="62" width="20" height="20" rx="2" stroke="#7c5cfc" strokeWidth="1.5" strokeOpacity="0.6" />
        <rect x="82" y="98" width="20" height="20" rx="2" stroke="#7c5cfc" strokeWidth="1.5" strokeOpacity="0.6" />
        <rect x="122" y="98" width="8" height="8" fill="#7c5cfc" fillOpacity="0.5" />
        <rect x="134" y="98" width="4" height="4" fill="#7c5cfc" fillOpacity="0.5" />
        <rect x="122" y="110" width="4" height="4" fill="#7c5cfc" fillOpacity="0.5" />
        <rect x="75" y="158" width="90" height="8" rx="4" fill="white" fillOpacity="0.08" />
        <circle cx="200" cy="60" r="22" fill="#000" stroke="#22c55e" strokeWidth="1.5" />
        <path d="M191 60l5.5 5.5L209 53" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [slide, setSlide] = useState(0)

  const handleNext = () => {
    if (slide < slides.length - 1) {
      setSlide((v) => v + 1)
    } else {
      localStorage.setItem(ONBOARDING_KEY, 'true')
      onComplete()
    }
  }

  const current = slides[slide]

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-between px-6 py-12">
      <LogoFull />

      <div className="flex flex-col items-center gap-6 flex-1 justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="flex flex-col items-center gap-6 text-center"
          >
            {current.illustration}
            <h2 className="font-sora font-bold text-2xl text-white">{current.title}</h2>
            <p className="text-gray-400 text-sm max-w-xs">{current.subtitle}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-xs">
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === slide ? 'w-6 bg-[#7c5cfc]' : 'w-1.5 bg-white/20'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <GlowButton variant="purple" fullWidth size="lg" onClick={handleNext}>
          {slide === slides.length - 1 ? 'Get Started' : 'Next'}
        </GlowButton>

        {slide < slides.length - 1 && (
          <button
            onClick={() => { localStorage.setItem(ONBOARDING_KEY, 'true'); onComplete() }}
            className="text-sm text-gray-500 hover:text-white transition-colors"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  )
}
