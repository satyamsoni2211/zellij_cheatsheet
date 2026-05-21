'use client'

import { useState, useEffect } from 'react'
import { shortcuts, ShortcutMode } from '@/data/shortcuts'
import { Kbd } from './Kbd'
import { ModeFilter } from '@/components/cheatsheet/ModeFilter'
import { CopyButton } from './CopyButton'

const DRAWER_STORAGE_KEY = 'quickRefDrawerOpen'
const FILTER_STORAGE_KEY = 'quickRefDrawerFilter'

export function QuickRefDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeModes, setActiveModes] = useState<ShortcutMode[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Restore drawer state
    const storedOpen = sessionStorage.getItem(DRAWER_STORAGE_KEY)
    if (storedOpen === 'true') setIsOpen(true)

    // Restore filter state
    const storedFilter = sessionStorage.getItem(FILTER_STORAGE_KEY)
    if (storedFilter) {
      try {
        setActiveModes(JSON.parse(storedFilter))
      } catch {
        // Invalid JSON, ignore
      }
    }

    // Keyboard shortcut: Shift+?
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === '?') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const toggleDrawer = () => {
    const newState = !isOpen
    setIsOpen(newState)
    sessionStorage.setItem(DRAWER_STORAGE_KEY, String(newState))
  }

  const handleModeToggle = (mode: ShortcutMode) => {
    setActiveModes((prev) => {
      const newModes = prev.includes(mode)
        ? prev.filter((m) => m !== mode)
        : [...prev, mode]
      sessionStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(newModes))
      return newModes
    })
  }

  // Count shortcuts per mode
  const counts = shortcuts.reduce((acc, shortcut) => {
    acc[shortcut.mode] = (acc[shortcut.mode] || 0) + 1
    return acc
  }, {} as Record<ShortcutMode, number>)

  // Filter shortcuts
  const filteredShortcuts = activeModes.length === 0
    ? shortcuts
    : shortcuts.filter((s) => activeModes.includes(s.mode))

  if (!mounted) return null

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={toggleDrawer}
        className="fixed bottom-6 right-6 z-40 px-4 py-2.5 rounded-full
          bg-[var(--accent)] text-[var(--accent-text)] font-medium text-sm
          shadow-lg hover:shadow-xl transition-all duration-200
          flex items-center gap-2 border border-[var(--accent)]"
        aria-label="Open quick reference"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span className="hidden sm:inline">Cheatsheet</span>
        <kbd className="hidden sm:inline px-1.5 py-0.5 text-xs bg-white/20 rounded">?</kbd>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={toggleDrawer}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed z-50 bg-[var(--bg-primary)] border border-[var(--border)]
          shadow-2xl transition-transform duration-300 ease-out
          w-[360px] max-h-[70vh] overflow-hidden
          rounded-tl-2xl rounded-bl-2xl
          flex flex-col
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          bottom-0 right-0`}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
          <h2 className="font-semibold text-[var(--text-primary)]">Quick Reference</h2>
          <button
            onClick={toggleDrawer}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-primary)] transition-colors text-[var(--text-secondary)]"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Compact mode filter */}
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <ModeFilter
            activeModes={activeModes}
            onToggle={handleModeToggle}
            counts={counts}
          />
        </div>

        {/* Condensed shortcut list */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {filteredShortcuts.map((shortcut) => (
            <div
              key={shortcut.id}
              className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-[var(--bg-secondary)] group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Kbd keys={shortcut.keys} className="shrink-0" />
                <span className="text-sm text-[var(--text-primary)] truncate">
                  {shortcut.action}
                </span>
              </div>
              <CopyButton text={shortcut.keys.join(' ')} size="sm" />
            </div>
          ))}
        </div>

        {/* Footer link */}
        <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
          <a
            href="#essentials"
            onClick={toggleDrawer}
            className="flex items-center justify-center gap-1 text-sm text-[var(--accent)] hover:underline"
          >
            See full cheatsheet
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </a>
        </div>
      </aside>
    </>
  )
}