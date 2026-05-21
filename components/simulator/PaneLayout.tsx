'use client'

import { Pane } from '@/lib/simulator-state'

interface PaneLayoutProps {
  panes: Pane[]
  focusedPaneId: string | null
  onPaneClick: (paneId: string) => void
  reducedMotion: boolean
}

export function PaneLayout({ panes, focusedPaneId, onPaneClick, reducedMotion }: PaneLayoutProps) {
  const tiledPanes = panes.filter((p) => !p.floating)
  const floatingPanes = panes.filter((p) => p.floating)

  return (
    <div className="relative w-full h-full bg-[var(--bg-terminal)] overflow-hidden">
      {/* Tiled panes */}
      <div className="absolute inset-0">
        {tiledPanes.map((pane) => (
          <div
            key={pane.id}
            className={`absolute border border-[var(--border)] transition-all duration-300
              ${reducedMotion ? '' : 'transition-all duration-300'}
              ${pane.id === focusedPaneId ? 'border-2 border-[var(--accent)]' : ''}
            `}
            style={{
              left: `${pane.x}%`,
              top: `${pane.y}%`,
              width: `${pane.w}%`,
              height: `${pane.h}%`,
            }}
            onClick={() => onPaneClick(pane.id)}
          >
            {/* Pane content */}
            <div className="absolute inset-0 p-3 font-mono text-xs bg-[var(--bg-terminal)]">
              <div className="text-[var(--text-secondary)]">
                <span className="text-green-500">user</span>
                <span className="text-[var(--text-secondary)]">@</span>
                <span className="text-blue-400">host</span>
                <span className="text-[var(--text-secondary)]">:</span>
                <span className="text-yellow-300">~</span>
                <span className="text-[var(--text-secondary)]">$ </span>
              </div>
              <div className="mt-2 text-[var(--text-primary)] opacity-80">
                {pane.command}
              </div>
              {pane.id === focusedPaneId && (
                <div className="absolute bottom-2 left-3 right-3">
                  <span className="animate-pulse text-[var(--accent)]">▋</span>
                </div>
              )}
            </div>

            {/* Box drawing border */}
            {pane.w > 10 && pane.h > 10 && (
              <div className="absolute inset-0 pointer-events-none">
                <span className="absolute top-0 left-0 text-[var(--border-strong)] text-xs">┌</span>
                <span className="absolute top-0 right-0 text-[var(--border-strong)] text-xs">┐</span>
                <span className="absolute bottom-0 left-0 text-[var(--border-strong)] text-xs">└</span>
                <span className="absolute bottom-0 right-0 text-[var(--border-strong)] text-xs">┘</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Floating panes */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingPanes.map((pane) => (
          <div
            key={pane.id}
            className={`absolute border-2 border-[var(--mode-pane)] rounded-md bg-[var(--bg-terminal)] shadow-2xl pointer-events-auto
              ${pane.id === focusedPaneId ? 'ring-2 ring-[var(--accent)]' : ''}
              ${reducedMotion ? '' : 'transition-all duration-300'}
            `}
            style={{
              left: `${pane.x}%`,
              top: `${pane.y}%`,
              width: `${pane.w}%`,
              height: `${pane.h}%`,
              zIndex: pane.zIndex,
            }}
            onClick={() => onPaneClick(pane.id)}
          >
            <div className="absolute inset-0 p-3 font-mono text-xs">
              <div className="text-[var(--text-secondary)]">
                <span className="text-green-500">user</span>
                <span className="text-[var(--text-secondary)]">@</span>
                <span className="text-blue-400">host</span>
                <span className="text-[var(--text-secondary)]">:</span>
                <span className="text-yellow-300">~</span>
                <span className="text-[var(--text-secondary)]">$ </span>
              </div>
              <div className="mt-2 text-[var(--text-primary)] opacity-80">
                {pane.command}
              </div>
              {pane.id === focusedPaneId && (
                <div className="absolute bottom-2 left-3 right-3">
                  <span className="animate-pulse text-[var(--mode-pane)]">▋</span>
                </div>
              )}
            </div>
            {/* Floating pane title bar */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-[var(--mode-pane)]/20 rounded-t-md flex items-center px-2">
              <span className="text-xs text-[var(--mode-pane)]">Floating Pane</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}