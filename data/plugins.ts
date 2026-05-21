export type PluginCategory =
  | 'Status bar'
  | 'File management'
  | 'Session tools'
  | 'Git integration'
  | 'Productivity'
  | 'Fun/experimental'

export type PluginLanguage = 'Rust' | 'Go' | 'TypeScript' | 'Python' | 'AssemblyScript'

export interface Plugin {
  id: string
  name: string
  author: string
  githubUrl: string
  description: string
  category: PluginCategory
  language: PluginLanguage
  stars: number
  installSnippet: string
}

export const plugins: Plugin[] = [
  {
    id: 'zjstatus',
    name: 'zjstatus',
    author: 'dj95',
    githubUrl: 'https://github.com/dj95/zjstatus',
    description: 'A configurable, themeable statusbar plugin with Cava audio visualization support',
    category: 'Status bar',
    language: 'Rust',
    stars: 950,
    installSnippet: 'zellij plugin run https://github.com/dj95/zjstatus',
  },
  {
    id: 'zellij-datetime',
    name: 'zellij-datetime',
    author: 'h1romas4',
    githubUrl: 'https://github.com/h1romas4/zellij-datetime',
    description: 'Adds a date and time pane to your Zellij status bar',
    category: 'Status bar',
    language: 'Rust',
    stars: 49,
    installSnippet: 'zellij plugin run https://github.com/h1romas4/zellij-datetime',
  },
  {
    id: 'zellaude',
    name: 'zellaude',
    author: 'ishefi',
    githubUrl: 'https://github.com/ishefi/zellaude',
    description: 'Shows Claude Code activity indicators on tabs in Zellij',
    category: 'Status bar',
    language: 'Rust',
    stars: 47,
    installSnippet: 'zellij plugin run https://github.com/ishefi/zellaude',
  },
  {
    id: 'room',
    name: 'room',
    author: 'rvcas',
    githubUrl: 'https://github.com/rvcas/room',
    description: 'A Zellij plugin for quickly searching and switching tabs',
    category: 'Session tools',
    language: 'Rust',
    stars: 267,
    installSnippet: 'zellij plugin run https://github.com/rvcas/room',
  },
  {
    id: 'zellij-sessionizer',
    name: 'zellij-sessionizer',
    author: 'laperlej',
    githubUrl: 'https://github.com/laperlej/zellij-sessionizer',
    description: 'Create sessions based on folder names for quick project switching',
    category: 'Session tools',
    language: 'Rust',
    stars: 81,
    installSnippet: 'zellij plugin run https://github.com/laperlej/zellij-sessionizer',
  },
  {
    id: 'zellij-autolock',
    name: 'zellij-autolock',
    author: 'fresh2dev',
    githubUrl: 'https://github.com/fresh2dev/zellij-autolock',
    description: 'Automatically lock Zellij depending on pane command',
    category: 'Session tools',
    language: 'Rust',
    stars: 144,
    installSnippet: 'zellij plugin run https://github.com/fresh2dev/zellij-autolock',
  },
  {
    id: 'monocole',
    name: 'monocle',
    author: 'imsnif',
    githubUrl: 'https://github.com/imsnif/monocle',
    description: 'Fuzzy find of file names and contents across your Zellij workspace',
    category: 'File management',
    language: 'Rust',
    stars: 188,
    installSnippet: 'zellij plugin run https://github.com/imsnif/monocle',
  },
  {
    id: 'zellij-pane-picker',
    name: 'zellij-pane-picker',
    author: 'shihanng',
    githubUrl: 'https://github.com/shihanng/zellij-pane-picker',
    description: 'Quickly switch, star, and jump to panes in Zellij',
    category: 'File management',
    language: 'Rust',
    stars: 26,
    installSnippet: 'zellij plugin run https://github.com/shihanng/zellij-pane-picker',
  },
  {
    id: 'harpoon',
    name: 'harpoon',
    author: 'Nacho114',
    githubUrl: 'https://github.com/Nacho114/harpoon',
    description: 'Quickly navigate panes with marks (Neovim harpoon clone for Zellij)',
    category: 'Productivity',
    language: 'Rust',
    stars: 193,
    installSnippet: 'zellij plugin run https://github.com/Nacho114/harpoon',
  },
  {
    id: 'zellij-forgot',
    name: 'zellij-forgot',
    author: 'karimould',
    githubUrl: 'https://github.com/karimould/zellij-forgot',
    description: 'Swiftly present and access your custom keybinds configuration',
    category: 'Productivity',
    language: 'Rust',
    stars: 230,
    installSnippet: 'zellij plugin run https://github.com/karimould/zellij-forgot',
  },
  {
    id: 'zellij-bookmarks',
    name: 'zellij-bookmarks',
    author: 'yaroslavborbat',
    githubUrl: 'https://github.com/yaroslavborbat/zellij-bookmarks',
    description: 'Manage command bookmarks and insert them into terminal panes',
    category: 'Productivity',
    language: 'Rust',
    stars: 40,
    installSnippet: 'zellij plugin run https://github.com/yaroslavborbat/zellij-bookmarks',
  },
  {
    id: 'ghost',
    name: 'ghost',
    author: 'vdbulcke',
    githubUrl: 'https://github.com/vdbulcke/ghost',
    description: 'Spawn a floating command terminal pane in Zellij',
    category: 'Productivity',
    language: 'Rust',
    stars: 62,
    installSnippet: 'zellij plugin run https://github.com/vdbulcke/ghost',
  },
]

export const pluginCategories: PluginCategory[] = [
  'Status bar',
  'File management',
  'Session tools',
  'Git integration',
  'Productivity',
  'Fun/experimental',
]