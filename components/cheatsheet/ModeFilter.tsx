'use client'

import { ShortcutMode } from '@/data/shortcuts'

interface ModeFilterProps {
  activeModes: ShortcutMode[]
  onToggle: (mode: ShortcutMode) => void
  counts: Record<ShortcutMode, number>
}

const modeLabels: Record<ShortcutMode | 'all', string> = {
  all: 'All',
  normal: 'Normal',
  pane: 'Pane',
  tab: 'Tab',
  scroll: 'Scroll',
  session: 'Session',
  resize: 'Resize',
  search: 'Search',
  locked: 'Locked',
  cli: 'CLI',
}

const modeColors: Record<ShortcutMode, string> = {
  normal: 'bg-[var(--mode-normal)]',
  pane: 'bg-[var(--mode-pane)]',
  tab: 'bg-[var(--mode-tab)]',
  scroll: 'bg-[var(--mode-scroll)]',
  session: 'bg-[var(--mode-session)]',
  resize: 'bg-purple-500',
  search: 'bg-orange-500',
  locked: 'bg-red-500',
  cli: 'bg-gray-500',
}

const modes: ShortcutMode[] = [
  'normal',
  'pane',
  'tab',
  'scroll',
  'session',
  'resize',
  'search',
  'locked',
  'cli',
]

export function ModeFilter({ activeModes, onToggle, counts }: ModeFilterProps) {
  const isAllActive = activeModes.length === 0

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => {
          // Clear all modes if "All" is clicked
          if (isAllActive) return
          modes.forEach((m) => {
            if (activeModes.includes(m)) return
            onToggle(m)
          })
        }}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all
          ${
            isAllActive
              ? 'bg-[var(--accent)] text-[var(--accent-text)]'
              : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--border)]'
          }`}
      >
        All
        <span className="ml-2 opacity-60">
          {Object.values(counts).reduce((a, b) => a + b, 0)}
        </span>
      </button>

      {modes.map((mode) => {
        const isActive = activeModes.includes(mode)
        const count = counts[mode] || 0

        return (
          <button
            key={mode}
            onClick={() => onToggle(mode)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2
              ${
                isActive
                  ? `${modeColors[mode]} text-white`
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--border)]'
              }`}
          >
            <span>{modeLabels[mode]}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-xs
                ${
                  isActive
                    ? 'bg-white/20'
                    : 'bg-[var(--bg-primary)] text-[var(--text-secondary)]'
                }`}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}