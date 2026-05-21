'use client'

import { useState, useCallback, lazy, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { LayoutPreview } from './LayoutPreview'
import { TemplateGallery } from './TemplateGallery'
import { ConfigReference } from './ConfigReference'
import { generateLaunchCommand } from '@/data/layouts'

// Lazy load the editor to avoid SSR issues
const KDLEditor = dynamic(
  () => import('./KDLEditor').then(mod => ({ default: mod.KDLEditor })),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center gap-2 text-[var(--text-muted)]">
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading editor...</span>
        </div>
      </div>
    ),
  }
)

const defaultKDL = `layout {
  pane size=1 {
    pane name="Main"
  }
}`

export function LayoutsSection() {
  const [currentKDL, setCurrentKDL] = useState(defaultKDL)

  const handleEditorChange = useCallback((value: string) => {
    setCurrentKDL(value)
  }, [])

  const handleLoadTemplate = useCallback((kdl: string) => {
    setCurrentKDL(kdl)
  }, [])

  const handleCopyCommand = async () => {
    const command = generateLaunchCommand('custom')
    try {
      await navigator.clipboard.writeText(command)
    } catch (e) {
      console.error('Failed to copy:', e)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([currentKDL], { type: 'text/kdl' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'layout.kdl'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
          Layout Editor
        </h2>
        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
          Design and preview your Zellij layouts with the KDL editor.
          Write layout configurations, see them visualized, and download or launch them instantly.
        </p>
      </div>

      {/* Two-panel Editor with Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
        {/* Editor Panel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wide">
              KDL Editor
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleCopyCommand}
                className="px-3 py-1.5 text-xs rounded-md border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] transition-colors"
              >
                Copy Launch Command
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 text-xs rounded-md bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90 transition-opacity"
              >
                Download .kdl
              </button>
            </div>
          </div>
          <KDLEditor
            initialValue={currentKDL}
            onChange={handleEditorChange}
          />
        </div>

        {/* Preview Panel */}
        <div className="space-y-3">
          <span className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wide">
            Visual Preview
          </span>
          <LayoutPreview kdl={currentKDL} debounceMs={300} />
        </div>
      </div>

      {/* Template Gallery */}
      <div className="mb-16">
        <TemplateGallery onLoadTemplate={handleLoadTemplate} />
      </div>

      {/* Config Reference */}
      <div className="max-w-4xl mx-auto">
        <ConfigReference />
      </div>
    </section>
  )
}