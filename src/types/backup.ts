import type { Account } from './account'
import type { AppSettings } from './settings'

export interface BackupMetadata {
  version: 1
  createdAt: number
  appVersion: string
}

export interface BackupPayload extends BackupMetadata {
  accounts: Account[]
  settings: AppSettings
}
