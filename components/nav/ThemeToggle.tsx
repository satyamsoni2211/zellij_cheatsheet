'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const themes = [
  { name: 'terminal-dark', label: 'Terminal Dark', icon: '⌨' },
  { name: 'paper-light', label: 'Paper Light', icon: '☀' },
  { name: 'gruvbox-warm', label: 'Gruvbox Warm', icon: '🍂' },
  { name: 'nightowl', label: 'Night Owl', icon: '🌙' },
]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]"
        aria-label="Toggle theme"
      >
        <span className="text-[var(--text-primary)]">◐</span>
      </button>
    )
  }

  const currentIndex = themes.findIndex((t) => t.name === theme)
  const currentTheme = themes[currentIndex] || themes[0]

  const handleClick = () => {
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex].name)
  }

  return (
    <button
      onClick={handleClick}
      title={`Theme: ${currentTheme.label}`}
      className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors"
      aria-label={`Current theme: ${currentTheme.label}. Click to change.`}
    >
      <span className="text-[var(--text-primary)] text-sm" aria-hidden="true">
        {currentTheme.icon}
      </span>
    </button>
  )
}