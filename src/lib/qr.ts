import { parseOtpAuthUri, ParsedOtpAuth } from './totp'
import { isValidOtpAuthUri } from './sanitize'

export type { ParsedOtpAuth }

export function parseQRCode(data: string): ParsedOtpAuth | null {
  const trimmed = data.trim()
  if (!isValidOtpAuthUri(trimmed)) return null
  return parseOtpAuthUri(trimmed)
}
