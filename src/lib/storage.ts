import { openDB, IDBPDatabase } from 'idb'
import { DB_NAME, DB_VERSION, DEVICE_SALT_KEY } from './constants'
import { encrypt, decrypt, generateSalt, generateKey, generateDeviceKey, EncryptedPayload } from './crypto'
import type { Account } from '@/types/account'
import type { AppSettings } from '@/types/settings'

interface MoonAuthDB {
  accounts: { key: string; value: { id: string; encrypted: EncryptedPayload } }
  settings: { key: string; value: AppSettings }
  security: {
    key: string
    value: { salt: string; pinHash: string; biometricCredentialId?: string }
  }
}

async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('accounts')) db.createObjectStore('accounts', { keyPath: 'id' })
      if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings')
      if (!db.objectStoreNames.contains('security')) db.createObjectStore('security')
    },
  })
}

async function getDeviceKey(): Promise<{ key: CryptoKey; salt: Uint8Array }> {
  let saltB64 = localStorage.getItem(DEVICE_SALT_KEY)
  let salt: Uint8Array
  if (saltB64) {
    salt = Uint8Array.from(atob(saltB64), (c) => c.charCodeAt(0))
  } else {
    salt = await generateSalt()
    saltB64 = btoa(String.fromCharCode(...salt))
    localStorage.setItem(DEVICE_SALT_KEY, saltB64)
  }
  const key = await generateDeviceKey(salt)
  return { key, salt }
}

export async function saveAccount(account: Account, cryptoKey?: CryptoKey): Promise<void> {
  const db = await getDB()
  let key: CryptoKey
  let salt: Uint8Array

  if (cryptoKey) {
    const sec = await db.get('security', 'main')
    salt = sec ? Uint8Array.from(atob(sec.salt), (c) => c.charCodeAt(0)) : await generateSalt()
    key = cryptoKey
  } else {
    const device = await getDeviceKey()
    key = device.key
    salt = device.salt
  }

  const payload = await encrypt(JSON.stringify(account), key, salt)
  await db.put('accounts', { id: account.id, encrypted: payload })
}

export async function loadAccounts(cryptoKey?: CryptoKey): Promise<Account[]> {
  const db = await getDB()
  const all = await db.getAll('accounts')
  const accounts: Account[] = []

  let key: CryptoKey
  if (cryptoKey) {
    key = cryptoKey
  } else {
    const device = await getDeviceKey()
    key = device.key
  }

  for (const record of all) {
    try {
      const json = await decrypt(record.encrypted, key)
      accounts.push(JSON.parse(json) as Account)
    } catch {
      // Skip corrupted records
    }
  }
  return accounts
}

export async function deleteAccount(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('accounts', id)
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  const db = await getDB()
  await db.put('settings', settings, 'main')
}

export async function loadSettings(): Promise<AppSettings | null> {
  const db = await getDB()
  return db.get('settings', 'main') as Promise<AppSettings | null>
}

export async function saveSecurityConfig(config: {
  salt: string
  pinHash: string
  biometricCredentialId?: string
}): Promise<void> {
  const db = await getDB()
  await db.put('security', config, 'main')
}

export async function loadSecurityConfig(): Promise<{
  salt: string
  pinHash: string
  biometricCredentialId?: string
} | null> {
  const db = await getDB()
  return db.get('security', 'main') as Promise<{ salt: string; pinHash: string; biometricCredentialId?: string } | null>
}

export async function clearAllData(): Promise<void> {
  const db = await getDB()
  await db.clear('accounts')
  await db.clear('settings')
  await db.clear('security')
  localStorage.removeItem(DEVICE_SALT_KEY)
}

export async function reEncryptAccounts(
  accounts: Account[],
  newKey: CryptoKey,
  newSalt: Uint8Array
): Promise<void> {
  const db = await getDB()
  await db.clear('accounts')
  for (const account of accounts) {
    const payload = await encrypt(JSON.stringify(account), newKey, newSalt)
    await db.put('accounts', { id: account.id, encrypted: payload })
  }
}

export { generateKey, generateSalt }
