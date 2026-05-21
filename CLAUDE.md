# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zellij Cheatsheet — A developer-first interactive web reference for the Zellij terminal multiplexer. Single-page Next.js application with anchor-based navigation, four-theme theming, interactive terminal simulator, KDL layout editor, and plugin/workflow documentation.

## Commands

```bash
npm run dev      # Development server at localhost:3000
npm run build   # Static export to /out directory
npm run start   # Serve production build
npm run lint    # ESLint check
```

## Architecture

### Single-Page Structure
All content lives on `/` (the main page). Sections are composed in `app/page.tsx` and accessed via anchor links (`#essentials`, `#simulator`, `#layouts`, `#plugins`, `#workflows`). A sticky navbar provides jump links with active-section detection via `IntersectionObserver`.

### Theming System
Themes are implemented via CSS custom properties on `:root` and theme class selectors (`.terminal-dark`, `.paper-light`, `.gruvbox-warm`, `.nightowl`). `next-themes` manages `attribute="class"` on `<html>`. All theme variables are consolidated in `styles/globals.css` — edit there to modify theme values.

### Section Components
- **hero/** — `HeroSection`, `TerminalMockup` (CSS animation), `InstallSnippet`, `TmuxComparisonStrip`
- **cheatsheet/** — `EssentialsSection`, `ShortcutGrid` (React.memo), `ShortcutCard`, `ModeFilter`, `ShortcutSearch`
- **simulator/** — `ZellijSimulator` (state machine), `PaneLayout`, `StatusBar`, `TabBar`, `MissionSelector`, `MissionStepper`
- **layouts/** — `LayoutsSection`, `KDLEditor` (CodeMirror 6, lazy-loaded), `LayoutPreview`, `TemplateGallery`, `ConfigReference`
- **plugins/** — `PluginsSection`, `PluginGallery`, `HooksReference` (10 hooks), `PluginPrimer`
- **workflows/** — `WorkflowsSection`, `WorkflowCard`, `WorkflowStepper`
- **ui/** — `CommandPalette` (Cmd+K, Fuse.js), `QuickRefDrawer` (Shift+?), `Kbd`, `CopyButton`, `SectionHeader`

### Data Layer
All content is static TypeScript data in `data/`:
- `shortcuts.ts` — 48 shortcuts across 9 modes
- `workflows.ts` — 8 workflows with step sequences
- `plugins.ts` — 10 community plugins
- `layouts.ts` — 8 KDL layout templates
- `meta.ts` — Zellij version (`0.40.0`), last updated date

### State Management
- **Simulator state** — `lib/simulator-state.ts` contains a `useReducer`-based state machine for mode/panes/tabs/mission tracking
- **Search** — `lib/search.ts` builds a Fuse.js index from shortcuts, workflows, plugins, layouts, and section headings
- **Theme persistence** — `next-themes` uses `localStorage`; drawer state uses `sessionStorage`

### KDL System
- `lib/kdl-parser.ts` — Lightweight parser for layout AST (`layout`, `tab`, `pane` nodes)
- `lib/layout-renderer.ts` — Converts KDL AST to SVG diagram for live preview
- `KDLEditor.tsx` — CodeMirror 6 lazy-loaded via `next/dynamic`, KDL highlighting via `@codemirror/lang-javascript` with custom configuration

## CodeGraph MCP

This project has a CodeGraph MCP server. Use it for structural questions:

| Question | Tool |
|---|---|
| "Where is X defined?" | `codegraph_search` |
| "What calls function Y?" | `codegraph_callers` |
| "What would break if I changed Z?" | `codegraph_impact` |
| "Survey an unfamiliar module" | `codegraph_explore` |
| "What files exist under path/" | `codegraph_files` |

Do NOT re-verify codegraph results with grep — it's slower and less accurate.

## Tech Stack

- **Framework**: Next.js 16 (App Router, static export)
- **Styling**: Tailwind CSS v4 (CSS-first config via `@import 'tailwindcss'`)
- **Theming**: next-themes with CSS custom properties
- **Search**: Fuse.js with fuzzy matching
- **Editor**: CodeMirror 6 (lazy-loaded)
- **State**: React useReducer (simulator), React context (theme)

## Key Files

- `app/page.tsx` — Main page composition
- `app/layout.tsx` — Root layout with ThemeProvider and fonts
- `styles/globals.css` — Tailwind import + all CSS variables + base resets
- `data/meta.ts` — Central version info
- `lib/simulator-state.ts` — Simulator state machine
- `components/nav/Navbar.tsx` — Sticky nav with scroll detection