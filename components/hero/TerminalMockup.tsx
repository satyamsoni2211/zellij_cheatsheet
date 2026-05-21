'use client'

import { useEffect, useState } from 'react'

type TerminalMode = 'NORMAL' | 'PANE' | 'TAB' | 'SESSION'

interface ModeState {
  mode: TerminalMode
  hint: string
}

const animationSequence: ModeState[] = [
  { mode: 'NORMAL', hint: '' },
  { mode: 'NORMAL', hint: '^P' },
  { mode: 'PANE', hint: '^P pane' },
  { mode: 'PANE', hint: '^D' },
  { mode: 'PANE', hint: 'new pane' },
  { mode: 'NORMAL', hint: 'Esc' },
]

export function TerminalMockup() {
  const [phase, setPhase] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    const interval = setInterval(() => {
      setPhase((p) => (p + 1) % animationSequence.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [reducedMotion])

  const state = animationSequence[phase]
  const showSplit = phase >= 3

  return (
    <div className="relative w-full max-w-lg">
      {/* Terminal chrome */}
      <div className="rounded-t-xl border border-[var(--border)] overflow-hidden shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-secondary)] border-b border-[var(--border)]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex-1 text-center text-xs font-mono text-[var(--text-secondary)]">
            zellij — bash — 120×40
          </div>
        </div>

        {/* Terminal content */}
        <div
          className="relative bg-[var(--bg-terminal)] p-0"
          style={{ height: '320px' }}
        >
          {/* Pane structure */}
          <div className="absolute inset-0 flex">
            {/* Main pane */}
            <div
              className={`relative flex-1 border-r border-[var(--border)] ${
                showSplit && phase < 5 ? 'border-[var(--mode-pane)]' : ''
              }`}
              style={{
                borderRightWidth: showSplit ? '2px' : '1px',
                borderRightColor: showSplit && phase < 5 ? 'var(--mode-pane)' : 'var(--border)',
              }}
            >
              <div className="absolute inset-0 p-3 font-mono text-sm">
                <div className="text-[var(--text-secondary)]">
                  <span className="text-green-500">sat@box</span>
                  <span className="text-[var(--text-secondary)]">:</span>
                  <span className="text-blue-400">~/projects/zellij</span>
                  <span className="text-[var(--text-secondary)]">$ </span>
                  <span className="text-[var(--text-primary)]">cargo build --release</span>
                </div>
                <div className="mt-2 text-[var(--text-secondary)]">
                  <span className="animate-pulse">Compiling</span>
                  <span className="ml-2 text-[var(--text-mono)]">zellij-utils v0.40.0</span>
                </div>
                <div className="mt-1 text-[var(--text-secondary)]">
                  <span className="text-green-400">✓</span>
                  <span className="ml-2">Done in 12.3s
                  </span>
                </div>
              </div>
            </div>

            {/* Side pane (appears on split) */}
            {showSplit && (
              <div className="relative flex-1">
                <div className="absolute inset-0 p-3 font-mono text-sm">
                  <div className="text-[var(--text-secondary)]">
                    <span className="text-green-500">sat@box</span>
                    <span className="text-[var(--text-secondary)]">:</span>
                    <span className="text-blue-400">~/projects/zellij</span>
                    <span className="text-[var(--text-secondary)]">$ </span>
                    <span className="text-[var(--text-primary)]">vim src/main.rs</span>
                  </div>
                  <div className="mt-3 text-[var(--text-mono)] text-xs leading-relaxed">
                    <div className="text-yellow-300">fn main() &#123;</div>
                    <div className="pl-4 text-[var(--text-secondary)]">println!(&quot;Hello&quot;);</div>
                    <div className="text-yellow-300">&#125;</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Floating hint overlay */}
          {state.hint && (
            <div
              className={`absolute transition-all duration-500 font-mono text-xs pointer-events-none ${
                phase === 1 ? 'top-4 left-1/2 -translate-x-1/2' : 'top-2 right-2'
              }`}
            >
              <div className="flex items-center gap-1.5">
                {state.hint.includes('^P') && (
                  <kbd className="px-2 py-1 rounded bg-[var(--kbd-bg)] border border-[var(--kbd-border)] text-[var(--kbd-text)] text-xs font-mono shadow-sm">
                    Ctrl+P
                  </kbd>
                )}
                {state.hint.includes('^D') && (
                  <kbd className="px-2 py-1 rounded bg-[var(--kbd-bg)] border border-[var(--kbd-border)] text-[var(--kbd-text)] text-xs font-mono shadow-sm">
                    d
                  </kbd>
                )}
                {state.hint === 'Esc' && (
                  <kbd className="px-2 py-1 rounded bg-[var(--kbd-bg)] border border-[var(--kbd-border)] text-[var(--kbd-text)] text-xs font-mono shadow-sm">
                    Esc
                  </kbd>
                )}
                {state.hint === 'new pane' && (
                  <span className="px-2 py-1 rounded bg-[var(--mode-pane)]/20 text-[var(--mode-pane)] text-xs">
                    + pane
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-1.5 bg-[var(--bg-secondary)] border-t border-[var(--border)] text-xs font-mono">
          {/* Left: session info */}
          <div className="flex items-center gap-4 text-[var(--text-secondary)]">
            <span>0</span>
            <span>sat@box</span>
            <span>120×40</span>
          </div>

          {/* Center: mode badges */}
          <div className="flex items-center gap-2">
            <ModeBadge label="NORMAL" active={state.mode === 'NORMAL'} color="--mode-normal" />
            <ModeBadge label="PANE" active={state.mode === 'PANE'} color="--mode-pane" />
            <ModeBadge label="TAB" active={state.mode === 'TAB'} color="--mode-tab" />
            <ModeBadge label="SESSION" active={state.mode === 'SESSION'} color="--mode-session" />
          </div>

          {/* Right: zellij version */}
          <div className="text-[var(--text-secondary)]">zellij 0.40</div>
        </div>
      </div>
    </div>
  )
}

function ModeBadge({
  label,
  active,
  color,
}: {
  label: string
  active: boolean
  color: string
}) {
  return (
    <span
      className={`px-1.5 py-0.5 rounded text-xs transition-colors ${
        active ? 'font-bold' : 'opacity-40'
      }`}
      style={{
        backgroundColor: active ? `var(${color})` : 'transparent',
        color: active ? '#000' : `var(${color})`,
        border: `1px solid var(${color})`,
      }}
    >
      {label}
    </span>
  )
}