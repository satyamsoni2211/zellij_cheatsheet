'use client'

import { useEffect, useRef, useState } from 'react'

interface KDLEditorProps {
  initialValue?: string
  onChange?: (value: string) => void
  readOnly?: boolean
}

// Simple KDL syntax highlighting for preview
const KDLSyntaxHighlighter = ({ code }: { code: string }) => {
  const highlighted = code
    .replace(/\b(layout|tab|pane|split)\b/g, '<span style="color:#c678dd;font-weight:bold">$1</span>')
    .replace(/\b(direction|size|command|cwd|name)\b/g, '<span style="color:#e5c07b">$1</span>')
    .replace(/=/g, '<span style="color:#56b6c2">=</span>')
    .replace(/"([^"]*)"/g, '<span style="color:#98c379">"$1"</span>')

  return (
    <div
      className="font-mono text-sm leading-6 whitespace-pre-wrap"
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  )
}

export function KDLEditor({ initialValue = '', onChange, readOnly = false }: KDLEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [code, setCode] = useState(initialValue)
  const [lineNumbers, setLineNumbers] = useState<string[]>([])

  useEffect(() => {
    if (textareaRef.current) {
      const lines = code.split('\n')
      setLineNumbers(lines.map((_, i) => String(i + 1)))
    }
  }, [code])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setCode(newValue)
    onChange?.(newValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const target = e.currentTarget
      const start = target.selectionStart
      const end = target.selectionEnd
      const newValue = code.substring(0, start) + '  ' + code.substring(end)
      setCode(newValue)
      onChange?.(newValue)
      // Set cursor position after the tab
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2
      }, 0)
    }
    // Auto-close brackets
    if (e.key === '{') {
      e.preventDefault()
      const target = e.currentTarget
      const start = target.selectionStart
      const end = target.selectionEnd
      const newValue = code.substring(0, start) + '{}' + code.substring(end)
      setCode(newValue)
      onChange?.(newValue)
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 1
      }, 0)
    }
  }

  return (
    <div className="relative flex h-full min-h-[300px] rounded-lg border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      {/* Line numbers */}
      <div className="flex-shrink-0 py-3 px-3 bg-[var(--surface-secondary)] border-r border-[var(--border)] text-right select-none">
        <div className="font-mono text-xs text-[var(--text-muted)] leading-6">
          {lineNumbers.map((num, i) => (
            <div key={i}>{num}</div>
          ))}
        </div>
      </div>

      {/* Editor area */}
      <div className="flex-1 relative">
        {/* Syntax highlighted overlay */}
        <div className="absolute inset-0 p-3 pointer-events-none overflow-auto">
          <KDLSyntaxHighlighter code={code} />
        </div>

        {/* Actual textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          className="absolute inset-0 w-full h-full p-3 font-mono text-sm leading-6 bg-transparent text-transparent caret-[var(--text-primary)] resize-none focus:outline-none"
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
        />
      </div>

      {/* Error gutter indicator */}
      <div className="absolute top-0 right-0 w-1 h-full bg-transparent" />
    </div>
  )
}

// Lazy-loaded version using next/dynamic
export const LazyKDLEditor = () => {
  const [showEditor, setShowEditor] = useState(false)

  return (
    <div
      className="h-64"
      onMouseEnter={() => setShowEditor(true)}
      onFocus={() => setShowEditor(true)}
    >
      {showEditor ? (
        <KDLEditor />
      ) : (
        <div className="flex items-center justify-center h-full rounded-lg border border-[var(--border)] bg-[var(--surface)]">
          <p className="text-[var(--text-muted)] text-sm">Hover to load editor...</p>
        </div>
      )}
    </div>
  )
}