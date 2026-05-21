'use client'

import { SimulatorMode, Tab } from '@/lib/simulator-state'
import { modeHints } from '@/lib/simulator-state'

interface StatusBarProps {
  mode: SimulatorMode
  tabs: Tab[]
  focusedTabId: string | null
  sessionName: string
  onTabClick: (tabId: string) => void
}

const modeColors: Record<SimulatorMode, string> = {
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

const modeTextColors: Record<SimulatorMode, string> = {
  normal: 'text-black',
  pane: 'text-black',
  tab: 'text-white',
  scroll: 'text-black',
  session: 'text-white',
  resize: 'text-white',
  search: 'text-white',
  locked: 'text-white',
  cli: 'text-white',
}

export function StatusBar({ mode, tabs, focusedTabId, sessionName, onTabClick }: StatusBarProps) {
  const hints = modeHints[mode] || []

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-[var(--bg-secondary)] border-t border-[var(--border)] text-xs font-mono">
      {/* Left: mode badge */}
      <div className="flex items-center gap-3">
        <span
          className={`px-2 py-1 rounded font-bold text-xs ${modeColors[mode]} ${modeTextColors[mode]}`}
        >
          {mode.toUpperCase()}
        </span>
        {sessionName && (
          <span className="text-[var(--text-secondary)]">
            {sessionName}
          </span>
        )}
      </div>

      {/* Center: shortcut hints */}
      <div className="flex items-center gap-3 text-[var(--text-secondary)]">
        {hints.map((hint, i) => (
          <span key={i} className="flex items-center gap-1">
            {hint.includes('Ctrl') ? (
              <>
                <kbd className="px-1 py-0.5 rounded bg-[var(--kbd-bg)] border border-[var(--kbd-border)] text-[var(--kbd-text)] text-[10px]">
                  Ctrl
                </kbd>
                <span className="text-[10px]">{hint.replace('Ctrl+', '')}</span>
              </>
            ) : hint.includes('Esc') ? (
              <kbd className="px-1 py-0.5 rounded bg-[var(--kbd-bg)] border border-[var(--kbd-border)] text-[var(--kbd-text)] text-[10px]">
                Esc
              </kbd>
            ) : (
              <span className="text-[10px]">{hint}</span>
            )}
          </span>
        ))}
      </div>

      {/* Right: tab names */}
      <div className="flex items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabClick(tab.id)}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              tab.id === focusedTabId
                ? 'bg-[var(--accent)] text-[var(--accent-text)] font-medium'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>
    </div>
  )
}