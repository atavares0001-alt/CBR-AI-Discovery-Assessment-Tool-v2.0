'use client'

import { type TextareaHTMLAttributes, useState } from 'react'
import { CHAR_LIMITS } from '@/lib/utils/validation'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  maxChars?: number
}

export function Textarea({
  label,
  error,
  required,
  id,
  maxChars = CHAR_LIMITS.textarea,
  value,
  onChange,
  className = '',
  ...props
}: TextareaProps) {
  const [charCount, setCharCount] = useState((value as string)?.length || 0)

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (e.target.value.length <= maxChars) {
      setCharCount(e.target.value.length)
      onChange?.(e)
    }
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-text-secondary">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </label>
      <textarea
        id={id}
        required={required}
        value={value}
        onChange={handleChange}
        rows={4}
        className={`glass-input w-full resize-y px-4 py-3 text-sm ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      <div className="mt-1 flex justify-between">
        {error ? (
          <p className="text-xs text-red-400">{error}</p>
        ) : (
          <span />
        )}
        <span className={`text-xs ${charCount >= maxChars ? 'text-red-400' : 'text-text-muted'}`}>
          {charCount}/{maxChars}
        </span>
      </div>
    </div>
  )
}
