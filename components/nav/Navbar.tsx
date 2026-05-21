'use client'

import { useState, useEffect, useRef } from 'react'
import { ThemeToggle } from './ThemeToggle'
import { MobileDrawer } from './MobileDrawer'
import { CommandPalette } from '@/components/ui/CommandPalette'

const ZELLIJ_VERSION = 'v0.40'

const sections = [
  { id: 'essentials', label: 'Essentials' },
  { id: 'simulator', label: 'Simulator' },
  { id: 'layouts', label: 'Layouts' },
  { id: 'plugins', label: 'Plugins' },
  { id: 'workflows', label: 'Workflows' },
]

export function Navbar() {
  const [activeSection, setActiveSection] = useState<string>('')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // IntersectionObserver for active section detection
  useEffect(() => {
    if (!mounted) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0,
      }
    )

    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observerRef.current?.observe(element)
      }
    })

    return () => {
      observerRef.current?.disconnect()
    }
  }, [mounted])

  // Scroll progress tracker
  useEffect(() => {
    if (!mounted) return

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [mounted])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(sectionId)
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50">
        {/* Main navbar */}
        <nav className="h-14 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border)]">
          <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
            {/* Left: Wordmark + Version */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="font-mono font-bold text-lg text-[var(--text-primary)] tracking-tight">
                Zellij
              </span>
              <span className="px-1.5 py-0.5 text-xs font-mono bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border)] rounded">
                {ZELLIJ_VERSION}
              </span>
            </div>

            {/* Center: Section links - desktop only */}
            <div className="hidden md:flex items-center gap-1">
              {sections.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => handleNavClick(e, id)}
                  className="relative px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
                >
                  {label}
                  {/* Active section indicator dot */}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--accent)] transition-opacity ${
                      activeSection === id ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                    }`}
                  />
                </a>
              ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Search trigger */}
              <CommandPalette />

              {/* Theme toggle */}
              <ThemeToggle />

              {/* GitHub link */}
              <a
                href="https://github.com/zellij-org/zellij"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors"
                aria-label="Zellij on GitHub"
              >
                <svg
                  className="w-4 h-4 text-[var(--text-secondary)]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                  />
                </svg>
              </a>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <svg
                  className="w-4 h-4 text-[var(--text-secondary)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Scroll progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--border)]">
            <div
              className="h-full bg-[var(--accent)] transition-all duration-100 ease-out"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        sections={sections}
        activeSection={activeSection}
        onNavigate={handleNavClick}
      />
    </>
  )
}