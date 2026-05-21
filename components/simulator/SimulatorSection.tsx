'use client'

import { ZellijSimulator } from './ZellijSimulator'

export function SimulatorSection() {
  return (
    <section id="simulator" className="py-16 px-4 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            Interactive Simulator
          </h2>
          <p className="text-[var(--text-secondary)]">
            A browser-based Zellij environment. No installation needed. Press real shortcuts and see what happens.
          </p>
        </div>

        {/* Simulator */}
        <div className="bg-[var(--bg-primary)] rounded-2xl p-4 lg:p-6 border border-[var(--border)]">
          <ZellijSimulator />
        </div>

        {/* Help text */}
        <div className="mt-4 text-center text-sm text-[var(--text-secondary)]">
          <p>
            <kbd className="px-2 py-1 rounded bg-[var(--kbd-bg)] border border-[var(--kbd-border)] text-[var(--kbd-text)] text-xs font-mono">Esc</kbd>
            {' '}to return to Normal mode at any time
          </p>
        </div>
      </div>
    </section>
  )
}