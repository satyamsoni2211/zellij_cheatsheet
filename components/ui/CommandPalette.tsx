'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { search, getRecentlyVisited, addToRecentlyVisited, SearchItem } from '@/lib/search'
import { Kbd } from './Kbd'
import { CopyButton } from './CopyButton'

const typeIcons: Record<string, React.ReactNode> = {
  shortcut: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  ),
  workflow: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  ),
  config: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  plugin: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
    </svg>
  ),
  section: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  ),
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchItem[]>([])
  const [recentItems, setRecentItems] = useState<SearchItem[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Load recent items
  useEffect(() => {
    setMounted(true)
    setRecentItems(getRecentlyVisited())
  }, [])

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    if (!mounted) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
        if (!isOpen) {
          setRecentItems(getRecentlyVisited())
          setQuery('')
          setResults([])
          setSelectedIndex(0)
        }
      }

      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mounted, isOpen])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Search on query change
  useEffect(() => {
    if (query.trim()) {
      const searchResults = search(query)
      setResults(searchResults)
      setSelectedIndex(0)
    } else {
      setResults([])
    }
  }, [query])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const items = query.trim() ? results : recentItems
    const maxIndex = items.length - 1

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => (prev < maxIndex ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : maxIndex))
        break
      case 'Enter':
        e.preventDefault()
        if (items[selectedIndex]) {
          handleSelect(items[selectedIndex])
        }
        break
    }
  }, [results, recentItems, selectedIndex, query])

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.querySelector(`[data-index="${selectedIndex}"]`)
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  const handleSelect = (item: SearchItem) => {
    if (item.type === 'shortcut') {
      addToRecentlyVisited(item.id)
    }

    // Navigate to section if applicable
    if (item.type === 'section') {
      const element = document.getElementById(item.id.replace('section-', ''))
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }

    setIsOpen(false)
  }

  const displayItems = query.trim() ? results : recentItems

  if (!mounted) return null

  return (
    <>
      {/* Search trigger button (in navbar) */}
      {!isOpen && (
        <button
          onClick={() => {
            setRecentItems(getRecentlyVisited())
            setIsOpen(true)
          }}
          className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]
            hover:border-[var(--border-strong)] transition-colors"
          aria-label="Search shortcuts (Cmd+K)"
        >
          <svg
            className="w-4 h-4 text-[var(--text-secondary)]"
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
        </button>
      )}

      {/* Modal overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
          onClick={() => setIsOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal */}
          <div
            className="relative w-full max-w-xl mx-4 bg-[var(--bg-primary)] border border-[var(--border)]
              rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
              <svg
                className="w-5 h-5 text-[var(--text-secondary)]"
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
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search shortcuts, workflows, config..."
                className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)]
                  outline-none text-base"
              />
              <kbd className="px-2 py-1 text-xs bg-[var(--bg-secondary)] border border-[var(--border)]
                rounded text-[var(--text-secondary)]">
                ESC
              </kbd>
            </div>

            {/* Results list */}
            <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-2">
              {!query.trim() && recentItems.length > 0 && (
                <div className="px-3 py-2">
                  <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                    Recently Visited
                  </p>
                </div>
              )}

              {displayItems.length === 0 && query.trim() && (
                <div className="px-4 py-8 text-center text-[var(--text-secondary)]">
                  No results found for "{query}"
                </div>
              )}

              {displayItems.map((item, index) => (
                <div
                  key={item.id}
                  data-index={index}
                  onClick={() => handleSelect(item)}
                  className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors
                    ${index === selectedIndex ? 'bg-[var(--bg-secondary)]' : 'hover:bg-[var(--bg-secondary)]'}`}
                >
                  {/* Icon */}
                  <span className="text-[var(--text-secondary)]">
                    {typeIcons[item.type]}
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {item.title}
                      </span>
                      {item.shortcut && (
                        <Kbd keys={item.keys || []} className="shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] truncate">
                      {item.section && <span className="text-[var(--accent)]">{item.section} / </span>}
                      {item.description}
                    </p>
                  </div>

                  {/* Copy button for shortcuts */}
                  {item.type === 'shortcut' && item.shortcut && (
                    <CopyButton text={item.shortcut} size="sm" />
                  )}

                  {/* Arrow hint */}
                  {index === selectedIndex && (
                    <svg className="w-4 h-4 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
              <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded">↑↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded">↵</kbd>
                  select
                </span>
              </div>
              <span className="text-xs text-[var(--text-secondary)]">
                Powered by Fuse.js
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}