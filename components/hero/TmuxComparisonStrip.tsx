'use client'

interface Comparison {
  tmux: string
  zellij: string
}

const comparisons: Comparison[] = [
  {
    tmux: 'No UI hints — memorize or look up',
    zellij: 'Shortcut guide always visible in status bar',
  },
  {
    tmux: 'bash-based config (tmux.conf)',
    zellij: 'Human-readable KDL format',
  },
  {
    tmux: 'Shell script plugins',
    zellij: 'WASM plugins in any language',
  },
  {
    tmux: 'No floating panes',
    zellij: 'Native floating and stacked panes',
  },
  {
    tmux: 'Session sharing is manual',
    zellij: 'True multiplayer with per-user cursors',
  },
]

export function TmuxComparisonStrip() {
  return (
    <div className="w-full py-6 bg-[var(--bg-secondary)] border-y border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {comparisons.map(({ tmux, zellij }, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center gap-3 p-4 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)]"
            >
              {/* tmux pill */}
              <div className="w-full">
                <div className="px-3 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-xs text-[var(--text-secondary)] font-mono">
                  {tmux}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20">
                <svg
                  className="w-4 h-4 text-[var(--accent)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>

              {/* Zellij pill */}
              <div className="w-full">
                <div className="px-3 py-1.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-xs text-[var(--accent)] font-mono">
                  {zellij}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}