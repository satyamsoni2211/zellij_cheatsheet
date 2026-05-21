'use client'

import { LayoutTemplate, generateLaunchCommand, generateDownloadFile } from '@/data/layouts'

interface TemplateCardProps {
  template: LayoutTemplate
  onLoad: (kdl: string) => void
}

export function TemplateCard({ template, onLoad }: TemplateCardProps) {
  const handleCopy = async () => {
    const command = generateLaunchCommand(template.name.toLowerCase().replace(/ /g, '-'))
    try {
      await navigator.clipboard.writeText(command)
    } catch (e) {
      console.error('Failed to copy:', e)
    }
  }

  const handleDownload = () => {
    const blob = generateDownloadFile(template)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${template.id}.kdl`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="group relative flex flex-col rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 transition-all hover:border-[var(--text-muted)] hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-[var(--text-primary)]">{template.name}</h3>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md hover:bg-[var(--surface-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            title="Copy launch command"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-md hover:bg-[var(--surface-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            title="Download .kdl file"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-[var(--text-secondary)] mb-3 flex-1">{template.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {template.tags.map(tag => (
          <span
            key={tag}
            className="px-2 py-0.5 text-xs rounded-full bg-[var(--surface-secondary)] text-[var(--text-muted)]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* KDL Preview */}
      <div className="mb-3 p-2 rounded bg-[var(--surface-secondary)] border border-[var(--border)]">
        <pre className="text-xs font-mono text-[var(--text-muted)] overflow-x-auto whitespace-pre">
          {template.kdl.split('\n').slice(0, 4).join('\n')}
          {template.kdl.split('\n').length > 4 && '\n...'}
        </pre>
      </div>

      {/* Load button */}
      <button
        onClick={() => onLoad(template.kdl)}
        className="w-full mt-auto px-4 py-2 rounded-md bg-[var(--text-primary)] text-[var(--bg-primary)] font-medium text-sm hover:opacity-90 transition-opacity"
      >
        Load in Editor
      </button>
    </div>
  )
}