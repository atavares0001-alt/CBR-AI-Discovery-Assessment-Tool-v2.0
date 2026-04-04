'use client'

import { useState } from 'react'

interface MultiSelectChipsProps {
  id: string
  label: string
  options: string[]
  value: string[]
  onChange: (selected: string[]) => void
  showOther?: boolean
  required?: boolean
}

export function MultiSelectChips({
  id,
  label,
  options,
  value,
  onChange,
  showOther = true,
  required = false,
}: MultiSelectChipsProps) {
  const knownSelected = value.filter((v) => v !== '__other__' && options.includes(v))
  const otherValues = value.filter((v) => v !== '__other__' && !options.includes(v))
  const hasOther = value.includes('__other__') || otherValues.length > 0
  const [otherText, setOtherText] = useState(otherValues.join(', '))

  function toggleOption(option: string) {
    if (option === 'None') {
      // Selecting None clears everything else; deselecting None is a normal toggle
      const next = knownSelected.includes('None') ? [] : ['None']
      emitChange(next, false, '')
      return
    }
    // Selecting a non-None option removes None if it was selected
    let next = knownSelected.filter((v) => v !== 'None')
    next = next.includes(option)
      ? next.filter((v) => v !== option)
      : [...next, option]
    emitChange(next, hasOther, otherText)
  }

  function toggleOther() {
    const nextHasOther = !hasOther
    if (!nextHasOther) {
      setOtherText('')
    }
    emitChange(knownSelected, nextHasOther, nextHasOther ? otherText : '')
  }

  function handleOtherText(text: string) {
    setOtherText(text)
    emitChange(knownSelected, true, text)
  }

  function emitChange(selected: string[], includeOther: boolean, other: string) {
    const result = [...selected]
    if (includeOther) {
      result.push('__other__')
      const extras = other
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      result.push(...extras)
    }
    onChange(result)
  }

  const selectedCount = knownSelected.length + (hasOther ? otherValues.length : 0)

  return (
    <div className="question-group">
      <div className="question-group-label">
        <span className="label-dot" />
        <span>{label}{required && <span className="ml-1 text-accent">*</span>}</span>
        {selectedCount > 0 && (
          <span className="ml-auto rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
            {selectedCount} selected
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = knownSelected.includes(option)
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleOption(option)}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-all duration-150 ${
                isSelected
                  ? 'border-accent bg-accent/15 font-medium text-accent shadow-sm shadow-accent/10'
                  : 'border-glass-border bg-glass-bg text-text-secondary hover:border-accent/30 hover:bg-accent/5 hover:text-text-primary'
              }`}
            >
              {isSelected && <span className="mr-1.5">✓</span>}
              {option}
            </button>
          )
        })}
        {showOther && (
          <button
            type="button"
            onClick={toggleOther}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition-all duration-150 ${
              hasOther
                ? 'border-accent bg-accent/15 font-medium text-accent shadow-sm shadow-accent/10'
                : 'border-glass-border bg-glass-bg text-text-secondary hover:border-accent/30 hover:bg-accent/5 hover:text-text-primary'
            }`}
          >
            {hasOther && <span className="mr-1.5">✓</span>}
            Other
          </button>
        )}
      </div>
      {hasOther && (
        <input
          id={`${id}_other`}
          type="text"
          placeholder="Type other tools, separated by commas"
          value={otherText}
          onChange={(e) => handleOtherText(e.target.value)}
          className="glass-input mt-3 w-full px-4 py-3 text-sm"
        />
      )}
    </div>
  )
}
