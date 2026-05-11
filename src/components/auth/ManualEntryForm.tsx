'use client'

import { useState, useCallback } from 'react'
import { z } from 'zod'
import { isValidBase32, sanitizeBase32, sanitizeName, sanitizeIssuer } from '@/lib/sanitize'
import { generateTOTP } from '@/lib/totp'
import type { ParsedOtpAuth } from '@/lib/totp'
import { GlowButton } from '@/components/common/GlowButton'

const schema = z.object({
  name: z.string().min(1, 'Account name is required'),
  issuer: z.string().optional(),
  secret: z.string().min(1, 'Secret key is required').refine(isValidBase32, 'Invalid Base32 secret'),
  algorithm: z.enum(['SHA1', 'SHA256', 'SHA512']),
  digits: z.union([z.literal(6), z.literal(8)]),
  period: z.union([z.literal(30), z.literal(60)]),
})

interface ManualEntryFormProps {
  onSubmit: (parsed: ParsedOtpAuth) => void
  onCancel: () => void
}

export function ManualEntryForm({ onSubmit, onCancel }: ManualEntryFormProps) {
  const [form, setForm] = useState({
    name: '',
    issuer: '',
    secret: '',
    algorithm: 'SHA1' as 'SHA1' | 'SHA256' | 'SHA512',
    digits: 6 as 6 | 8,
    period: 30 as 30 | 60,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSecret, setShowSecret] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const updateField = useCallback(async (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))

    if (field === 'secret' && typeof value === 'string' && isValidBase32(value)) {
      try {
        const code = await generateTOTP(value, { algorithm: form.algorithm, digits: form.digits, period: form.period })
        setPreview(code)
      } catch {
        setPreview(null)
      }
    }
  }, [form.algorithm, form.digits, form.period])

  const handleSubmit = useCallback(() => {
    const result = schema.safeParse(form)
    if (!result.success) {
      const errs: Record<string, string> = {}
      result.error.errors.forEach((e) => { errs[e.path[0] as string] = e.message })
      setErrors(errs)
      return
    }
    onSubmit({
      label: sanitizeName(form.name),
      issuer: sanitizeIssuer(form.issuer),
      secret: sanitizeBase32(form.secret),
      algorithm: form.algorithm,
      digits: form.digits,
      period: form.period,
    })
  }, [form, onSubmit])

  return (
    <div className="px-5 py-4 flex flex-col gap-4">
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5" htmlFor="name">
          Account Name <span className="text-red-400">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={(e) => updateField('name', sanitizeName(e.target.value))}
          placeholder="e.g. john@example.com"
          maxLength={64}
          className="w-full bg-[#0f0f0f] border border-white/[0.06] rounded-[10px] px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/20"
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && <p id="name-error" className="mt-1 text-xs text-red-400">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5" htmlFor="issuer">
          Service / Issuer
        </label>
        <input
          id="issuer"
          type="text"
          value={form.issuer}
          onChange={(e) => updateField('issuer', sanitizeIssuer(e.target.value))}
          placeholder="e.g. Discord, GitHub"
          maxLength={64}
          className="w-full bg-[#0f0f0f] border border-white/[0.06] rounded-[10px] px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/20"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5" htmlFor="secret">
          Secret Key <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <input
            id="secret"
            type={showSecret ? 'text' : 'password'}
            value={form.secret}
            onChange={(e) => updateField('secret', sanitizeBase32(e.target.value))}
            placeholder="Base32 secret"
            maxLength={256}
            className="w-full bg-[#0f0f0f] border border-white/[0.06] rounded-[10px] px-3 py-2.5 pr-10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/20 font-mono"
            aria-describedby={errors.secret ? 'secret-error' : undefined}
          />
          <button
            type="button"
            onClick={() => setShowSecret((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            aria-label={showSecret ? 'Hide secret' : 'Show secret'}
          >
            {showSecret ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M13.8 7.3C12.5 4.7 10.4 3 8 3S3.5 4.7 2.2 7.3a1 1 0 0 0 0 1.4C3.5 11.3 5.6 13 8 13s4.5-1.7 5.8-4.3a1 1 0 0 0 0-1.4zM8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-5a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 2l12 12M13.8 7.3C12.5 4.7 10.4 3 8 3c-1 0-1.9.3-2.7.7M4.5 4.5A7 7 0 0 0 2.2 7.3a1 1 0 0 0 0 1.4C3.5 11.3 5.6 13 8 13c1.3 0 2.5-.5 3.5-1.3" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
        {errors.secret && <p id="secret-error" className="mt-1 text-xs text-red-400">{errors.secret}</p>}
        {preview && (
          <p className="mt-1.5 text-xs text-green-400 font-mono">Preview: {preview.slice(0, 3)} {preview.slice(3)}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5" htmlFor="algorithm">Algorithm</label>
          <select
            id="algorithm"
            value={form.algorithm}
            onChange={(e) => updateField('algorithm', e.target.value)}
            className="w-full bg-[#0f0f0f] border border-white/[0.06] rounded-[10px] px-2 py-2.5 text-xs text-white focus:outline-none focus:border-white/20"
          >
            <option value="SHA1">SHA1</option>
            <option value="SHA256">SHA256</option>
            <option value="SHA512">SHA512</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5" htmlFor="digits">Digits</label>
          <select
            id="digits"
            value={form.digits}
            onChange={(e) => updateField('digits', parseInt(e.target.value))}
            className="w-full bg-[#0f0f0f] border border-white/[0.06] rounded-[10px] px-2 py-2.5 text-xs text-white focus:outline-none focus:border-white/20"
          >
            <option value={6}>6</option>
            <option value={8}>8</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5" htmlFor="period">Period</label>
          <select
            id="period"
            value={form.period}
            onChange={(e) => updateField('period', parseInt(e.target.value))}
            className="w-full bg-[#0f0f0f] border border-white/[0.06] rounded-[10px] px-2 py-2.5 text-xs text-white focus:outline-none focus:border-white/20"
          >
            <option value={30}>30s</option>
            <option value={60}>60s</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <GlowButton variant="ghost" fullWidth onClick={onCancel}>Cancel</GlowButton>
        <GlowButton variant="purple" fullWidth onClick={handleSubmit}>Add Account</GlowButton>
      </div>
    </div>
  )
}
