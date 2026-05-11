export interface TOTPOptions {
  algorithm?: 'SHA1' | 'SHA256' | 'SHA512'
  digits?: 6 | 8
  period?: 30 | 60
}

export interface ParsedOtpAuth {
  label: string
  issuer: string
  secret: string
  algorithm: 'SHA1' | 'SHA256' | 'SHA512'
  digits: 6 | 8
  period: 30 | 60
}

const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

export function decodeBase32(input: string): Uint8Array {
  const s = input.toUpperCase().replace(/=+$/, '').replace(/\s/g, '')
  const bits: number[] = []
  for (const char of s) {
    const idx = BASE32_CHARS.indexOf(char)
    if (idx === -1) continue
    for (let i = 4; i >= 0; i--) {
      bits.push((idx >> i) & 1)
    }
  }
  const bytes = new Uint8Array(Math.floor(bits.length / 8))
  for (let i = 0; i < bytes.length; i++) {
    let byte = 0
    for (let j = 0; j < 8; j++) {
      byte = (byte << 1) | bits[i * 8 + j]
    }
    bytes[i] = byte
  }
  return bytes
}

function getAlgorithmName(alg: string): string {
  switch (alg) {
    case 'SHA256': return 'SHA-256'
    case 'SHA512': return 'SHA-512'
    default: return 'SHA-1'
  }
}

export async function generateTOTP(secret: string, options: TOTPOptions = {}): Promise<string> {
  const { algorithm = 'SHA1', digits = 6, period = 30 } = options
  const keyBytes = decodeBase32(secret)
  const counter = Math.floor(Date.now() / 1000 / period)

  const counterBuffer = new ArrayBuffer(8)
  const view = new DataView(counterBuffer)
  view.setUint32(0, Math.floor(counter / 0x100000000), false)
  view.setUint32(4, counter & 0xffffffff, false)

  const keyBuffer = keyBytes.buffer.slice(keyBytes.byteOffset, keyBytes.byteOffset + keyBytes.byteLength) as ArrayBuffer
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'HMAC', hash: getAlgorithmName(algorithm) },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, counterBuffer)
  const hmac = new Uint8Array(signature)
  const offset = hmac[hmac.length - 1] & 0x0f
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    (hmac[offset + 1] << 16) |
    (hmac[offset + 2] << 8) |
    hmac[offset + 3]

  const otp = code % Math.pow(10, digits)
  return otp.toString().padStart(digits, '0')
}

export function getTimeRemaining(period = 30): number {
  return period - (Math.floor(Date.now() / 1000) % period)
}

export function getTimeProgress(period = 30): number {
  return (Math.floor(Date.now() / 1000) % period) / period
}

export function parseOtpAuthUri(uri: string): ParsedOtpAuth | null {
  try {
    if (!uri.startsWith('otpauth://totp/')) return null
    const withoutScheme = uri.slice('otpauth://totp/'.length)
    const qIdx = withoutScheme.indexOf('?')
    if (qIdx === -1) return null

    const rawLabel = decodeURIComponent(withoutScheme.slice(0, qIdx))
    const params = new URLSearchParams(withoutScheme.slice(qIdx + 1))

    const secret = params.get('secret')
    if (!secret) return null

    let issuer = params.get('issuer') || ''
    let label = rawLabel

    if (rawLabel.includes(':')) {
      const parts = rawLabel.split(':')
      if (!issuer) issuer = parts[0].trim()
      label = parts.slice(1).join(':').trim()
    }

    const algParam = params.get('algorithm')?.toUpperCase()
    const algorithm: 'SHA1' | 'SHA256' | 'SHA512' =
      algParam === 'SHA256' ? 'SHA256' : algParam === 'SHA512' ? 'SHA512' : 'SHA1'

    const digitsParam = parseInt(params.get('digits') || '6')
    const digits: 6 | 8 = digitsParam === 8 ? 8 : 6

    const periodParam = parseInt(params.get('period') || '30')
    const period: 30 | 60 = periodParam === 60 ? 60 : 30

    return { label, issuer, secret: secret.toUpperCase(), algorithm, digits, period }
  } catch {
    return null
  }
}
