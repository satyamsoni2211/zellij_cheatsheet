import Fuse, { IFuseOptions } from 'fuse.js'
import { shortcuts, Shortcut, ShortcutMode } from '@/data/shortcuts'

export interface SearchItem {
  id: string
  type: 'shortcut' | 'workflow' | 'config' | 'plugin' | 'section'
  title: string
  description: string
  shortcut?: string
  mode?: ShortcutMode
  section?: string
  keys?: string[]
}

const sectionHeadings = [
  { id: 'essentials', label: 'Essentials', description: 'Core Zellij shortcuts' },
  { id: 'simulator', label: 'Simulator', description: 'Practice shortcuts in a simulator' },
  { id: 'layouts', label: 'Layouts', description: 'Pre-built layout configurations' },
  { id: 'plugins', label: 'Plugins', description: 'Extend Zellij with plugins' },
  { id: 'workflows', label: 'Workflows', description: 'Common Zellij workflows' },
]

const configKeys = [
  { id: 'cfg-theme', title: 'theme', description: 'Set the color theme', section: 'Config' },
  { id: 'cfg-template', title: 'template', description: 'Default layout template', section: 'Config' },
  { id: 'cfg-serial', title: 'serial', description: 'Serialization settings', section: 'Config' },
  { id: 'cfg-plugins', title: 'plugins', description: 'Plugin configuration', section: 'Config' },
]

const plugins = [
  { id: 'plugin-file-tree', title: 'File Tree', description: 'Navigate files visually', section: 'Plugins' },
  { id: 'plugin-code', title: 'Code View', description: 'Syntax-highlighted code viewing', section: 'Plugins' },
  { id: 'plugin-git', title: 'Git Status', description: 'See changes in current directory', section: 'Plugins' },
]

const workflows = [
  { id: 'wf-terminal-only', title: 'Terminal Only', description: 'Single terminal workflow', section: 'Workflows' },
  { id: 'wf-three-pane', title: 'Three Pane', description: 'Editor + two terminals layout', section: 'Workflows' },
  { id: 'wf-monitor', title: 'Monitor', description: 'Log monitoring with editor', section: 'Workflows' },
]

export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = []

  // Add shortcuts
  shortcuts.forEach((shortcut: Shortcut) => {
    items.push({
      id: shortcut.id,
      type: 'shortcut',
      title: shortcut.action,
      description: shortcut.description,
      shortcut: shortcut.keys.join(' '),
      mode: shortcut.mode,
      keys: shortcut.keys,
    })
  })

  // Add section headings
  sectionHeadings.forEach((section) => {
    items.push({
      id: `section-${section.id}`,
      type: 'section',
      title: section.label,
      description: section.description,
      section: 'Navigation',
    })
  })

  // Add config keys
  configKeys.forEach((config) => {
    items.push({
      id: config.id,
      type: 'config',
      title: config.title,
      description: config.description,
      section: config.section,
    })
  })

  // Add plugins
  plugins.forEach((plugin) => {
    items.push({
      id: plugin.id,
      type: 'plugin',
      title: plugin.title,
      description: plugin.description,
      section: plugin.section,
    })
  })

  // Add workflows
  workflows.forEach((workflow) => {
    items.push({
      id: workflow.id,
      type: 'workflow',
      title: workflow.title,
      description: workflow.description,
      section: workflow.section,
    })
  })

  return items
}

const fuseOptions: IFuseOptions<SearchItem> = {
  keys: [
    { name: 'title', weight: 0.5 },
    { name: 'description', weight: 0.3 },
    { name: 'shortcut', weight: 0.2 },
  ],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 2,
}

let fuseInstance: Fuse<SearchItem> | null = null
let searchItems: SearchItem[] | null = null

export function getFuseInstance(): Fuse<SearchItem> {
  if (!fuseInstance || !searchItems) {
    searchItems = buildSearchIndex()
    fuseInstance = new Fuse(searchItems, fuseOptions)
  }
  return fuseInstance
}

export function search(query: string, limit = 10): SearchItem[] {
  if (!query.trim()) {
    return []
  }
  const fuse = getFuseInstance()
  const results = fuse.search(query, { limit })
  return results.map((r) => r.item)
}

export function getRecentlyVisited(): SearchItem[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = sessionStorage.getItem('recentlyVisitedShortcuts')
    if (!stored) return []

    const ids: string[] = JSON.parse(stored)
    const allItems = buildSearchIndex()

    return ids
      .map((id) => allItems.find((item) => item.id === id))
      .filter((item): item is SearchItem => item !== undefined)
      .slice(0, 5)
  } catch {
    return []
  }
}

export function addToRecentlyVisited(id: string) {
  if (typeof window === 'undefined') return

  try {
    const stored = sessionStorage.getItem('recentlyVisitedShortcuts')
    let ids: string[] = stored ? JSON.parse(stored) : []

    // Remove if already exists
    ids = ids.filter((i) => i !== id)
    // Add to front
    ids.unshift(id)
    // Keep only last 10
    ids = ids.slice(0, 10)

    sessionStorage.setItem('recentlyVisitedShortcuts', JSON.stringify(ids))
  } catch {
    // Silently fail
  }
}