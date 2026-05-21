'use client'

import { useState, useRef } from 'react'

interface CopyButtonProps {
  text: string
  className?: string
  size?: 'sm' | 'md'
}

export function CopyButton({ text, className = '', size = 'sm' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setCopied(false)
      }, 1500)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const sizeClasses = size === 'sm' ? 'p-1.5' : 'p-2'

  return (
    <button
      onClick={handleCopy}
      className={`relative ${sizeClasses} rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]
        hover:border-[var(--border-strong)] transition-all duration-200
        text-[var(--text-secondary)] hover:text-[var(--text-primary)]
        ${className}`}
      aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {copied ? (
        // Checkmark icon
        <svg
          className="w-4 h-4 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        // Copy icon
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      )}
      {copied && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-green-500 text-white rounded whitespace-nowrap animate-fade-in">
          Copied!
        </span>
      )}
    </button>
  )
}
