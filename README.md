# Zellij Cheatsheet

An interactive web reference for the [Zellij](https://zellij.dev) terminal multiplexer. Find shortcuts, modes, layouts, and workflows — or practice in the built-in terminal simulator.

## Features

- **48 shortcuts** across 9 modes (Normal, Pane, Tab, Scroll, Session, Resize, Search, Locked, CLI)
- **Interactive terminal simulator** with guided missions to learn Zellij without installing it
- **Live KDL layout editor** with real-time visual preview
- **8 workflow guides** with step-through instructions
- **10 community plugins** with installation snippets
- **4 themes**: Terminal Dark, Paper Light, Gruvbox Warm, Night Owl Blue
- **Print-optimized** layout for PDF reference
- **Keyboard-first navigation** with ⌘K command palette

## Quick Start

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the cheatsheet.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Main cheatsheet page
│   ├── print/page.tsx     # Print-optimized layout
│   └── layout.tsx         # Root layout with ThemeProvider
├── components/            # React components by section
│   ├── nav/              # Navbar, ThemeToggle
│   ├── hero/              # Hero, TerminalMockup, InstallSnippet
│   ├── cheatsheet/        # EssentialsSection, ShortcutCard, ModeFilter
│   ├── simulator/         # ZellijSimulator, PaneLayout, MissionStepper
│   ├── layouts/           # KDLEditor, LayoutPreview, TemplateGallery
│   ├── plugins/           # PluginGallery, HooksReference, PluginPrimer
│   ├── workflows/         # WorkflowCard, WorkflowStepper
│   └── ui/                # CommandPalette, QuickRefDrawer, Kbd
├── data/                   # Static content
│   ├── shortcuts.ts       # 48 shortcut definitions
│   ├── workflows.ts       # 8 workflow guides
│   ├── plugins.ts         # 10 community plugins
│   ├── layouts.ts         # 8 KDL layout templates
│   └── meta.ts           # Version info
├── lib/                    # Utilities
│   ├── simulator-state.ts # Simulator state machine
│   ├── kdl-parser.ts     # KDL layout parser
│   ├── layout-renderer.ts # KDL to SVG renderer
│   └── search.ts         # Fuse.js search index
└── styles/                 # Stylesheets
    ├── globals.css        # Tailwind + CSS variables
    └── themes/            # Theme-specific variables
```

## Deployment

The project exports as static HTML, deployable to any CDN:

```bash
npm run build  # Output in /out
```

### Vercel

1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to `main`

### GitHub Pages

1. Enable GitHub Pages in repository settings
2. Add a `.github/workflows/deploy.yml` workflow
3. The static export builds to `/out`

## Development

```bash
# Lint
npm run lint

# TypeScript check
npx tsc --noEmit
```

## Tech Stack

- **Framework**: Next.js 16 (App Router, static export)
- **Styling**: Tailwind CSS v4
- **Theming**: next-themes with CSS custom properties
- **Search**: Fuse.js
- **Editor**: CodeMirror 6 (lazy-loaded)
- **State**: React useReducer

## License

MIT

---

*Not affiliated with the official Zellij project.*