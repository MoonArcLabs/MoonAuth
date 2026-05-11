import { PBKDF2_ITERATIONS, SALT_LENGTH, IV_LENGTH, KEY_LENGTH } from './constants'

export interface EncryptedPayload {
  iv: string
  data: string
  salt: string
  version: number
}

function toBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
  return btoa(String.fromCharCode(...bytes))
}

function fromBase64(b64: string): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)) as Uint8Array<ArrayBuffer>
}

function toArrayBuffer(u8: Uint8Array): ArrayBuffer {
  return u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength) as ArrayBuffer
}

export async function generateSalt(): Promise<Uint8Array<ArrayBuffer>> {
  return crypto.getRandomValues(new Uint8Array(SALT_LENGTH)) as Uint8Array<ArrayBuffer>
}

export async function generateKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const rawKey = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: toArrayBuffer(salt instanceof Uint8Array ? salt : new Uint8Array(salt)), iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    rawKey,
    { name: 'AES-GCM', length: KEY_LENGTH },
    true,
    ['encrypt', 'decrypt']
  )
}

export async function generateDeviceKey(salt: Uint8Array): Promise<CryptoKey> {
  const rawKey = await crypto.subtle.importKey('raw', toArrayBuffer(salt instanceof Uint8Array ? salt : new Uint8Array(salt)), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: new ArrayBuffer(16), iterations: 1, hash: 'SHA-256' },
    rawKey,
    { name: 'AES-GCM', length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  )
}

export async function encrypt(data: string, key: CryptoKey, salt: Uint8Array): Promise<EncryptedPayload> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH)) as Uint8Array<ArrayBuffer>
  const enc = new TextEncoder()
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(data))
  return {
    iv: toBase64(iv),
    data: toBase64(encrypted),
    salt: toBase64(salt),
    version: 1,
  }
}

export async function decrypt(payload: EncryptedPayload, key: CryptoKey): Promise<string> {
  const iv = fromBase64(payload.iv)
  const data = fromBase64(payload.data)
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, toArrayBuffer(data))
  return new TextDecoder().decode(decrypted)
}

export async function hashPIN(pin: string, salt: Uint8Array): Promise<string> {
  const key = await generateKey(pin, salt)
  const exported = await crypto.subtle.exportKey('raw', key)
  return toBase64(exported)
}

export async function verifyPIN(pin: string, salt: Uint8Array, hash: string): Promise<boolean> {
  try {
    const computed = await hashPIN(pin, salt)
    return computed === hash
  } catch {
    return false
  }
}
