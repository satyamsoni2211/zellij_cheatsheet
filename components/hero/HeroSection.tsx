'use client'

import { TerminalMockup } from './TerminalMockup'
import { InstallSnippet } from './InstallSnippet'

const valueProps = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    ),
    title: 'On-screen shortcut hints',
    description: 'Every key combo shown right in the status bar. No more memorizing.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
        />
      </svg>
    ),
    title: 'KDL layouts',
    description: 'Human-readable config files instead of cryptic bash scripts.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    ),
    title: 'WASM plugins',
    description: 'Write plugins in any language that compiles to WASM. Python, Ruby, Rust.',
  },
]

export function HeroSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-4 py-16 w-full">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-center">
          {/* Left column: 55% */}
          <div className="flex-1 max-w-xl">
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl font-mono font-bold text-[var(--text-primary)] leading-tight">
              Your terminal.{' '}
              <span className="text-[var(--accent)]">Finally</span> in control.
            </h1>

            {/* Subheadline */}
            <p className="mt-4 text-lg text-[var(--text-secondary)] leading-relaxed">
              Zellij shows you what to press — you just focus on the work. A modern
              replacement for tmux with layouts, plugins, and no config overhead.
            </p>

            {/* Value props */}
            <ul className="mt-8 space-y-4">
              {valueProps.map(({ icon, title, description }) => (
                <li key={title} className="flex gap-3">
                  <span className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)]">
                    {icon}
                  </span>
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">{title}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{description}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Install block */}
            <div className="mt-8">
              <p className="text-xs text-[var(--text-secondary)] mb-2 font-mono uppercase tracking-wider">
                Quick Install
              </p>
              <InstallSnippet />
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => scrollTo('simulator')}
                className="px-5 py-2.5 rounded-lg bg-[var(--accent)] text-[var(--bg-primary)] font-medium hover:opacity-90 transition-opacity"
              >
                Try the simulator
              </button>
              <button
                onClick={() => scrollTo('essentials')}
                className="px-5 py-2.5 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors"
              >
                Jump to shortcuts
              </button>
            </div>
          </div>

          {/* Right column: 45% */}
          <div className="flex-1 w-full flex justify-center lg:justify-end">
            <TerminalMockup />
          </div>
        </div>
      </div>
    </section>
  )
}