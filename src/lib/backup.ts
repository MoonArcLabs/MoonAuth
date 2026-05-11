import { encrypt, decrypt, generateSalt, generateKey } from './crypto'
import type { Account } from '@/types/account'
import type { AppSettings } from '@/types/settings'
import { APP_VERSION } from './constants'

export interface BackupPayload {
  version: 1
  createdAt: number
  appVersion: string
  accounts: Account[]
  settings: AppSettings
}

export async function exportBackup(
  accounts: Account[],
  settings: AppSettings,
  password: string
): Promise<string> {
  const payload: BackupPayload = {
    version: 1,
    createdAt: Date.now(),
    appVersion: APP_VERSION,
    accounts,
    settings,
  }

  const salt = await generateSalt()
  const key = await generateKey(password, salt)
  const encrypted = await encrypt(JSON.stringify(payload), key, salt)
  return JSON.stringify(encrypted)
}

export async function importBackup(
  fileContent: string,
  password: string
): Promise<BackupPayload> {
  const encrypted = JSON.parse(fileContent)
  if (!encrypted.iv || !encrypted.data || !encrypted.salt) {
    throw new Error('Invalid backup file format')
  }

  const salt = Uint8Array.from(atob(encrypted.salt), (c) => c.charCodeAt(0))
  const key = await generateKey(password, salt)

  let json: string
  try {
    json = await decrypt(encrypted, key)
  } catch {
    throw new Error('Invalid password or corrupted backup')
  }

  const payload = JSON.parse(json) as BackupPayload
  if (payload.version !== 1 || !Array.isArray(payload.accounts)) {
    throw new Error('Invalid backup data structure')
  }

  return payload
}

export function downloadBackup(content: string): void {
  const date = new Date().toISOString().split('T')[0]
  const filename = `moonauth-backup-${date}.moonauth`
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
