'use client'

import { type SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: { value: string; label: string }[]
  error?: string
  placeholder?: string
}

export function Select({ label, options, error, required, id, placeholder, className = '', ...props }: SelectProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-text-secondary">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </label>
      <select
        id={id}
        required={required}
        className={`glass-input w-full px-4 py-3 text-sm ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" className="bg-card">
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-card">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}
