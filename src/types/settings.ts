export interface SecuritySettings {
  pinEnabled: boolean
  biometricEnabled: boolean
  autoLockTimeout: number
}

export interface AppSettings {
  security: SecuritySettings
  theme: 'dark'
  version: number
}

export const DEFAULT_SETTINGS: AppSettings = {
  security: {
    pinEnabled: false,
    biometricEnabled: false,
    autoLockTimeout: 300,
  },
  theme: 'dark',
  version: 1,
}
