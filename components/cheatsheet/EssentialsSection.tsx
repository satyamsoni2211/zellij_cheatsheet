'use client'

import { useState, useMemo, useCallback } from 'react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ShortcutSearch } from './ShortcutSearch'
import { ModeFilter } from './ModeFilter'
import { ShortcutGrid } from './ShortcutGrid'
import { shortcuts, ShortcutMode } from '@/data/shortcuts'
import { meta } from '@/data/meta'

function fuzzyMatch(text: string, query: string): boolean {
  if (!query) return true
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()

  // Simple fuzzy match: all query chars must appear in order
  let queryIndex = 0
  for (let i = 0; i < lowerText.length && queryIndex < lowerQuery.length; i++) {
    if (lowerText[i] === lowerQuery[queryIndex]) {
      queryIndex++
    }
  }
  return queryIndex === lowerQuery.length
}

export function EssentialsSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeModes, setActiveModes] = useState<ShortcutMode[]>([])

  const counts = useMemo(() => {
    const result: Record<ShortcutMode, number> = {
      normal: 0,
      pane: 0,
      tab: 0,
      scroll: 0,
      session: 0,
      resize: 0,
      search: 0,
      locked: 0,
      cli: 0,
    }
    shortcuts.forEach((s) => {
      result[s.mode]++
    })
    return result
  }, [])

  const filteredShortcuts = useMemo(() => {
    return shortcuts.filter((shortcut) => {
      // Filter by mode
      if (activeModes.length > 0 && !activeModes.includes(shortcut.mode)) {
        return false
      }

      // Filter by search query
      if (searchQuery) {
        const searchText = [
          shortcut.action,
          shortcut.description,
          shortcut.keys.join(' '),
          ...shortcut.tags,
        ].join(' ').toLowerCase()

        if (!fuzzyMatch(searchText, searchQuery)) {
          return false
        }
      }

      return true
    })
  }, [searchQuery, activeModes])

  const handleModeToggle = useCallback((mode: ShortcutMode) => {
    setActiveModes((prev) => {
      if (prev.includes(mode)) {
        return prev.filter((m) => m !== mode)
      } else {
        return [...prev, mode]
      }
    })
  }, [])

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title="Essentials Cheatsheet"
          description={`Essential shortcuts for Zellij ${meta.zellijVersion} — Updated ${meta.lastUpdated}`}
          id="essentials"
        />

        <ShortcutSearch value={searchQuery} onChange={setSearchQuery} />

        <ModeFilter
          activeModes={activeModes}
          onToggle={handleModeToggle}
          counts={counts}
        />

        <ShortcutGrid shortcuts={filteredShortcuts} />
      </div>
    </section>
  )
}