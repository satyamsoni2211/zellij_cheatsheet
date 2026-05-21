import { KDLNode } from './kdl-parser'

export interface PaneRect {
  x: number
  y: number
  width: number
  height: number
  name: string
  command?: string
  tabs: string[]
}

export interface LayoutDiagram {
  width: number
  height: number
  panes: PaneRect[]
  error?: string
}

const PADDING = 10
const PANE_GAP = 4
const TAB_HEIGHT = 24
const HEADER_HEIGHT = 32
const MIN_PANE_WIDTH = 80
const MIN_PANE_HEIGHT = 40

export function calculateLayout(children: KDLNode[], x: number, y: number, width: number, height: number): PaneRect[] {
  const panes: PaneRect[] = []

  const splitHorizontally = children.filter(c => c.name === 'split' && c.props.direction === 'horizontal')
  const splitVertically = children.filter(c => c.name === 'split' && c.props.direction === 'vertical')
  const panes_direct = children.filter(c => c.name === 'pane')

  const splits = [...splitHorizontally, ...splitVertically]

  if (splits.length === 0 && panes_direct.length === 0) {
    // Leaf node - no children, will be handled at a higher level
    return []
  }

  if (splits.length === 0 && panes_direct.length > 0) {
    // Direct panes at this level
    const paneWidth = (width - PADDING * 2 - PANE_GAP * (panes_direct.length - 1)) / panes_direct.length
    let currentX = x + PADDING

    for (const pane of panes_direct) {
      const paneName = pane.args[0] || pane.props.name || 'pane'
      const paneCommand = pane.props.command

      panes.push({
        x: currentX,
        y: y + HEADER_HEIGHT,
        width: Math.max(paneWidth, MIN_PANE_WIDTH),
        height: Math.max(height - HEADER_HEIGHT - PADDING, MIN_PANE_HEIGHT),
        name: paneName,
        command: paneCommand,
        tabs: [],
      })
      currentX += paneWidth + PANE_GAP
    }
    return panes
  }

  // For splits, distribute space among children
  if (splits.length === 1) {
    const split = splits[0]
    const isHorizontal = split.props.direction === 'horizontal'

    const childPanes: PaneRect[] = []
    for (const child of split.children) {
      if (child.name === 'pane') {
        const paneName = child.args[0] || child.props.name || 'pane'
        const paneCommand = child.props.command
        childPanes.push({
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          name: paneName,
          command: paneCommand,
          tabs: [],
        })
      } else {
        const subPanes = calculateLayout([child], 0, 0, 100, 100)
        childPanes.push(...subPanes)
      }
    }

    if (isHorizontal) {
      const totalWidth = width - PADDING * 2
      const portionWidth = (totalWidth - PANE_GAP * (childPanes.length - 1)) / childPanes.length
      let currentX = x + PADDING
      for (const childPane of childPanes) {
        panes.push({
          ...childPane,
          x: currentX,
          y: y + HEADER_HEIGHT,
          width: portionWidth,
          height: height - HEADER_HEIGHT - PADDING,
        })
        currentX += portionWidth + PANE_GAP
      }
    } else {
      const totalHeight = height - HEADER_HEIGHT - PADDING
      const portionHeight = (totalHeight - PANE_GAP * (childPanes.length - 1)) / childPanes.length
      let currentY = y + HEADER_HEIGHT
      for (const childPane of childPanes) {
        panes.push({
          ...childPane,
          x: x + PADDING,
          y: currentY,
          width: width - PADDING * 2,
          height: portionHeight,
        })
        currentY += portionHeight + PANE_GAP
      }
    }
    return panes
  }

  // Multiple splits - recursively handle each
  for (const split of splits) {
    const subPanes = calculateLayout([split], x, y, width, height)
    panes.push(...subPanes)
  }

  return panes
}

export function renderLayoutToSVG(children: KDLNode[], width: number = 600, height: number = 400): LayoutDiagram {
  try {
    const panes = calculateLayout(children, 0, 0, width, height)

    if (panes.length === 0) {
      // No layout found, show empty state
      return {
        width,
        height,
        panes: [{
          x: PADDING,
          y: HEADER_HEIGHT,
          width: width - PADDING * 2,
          height: height - HEADER_HEIGHT - PADDING,
          name: 'Empty Layout',
          tabs: [],
        }],
      }
    }

    return {
      width,
      height,
      panes,
    }
  } catch (e) {
    return {
      width,
      height,
      panes: [],
      error: e instanceof Error ? e.message : 'Unknown error',
    }
  }
}

export function generateSVG(diagram: LayoutDiagram, activeTab: string = 'Main'): string {
  const { width, height, panes, error } = diagram

  if (error) {
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#1a1a2e" rx="8"/>
      <text x="50%" y="50%" text-anchor="middle" fill="#ff6b6b" font-family="monospace" font-size="14">
        Error: ${error}
      </text>
    </svg>`
  }

  const paneRects = panes.map(p => `
    <rect x="${p.x}" y="${p.y}" width="${p.width}" height="${p.height}" fill="#2d2d44" stroke="#4a4a6a" stroke-width="1" rx="4"/>
    <text x="${p.x + p.width / 2}" y="${p.y + p.height / 2}" text-anchor="middle" dominant-baseline="middle" fill="#e0e0e0" font-family="monospace" font-size="11">
      ${escapeXml(p.name)}
    </text>
    ${p.command ? `<text x="${p.x + p.width / 2}" y="${p.y + p.height / 2 + 14}" text-anchor="middle" dominant-baseline="middle" fill="#888" font-family="monospace" font-size="9">
      ${escapeXml(p.command.length > 30 ? p.command.slice(0, 27) + '...' : p.command)}
    </text>` : ''}
  `).join('')

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#1a1a2e" rx="8"/>
    <rect x="0" y="0" width="${width}" height="${HEADER_HEIGHT}" fill="#16162a" rx="8"/>
    <text x="12" y="20" fill="#888" font-family="monospace" font-size="12">${escapeXml(activeTab)}</text>
    ${paneRects}
  </svg>`
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}