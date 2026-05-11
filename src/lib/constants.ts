export const APP_NAME = 'MoonAuth'
export const APP_VERSION = '1.0.0'
export const DB_NAME = 'moonauth-db'
export const DB_VERSION = 1
export const CACHE_NAME = 'moonauth-v1'

export const PBKDF2_ITERATIONS = 600_000
export const SALT_LENGTH = 16
export const IV_LENGTH = 12
export const KEY_LENGTH = 256

export const AUTO_LOCK_OPTIONS = [
  { label: '1 minute', value: 60 },
  { label: '2 minutes', value: 120 },
  { label: '5 minutes', value: 300 },
  { label: '10 minutes', value: 600 },
  { label: '30 minutes', value: 1800 },
  { label: 'Never', value: 0 },
] as const

export const DEFAULT_AUTO_LOCK = 300
export const MAX_PIN_ATTEMPTS = 6
export const PIN_COOLDOWN_BASE = 30

export const TOTP_DEFAULTS = {
  algorithm: 'SHA1' as const,
  digits: 6,
  period: 30,
}

export const INPUT_LIMITS = {
  name: 64,
  issuer: 64,
  secret: 256,
}

export const ONBOARDING_KEY = 'moonauth-onboarding-complete'
export const INSTALL_DISMISSED_KEY = 'moonauth-install-dismissed'
export const DEVICE_SALT_KEY = 'moonauth-device-salt'
