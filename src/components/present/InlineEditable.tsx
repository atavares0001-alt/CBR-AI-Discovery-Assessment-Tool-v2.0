'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePresentationContext } from './PresentationShell'

interface InlineEditableProps {
  value: string
  onChange: (value: string) => void
  fieldType?: 'text' | 'textarea' | 'select'
  options?: { label: string; value: string }[]
  placeholder?: string // Only shown during active editing, not as display text
  className?: string
  as?: keyof React.JSX.IntrinsicElements
}

function PencilSmallIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 1.5L10.5 3.5L4 10H2V8L8.5 1.5Z" />
    </svg>
  )
}

export function InlineEditable({
  value,
  onChange,
  fieldType = 'text',
  options,
  placeholder = '',
  className = '',
  as: Tag = 'span',
}: InlineEditableProps) {
  const { editMode } = usePresentationContext()
  const [isEditing, setIsEditing] = useState(false)
  const [localValue, setLocalValue] = useState(value)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null)

  // Sync external value
  useEffect(() => {
    if (!isEditing) {
      setLocalValue(value)
    }
  }, [value, isEditing])

  // Auto-focus when entering edit state
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      // Select text for input/textarea
      if ('select' in inputRef.current && fieldType !== 'select') {
        inputRef.current.select()
      }
    }
  }, [isEditing, fieldType])

  const commitEdit = () => {
    setIsEditing(false)
    if (localValue !== value) {
      onChange(localValue)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && fieldType === 'text') {
      e.preventDefault()
      commitEdit()
    }
    if (e.key === 'Escape') {
      setLocalValue(value)
      setIsEditing(false)
    }
  }

  // Not in edit mode — render plain text (no placeholder shown)
  if (!editMode) {
    if (!value) return null
    return <Tag className={className}>{value}</Tag>
  }

  // In edit mode but not actively editing — show with hover indicators
  if (!isEditing) {
    return (
      <span
        className={`group relative inline-block cursor-pointer rounded transition-all duration-200 ${className}`}
        onClick={() => setIsEditing(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setIsEditing(true)
        }}
      >
        {/* Dashed border on hover */}
        <span className="absolute -inset-1.5 rounded border border-dashed border-transparent group-hover:border-accent/50 transition-colors duration-200 pointer-events-none" />

        {/* Pencil icon on hover */}
        <span className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-accent text-white rounded-full p-0.5 shadow-lg shadow-accent/30 pointer-events-none">
          <PencilSmallIcon />
        </span>

        <span>
          {value || '\u00A0'}
        </span>
      </span>
    )
  }

  // Actively editing
  return (
    <AnimatePresence mode="wait">
      <motion.span
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.15 }}
        className="inline-block"
      >
        {fieldType === 'text' && (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`glass-input px-3 py-1.5 text-inherit w-full min-w-[120px] ${className}`}
          />
        )}

        {fieldType === 'textarea' && (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={localValue}
            onChange={(e) => {
              setLocalValue(e.target.value)
              // Auto-grow
              const el = e.target
              el.style.height = 'auto'
              el.style.height = el.scrollHeight + 'px'
            }}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setLocalValue(value)
                setIsEditing(false)
              }
            }}
            placeholder={placeholder}
            rows={5}
            className={`glass-input px-3 py-1.5 text-inherit w-full min-h-[120px] resize-none overflow-hidden ${className}`}
          />
        )}

        {fieldType === 'select' && options && (
          <select
            ref={inputRef as React.RefObject<HTMLSelectElement>}
            value={localValue}
            onChange={(e) => {
              setLocalValue(e.target.value)
              onChange(e.target.value)
              setIsEditing(false)
            }}
            onBlur={commitEdit}
            className={`glass-input px-3 py-1.5 text-inherit cursor-pointer ${className}`}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-card text-text-primary">
                {opt.label}
              </option>
            ))}
          </select>
        )}
      </motion.span>
    </AnimatePresence>
  )
}
