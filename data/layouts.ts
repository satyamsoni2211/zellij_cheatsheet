export interface LayoutTemplate {
  id: string
  name: string
  description: string
  tags: string[]
  kdl: string
}

export const layouts: LayoutTemplate[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Single pane, no splits - perfect for focused work',
    tags: ['minimal', 'single', 'focus'],
    kdl: `layout {
  pane size=1 {
  }
}`,
  },
  {
    id: 'vertical-split',
    name: 'Vertical Split',
    description: 'Two panes side by side for comparing files',
    tags: ['split', 'vertical', 'two-panes'],
    kdl: `layout {
  split direction="vertical" {
    pane
    pane
  }
}`,
  },
  {
    id: 'full-stack-dev',
    name: 'Full-Stack Dev',
    description: 'Three panes: editor, server logs, and git status',
    tags: ['development', 'full-stack', 'logs'],
    kdl: `layout {
  split direction="vertical" {
    split direction="horizontal" {
      pane
      pane
    }
    pane command="tail -f /var/log/server.log"
  }
}`,
  },
  {
    id: 'git-workflow',
    name: 'Git Workflow',
    description: 'Two tabs for coding and git operations',
    tags: ['git', 'version-control', 'tabs'],
    kdl: `layout {
  tab "Coding" {
    pane
  }
  tab "Git" {
    pane command="git status"
  }
}`,
  },
  {
    id: 'log-monitor',
    name: 'Log Monitor',
    description: 'Four panes with tail -f commands for monitoring',
    tags: ['logs', 'monitoring', 'four-panes'],
    kdl: `layout {
  split direction="horizontal" {
    split direction="vertical" {
      pane command="tail -f logs/app.log"
      pane command="tail -f logs/error.log"
    }
    split direction="vertical" {
      pane command="tail -f logs/access.log"
      pane
    }
  }
}`,
  },
  {
    id: 'pair-programming',
    name: 'Pair Programming',
    description: 'Two tabs for collaborative sessions',
    tags: ['collaboration', 'pair', 'tabs'],
    kdl: `layout {
  tab "Driver" {
    pane
  }
  tab "Navigator" {
    pane
  }
}`,
  },
  {
    id: 'cicd-dashboard',
    name: 'CI/CD Dashboard',
    description: 'Panes with watch commands for pipeline monitoring',
    tags: ['ci-cd', 'monitoring', 'pipeline'],
    kdl: `layout {
  split direction="horizontal" {
    pane command="watch -n 5 kubectl get pods"
    pane command="watch -n 10 curl -s http://localhost:8080/health"
  }
  split direction="horizontal" {
    pane command="tail -f /var/log/cicd.log"
    pane command="htop"
  }
}`,
  },
  {
    id: 'ssh-multi-server',
    name: 'SSH Multi-Server',
    description: 'SSH to multiple hosts in a tiled layout',
    tags: ['ssh', 'remote', 'multi-server'],
    kdl: `layout {
  split direction="horizontal" {
    pane command="ssh server1"
    pane command="ssh server2"
  }
  split direction="horizontal" {
    pane command="ssh server3"
    pane command="ssh server4"
  }
}`,
  },
]

export function getLayoutById(id: string): LayoutTemplate | undefined {
  return layouts.find(l => l.id === id)
}

export function generateLaunchCommand(layoutName: string): string {
  return `zellij --layout ${layoutName}`
}

export function generateDownloadFile(layout: LayoutTemplate): Blob {
  const content = `// ${layout.name} Layout
// ${layout.description}

${layout.kdl}
`
  return new Blob([content], { type: 'text/kdl' })
}