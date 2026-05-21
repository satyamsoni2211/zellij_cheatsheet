'use client'

import { useState, useEffect } from 'react'

type OS = 'macos' | 'linux' | 'generic'

const installCommands: Record<OS, string> = {
  macos: 'brew install zellij',
  linux: 'cargo install --locked zellij',
  generic: 'bash <(curl -L https://zellij.dev/launch)',
}

const osLabels: Record<OS, string> = {
  macos: 'macOS',
  linux: 'Linux',
  generic: 'Other',
}

function detectOS(): OS {
  if (typeof navigator === 'undefined') return 'generic'
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('mac') || ua.includes('darwin')) return 'macos'
  if (ua.includes('linux')) return 'linux'
  return 'generic'
}

export function InstallSnippet() {
  const [os, setOs] = useState<OS>('generic')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setOs(detectOS())
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(installCommands[os])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: select text
    }
  }

  return (
    <div className="space-y-2">
      {/* OS toggles */}
      <div className="flex gap-1">
        {(Object.keys(osLabels) as OS[]).map((key) => (
          <button
            key={key}
            onClick={() => setOs(key)}
            className={`px-2.5 py-1 text-xs rounded border transition-colors ${
              os === key
                ? 'bg-[var(--accent)] text-[var(--bg-primary)] border-[var(--accent)] font-medium'
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--border-strong)]'
            }`}
          >
            {osLabels[key]}
          </button>
        ))}
      </div>

      {/* Snippet with copy button */}
      <div className="relative group">
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[var(--bg-terminal)] border border-[var(--border)] font-mono text-sm">
          <span className="text-[var(--text-secondary)]">$</span>
          <span className="text-[var(--text-primary)] flex-1">{installCommands[os]}</span>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Copy install command"
        >
          {copied ? (
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}