'use client'

import { ThemeToggle } from './ThemeToggle'

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
  sections: { id: string; label: string }[]
  activeSection: string
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => void
}

export function MobileDrawer({
  isOpen,
  onClose,
  sections,
  activeSection,
  onNavigate,
}: MobileDrawerProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-72 bg-[var(--bg-primary)] border-l border-[var(--border)] shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 h-14 border-b border-[var(--border)]">
            <span className="font-mono font-bold text-[var(--text-primary)]">Menu</span>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
              aria-label="Close menu"
            >
              <svg
                className="w-5 h-5 text-[var(--text-secondary)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Search bar */}
          <div className="px-4 py-3 border-b border-[var(--border)]">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search shortcuts..."
                className="w-full pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {sections.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => onNavigate(e, id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  activeSection === id
                    ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    activeSection === id ? 'bg-[var(--accent)]' : 'bg-transparent'
                  }`}
                />
                {label}
              </a>
            ))}
          </nav>

          {/* Theme toggle at bottom */}
          <div className="px-4 py-4 border-t border-[var(--border)]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}