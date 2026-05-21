'use client'

import { useState, useCallback } from 'react'
import { Shortcut, ShortcutMode } from '@/data/shortcuts'
import { Kbd } from '@/components/ui/Kbd'

interface ShortcutCardProps {
  shortcut: Shortcut
  relatedShortcuts?: Shortcut[]
}

const modeLabels: Record<ShortcutMode, string> = {
  normal: 'NORMAL',
  pane: 'PANE',
  tab: 'TAB',
  scroll: 'SCROLL',
  session: 'SESSION',
  resize: 'RESIZE',
  search: 'SEARCH',
  locked: 'LOCKED',
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

export function ShortcutCard({ shortcut, relatedShortcuts = [] }: ShortcutCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = useCallback(() => {
    const keyCombo = shortcut.keys.join(' ')
    navigator.clipboard.writeText(keyCombo).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }, [shortcut.keys])

  const handleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev)
  }, [])

  const handleTryIt = useCallback(() => {
    // In a real app, this would trigger the simulator
    console.log(`Try shortcut: ${shortcut.id}`)
  }, [shortcut.id])

  return (
    <div
      className={`bg-[var(--card)] border border-[var(--border)] rounded-lg p-4
        transition-all duration-200 cursor-pointer
        ${isExpanded ? 'ring-2 ring-[var(--accent)]' : 'hover:border-[var(--border-strong)]'}`}
      onClick={handleExpand}
    >
      {/* Mode Badge */}
      <div className="flex justify-between items-start mb-3">
        <span
          className={`px-2 py-0.5 rounded text-xs font-bold text-white ${modeColors[shortcut.mode]}`}
        >
          {modeLabels[shortcut.mode]}
        </span>
      </div>

      {/* Keys */}
      <div className="flex flex-wrap gap-1 mb-3">
        {shortcut.keys.map((key, index) => (
          <Kbd key={index} keys={[key]} />
        ))}
      </div>

      {/* Action */}
      <h3 className="font-bold text-[var(--text-primary)] mb-1">
        {shortcut.action}
      </h3>

      {/* Description */}
      <p className="text-sm text-[var(--text-secondary)] mb-3">
        {shortcut.description}
      </p>

      {/* Footer */}
      <div className="flex justify-between items-center">
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleTryIt()
          }}
          className="text-xs text-[var(--accent)] hover:underline"
        >
          Try it
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            handleCopy()
          }}
          className="p-1.5 hover:bg-[var(--bg-secondary)] rounded transition-colors"
          title="Copy shortcut"
        >
          {isCopied ? (
            <svg
              className="h-4 w-4 text-green-500"
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
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div
          className="mt-4 pt-4 border-t border-[var(--border)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {shortcut.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Related Shortcuts */}
          {relatedShortcuts.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase mb-2">
                Related Shortcuts
              </h4>
              <div className="space-y-2">
                {relatedShortcuts.map((related) => (
                  <div key={related.id} className="flex items-center gap-2">
                    <Kbd keys={related.keys} />
                    <span className="text-sm text-[var(--text-primary)]">
                      {related.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Since Version */}
          <p className="text-xs text-[var(--text-secondary)] mt-4">
            Available since Zellij {shortcut.sinceVersion}
          </p>
        </div>
      )}
    </div>
  )
}