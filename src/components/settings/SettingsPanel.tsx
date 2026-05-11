'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSecurityContext } from '@/context/SecurityContext'
import { useSettingsContext } from '@/context/SettingsContext'
import { PINSetup } from '@/components/security/PINSetup'
import { BackupExport } from './BackupExport'
import { BackupImport } from './BackupImport'
import { AUTO_LOCK_OPTIONS, APP_VERSION } from '@/lib/constants'
import { useToast } from '@/hooks/useToast'

interface SettingsPanelProps {
  open: boolean
  onClose: () => void
}

function Toggle({ checked, onChange, id }: { checked: boolean; onChange: (v: boolean) => void; id: string }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-[#7c5cfc]' : 'bg-white/10'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{title}</h3>
      <div className="bg-[#111] rounded-[16px] border border-white/[0.04] overflow-hidden divide-y divide-white/[0.04]">
        {children}
      </div>
    </div>
  )
}

function SettingRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5 gap-3">
      <div>
        <div className="text-sm text-white">{label}</div>
        {hint && <div className="text-xs text-gray-500 mt-0.5">{hint}</div>}
      </div>
      {children}
    </div>
  )
}

export function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const { hasPIN, setupPIN, removePIN, lock } = useSecurityContext()
  const { settings, updateSecurity } = useSettingsContext()
  const { addToast } = useToast()
  const [showPINSetup, setShowPINSetup] = useState(false)

  const handlePINToggle = async (enabled: boolean) => {
    if (enabled) {
      setShowPINSetup(true)
    } else {
      await removePIN()
      await updateSecurity({ pinEnabled: false })
      addToast('PIN lock disabled', 'info')
    }
  }

  const handlePINSetupComplete = async (pin: string) => {
    await setupPIN(pin)
    await updateSecurity({ pinEnabled: true })
    setShowPINSetup(false)
    addToast('PIN lock enabled', 'success')
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            role="dialog"
            aria-label="Settings"
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-[#0a0a0a] border-l border-white/[0.06] overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between px-5 pt-safe-top pt-5 pb-4 border-b border-white/[0.04]">
              <h2 className="font-sora font-semibold text-white">Settings</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close settings"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M12.7 3.3a1 1 0 0 0-1.4 0L8 6.6 4.7 3.3a1 1 0 0 0-1.4 1.4L6.6 8l-3.3 3.3a1 1 0 1 0 1.4 1.4L8 9.4l3.3 3.3a1 1 0 0 0 1.4-1.4L9.4 8l3.3-3.3a1 1 0 0 0 0-1.4z" />
                </svg>
              </button>
            </div>

            {showPINSetup ? (
              <PINSetup onComplete={handlePINSetupComplete} onCancel={() => setShowPINSetup(false)} />
            ) : (
              <div className="flex flex-col gap-6 p-5">
                <Section title="Security">
                  <SettingRow label="PIN Lock" hint="Require PIN to unlock the app">
                    <Toggle checked={hasPIN} onChange={handlePINToggle} id="pin-toggle" />
                  </SettingRow>
                  {hasPIN && (
                    <>
                      <SettingRow label="Change PIN">
                        <button
                          onClick={() => setShowPINSetup(true)}
                          className="text-xs text-[#7c5cfc] font-medium"
                        >
                          Change
                        </button>
                      </SettingRow>
                      <SettingRow label="Auto-lock timeout">
                        <select
                          value={settings.security.autoLockTimeout}
                          onChange={(e) => updateSecurity({ autoLockTimeout: parseInt(e.target.value) })}
                          className="bg-transparent text-xs text-white focus:outline-none text-right"
                          aria-label="Auto-lock timeout"
                        >
                          {AUTO_LOCK_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-[#0a0a0a]">
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </SettingRow>
                      <SettingRow label="Lock Now">
                        <button
                          onClick={() => { lock(); onClose() }}
                          className="text-xs text-red-400 font-medium"
                        >
                          Lock
                        </button>
                      </SettingRow>
                    </>
                  )}
                </Section>

                <Section title="Backup">
                  <div className="p-4">
                    <BackupExport />
                  </div>
                  <div className="p-4">
                    <BackupImport />
                  </div>
                </Section>

                <Section title="About">
                  <SettingRow label="Version" hint={`MoonAuth v${APP_VERSION}`}>
                    <span className="text-xs text-gray-500">{APP_VERSION}</span>
                  </SettingRow>
                  <div className="px-4 py-3.5">
                    <p className="text-xs text-gray-500">
                      MoonAuth is fully offline. Your secrets never leave this device.
                    </p>
                  </div>
                </Section>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
