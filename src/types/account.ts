export interface Account {
  id: string
  name: string
  issuer: string
  secret: string
  algorithm: 'SHA1' | 'SHA256' | 'SHA512'
  digits: 6 | 8
  period: 30 | 60
  icon?: string
  color?: string
  addedAt: number
  updatedAt: number
}

export interface AccountWithCode extends Account {
  code: string
  nextCode: string
  timeRemaining: number
  progress: number
}

export interface StoredAccount {
  id: string
  encrypted: {
    iv: string
    data: string
    salt: string
    version: number
  }
}
