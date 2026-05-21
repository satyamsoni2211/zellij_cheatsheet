import Link from 'next/link'
import { shortcuts, type ShortcutMode } from '@/data/shortcuts'

// Mode display configuration
const modeConfig: Record<ShortcutMode, { label: string; color: string }> = {
  normal: { label: 'Normal', color: '#22c55e' },
  pane: { label: 'Pane', color: '#eab308' },
  tab: { label: 'Tab', color: '#3b82f6' },
  scroll: { label: 'Scroll', color: '#06b6d4' },
  session: { label: 'Session', color: '#a855f7' },
  resize: { label: 'Resize', color: '#f97316' },
  search: { label: 'Search', color: '#ec4899' },
  locked: { label: 'Locked', color: '#ef4444' },
  cli: { label: 'CLI', color: '#8b5cf6' },
}

// Group shortcuts by mode
function groupByMode(shortcuts: typeof import('@/data/shortcuts').shortcuts) {
  const groups: Record<ShortcutMode, typeof shortcuts> = {} as Record<ShortcutMode, typeof shortcuts>
  shortcuts.forEach((shortcut) => {
    if (!groups[shortcut.mode]) {
      groups[shortcut.mode] = []
    }
    groups[shortcut.mode].push(shortcut)
  })
  return groups
}

export default function PrintPage() {
  const groupedShortcuts = groupByMode(shortcuts)

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Print header */}
      <div className="border-b-2 border-black pb-4 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Zellij Cheatsheet</h1>
            <p className="text-sm text-gray-600 mt-1">Covers Zellij v0.40</p>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p>Last updated: May 2026</p>
            <p className="mt-1">
              <Link href="/" className="text-blue-600 hover:underline">
                zellij-cheatsheet.vercel.app
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Compact two-column shortcut grid */}
      <div className="space-y-8">
        {(Object.keys(modeConfig) as ShortcutMode[]).map((mode) => {
          const shortcutsForMode = groupedShortcuts[mode]
          if (!shortcutsForMode || shortcutsForMode.length === 0) return null

          return (
            <section key={mode} className="print-section">
              {/* Mode header */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="px-2 py-0.5 text-xs font-mono font-semibold rounded"
                  style={{
                    backgroundColor: `${modeConfig[mode].color}20`,
                    color: modeConfig[mode].color,
                    border: `1px solid ${modeConfig[mode].color}`,
                  }}
                >
                  {modeConfig[mode].label}
                </span>
                <span className="text-xs text-gray-500">
                  {mode === 'cli' ? 'Ctrl+o' : `Ctrl+${mode.charAt(0).toLowerCase()}`} prefix
                </span>
              </div>

              {/* Two-column grid */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                {shortcutsForMode.map((shortcut) => (
                  <div key={shortcut.id} className="flex items-start gap-3 py-1">
                    {/* Keys */}
                    <div className="flex-shrink-0 flex flex-wrap gap-1 min-w-[120px]">
                      {shortcut.keys.map((key, i) => (
                        <span key={i}>
                          <kbd className="px-1.5 py-0.5 text-xs font-mono bg-gray-100 border border-gray-300 rounded">
                            {key}
                          </kbd>
                          {i < shortcut.keys.length - 1 && (
                            <span className="text-gray-400 mx-0.5">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                    {/* Action */}
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-900">
                        {shortcut.action}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {shortcut.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {/* Print footer */}
      <div className="mt-12 pt-4 border-t-2 border-black text-center text-xs text-gray-500">
        <p>Not affiliated with official Zellij project. Open a PR to contribute.</p>
        <p className="mt-1">Made by developers, for developers.</p>
      </div>
    </div>
  )
}