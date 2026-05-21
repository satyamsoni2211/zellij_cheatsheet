'use client'

import { useEffect, useState, useMemo } from 'react'
import { parseKDL, KDLNode } from '@/lib/kdl-parser'
import { renderLayoutToSVG, LayoutDiagram, generateSVG } from '@/lib/layout-renderer'

interface LayoutPreviewProps {
  kdl: string
  debounceMs?: number
}

export function LayoutPreview({ kdl, debounceMs = 300 }: LayoutPreviewProps) {
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        setIsUpdating(true)
        const result = parseKDL(kdl)

        if (result.errors.length > 0) {
          setError(result.errors[0].message)
          setSvg(generateErrorSVG(result.errors[0].message))
          return
        }

        setError(null)

        // Extract layout children from parse result
        // result.nodes[0] is the synthetic 'root' node whose children hold the actual layout content
        const rootNode = result.nodes[0]
        const layoutChildren: KDLNode[] = rootNode?.children || []
        const layoutNode = layoutChildren.find(n => n.name === 'layout')
        const children: KDLNode[] = layoutNode ? layoutNode.children : layoutChildren

        const diagram = renderLayoutToSVG(children, 500, 300)
        const newSvg = generateSVG(diagram, 'Preview')

        setSvg(newSvg)
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Parse error'
        setError(message)
        setSvg(generateErrorSVG(message))
      } finally {
        setTimeout(() => setIsUpdating(false), 100)
      }
    }, debounceMs)

    return () => clearTimeout(timeoutId)
  }, [kdl, debounceMs])

  return (
    <div className="relative rounded-lg border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--surface-secondary)] border-b border-[var(--border)]">
        <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
          Layout Preview
        </span>
        {isUpdating && (
          <span className="text-xs text-[var(--text-muted)]">Updating...</span>
        )}
      </div>

      {/* SVG Display */}
      <div
        className="p-4 min-h-[200px] flex items-center justify-center"
        dangerouslySetInnerHTML={{ __html: svg }}
      />

      {/* Error indicator */}
      {error && (
        <div className="absolute top-10 left-0 right-0 mx-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-xs text-red-400 font-mono">{error}</p>
        </div>
      )}
    </div>
  )
}

function generateErrorSVG(message: string): string {
  return `<svg width="500" height="300" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#2d2d44" rx="8"/>
    <text x="50%" y="45%" text-anchor="middle" fill="#ff6b6b" font-family="monospace" font-size="12">
      Parse Error
    </text>
    <text x="50%" y="60%" text-anchor="middle" fill="#888" font-family="monospace" font-size="10">
      ${escapeHtml(message)}
    </text>
  </svg>`
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}