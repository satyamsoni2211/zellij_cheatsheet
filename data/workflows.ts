export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export interface WorkflowStep {
  instruction: string
  command?: string
  explanation?: string
  tip?: string
}

export interface Workflow {
  id: string
  title: string
  description: string
  difficulty: Difficulty
  steps: WorkflowStep[]
}

export const workflows: Workflow[] = [
  {
    id: 'session-resurrection',
    title: 'Session Resurrection',
    description: 'Restore your workspace exactly as you left it after a reboot or disconnect.',
    difficulty: 'beginner',
    steps: [
      {
        instruction: 'Enable session serialization in your Zellij config',
        command: `// In ~/.config/zellij/config.kdl
session_serialization true`,
        explanation: 'Add this to your config.kdl file to enable automatic session saving.',
      },
      {
        instruction: 'Verify session_serialization is active',
        command: `zellij options --session-serialization`,
        tip: 'You should see "true" in the output.',
      },
      {
        instruction: 'Start your session as usual',
        command: `zellij -s myproject`,
        explanation: 'Create panes, open files, run processes. Zellij saves state periodically.',
      },
      {
        instruction: 'Disconnect from the session',
        command: `Ctrl + o  then  d`,
        explanation: 'Your session is now preserved in the background.',
      },
      {
        instruction: 'After reboot, reattach to your session',
        command: `zellij attach myproject`,
        explanation: 'All panes, tabs, and working directories are restored.',
        tip: 'Use zellij list-sessions to see all preserved sessions.',
      },
      {
        instruction: 'Manually trigger a session save (optional)',
        command: `zellij action dump-screen`,
        explanation: 'Forces an immediate save of current state to disk.',
      },
    ],
  },
  {
    id: 'tmux-migration',
    title: 'tmux Migration Guide',
    description: 'Transition from tmux prefix-based commands to Zellij mode-based workflows.',
    difficulty: 'intermediate',
    steps: [
      {
        instruction: 'Understand the fundamental difference',
        explanation: 'tmux uses a prefix key (Ctrl+b) for all commands. Zellij uses modes: Normal, Pane, Tab, Scroll, Session.',
        tip: 'In Zellij, you hold Ctrl+mode key, then press the action key. Release to return to Normal.',
      },
      {
        instruction: 'Enable the tmux-style keybinding preset',
        command: `keybinds "tmux"`,
        explanation: 'This changes Ctrl+b to be your prefix, similar to tmux.',
      },
      {
        instruction: 'Learn the equivalent operations (session)',
        command: `Ctrl + o  then  d     # detach
Ctrl + o  then  r     # rename
Ctrl + o  then  w     # session manager`,
        explanation: 'tmux: Ctrl+b d → Zellij: Ctrl+o d',
      },
      {
        instruction: 'Learn pane operations',
        command: `Ctrl + p  then  d     # split down
Ctrl + p  then  r     # split right
Ctrl + p  then  ↑↓←→  # navigate panes`,
        explanation: 'tmux: Ctrl+b " → Zellij: Ctrl+p d (split down)',
      },
      {
        instruction: 'Learn tab operations',
        command: `Ctrl + t  then  n     # new tab
Ctrl + t  then  x     # close tab
Ctrl + t  then  ←→     # navigate tabs`,
        explanation: 'tmux: Ctrl+b c → Zellij: Ctrl+t n (new tab)',
      },
      {
        instruction: 'Migrate your existing tmux sessions',
        command: `tmux list-sessions`,
        explanation: 'List your tmux sessions, then manually recreate them in Zellij, or use a layout file.',
      },
    ],
  },
  {
    id: 'ssh-multi-server',
    title: 'SSH Multi-Server Workflow',
    description: 'Manage multiple remote servers simultaneously with one Zellij session.',
    difficulty: 'advanced',
    steps: [
      {
        instruction: 'Create a layout directory for your server cluster',
        command: `mkdir -p ~/.config/zellij/layouts`,
        tip: 'Layouts go in ~/.config/zellij/layouts/ or specify with --layout flag.',
      },
      {
        instruction: 'Create a .kdl layout file with SSH panes',
        command: `layout {
    tab name="servers" {
        pane size=1/3 { command "ssh user@server1"; }
        pane size=1/3 { command "ssh user@server2"; }
        pane { command "ssh user@server3"; }
    }
}`,
        explanation: 'Each pane opens an SSH session to a different server.',
      },
      {
        instruction: 'Start the multi-server session',
        command: `zellij --layout my-servers`,
        explanation: 'Opens all servers in a preconfigured layout.',
      },
      {
        instruction: 'Handle SSH key forwarding',
        command: `# In ~/.ssh/config
Host *
    ForwardAgent yes`,
        explanation: 'Ensure your SSH config has ForwardAgent enabled for key forwarding.',
        tip: 'Edit ~/.ssh/config to enable agent forwarding.',
      },
      {
        instruction: 'Handle network drops gracefully',
        command: `zellij attach my-servers`,
        explanation: 'Use this command to reattach after a network interruption.',
      },
      {
        instruction: 'Create named sessions per environment',
        command: `zellij -s prod-webserver
zellij -s staging-webserver`,
        explanation: 'Keep separate sessions for dev, staging, prod environments.',
      },
    ],
  },
  {
    id: 'multiplayer',
    title: 'Multiplayer / Collaboration',
    description: 'Share your Zellij session with teammates for real-time collaboration.',
    difficulty: 'intermediate',
    steps: [
      {
        instruction: 'Start a shareable session',
        command: `zellij --share`,
        explanation: 'The --share flag makes your session discoverable to others on the network.',
      },
      {
        instruction: 'Generate session connection info',
        command: `zellij action session-share`,
        explanation: 'This outputs the connection details your teammates need.',
      },
      {
        instruction: 'Team members connect to your session',
        command: `zellij attach <session-name>`,
        explanation: 'Each collaborator gets a unique colored cursor to identify them.',
      },
      {
        instruction: 'Set permissions for collaborators',
        explanation: 'By default, collaborators can see and interact. You can restrict to read-only.',
        tip: 'Use Ctrl+o, l to lock your session to read-only mode.',
      },
      {
        instruction: 'Use cases for multiplayer',
        explanation: 'Live debugging: Watch each other fix bugs in real-time.\nCode review: Walkthrough changes with your team.\nPair programming: Share terminal with remote partner.',
      },
    ],
  },
  {
    id: 'cicd-startup',
    title: 'CI/CD Startup Layout',
    description: 'Automate project environment setup with a commit-ready layout file.',
    difficulty: 'intermediate',
    steps: [
      {
        instruction: 'Create a .zellij directory in your project root',
        command: `mkdir -p .zellij`,
        tip: 'Commit this to version control so the whole team benefits.',
      },
      {
        instruction: 'Create a dev.kdl layout for your project',
        explanation: 'Define a layout with all your development tools open.',
      },
      {
        instruction: 'Define panes in your layout',
        command: `layout {
    tab name="dev" {
        pane size=3/4 {
            cwd "/path/to/project"
            command "nvim"
        }
        pane { command "npm run dev"; }
        pane { command "npm test -- --watch"; }
    }
}`,
        explanation: 'Set working directory and start commands for each pane.',
      },
      {
        instruction: 'Add a Makefile target for convenience',
        command: `.PHONY: dev
dev:
	zellij --layout .zellij/dev.kdl`,
        explanation: 'Run make dev to launch your full development environment.',
      },
      {
        instruction: 'Commit the layout to your repo',
        command: `git add .zellij/dev.kdl Makefile
git commit -m "add dev environment layout"`,
        explanation: 'Teammates get the same setup with make dev.',
      },
    ],
  },
  {
    id: 'keybinding-conflicts',
    title: 'Keybinding Conflict Resolution',
    description: 'Resolve conflicts between Zellij and tools like Vim that want the same keys.',
    difficulty: 'intermediate',
    steps: [
      {
        instruction: 'Understand why conflicts happen',
        explanation: 'Vim uses Ctrl+p for completion. Zellij uses Ctrl+p for pane mode. Neither is wrong.',
        tip: 'Conflicts arise when two programs want the same key sequence.',
      },
      {
        instruction: 'Solution 1: Use Lock Mode',
        command: `Ctrl + g`,
        explanation: 'Press Ctrl+g to lock Zellij. All keys pass through to the underlying app until unlocked.',
      },
      {
        instruction: 'Unlock after finishing in Vim',
        command: `Ctrl + g`,
        explanation: 'Press Ctrl+g again to return Zellij to normal operation.',
        tip: "Lock mode is instant and doesn't require configuration.",
      },
      {
        instruction: 'Solution 2: Use the Unlock First preset',
        command: `keybinds "unlock-first"`,
        explanation: 'This preset requires a Ctrl+o prefix before mode keys, letting Vim use Ctrl+p directly.',
      },
      {
        instruction: 'Solution 3: Remap conflicting keys',
        command: `// In config.kdl
unbind "Ctrl+p"
bind "Ctrl+\\" { SwitchToMode "Normal"; }`,
        explanation: 'Remove Zellij\'s binding and reassign to an unused key combination.',
        tip: 'Add to config.kdl for permanent changes.',
      },
    ],
  },
  {
    id: 'floating-panes',
    title: 'Floating Panes as Quick Terminals',
    description: 'Use floating panes as persistent scratch terminals accessible from any tab.',
    difficulty: 'beginner',
    steps: [
      {
        instruction: 'Enter pane mode',
        command: `Ctrl + p`,
        explanation: 'Press Ctrl+p to enter pane mode.',
      },
      {
        instruction: 'Create a floating pane',
        command: `Ctrl + p  then  f`,
        explanation: 'This opens the focused pane as a floating window.',
        tip: 'Floating panes appear on top of tiled panes.',
      },
      {
        instruction: 'Position and size the floating pane',
        explanation: 'Drag to reposition. Use resize mode (Ctrl+n) to adjust size.',
        tip: 'Configure default floating pane size in config.kdl.',
      },
      {
        instruction: 'Access floating pane from any tab',
        explanation: 'The floating pane persists across all tabs in your session.',
        tip: 'Great for a scratch terminal, calculator, or notes.',
      },
      {
        instruction: 'Open floating pane from CLI',
        command: `zellij action start-or-reload-plugin "file:/path/to/plugin"`,
        explanation: 'Open specific plugins in a floating pane from the command line.',
      },
      {
        instruction: 'Dismiss a floating pane without closing',
        command: `Ctrl + p  then  e`,
        explanation: 'Embed the floating pane back into the tiled layout, or x to close.',
      },
    ],
  },
  {
    id: 'plugin-workflow',
    title: 'Plugin-Powered Workflow',
    description: 'Install and configure plugins for a turbocharged terminal workflow.',
    difficulty: 'advanced',
    steps: [
      {
        instruction: 'Install zjstatus for a rich status bar',
        command: `zellij plugin run https://github.com/dj95/zjstatus`,
        explanation: 'zjstatus shows CPU, RAM, date, time, and git branch in your status bar.',
      },
      {
        instruction: 'Install monocle for fuzzy file search',
        command: `zellij plugin run https://github.com/imsnif/monocle`,
        explanation: 'Monocle provides vim-fzf style fuzzy finding across your project.',
      },
      {
        instruction: 'Install harpoon for pane bookmarks',
        command: `zellij plugin run https://github.com/Nacho114/harpoon`,
        explanation: 'Harpoon lets you bookmark specific panes and jump between them instantly.',
      },
      {
        instruction: 'Configure plugins in config.kdl',
        command: `// In ~/.config/zellij/config.kdl
plugins {
    "file:~/.config/zellij/plugins/zjstatus.wasm"
    "file:~/.config/zellij/plugins/monocle.wasm"
}`,
        explanation: 'Add plugin paths to your Zellij configuration.',
      },
      {
        instruction: 'Enable plugin in layout',
        command: `layout {
    tab name="editor" {
        pane_plugin "file:~/.config/zellij/plugins/zjstatus.wasm"
        pane { command "nvim"; }
    }
}`,
        explanation: 'Reference the plugin in your layout file to activate it.',
      },
      {
        instruction: 'Enjoy the workflow',
        explanation: 'Open file → edit → Ctrl+p, h → jump to bookmarked pane → check git status. All without leaving the keyboard.',
        tip: 'Spend time learning each plugin\'s shortcuts for maximum efficiency.',
      },
    ],
  },
]