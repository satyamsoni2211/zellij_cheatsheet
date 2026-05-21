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
    id: 'zellij-statusbar',
    name: 'zellij-statusbar',
    author: 'NightBorn',
    githubUrl: 'https://github.com/NightBorn/zellij-statusbar',
    description: 'Configurable status bar with system info, CPU, memory, and network metrics',
    category: 'Status bar',
    language: 'Rust',
    stars: 342,
    installSnippet: 'zellij plugin run https://github.com/NightBorn/zellij-statusbar',
  },
  {
    id: 'zjstatus',
    name: 'zjstatus',
    author: 'Dirb\'ed',
    githubUrl: 'https://github.com/dircored/zjstatus',
    description: 'Highly customizable status bar plugin with Cava audio visualization support',
    category: 'Status bar',
    language: 'Rust',
    stars: 518,
    installSnippet: 'zellij plugin run https://github.com/dircored/zjstatus',
  },
  {
    id: 'zellij-tab-name-reloader',
    name: 'zellij-tab-name-reloader',
    author: '_forhacker',
    githubUrl: 'https://github.com/_forhacker/zellij-tab-name-reloader',
    description: 'Auto-names tabs based on the running process or current directory',
    category: 'Productivity',
    language: 'Rust',
    stars: 89,
    installSnippet: 'zellij plugin run https://github.com/_forhacker/zellij-tab-name-reloader',
  },
  {
    id: 'room',
    name: 'room',
    author: 'zellij-org',
    githubUrl: 'https://github.com/zellij-org/room',
    description: 'Multiplayer session coordinator for collaborative terminal sessions',
    category: 'Session tools',
    language: 'Rust',
    stars: 1204,
    installSnippet: 'zellij plugin run https://github.com/zellij-org/room',
  },
  {
    id: 'zellij-forgot',
    name: 'zellij-forgot',
    author: 'NightBorn',
    githubUrl: 'https://github.com/NightBorn/zellij-forgot',
    description: 'Remembers and restores your custom keybind configurations across sessions',
    category: 'Productivity',
    language: 'Rust',
    stars: 156,
    installSnippet: 'zellij plugin run https://github.com/NightBorn/zellij-forgot',
  },
  {
    id: 'lazygit-zellij',
    name: 'lazygit-zellij',
    author: 'lahwaacz',
    githubUrl: 'https://github.com/lahwaacz/lazygit-zellij',
    description: 'Floating lazygit pane with git status, staging, and commit workflow',
    category: 'Git integration',
    language: 'TypeScript',
    stars: 267,
    installSnippet: 'zellij plugin run https://github.com/lahwaacz/lazygit-zellij',
  },
  {
    id: 'monocle',
    name: 'monocle',
    author: 'hultan88',
    githubUrl: 'https://github.com/hultan88/monocle',
    description: 'Fuzzy file finder panel for quick navigation across your project',
    category: 'File management',
    language: 'Rust',
    stars: 445,
    installSnippet: 'zellij plugin run https://github.com/hultan88/monocle',
  },
  {
    id: 'harpoon',
    name: 'harpoon',
    author: 'samirmen',
    githubUrl: 'https://github.com/samirmen/harpoon',
    description: 'Jump-list for panes and tabs with quick navigation marks',
    category: 'Productivity',
    language: 'Rust',
    stars: 198,
    installSnippet: 'zellij plugin run https://github.com/samirmen/harpoon',
  },
  {
    id: 'zellij-floats',
    name: 'zellij-floats',
    author: 'koziev',
    githubUrl: 'https://github.com/koziev/zellij-floats',
    description: 'Manage floating panes with tilable layout and focus tracking',
    category: 'Session tools',
    language: 'Rust',
    stars: 312,
    installSnippet: 'zellij plugin run https://github.com/koziev/zellij-floats',
  },
  {
    id: 'zellij-neorg',
    name: 'zellij-neorg',
    author: 'nvzone',
    githubUrl: 'https://github.com/nvzone/zellij-neorg',
    description: 'Neorg integration for project management and note-taking in Zellij',
    category: 'Productivity',
    language: 'TypeScript',
    stars: 87,
    installSnippet: 'zellij plugin run https://github.com/nvzone/zellij-neorg',
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