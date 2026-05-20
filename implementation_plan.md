# Zellij Cheatsheet — Implementation Plan

> A developer-first interactive cheatsheet positioning Zellij as the productive, modern alternative to tmux. Built with Next.js, supporting four themes, interactive simulations, and progressive depth from quick reference to advanced workflows.

---

## Table of Contents

1. [Product Vision & Goals](#1-product-vision--goals)
2. [Site Architecture Overview](#2-site-architecture-overview)
3. [Page Sections — Detailed Breakdown](#3-page-sections--detailed-breakdown)
   - 3.1 Navigation & Header
   - 3.2 Hero Section
   - 3.3 Essentials Cheatsheet
   - 3.4 Interactive Terminal Simulator
   - 3.5 Layouts & KDL Configuration
   - 3.6 Plugins & Hooks
   - 3.7 Advanced Workflows
   - 3.8 Quick Reference Drawer
   - 3.9 Footer
4. [Component Design Specifications](#4-component-design-specifications)
5. [Content Strategy & Focus Areas](#5-content-strategy--focus-areas)
6. [Theming System](#6-theming-system)
7. [Interactivity & UX Flows](#7-interactivity--ux-flows)
8. [Data Architecture](#8-data-architecture)
9. [Next.js Project Structure](#9-nextjs-project-structure)
10. [Page & Routing Decisions](#10-page--routing-decisions)
11. [Accessibility & Performance](#11-accessibility--performance)
12. [Phased Build Plan](#12-phased-build-plan)

---

## 1. Product Vision & Goals

### What This Is

A single, self-contained web reference that serves as both an instant-lookup cheatsheet and an interactive learning environment for Zellij — the Rust-based terminal multiplexer. It is not a documentation site. It is not a blog. It is a tool developers open in a second browser tab while working in their terminal.

### Primary Audience

| Audience | What They Need |
|---|---|
| Developers migrating from tmux | Side-by-side comparison, familiar concepts remapped, muscle-memory rebuilder |
| Zellij beginners | Guided flows, mode explainer, missions to build confidence |
| Power users (daily Zellij users) | Fast lookup, KDL recipes, advanced workflow patterns |
| DevOps / SRE | Session management patterns, SSH workflows, CI/CD startup layouts |

### Core Experience Goals

- **Zero friction lookup.** Any shortcut must be findable in under 5 seconds — via search, section jump, or ⌘K.
- **Learn by doing.** The interactive simulator lets users try Zellij flows without opening a terminal.
- **Progressive depth.** Beginners read cards. Intermediate users follow steppers. Advanced users explore the KDL editor and hooks reference.
- **Feel native to developers.** The site looks like it was built by someone who lives in the terminal — not a marketing page.
- **Positioning clarity.** Every section reinforces why Zellij is a better choice than tmux for modern workflows.

### What Makes This Different From Existing Resources

Most Zellij references are either the official docs (comprehensive but dense) or one-page shortcut tables (shallow). This site sits between them: scannable like a cheatsheet, interactive like a tutorial, with enough depth for advanced use. The KDL live editor and terminal simulator are unique to this site.

---

## 2. Site Architecture Overview

### Single-Page Application with Anchor Navigation

The entire site is a single Next.js page (`app/page.tsx`) using anchor-based scroll navigation. This design decision is intentional:

- Enables ⌘K search across all content from anywhere
- No page transitions that interrupt reference lookup flow
- Can be printed to a compact two-column PDF (via a print stylesheet)
- Works offline once loaded (no API dependencies)

Sections are stacked vertically in reading order. The sticky nav provides jump links to each section. A floating quick-reference drawer is available globally.

### Section Flow (Top to Bottom)

```
[Navigation Bar]          → Always visible, anchors + search + theme toggle
[Hero]                    → Hook, install, tmux comparison
[Essentials Cheatsheet]   → All shortcuts, filterable by mode
[Terminal Simulator]      → Interactive Zellij UI with guided missions
[Layouts & KDL]           → Live editor + visual preview + templates
[Plugins & Hooks]         → Plugin gallery + event hook reference
[Advanced Workflows]      → Step-through cards for complex patterns
[Footer]                  → Links, version note, contributing
[Quick Reference Drawer]  → Floating global shortcut reference (always accessible)
```

### Pages & Routes

| Route | Purpose |
|---|---|
| `/` | Main cheatsheet page (all sections) |
| `/print` | Print-optimized layout — compact two-column shortcut grid, no interactive elements |
| `/#essentials` | Anchor: cheatsheet section |
| `/#simulator` | Anchor: terminal simulator |
| `/#layouts` | Anchor: layouts & KDL section |
| `/#plugins` | Anchor: plugins section |
| `/#workflows` | Anchor: advanced workflows |

There are no other pages. All content lives on `/`. The `/print` route renders a stripped version for saving as PDF.

---

## 3. Page Sections — Detailed Breakdown

---

### 3.1 Navigation & Header

#### Purpose
Persistent orientation anchor. Keeps users moving between sections quickly. Hosts the global search and theme switcher.

#### Layout & Appearance
The nav is a full-width sticky bar, approximately 56px tall, sitting at the top of the viewport at all times. It has a subtle backdrop blur so the content below is readable through it.

**Left side:** The Zellij wordmark (text-based, monospaced feel) followed by a small version badge showing the Zellij version the shortcuts apply to (e.g. `v0.40`).

**Center:** Section jump links — `Essentials`, `Simulator`, `Layouts`, `Plugins`, `Workflows`. These are plain text links, not buttons. The active section is indicated by a small teal dot beneath the link as the user scrolls. On mobile, these collapse into a hamburger menu that opens a full-height drawer.

**Right side:** Three elements:
- A search trigger (magnifying glass icon) that opens the ⌘K command palette
- A theme toggle cycle button (clicking cycles through the four themes)
- A GitHub icon link to the Zellij repository

#### Scroll Behavior
An `IntersectionObserver` watches each section heading. As a section enters the viewport, the corresponding nav link activates. A 2px progress bar runs along the very bottom edge of the nav, showing overall page scroll progress.

#### Mobile Behavior
Below 768px, the center links disappear and a hamburger icon appears. Tapping it opens a full-screen overlay drawer with large touch-friendly section links, the theme toggle, and the search bar.

#### Content Notes
The nav does not include a logo image — it uses text. The Zellij name is styled in the monospace font used throughout the terminal aesthetic areas of the site. The version badge is automatically included in the data layer and surfaced here.

---

### 3.2 Hero Section

#### Purpose
Convert a skeptical visitor (likely a tmux user) into someone who wants to keep reading. Establish the productivity framing immediately. Make installation feel instant.

#### Layout & Appearance
Full viewport-width section. Approximately 85–90vh tall on first load so the content just below the fold is barely visible, inviting the user to scroll.

**Left column (55% width):** Headline text and CTAs.
**Right column (45% width):** Animated terminal mockup.

On mobile, the columns stack vertically — terminal mockup below the text.

#### Left Column Content

**Headline:** Large, bold display text. Something in the spirit of:
> "Your terminal. Finally in control."

Or a positioning line like:
> "The terminal multiplexer that doesn't make you memorize everything."

The exact copy should be short (under 8 words), confident, and reference the discoverability advantage.

**Subheadline:** One sentence, 20–25 words. Positions Zellij explicitly against tmux:
> "Zellij shows you what to press — you just focus on the work. A modern replacement for tmux with layouts, plugins, and no config overhead."

**Three-bullet value proposition:** Three short lines, each with a small icon, naming the core differentiators:
- On-screen shortcut hints — no memorization required
- KDL layouts — define your workspace in a file, load it anywhere  
- WASM plugins — extend anything, in any language

**Install block:** A styled code snippet with OS detection. The snippet shown changes based on detected OS:
- macOS: `brew install zellij`
- Linux (cargo): `cargo install --locked zellij`
- Generic: `bash <(curl -L https://zellij.dev/launch)`

A small toggle below lets users switch OS manually. A copy button is overlaid on the snippet.

**CTAs:** Two buttons side by side:
- Primary: "Try the simulator" (scrolls to simulator section)
- Secondary: "Jump to shortcuts" (scrolls to essentials section)

#### Right Column Content — Animated Terminal Mockup

A CSS-rendered terminal window (not a video or GIF). It mimics the Zellij default layout:
- Dark terminal chrome with a title bar
- Two panes visible — a main editor pane and a smaller side pane
- The Zellij status bar at the bottom showing mode badges (`NORMAL`, `PANE`, `TAB`)
- Fake text output in the panes — code output, ls listing, etc.

An animation loop plays on load:
1. User "presses" `Ctrl+p` — the status bar switches to PANE mode (highlighted badge)
2. User "presses" `d` — a new pane appears with a split animation
3. The pane border activates (focus indicator)
4. User "presses" `Esc` — returns to NORMAL mode
5. 3-second pause, then loop

The animation is CSS-driven using keyframes. It respects `prefers-reduced-motion` — when reduced motion is preferred, the terminal just shows a static split-pane layout.

#### Below the Fold Teaser — tmux Comparison Strip

Immediately below the hero, a narrow full-width strip (not a full section) shows five side-by-side comparison pills:

| tmux | → | Zellij |
|---|---|---|
| No UI hints — memorize or look up | → | Shortcut guide always visible in status bar |
| bash-based config (`tmux.conf`) | → | Human-readable KDL format |
| Shell script plugins | → | WASM plugins in any language |
| No floating panes | → | Native floating and stacked panes |
| Session sharing is manual | → | True multiplayer with per-user cursors |

This strip is styled as a single horizontal band with a subtle background, setting the competitive framing before the user enters the reference content.

---

### 3.3 Essentials Cheatsheet

#### Purpose
The primary reference layer. Everything a user needs for day-to-day Zellij usage, organized and instantly filterable. This section is the most frequently revisited.

#### Layout & Appearance

**Section header:** Title (`Essentials`) with a short descriptor: "All shortcuts, filterable by mode. Click any card to copy."

**Filter bar:** A horizontal row of mode filter buttons, each styled as a pill/badge. Clicking a filter shows only shortcuts for that mode. The filters are:

- `All` (default)
- `Normal`
- `Pane`
- `Tab`
- `Scroll`
- `Session`
- `Resize`
- `Search`
- `Locked`

Active filter is highlighted in teal. Multiple filters can be active simultaneously (user can select `Pane + Tab` to see both). A small count badge on each filter shows how many shortcuts are in that category.

**Search input:** Above the filter bar, a small search input with a keyboard shortcut hint (`/` to focus). Typing filters the grid in real time using fuzzy matching on shortcut name, key combo, and description.

**Shortcut grid:** A responsive grid of shortcut cards. On desktop, 3 columns. On tablet, 2 columns. On mobile, 1 column.

Each shortcut card contains:
- The key combination displayed as styled `<kbd>` elements (e.g., `Ctrl` + `p`)
- A short action name (e.g., "Enter Pane Mode") in bold
- A one-line description (e.g., "Switch to pane management — split, navigate, close")
- A mode badge in the top-right corner (e.g., `NORMAL`)
- A copy icon button in the bottom-right — clicking copies the key combo as text
- A "Try it" link (small, below the description) that scrolls to the simulator and pre-loads that shortcut's demo

Cards use a subtle hover state — a faint teal left-border accent appears on hover. Clicking anywhere on the card (not the buttons) expands it inline to show more detail: what the mode looks like in the status bar, what other shortcuts are available from within that mode.

#### Shortcut Groups Documented

**Session Management**
- Start a named session: `zellij -s <name>` (CLI)
- List sessions: `zellij list-sessions` (CLI)
- Attach to session: `zellij attach <name>` (CLI)
- Detach from session: `Ctrl+o` → `d`
- Open session manager: `Ctrl+o` → `w`
- Rename session: `Ctrl+o` → `r`
- Create new session: `Ctrl+o` → `n`
- Kill session: `Ctrl+o` → `x`

**Pane Management (Pane Mode — `Ctrl+p`)**
- Split pane horizontally: `d`
- Split pane vertically: `r`
- Navigate to pane: `↑ ↓ ← →`
- Close focused pane: `x`
- Toggle full-screen: `f`
- Float pane: `w`
- Embed floating pane: `e`
- Rename pane: `c`
- Stack panes: `s`
- Navigate stacked panes: `Tab`

**Tab Management (Tab Mode — `Ctrl+t`)**
- Create new tab: `n`
- Close tab: `x`
- Navigate tabs: `← →` or `h` `l`
- Rename tab: `r`
- Move tab left/right: `H` `L`
- Switch to tab by number: `1`–`9`

**Scroll & Copy Mode (`Ctrl+s`)**
- Scroll up/down: `↑ ↓` or `j` `k`
- Page up/down: `Ctrl+u` / `Ctrl+d`
- Enter copy mode: `e`
- Search in buffer: `/`
- Copy selection: `y`
- Exit scroll: `Esc` or `Enter`

**Resize Mode (`Ctrl+n`)**
- Increase pane size: `↑ ↓ ← →`
- Increase/decrease: `+` / `-`
- Return to normal: `Esc`

**Lock Mode**
- Enter locked (passthrough) mode: `Ctrl+g`
- Exit locked mode: `Ctrl+g`

**Keybinding Presets Note**
A small callout card at the top of the section explains that Zellij offers two keybinding presets — `Default` and `Unlock First`. This cheatsheet covers the Default preset. A toggle allows switching the displayed shortcuts to the Unlock First layout.

---

### 3.4 Interactive Terminal Simulator

#### Purpose
Teach Zellij's modal system through doing. Users who have never installed Zellij can practice the mental model here. Users who have installed it can use this to rehearse less-used shortcuts.

#### Layout & Appearance

The simulator is a full-width section with a dark background regardless of the active theme — it always looks like a terminal environment. This section has the most visual weight on the page.

**Top row:** A section title and a brief explanation: "A browser-based Zellij environment. No installation needed. Press real shortcuts and see what happens."

**Mission selector:** A horizontal row of mission pills above the simulator:
- `Basics` — pane splitting, navigation, closing
- `Tabs` — create, rename, navigate, close
- `Sessions` — detach, list, reattach flow
- `Floating Panes` — open, move, embed
- `Free mode` — no guidance, just explore

The active mission is highlighted. Each mission has a title and a "3 steps" / "5 steps" indicator.

**The Simulator Chrome:**

The simulator is rendered as a styled `div` that mirrors the visual appearance of a real Zellij terminal:

- A terminal title bar at the very top with a fake session name and three traffic-light circles
- A main content area divided into panes (starting with a single pane)
- Pane borders rendered with box-drawing characters (`┌─┐│└─┘`) or CSS borders
- A Zellij status bar fixed to the bottom of the simulator, containing:
  - Left side: mode badge (NORMAL / PANE / TAB / etc.) with color-coded background per mode
  - Center: shortcut hint strip showing available shortcuts for the current mode — exactly as real Zellij shows them
  - Right side: tab names with the active tab highlighted

**Inside each pane:** A fake terminal with a blinking cursor. The pane shows a static prompt (`user@host:~$`) unless a mission step puts output there.

**Keyboard capture:** When the user clicks into the simulator area (or a "Focus simulator" button), keyboard events are intercepted. The simulator interprets Zellij key combinations and responds visually. ESC always returns to Normal mode.

**Key response behavior:**
- `Ctrl+p` — status bar switches to PANE mode, available shortcuts update, pane border highlights
- `d` (in Pane mode) — a new pane appears below with a smooth height-splitting animation
- `r` (in Pane mode) — a new pane appears to the right
- `x` (in Pane mode) — focused pane closes with a fade
- `f` (in Pane mode) — focused pane fills the full simulator area
- `w` (in Pane mode) — a floating pane overlay appears (draggable)
- `Ctrl+t` → `n` — a new tab appears in the tab bar
- `Ctrl+t` → `x` — active tab closes
- `Ctrl+o` → `d` — simulator shows a "Session detached" message overlay, then a mock `zellij list-sessions` screen
- `Ctrl+s` — status bar switches to SCROLL mode, scroll indicators appear

**Guided mission flow:**

When a mission is active, a small step indicator panel sits to the right of the simulator:
- Current step number (e.g. `Step 2 of 4`)
- Step instruction in plain English (e.g. "Now press `d` to split the pane horizontally")
- The key combination shown as a styled `<kbd>` element
- A hint button (reveals more context if the user is stuck)
- A "Skip step" option

When the user performs the correct action, the step checks off with a green checkmark animation and the next step activates. On mission completion, a celebratory state appears — confetti animation, "Mission complete" message, and a prompt to try the next mission.

**Free mode:**

No instructions. The full shortcut hint strip at the bottom of the simulator remains visible (as it would in real Zellij), so users can discover shortcuts organically.

---

### 3.5 Layouts & KDL Configuration

#### Purpose
Teach Zellij's most powerful productivity feature — custom workspace layouts. Most users never use this; this section makes it accessible and immediately useful.

#### Overview

Layouts in Zellij are defined in KDL files (Kiss Document Language). A layout file describes how panes and tabs are arranged, what commands run in them, and what plugins load. This section has three parts:

1. A visual explainer of what KDL layout files are and where they live
2. An interactive live editor with visual preview
3. A template gallery of ready-to-use layouts

#### Part 1 — What Are Layouts?

A short explanatory block (not a wall of text) with a diagram showing:
- `~/.config/zellij/layouts/` directory structure
- How `zellij --layout myproject.kdl` loads a layout
- How `default.kdl` auto-loads

A KDL syntax explainer in three points:
- `layout { }` — the root node
- `pane { }` — a terminal pane, optionally with `command "..."` to auto-run
- `tab { }` — groups panes into a tab

An annotated code example is shown, with each part of the code highlighted and labeled.

#### Part 2 — Live KDL Editor

**Layout:** A two-panel horizontal split. Left panel is the editor. Right panel is the visual preview.

**Left panel — KDL Editor:**
- Built with CodeMirror 6 (lazy-loaded — only initializes when user scrolls to this section)
- KDL syntax highlighting via a custom language mode (simple enough that a tokenizer handles it — KDL grammar is not complex)
- Line numbers visible
- Inline error highlighting — if the KDL is invalid, the problematic line gets a red gutter indicator and a tooltip describing the error
- Auto-close brackets and quotes

Starting content in the editor is a commented example layout so the user has something to learn from immediately:

```kdl
// My project layout
layout {
    tab name="editor" {
        pane split_direction="vertical" {
            pane { command "nvim"; }
            pane size=30 { command "lazygit"; }
        }
    }
    tab name="terminal" {
        pane {}
        pane {}
    }
    tab name="logs" {
        pane { command "tail -f /var/log/app.log"; }
    }
}
```

**Right panel — Visual Preview:**
- A grid-based visual representation of the layout described in the editor
- Updates in real time (debounced 300ms after typing stops) 
- Each pane shown as a labeled rectangle
- Tab names shown as a tab bar at the top of the preview
- If a pane has a `command`, that command is shown inside the pane rectangle as a small label
- Invalid KDL shows an error state: "Invalid layout — fix the KDL to see preview"
- A small "Copy launch command" button generates: `zellij --layout <name>.kdl`

**Below the editor:** A "Download this layout" button that generates the `.kdl` file and triggers a browser download. A "Copy to clipboard" button as well.

#### Part 3 — Template Gallery

Eight pre-built layout templates shown as cards in a 4-column grid (2 on tablet, 1 on mobile).

Each template card contains:
- Template name (e.g., "Full-stack dev", "Git workflow", "Log monitor")
- A tiny visual preview diagram (small SVG showing the pane arrangement)
- A one-line description of the use case
- A "Load in editor" button that populates the editor with that template's KDL

**Templates included:**

1. **Minimal** — Single pane, no splits. Good default.
2. **Vertical split** — Two panes side by side. Editor + terminal.
3. **Full-stack dev** — Three panes: editor (large), server logs (bottom-left), git status (bottom-right).
4. **Git workflow** — Two tabs: one for coding (editor + terminal), one for Git (lazygit + diff view).
5. **Log monitor** — Four panes, each running a different `tail -f` command.
6. **Pair programming** — Two tabs in the same session, optimized for sharing via Zellij's multiplayer.
7. **CI/CD dashboard** — Panes running watch commands for test output, build output, deploy status.
8. **SSH multi-server** — Template with command panes pre-configured for SSH to multiple hosts.

#### Part 4 — config.kdl Reference

A collapsible section (closed by default) showing the full `~/.config/zellij/config.kdl` structure. Each meaningful configuration key is shown with:
- Its name
- Its type and valid values
- A one-line explanation
- The default value

Key config options covered: `theme`, `default_layout`, `default_mode`, `pane_frames`, `mouse_mode`, `session_serialization`, `keybinds` (custom binding example), `plugins` (loading custom plugins), `env` (environment variables).

---

### 3.6 Plugins & Hooks

#### Purpose
Show the depth of Zellij's extensibility. Help users find useful community plugins. Provide a reference for developers writing their own.

#### Part 1 — Plugin Gallery

A searchable, filterable grid of community plugins. Filters by category:
- `Status bar`
- `File management`
- `Session tools`
- `Git integration`
- `Productivity`
- `Fun / experimental`

Each plugin card shows:
- Plugin name
- Author (GitHub handle)
- One-line description
- Category badge
- Language badge (Rust, Zig, other)
- GitHub star count (static data — updated when the site is rebuilt)
- Install snippet: the `plugin { path "..." }` or `plugin { git "..." }` KDL config
- A copy button for the install snippet

**Featured plugins to include:**

| Plugin | Description |
|---|---|
| `zellij-statusbar` | Configurable status bar with system info |
| `zjstatus` | Highly customizable status bar |
| `zellij-tab-name-reloader` | Auto-names tabs based on running process |
| `room` | Multiplayer session coordinator |
| `zellij-forgot` | Remembers your custom keybinds |
| `lazygit-zellij` | Float a lazygit pane |
| `monocle` | Fuzzy file finder panel |
| `harpoon` | Jump-list for panes and tabs |

#### Part 2 — Event Hooks Reference

A table-based reference of all available Zellij plugin event hooks. Each row:
- Hook name (monospace, e.g., `on_key`)
- When it fires
- What data it receives
- A one-line code pattern

**Hooks covered:**

| Hook | Fires when... |
|---|---|
| `render` | Plugin needs to re-render its UI |
| `update` | Plugin receives a new event |
| `on_key` | User presses a key while plugin is focused |
| `tab_update` | Any tab changes (new, rename, close) |
| `pane_update` | Any pane changes |
| `mode_update` | The terminal mode changes |
| `session_update` | A session is created, renamed, or destroyed |
| `pipe_message` | Another plugin sends a message to this one |
| `web_request_result` | A pending HTTP request resolves |
| `file_system_update` | A watched file or directory changes |

#### Part 3 — Plugin Development Primer

A concise (not exhaustive) explanation of how Zellij plugins work. This is not a tutorial — it is a mental model builder. Four subsections:

**WASM/WASI basics:** Plugins are compiled to WASM. They have a sandboxed environment. They communicate with Zellij via a message-passing API. Any language that compiles to WASM can write a Zellij plugin — Rust is most common.

**Plugin anatomy:** The minimum structure of a plugin — a `render` function, an `update` function, and a manifest KDL block. Brief Rust pseudocode shown (not full code, just structure).

**Permissions system:** Plugins declare what they need access to. The available permissions are listed: `ReadApplicationState`, `ChangeApplicationState`, `OpenFiles`, `RunCommands`, `OpenTerminalsOrPlugins`, `WriteToStdin`, `WebAccess`, `ReadSecret`, `WriteSecret`.

**Plugin manager:** How to use Zellij's built-in plugin manager (available since v0.38) to install and update WASM plugins without manually editing config files.

---

### 3.7 Advanced Workflows

#### Purpose
Cover the patterns that make Zellij genuinely powerful for professional terminal users — patterns that go beyond basic shortcuts.

#### Layout & Appearance

A grid of workflow cards. Each card is a self-contained step-through widget — clicking through numbered steps with arrows, each step showing the command or config and an explanation.

On desktop, two workflow cards sit side by side where they are similar in length. For longer workflows, they span the full width.

#### Workflows Covered

**Workflow 1 — Session Resurrection**
Zellij can restore sessions after a reboot or unexpected terminal close. This workflow covers:
- Enabling `session_serialization true` in `config.kdl`
- What gets saved (pane layout, tab names, working directories)
- What doesn't get saved (terminal scroll buffer contents)
- Using `zellij attach <name>` after a reboot
- Manually triggering a save: `zellij action dump-screen`

**Workflow 2 — tmux Migration Guide**
A step-through mapping for developers switching from tmux:

- Understanding the fundamental difference: tmux is prefix-based, Zellij is mode-based
- The tmux-equivalent keybinding preset (how to configure Zellij to use `Ctrl+b` prefix style)
- Side-by-side table: tmux command → Zellij equivalent for 20 common operations
- Status bar configuration comparison
- Transferring existing tmux sessions to Zellij

**Workflow 3 — SSH Multi-Server Workflow**
For DevOps users who manage multiple remote servers:

- Creating a layout file where each tab SSHes to a different server
- Using `command "ssh user@server"` inside layout panes
- Handling SSH key forwarding
- Using Zellij detach/reattach to resume SSH sessions after network drops
- Named sessions per environment (staging, production, etc.)

**Workflow 4 — Multiplayer / Collaboration**
For pair programming or teaching sessions:

- How Zellij's multiplayer works (everyone connects to the same session, each gets a named colored cursor)
- Steps to set up a shareable session: named session + server-side Zellij + SSH/tmux gateway
- Permissions: read-only vs read-write collaboration
- Useful for: live debugging, code review walkthroughs, remote pair programming

**Workflow 5 — CI/CD Startup Layout**
For developers who want their project workspace to auto-configure on startup:

- Creating a project-specific `layout.kdl` committed to the repo
- Adding a `Makefile` or `justfile` target: `make dev` runs `zellij --layout ./.zellij/dev.kdl`
- Layout that opens editor, runs dev server, runs test watcher, shows git status
- Using `cwd` in layout to set working directory per pane

**Workflow 6 — Keybinding Conflict Resolution**
For users whose editor (Vim, Emacs, etc.) conflicts with Zellij shortcuts:

- Explaining why conflicts happen (both Vim and Zellij want `Ctrl+p`)
- The two solutions: Lock mode and the Unlock First keybinding preset
- Lock mode: `Ctrl+g` disables all Zellij shortcuts until pressed again — editor gets full keyboard control
- Unlock First: requires a prefix before any Zellij command — similar to tmux's model
- How to configure custom keybinds in `config.kdl` to avoid specific conflicts
- Example: remapping Zellij's `Ctrl+p` to `Ctrl+\` to avoid Vim conflict

**Workflow 7 — Floating Panes as Quick Terminals**
A productivity pattern: using floating panes as scratch terminals:

- Binding a shortcut to open a floating pane in any tab
- Sizing and positioning floating panes via config
- Using `zellij action start-or-reload-plugin` to open a floating pane from the CLI (useful in shell scripts)
- Dismissing floating panes without closing them (they persist)

**Workflow 8 — Plugin-Powered Workflow**
An end-to-end example of combining plugins:

- Installing `zjstatus` for a rich status bar
- Installing `monocle` for fuzzy file search
- Installing `harpoon` for pane bookmarks
- The resulting workflow: open file → edit → jump back to terminal → check git status, all without leaving the keyboard

---

### 3.8 Quick Reference Drawer

#### Purpose
A globally accessible shortcut reference that doesn't require scrolling. Available from any section.

#### Appearance & Behavior

A small floating button in the bottom-right corner of the screen. It is a small pill-shaped button that reads `⌨ Cheatsheet` or shows just a keyboard icon on small screens.

Clicking it opens a side drawer (from the right on desktop, from the bottom on mobile). The drawer is approximately 360px wide on desktop. It slides in with a smooth CSS transition.

**Inside the drawer:**
- A title bar: "Quick Reference" with a close button
- A compact mode filter (smaller pill buttons than the main section)
- A condensed list of shortcuts — same data as the main section but displayed in a tighter format (no description, just key combo + action name)
- A link at the bottom: "See full cheatsheet ↑" that scrolls to the main section and closes the drawer

The drawer remembers its last active filter using `sessionStorage`.

Keyboard shortcut to open/close the drawer: `Shift+?` (shown in a tooltip on hover).

---

### 3.9 Footer

#### Layout
A three-column footer:

**Left column:** 
- "Zellij Cheatsheet" in the monospace display style
- "Covers Zellij v0.40 — last updated [date]"
- A note: "Not affiliated with the official Zellij project"

**Center column:**
- Quick links: Essentials, Simulator, Layouts, Plugins, Workflows
- External links: Official Zellij docs, Zellij GitHub, Zellij Discord

**Right column:**
- "Found an error or missing shortcut? Open a PR"
- GitHub contribution link
- Theme switcher (duplicated here for convenience)

**Bottom bar:** Copyright line. "Made by developers, for developers."

---

## 4. Component Design Specifications

### Visual Language

The site adopts a terminal-native aesthetic. It does not look like a standard SaaS product or documentation site. It feels like something a developer would build and use themselves.

**Typography:**
- Display / headings: A geometric mono or technical sans — something with a technical character. Consider `JetBrains Mono` for headings in the terminal-adjacent areas, and a clean sans-serif (`Geist` or `IBM Plex Sans`) for body text and descriptions.
- Body text: 15–16px, comfortable line-height (1.6–1.7)
- Code / shortcuts: Monospace throughout — `JetBrains Mono` or `Fira Code`. Shortcuts shown in `<kbd>` elements.

**Color usage:**
- Teal (`#1D9E75` family) is the primary accent — the Zellij brand color
- Borders are thin (0.5px) — never heavy
- Cards use very subtle fills, not heavy box shadows
- Mode badges use color-coded backgrounds (one per mode — Normal = teal, Pane = amber, Tab = blue, etc.)

**Spacing:** Generous. Sections have significant vertical padding. Content doesn't feel cramped.

**Iconography:** Tabler Icons (outline) throughout. Consistent size (18–20px inline, 24px decorative). Never filled icons.

---

### Component: ShortcutCard

The atomic unit of the cheatsheet. Appears in both the main grid and the quick reference drawer.

**States:**
- Default: white card, thin border, visible key combo and action name
- Hover: teal left border accent, slight background tint
- Expanded (clicked): card grows inline to show full description, related shortcuts, and mode context
- Copied (after clicking copy): brief "Copied!" text appears for 1.5s, then resets

**Anatomy:**
```
┌─────────────────────────────────────────┐
│  [Mode badge]                    [PANE] │  ← top-right mode label
│                                         │
│  Ctrl + p                               │  ← key combo (large, monospace)
│  Enter Pane Mode                        │  ← action name (medium weight)
│                                         │
│  Switch to pane management. Split,      │  ← description (small, muted)
│  navigate, resize, or close panes.      │
│                                         │
│  [Try it →]                    [Copy ⎘] │  ← actions
└─────────────────────────────────────────┘
```

**Expanded state adds:**
```
  ─────────────────────────────────────────
  Once in Pane mode:
  [d] Split down   [r] Split right   [x] Close
  [f] Fullscreen   [w] Float         [Esc] Exit
```

---

### Component: KbdKey

The styled keyboard key element. Used for individual keys in shortcut displays.

**Appearance:** White background, 0.5px border, 4px border-radius, monospace font, 11–12px, small box shadow (0 1px 0 border-color) to give a physical key feel. In dark themes, inverted.

**Combinations:** A `+` separator character between keys. E.g., `Ctrl` `+` `p`.

---

### Component: ModeFilter

The filter pills in the cheatsheet section.

**States:** Default (inactive), Active (teal background, white text). Count badge is always visible. Multiple can be active simultaneously.

**Behavior:** Clicking an active filter deactivates it. Clicking `All` deactivates all others. `All` is always the default active state.

---

### Component: MissionStepper

Used in the Simulator (mission guidance) and in Advanced Workflows (step-through).

**Appearance:** A vertically stacked list of steps. Completed steps show a green checkmark. Current step is highlighted with a teal left border. Future steps are muted.

Each step:
- Step number (small, circular)
- Instruction text
- Optional: key combo to press (styled `<kbd>`)
- Optional: hint button (expands a tooltip with more context)

---

### Component: KDLEditor

CodeMirror 6 instance styled to match the site theme. Custom KDL language support (syntax highlighting).

**Features:**
- Line numbers
- Matching bracket highlight
- Error gutter indicators
- Theme-aware (editor background adapts to active site theme)
- Keyboard shortcut: `Ctrl+Enter` / `Cmd+Enter` triggers layout preview update

---

### Component: LayoutPreview

The SVG/canvas-based pane diagram rendered from parsed KDL.

**How it works:** The KDL is parsed client-side into a tree structure. The renderer maps that tree to a grid of rectangles. Tab names become a tab bar. Pane `command` values appear as labels inside pane rectangles.

**Visual style:** Clean boxes with thin borders. Tabs shown at the top. The focused/active pane has a slightly thicker border.

**Error state:** Shows a soft red border around the preview area with "Invalid layout" text.

---

### Component: CommandPalette (⌘K)

**Trigger:** `Cmd+K` / `Ctrl+K` from anywhere on the page.

**Appearance:** Centered modal overlay with a blurred backdrop. Input at the top. Results list below.

**Search scope:**
- All shortcuts (key combo + action name)
- All workflow titles
- All config keys
- All plugin names
- Section headings

**Result anatomy:**
- Icon (keyboard icon for shortcuts, workflow icon for workflows, etc.)
- Title
- Section breadcrumb (e.g., "Essentials › Pane Mode")
- Keyboard shortcut to jump there

**Keyboard navigation:** Arrow keys move through results. Enter navigates. Escape closes.

---

### Component: ThemeToggle

A small button that cycles through the four themes. Shows the current theme name as a tooltip on hover. An icon representing each theme (moon, sun, terminal, snowflake) appears in the button.

---

### Component: ZellijSimulator

The main simulation area. Full state machine implemented in React.

**State model:**
- `mode`: one of `normal | pane | tab | scroll | session | resize | search | locked`
- `panes`: array of pane objects (`{ id, x, y, w, h, command, focused, floating }`)
- `tabs`: array of tab objects (`{ id, name, panes, active }`)
- `session`: session name string
- `missionState`: current mission + current step + completed steps

**Key capture:** `useEffect` to attach `keydown` listener when simulator is focused. Detached when focus leaves the simulator area.

---

## 5. Content Strategy & Focus Areas

### Voice and Tone

The writing throughout the site is direct, practical, and written developer-to-developer. No fluff, no marketing superlatives. Short sentences. Active voice.

Good: "Press `Ctrl+p` to enter Pane mode. Then `d` to split horizontally."
Avoid: "You can leverage the powerful pane management capabilities by utilizing the dedicated Pane mode."

### Content Priorities

**Highest priority content (must be 100% accurate and complete):**
- All shortcut key combinations for the current Zellij version
- CLI commands for session management
- KDL syntax for layouts and config
- Plugin hook names and signatures

**High priority content (should be complete, can have gaps in v1):**
- Workflow step-through content
- Plugin gallery (can start with 6 plugins, grow over time)
- tmux comparison details

**Medium priority (nice to have in v1, iteratable):**
- Plugin development primer
- config.kdl full reference
- All eight layout templates

### Versioning Strategy

The Zellij version number is stored in a single `data/meta.ts` file. All shortcut data is annotated with the version it was introduced (e.g., floating panes were added in v0.33). Shortcuts for features not in the displayed version are filtered out automatically.

The nav badge and footer note both read from this central version value.

### The tmux Comparison — Framing Guidelines

The comparison should be respectful and accurate — not dismissive of tmux. tmux is a mature, reliable tool. Zellij is newer and has genuine tradeoffs (higher memory usage, fewer terminal compatibility options). The framing is:

> "If you're comfortable in tmux and it works for you, that's great. If you're starting fresh, or if tmux's config overhead frustrates you, Zellij offers the same power with a lower learning curve."

The comparison strip shows real, verifiable differences — not marketing claims.

---

## 6. Theming System

### Implementation

Theming is implemented via CSS custom properties on the `:root` element. The `next-themes` library manages the active theme class on the `<html>` element. Four theme classes: `theme-terminal`, `theme-paper`, `theme-gruvbox`, `theme-nightowl`.

Each theme defines a complete set of CSS variables:

```
--bg-primary        Background of main content areas
--bg-secondary      Background of cards and sidebars  
--bg-terminal       Background of terminal-style elements
--text-primary      Main body text
--text-secondary    Captions, descriptions, muted text
--text-mono         Monospace text (shortcuts, code)
--accent            Primary accent (teal-ish in most themes)
--accent-muted      Light tint of accent for hover states
--accent-text       Text color on accent backgrounds
--border            Default border color
--border-strong     Emphasized border (card hover, focus)
--mode-normal       Mode badge background — Normal mode
--mode-pane         Mode badge background — Pane mode
--mode-tab          Mode badge background — Tab mode
--mode-scroll       Mode badge background — Scroll mode
--mode-session      Mode badge background — Session mode
--kbd-bg            Keyboard key background
--kbd-border        Keyboard key border
--kbd-text          Keyboard key text
```

### Theme Definitions

**Terminal Dark (default)**
Deep navy/charcoal background. Green-teal accent. High contrast. Monospace feel. The aesthetic of a real terminal. Mode badges use saturated terminal colors (green for normal, yellow for pane, blue for tab, cyan for scroll). The simulator looks perfectly at home in this theme.

**Paper Light**
Off-white background (#fafaf7). Warm gray text. Teal accent. Generous whitespace. Feels like a printed reference card. Mode badges are soft and readable. Best for reading in bright environments.

**Gruvbox Warm**
Brown-earth dark background (#282828). Warm orange and yellow accents. Softer contrast than Terminal Dark. Instantly recognizable to Vim/Neovim users. Mode badges use the classic Gruvbox color palette. The KDL editor's syntax highlighting uses Gruvbox colors.

**Night Owl Blue**
Deep blue background (#011627). Electric blue and cyan accents. Crisp, modern. Inspired by VS Code's Night Owl theme. Popular with JavaScript/TypeScript developers. High contrast, excellent readability.

### Theme Persistence

`next-themes` persists the user's choice in `localStorage` under the key `zellij-cheatsheet-theme`. System preference (`prefers-color-scheme`) is used as the initial default — dark themes for dark-mode OS, Paper Light for light-mode OS.

---

## 7. Interactivity & UX Flows

### ⌘K Command Palette

**Open:** `Cmd+K` (macOS) or `Ctrl+K` (Windows/Linux). Also openable via the search icon in the nav.

**Flow:**
1. Modal opens with focus on search input
2. "Recently visited" shortcuts shown by default (stored in `sessionStorage`)
3. User types — results update in real time using Fuse.js fuzzy search
4. Arrow keys navigate results, Enter jumps to the result's section and closes palette
5. Escape closes without navigating

**Search index includes:** shortcut names, key combos, workflow titles, config keys, plugin names, section headings.

### Shortcut Copy Flow

1. User sees a shortcut card
2. Hovers — copy icon appears in bottom-right
3. Clicks copy icon
4. Key combo is copied as plain text (e.g., `Ctrl+p`) to clipboard using the Clipboard API
5. Copy icon momentarily changes to a checkmark with "Copied!" label
6. After 1.5 seconds, reverts to copy icon

### Live Layout Preview Flow

1. User edits KDL in the editor
2. 300ms debounce fires after typing stops
3. KDL is parsed using a client-side KDL parser (lightweight, ~5kb)
4. If parse succeeds: preview SVG updates with smooth transition
5. If parse fails: preview shows an error state, editor line with error gets gutter indicator
6. User can click "Copy launch command" at any time to get `zellij --layout <file>.kdl`

### Simulator Mission Flow

1. User selects a mission from the mission selector
2. Step 1 instruction appears in the mission panel
3. User presses the indicated shortcut
4. Simulator validates: correct key in correct mode → step advances with checkmark
5. Wrong key: gentle shake animation on the instruction, no punishment
6. On final step completion: celebration state, prompt to try next mission or enter free mode

### Quick Reference Drawer

1. Click the floating `⌨ Cheatsheet` button (or press `Shift+?`)
2. Drawer slides in from the right
3. Default shows "All" modes — most recently used shortcuts at top
4. User can filter by mode inside the drawer
5. Click any shortcut to jump to its full card in the main section (closes drawer, scrolls)
6. Drawer state (open/closed, active filter) is persisted in `sessionStorage`

---

## 8. Data Architecture

All content is stored as TypeScript data files in `data/`. No CMS, no backend, no API calls at runtime.

### `data/shortcuts.ts`

Array of shortcut objects. Each shortcut:

```typescript
{
  id: string,              // e.g., "pane-split-down"
  mode: Mode,              // enum: normal | pane | tab | scroll | session | resize | search | locked | cli
  keys: KeyCombo[],        // array of key objects, e.g., [{key: "ctrl"}, {key: "p"}]
  action: string,          // short name: "Enter Pane Mode"
  description: string,     // longer explanation
  since: string,           // Zellij version when introduced, e.g., "0.30.0"
  tags: string[],          // for search: ["pane", "mode", "enter"]
  hasMission: boolean,     // whether the simulator has a mission for this
}
```

### `data/workflows.ts`

Array of workflow objects:

```typescript
{
  id: string,
  title: string,
  description: string,
  difficulty: "beginner" | "intermediate" | "advanced",
  tags: string[],
  steps: WorkflowStep[],   // array of { instruction, command?, explanation, tip? }
}
```

### `data/plugins.ts`

Array of plugin objects:

```typescript
{
  id: string,
  name: string,
  author: string,
  githubUrl: string,
  description: string,
  category: PluginCategory,
  language: string,
  stars: number,           // static, updated at build time
  installSnippet: string,  // KDL config to load the plugin
}
```

### `data/layouts.ts`

Array of layout template objects:

```typescript
{
  id: string,
  name: string,
  description: string,
  tags: string[],
  kdl: string,             // the full KDL content
  previewDiagram: string,  // SVG string for the card thumbnail
}
```

### `data/meta.ts`

```typescript
{
  zellijVersion: "0.40.0",
  lastUpdated: "2025-05-01",
  defaultKeyBindingPreset: "default",
}
```

---

## 9. Next.js Project Structure

```
zellij-cheatsheet/
├── app/
│   ├── page.tsx                  ← Main page, all sections composed here
│   ├── print/
│   │   └── page.tsx              ← Print-optimized layout
│   ├── layout.tsx                ← ThemeProvider, fonts, metadata
│   └── globals.css               ← CSS variables per theme, base resets
│
├── components/
│   ├── nav/
│   │   ├── Navbar.tsx            ← Sticky nav, scroll progress bar
│   │   ├── MobileDrawer.tsx      ← Mobile nav overlay
│   │   └── ThemeToggle.tsx       ← Theme cycle button
│   │
│   ├── hero/
│   │   ├── HeroSection.tsx       ← Layout + copy
│   │   ├── TerminalMockup.tsx    ← Animated fake terminal
│   │   ├── InstallSnippet.tsx    ← OS-detected install command
│   │   └── TmuxComparisonStrip.tsx
│   │
│   ├── cheatsheet/
│   │   ├── EssentialsSection.tsx ← Section wrapper
│   │   ├── ShortcutGrid.tsx      ← Responsive grid of cards
│   │   ├── ShortcutCard.tsx      ← Individual shortcut card
│   │   ├── ModeFilter.tsx        ← Filter pills
│   │   ├── ShortcutSearch.tsx    ← Search input
│   │   └── KbdKey.tsx            ← Styled keyboard key element
│   │
│   ├── simulator/
│   │   ├── SimulatorSection.tsx  ← Section wrapper
│   │   ├── ZellijSimulator.tsx   ← Main simulator component (state machine)
│   │   ├── PaneLayout.tsx        ← Renders pane grid
│   │   ├── StatusBar.tsx         ← Bottom status bar with mode + hints
│   │   ├── TabBar.tsx            ← Tab bar at top of simulator
│   │   ├── MissionSelector.tsx   ← Mission pill tabs
│   │   └── MissionStepper.tsx    ← Step-through guidance panel
│   │
│   ├── layouts/
│   │   ├── LayoutsSection.tsx    ← Section wrapper
│   │   ├── KDLEditor.tsx         ← CodeMirror instance (lazy loaded)
│   │   ├── LayoutPreview.tsx     ← SVG diagram renderer
│   │   ├── TemplateGallery.tsx   ← Template card grid
│   │   ├── TemplateCard.tsx      ← Individual template card
│   │   └── ConfigReference.tsx   ← Collapsible config.kdl reference
│   │
│   ├── plugins/
│   │   ├── PluginsSection.tsx    ← Section wrapper
│   │   ├── PluginGallery.tsx     ← Searchable plugin grid
│   │   ├── PluginCard.tsx        ← Individual plugin card
│   │   ├── HooksReference.tsx    ← Event hooks table
│   │   └── PluginPrimer.tsx      ← WASM explainer
│   │
│   ├── workflows/
│   │   ├── WorkflowsSection.tsx  ← Section wrapper
│   │   ├── WorkflowCard.tsx      ← Individual workflow with stepper
│   │   └── WorkflowStepper.tsx   ← Numbered step-through component
│   │
│   ├── ui/
│   │   ├── CommandPalette.tsx    ← ⌘K search modal
│   │   ├── QuickRefDrawer.tsx    ← Floating drawer
│   │   ├── SectionHeader.tsx     ← Consistent section title block
│   │   ├── CopyButton.tsx        ← Reusable copy-to-clipboard
│   │   ├── CodeBlock.tsx         ← Syntax-highlighted code display
│   │   └── Kbd.tsx               ← Alias for KbdKey, used everywhere
│   │
│   └── footer/
│       └── Footer.tsx
│
├── data/
│   ├── shortcuts.ts
│   ├── workflows.ts
│   ├── plugins.ts
│   ├── layouts.ts
│   └── meta.ts
│
├── lib/
│   ├── kdl-parser.ts             ← Lightweight KDL parser for live preview
│   ├── layout-renderer.ts        ← KDL AST → SVG diagram
│   ├── search.ts                 ← Fuse.js search index builder
│   ├── simulator-state.ts        ← Simulator state machine logic
│   └── use-theme.ts              ← Theme hook wrapping next-themes
│
├── public/
│   └── fonts/                    ← Self-hosted fonts for performance
│
└── styles/
    ├── themes/
    │   ├── terminal.css
    │   ├── paper.css
    │   ├── gruvbox.css
    │   └── nightowl.css
    └── print.css                 ← Print stylesheet for /print route
```

---

## 10. Page & Routing Decisions

### Why Single-Page Architecture

The site is one long page with anchor navigation rather than multiple routes. This decision is based on the use case: a developer has this open in a small browser window beside their terminal. They need to jump between sections instantly. Anchor scrolling is faster than page navigation for this pattern.

The only exception is `/print`, which is a separate route because its layout is fundamentally different (no nav, no simulator, no interactive elements — just the shortcut grid optimized for PDF printing).

### Static Export

The site is exported as static HTML via `next export`. This means:
- Deployable to any CDN (Vercel, Netlify, GitHub Pages, Cloudflare Pages)
- No server costs
- Instant global performance
- No runtime API dependencies

### SEO & Metadata

Even though it's a developer tool, good SEO helps the site be found when developers search "Zellij shortcuts" or "Zellij vs tmux". Metadata in `layout.tsx`:
- Title: "Zellij Cheatsheet — The Interactive Shortcut Reference"
- Description: Includes "Zellij", "terminal multiplexer", "shortcuts", "tmux alternative"
- Open Graph image: A preview of the site's hero terminal mockup
- Canonical URL

---

## 11. Accessibility & Performance

### Accessibility

- All interactive elements are keyboard-accessible
- The simulator has a "Keyboard Focus" button to explicitly enter keyboard capture mode, preventing accidental capture
- All shortcut cards are focusable and operable via keyboard
- The command palette is fully keyboard-navigable
- Color is never the sole conveyor of information — mode badges have both color and text labels
- `prefers-reduced-motion` disables all CSS animations and transitions in the simulator and hero
- `prefers-contrast` mode increases border weights and text contrast
- All `<kbd>` elements have `aria-label` attributes that spell out the shortcut for screen readers (e.g., `aria-label="Control plus P"`)
- The simulator has an `aria-live` region announcing mode changes for screen readers

### Performance

- CodeMirror 6 is lazy-loaded via `next/dynamic` — only initializes when the Layouts section enters the viewport (`IntersectionObserver`)
- The simulator state machine is kept in a `useReducer` — no external state library
- Images: the terminal mockup in the hero uses no raster images — pure CSS and HTML
- Fonts are self-hosted in `/public/fonts` — no Google Fonts DNS lookup
- Shortcut data is a static import — no runtime fetching
- The Fuse.js search index is built once on first ⌘K open, then cached
- `React.memo` on `ShortcutCard` — the grid contains potentially 80+ cards, memoization prevents re-renders during filter changes

---

## 12. Phased Build Plan

### Phase 1 — Core Reference (MVP)

The minimum viable cheatsheet. Useful on day one.

**Deliverables:**
- Navigation (sticky, anchor links, theme toggle)
- Hero section (headline, install snippet, tmux comparison strip)
- Essentials cheatsheet section (full shortcut data, filter by mode, search, copy)
- Quick reference drawer (floating button, filtered shortcut list)
- Footer
- All four themes implemented
- Print route (`/print`)

**Out of scope for Phase 1:** Simulator, KDL editor, plugin gallery, workflows.

**Acceptance criteria:** A developer can open the site and find any Zellij shortcut within 5 seconds. The tmux comparison is clear. The site looks great in all four themes.

---

### Phase 2 — Interactive Learning

Adds the features that make this more than a static reference.

**Deliverables:**
- Terminal simulator (all pane, tab, session, scroll mode interactions)
- Guided missions (Basics, Tabs, Sessions)
- Mode explainer (interactive state machine diagram)
- tmux → Zellij shortcut mapper tool

**Acceptance criteria:** A Zellij beginner can complete all three basic missions. The simulator accurately reflects real Zellij behavior for all documented interactions.

---

### Phase 3 — Power User Features

Adds the advanced content for experienced users.

**Deliverables:**
- KDL live editor with visual preview
- Layout template gallery (all 8 templates)
- config.kdl reference (collapsible)
- Advanced workflows (all 8 workflows with step-through)
- Floating pane and stacked pane interactions in simulator
- ⌘K command palette (full implementation)

**Acceptance criteria:** A power user can build a custom layout in the editor and download the file. All 8 workflow steppers are completeable. ⌘K searches across all content.

---

### Phase 4 — Plugin Ecosystem

Adds the extensibility content.

**Deliverables:**
- Plugin gallery (minimum 8 plugins, with search and filter)
- Event hooks reference table
- Plugin development primer
- Additional simulator missions for floating panes and plugin shortcuts

**Acceptance criteria:** A developer who wants to extend Zellij can find a relevant community plugin or understand the hooks API structure from this page alone.

---

### Ongoing — Content Maintenance

After all phases are complete, the site requires periodic updates:
- When new Zellij versions release: update `data/meta.ts`, add new shortcuts with `since` version, add new config keys
- When new community plugins gain traction: add to `data/plugins.ts`
- Community contributions via GitHub PRs for shortcut corrections and new workflow patterns

---

*End of implementation plan.*