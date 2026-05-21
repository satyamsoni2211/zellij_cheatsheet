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
  tabs: string[]
  error?: string
}

const PADDING = 10
const PANE_GAP = 4
const TAB_HEIGHT = 28
const HEADER_HEIGHT = 36
const MIN_PANE_WIDTH = 80
const MIN_PANE_HEIGHT = 50

export function calculateLayout(node: KDLNode, x: number, y: number, width: number, height: number): PaneRect[] {
  const panes: PaneRect[] = []

  if (node.name === 'pane') {
    panes.push({
      x: x + PADDING,
      y: y + HEADER_HEIGHT,
      width: Math.max(width - PADDING * 2, MIN_PANE_WIDTH),
      height: Math.max(height - HEADER_HEIGHT - PADDING * 2, MIN_PANE_HEIGHT),
      name: node.args[0] || node.props.name || 'pane',
      command: node.props.command,
      tabs: [],
    })
    return panes
  }

  if (node.name === 'split') {
    const isHorizontal = node.props.direction !== 'vertical'
    const children = node.children
    if (children.length === 0) return panes

    if (isHorizontal) {
      const totalWidth = width - PADDING * 2
      const portionWidth = (totalWidth - PANE_GAP * (children.length - 1)) / children.length
      let cx = x + PADDING
      for (const child of children) {
        const cp = calculateLayout(child, cx, y, portionWidth, height)
        panes.push(...cp)
        cx += portionWidth + PANE_GAP
      }
    } else {
      const totalHeight = height - HEADER_HEIGHT - PADDING
      const portionHeight = (totalHeight - PANE_GAP * (children.length - 1)) / children.length
      let cy = y + HEADER_HEIGHT
      for (const child of children) {
        const cp = calculateLayout(child, x, cy, width, portionHeight)
        panes.push(...cp)
        cy += portionHeight + PANE_GAP
      }
    }
    return panes
  }

  if (node.name === 'tab' || node.name === 'layout') {
    for (const child of node.children) {
      panes.push(...calculateLayout(child, x, y, width, height))
    }
    return panes
  }

  return panes
}

export function extractTabs(nodes: KDLNode[]): string[] {
  const tabs: string[] = []
  for (const node of nodes) {
    if (node.name === 'tab') {
      tabs.push(node.args[0] || 'Tab')
    }
  }
  return tabs
}

export function renderLayoutToSVG(children: KDLNode[], width: number = 600, height: number = 400): LayoutDiagram {
  try {
    if (children.length === 0) {
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
        tabs: [],
      }
    }

    const layoutNode = children.find(n => n.name === 'layout')
    const layoutChildren = layoutNode ? layoutNode.children : children.filter(n => n.name !== 'root')

    const tabs = extractTabs(layoutChildren)

    const panes: PaneRect[] = []
    for (const child of layoutChildren) {
      if (child.name === 'tab' || child.name === 'split' || child.name === 'pane') {
        const childPanes = calculateLayout(child, 0, 0, width, height)
        panes.push(...childPanes)
      }
    }

    if (panes.length === 0) {
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
        tabs: [],
      }
    }

    return {
      width,
      height,
      panes,
      tabs,
    }
  } catch (e) {
    console.error('Layout render error:', e)
    return {
      width,
      height,
      panes: [],
      tabs: [],
      error: e instanceof Error ? e.message : 'Unknown error',
    }
  }
}

export function generateSVG(diagram: LayoutDiagram, activeTab: string = 'Main'): string {
  const { width, height, panes, tabs, error } = diagram

  if (error) {
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="var(--surface)"/>
      <text x="50%" y="50%" text-anchor="middle" fill="var(--text-secondary)" font-family="monospace" font-size="14">
        Error: ${error}
      </text>
    </svg>`
  }

  const tabLabels = tabs.length > 0 ? tabs : [activeTab]
  const tabBarHeight = tabLabels.length > 1 ? TAB_HEIGHT * Math.min(tabLabels.length, 3) : 0

  const paneRects = panes.map(p => `
    <rect x="${p.x}" y="${p.y}" width="${p.width}" height="${p.height}" fill="var(--surface-secondary)" stroke="var(--border)" stroke-width="1" rx="4"/>
    <text x="${p.x + p.width / 2}" y="${p.y + p.height / 2}" text-anchor="middle" dominant-baseline="middle" fill="var(--text-primary)" font-family="ui-monospace, monospace" font-size="12">
      ${escapeXml(p.name)}
    </text>
    ${p.command ? `<text x="${p.x + p.width / 2}" y="${p.y + p.height / 2 + 16}" text-anchor="middle" dominant-baseline="middle" fill="var(--text-muted)" font-family="ui-monospace, monospace" font-size="10">
      ${escapeXml(p.command.length > 25 ? p.command.slice(0, 22) + '...' : p.command)}
    </text>` : ''}
  `).join('')

  const tabBars = tabLabels.map((tab, i) => `
    <rect x="${i * 100 + 10}" y="4" width="90" height="24" fill="${tab === activeTab ? 'var(--border)' : 'transparent'}" rx="4"/>
    <text x="${i * 100 + 55}" y="18" text-anchor="middle" fill="${tab === activeTab ? 'var(--text-primary)' : 'var(--text-muted)'}" font-family="ui-monospace, monospace" font-size="11">${escapeXml(tab)}</text>
  `).join('')

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="var(--surface)" rx="8"/>
    <rect x="0" y="0" width="${width}" height="${HEADER_HEIGHT}" fill="var(--surface-secondary)" rx="8"/>
    ${tabBars}
    <rect x="0" y="${HEADER_HEIGHT - 4}" width="${width}" height="4" fill="var(--surface-secondary)"/>
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