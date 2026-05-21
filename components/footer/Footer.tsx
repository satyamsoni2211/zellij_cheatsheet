'use client'

import { ThemeToggle } from '@/components/nav/ThemeToggle'

const ZELLIJ_VERSION = 'v0.40'
const LAST_UPDATED = 'May 2026'

const quickLinks = [
  { id: 'essentials', label: 'Essentials' },
  { id: 'simulator', label: 'Simulator' },
  { id: 'layouts', label: 'Layouts' },
  { id: 'plugins', label: 'Plugins' },
  { id: 'workflows', label: 'Workflows' },
]

const externalLinks = [
  { href: 'https://zellij.dev/documentation/', label: 'Official Zellij docs' },
  { href: 'https://github.com/zellij-org/zellij', label: 'Zellij GitHub' },
  { href: 'https://discord.gg/zellij', label: 'Zellij Discord' },
]

export function Footer() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border)]">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Left column: Branding */}
          <div className="space-y-4">
            <h3 className="font-mono font-bold text-xl text-[var(--text-primary)] tracking-tight">
              Zellij Cheatsheet
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Covers Zellij {ZELLIJ_VERSION} — last updated {LAST_UPDATED}
            </p>
            <p className="text-xs text-[var(--text-secondary)] opacity-70">
              Not affiliated with official Zellij project
            </p>
          </div>

          {/* Center column: Quick links */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm text-[var(--text-primary)] mb-3">
                Navigation
              </h4>
              <ul className="space-y-2">
                {quickLinks.map(({ id, label }) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      onClick={(e) => handleNavClick(e, id)}
                      className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4">
              <h4 className="font-semibold text-sm text-[var(--text-primary)] mb-3">
                External Links
              </h4>
              <ul className="space-y-2">
                {externalLinks.map(({ href, label }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {label}
                      <svg
                        className="inline-block w-3 h-3 ml-1 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right column: Contribute + Theme */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm text-[var(--text-primary)] mb-3">
                Contribute
              </h4>
              <p className="text-sm text-[var(--text-secondary)] mb-3">
                Found an error or missing shortcut?
              </p>
              <a
                href="https://github.com/zellij-org/zellij/pulls"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border)] rounded-lg hover:border-[var(--border-strong)] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                  />
                </svg>
                Open a PR
              </a>
            </div>
            <div className="pt-4">
              <h4 className="font-semibold text-sm text-[var(--text-primary)] mb-3">
                Theme
              </h4>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom copyright bar */}
      <div className="border-t border-[var(--border)] bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="text-center text-sm text-[var(--text-secondary)]">
            Made by developers, for developers.
          </p>
        </div>
      </div>
    </footer>
  )
}