'use client'

import { useEffect, useRef, useState } from 'react'

interface ShortcutSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function ShortcutSearch({
  value,
  onChange,
  placeholder = 'Search shortcuts...',
}: ShortcutSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [showHint, setShowHint] = useState(true)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search on "/" keypress (when not in an input)
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault()
        inputRef.current?.focus()
        setShowHint(false)
      }

      // Hide hint after first focus
      if (document.activeElement === inputRef.current) {
        setShowHint(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-[var(--text-secondary)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-16 py-3 bg-[var(--bg-secondary)] border border-[var(--border)]
          rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)]
          focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent
          transition-all"
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        {showHint ? (
          <kbd className="px-2 py-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded text-xs text-[var(--text-secondary)]">
            /
          </kbd>
        ) : (
          <button
            onClick={() => {
              onChange('')
              inputRef.current?.blur()
              setShowHint(true)
            }}
            className="p-1 hover:bg-[var(--bg-primary)] rounded transition-colors"
          >
            <svg
              className="h-4 w-4 text-[var(--text-secondary)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}