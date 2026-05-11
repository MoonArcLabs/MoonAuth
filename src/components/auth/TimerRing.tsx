'use client'

import { useMemo } from 'react'

interface TimerRingProps {
  timeRemaining: number
  period: number
  size?: number
}

export function TimerRing({ timeRemaining, period, size = 36 }: TimerRingProps) {
  const progress = timeRemaining / period
  const radius = (size - 4) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - progress)

  const color = useMemo(() => {
    if (timeRemaining <= 5) return 'var(--color-timer-urgent)'
    if (timeRemaining <= 10) return 'var(--color-timer-warn)'
    return 'var(--color-timer-safe)'
  }, [timeRemaining])

  const isPulsing = timeRemaining <= 5

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={isPulsing ? 'animate-pulse-ring' : ''}
        aria-label={`${timeRemaining} seconds remaining`}
        role="timer"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="2"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s ease' }}
        />
      </svg>
      <span
        className="absolute text-[9px] font-mono font-bold tabular-nums"
        style={{ color }}
      >
        {timeRemaining}
      </span>
    </div>
  )
}
