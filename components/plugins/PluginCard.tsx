'use client'

import { CopyButton } from '@/components/ui/CopyButton'
import type { Plugin } from '@/data/plugins'

interface PluginCardProps {
  plugin: Plugin
}

const languageColors: Record<string, string> = {
  Rust: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  Go: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  TypeScript: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  Python: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  AssemblyScript: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
}

const categoryColors: Record<string, string> = {
  'Status bar': 'bg-teal-500/10 text-teal-400 border-teal-500/30',
  'File management': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  'Session tools': 'bg-violet-500/10 text-violet-400 border-violet-500/30',
  'Git integration': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  Productivity: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
  'Fun/experimental': 'bg-rose-500/10 text-rose-400 border-rose-500/30',
}

export function PluginCard({ plugin }: PluginCardProps) {

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-5 hover:border-[var(--border-strong)] transition-all duration-200">
      {/* Header: Name + Author */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-[var(--text-primary)] mb-1">
            {plugin.name}
          </h3>
          <a
            href={plugin.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.3-5.466-1.332-5.466-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.267 1.979-.399 3.003-.399 1.02 0 2.047.132 3.003.399 2.293 1.552 3.301 1.23 3.301 1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            @{plugin.author}
          </a>
        </div>
        {/* GitHub stars */}
        <div className="flex items-center gap-1 text-[var(--text-secondary)]">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span className="text-sm font-mono">{plugin.stars.toLocaleString()}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
        {plugin.description}
      </p>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${categoryColors[plugin.category] || 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}>
          {plugin.category}
        </span>
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${languageColors[plugin.language] || 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}>
          {plugin.language}
        </span>
      </div>

      {/* Install Snippet */}
      <div className="flex items-center gap-2 p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)]">
        <code className="flex-1 text-xs font-mono text-[var(--text-secondary)] overflow-hidden text-ellipsis whitespace-nowrap">
          {plugin.installSnippet}
        </code>
        <CopyButton text={plugin.installSnippet} size="sm" />
      </div>

    </div>
  )
}