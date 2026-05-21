'use client'

import { Tab } from '@/lib/simulator-state'

interface TabBarProps {
  tabs: Tab[]
  focusedTabId: string | null
  onTabClick: (tabId: string) => void
  onTabClose: () => void
}

export function TabBar({ tabs, focusedTabId, onTabClick, onTabClose }: TabBarProps) {
  return (
    <div className="flex items-center gap-1 px-2 py-1.5 bg-[var(--bg-secondary)] border-b border-[var(--border)] overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`group flex items-center gap-1 px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer min-w-fit
            ${tab.id === focusedTabId
              ? 'bg-[var(--bg-terminal)] text-[var(--text-primary)] border border-[var(--border)] border-b-0'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-terminal)]/50'
            }`}
          onClick={() => onTabClick(tab.id)}
        >
          <span>{tab.name}</span>
          {tabs.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onTabClose()
              }}
              className="ml-1 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  )
}