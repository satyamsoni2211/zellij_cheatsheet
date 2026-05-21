'use client'

import { memo } from 'react'
import { Shortcut } from '@/data/shortcuts'
import { ShortcutCard } from './ShortcutCard'

interface ShortcutGridProps {
  shortcuts: Shortcut[]
}

export const ShortcutGrid = memo(function ShortcutGrid({ shortcuts }: ShortcutGridProps) {
  if (shortcuts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--text-secondary)]">
          No shortcuts match your search criteria.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {shortcuts.map((shortcut) => (
        <ShortcutCard
          key={shortcut.id}
          shortcut={shortcut}
          relatedShortcuts={[]}
        />
      ))}
    </div>
  )
})