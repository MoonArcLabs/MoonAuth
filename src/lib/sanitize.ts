import { INPUT_LIMITS } from './constants'

const BASE32_CHARS = /[^A-Z2-7]/gi

export function sanitizeBase32(input: string): string {
  return input
    .toUpperCase()
    .replace(BASE32_CHARS, '')
    .slice(0, INPUT_LIMITS.secret)
}

export function sanitizeName(input: string): string {
  return input.trim().slice(0, INPUT_LIMITS.name)
}

export function sanitizeIssuer(input: string): string {
  return input.trim().slice(0, INPUT_LIMITS.issuer)
}

export function isValidBase32(secret: string): boolean {
  const cleaned = secret.toUpperCase().replace(/=+$/, '')
  return /^[A-Z2-7]+$/.test(cleaned) && cleaned.length >= 8
}

const OTP_AUTH_REGEX = /^otpauth:\/\/totp\/.+\?.*secret=[A-Z2-7]+=*/i

export function isValidOtpAuthUri(uri: string): boolean {
  return OTP_AUTH_REGEX.test(uri) && uri.length < 2048
}

export function sanitizePIN(input: string): string {
  return input.replace(/\D/g, '').slice(0, 8)
}
