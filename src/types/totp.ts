export interface TOTPConfig {
  secret: string
  algorithm: 'SHA1' | 'SHA256' | 'SHA512'
  digits: 6 | 8
  period: 30 | 60
}

export interface TOTPResult {
  code: string
  timeRemaining: number
  progress: number
}
