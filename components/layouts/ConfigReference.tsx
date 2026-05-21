'use client'

import { useState } from 'react'

interface ConfigItem {
  key: string
  type: string
  default?: string
  description: string
  values?: string[]
}

const configItems: ConfigItem[] = [
  { key: 'layout', type: 'string', description: 'Default layout to use when starting a session' },
  { key: 'session.name', type: 'string', description: 'Default session name' },
  { key: 'session.timeout', type: 'number', default: '30', description: 'Session timeout in seconds' },
  { key: 'pane.resize.relation', type: 'string', default: 'auto', values: ['auto', 'fixed'], description: 'How pane sizes relate when resizing' },
  { key: 'pane.sort_direction', type: 'string', default: 'default', values: ['default', 'alphabetical'], description: 'Sort direction for pane navigation' },
  { key: 'mouse_mode', type: 'boolean', default: 'true', description: 'Enable mouse support' },
  { key: 'scroll_buffer_size', type: 'number', default: '10000', description: 'Number of lines to keep in scroll buffer' },
  { key: 'copy_command', type: 'string', description: 'Command to use for copying selection' },
  { key: 'paste_command', type: 'string', description: 'Command to use for pasting' },
  { key: 'serials', type: 'string[]', description: 'List of serial ports to expose' },
  { key: 'TCP', type: 'string[]', description: 'List of TCP addresses to expose' },
  { key: 'mirror', type: 'boolean', default: 'false', description: 'Mirror the interface for left-handed users' },
  { key: 'theme', type: 'string', default: 'default', description: 'Color theme to use', values: ['default', ' Dracula', 'gruvbox', 'nord'] },
  { key: 'orientation', type: 'string', default: 'auto', values: ['horizontal', 'vertical', 'auto'], description: 'Initial pane orientation' },
  { key: 'default_tab', type: 'string', default: 'main', description: 'Name for the default tab' },
  { key: 'default_shell', type: 'string', description: 'Default shell to launch in panes' },
  { key: 'pane_frames', type: 'string', default: 'all', values: ['all', 'none', 'only_active'], description: 'Which pane borders to show' },
  { key: 'simplified_ui', type: 'boolean', default: 'false', description: 'Use simplified UI elements' },
  { key: 'show_borders', type: 'boolean', default: 'true', description: 'Show pane borders' },
  { key: 'border_char', type: 'string', default: '█', description: 'Character to use for borders' },
  { key: 'border_size', type: 'number', default: '1', description: 'Border line thickness' },
  { key: 'move_amount', type: 'number', default: '1', description: 'Default movement amount for resize' },
]

export function ConfigReference() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      {/* Toggle Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] transition-colors"
      >
        <span className="font-medium text-[var(--text-primary)]">
          Configuration Reference
        </span>
        <svg
          className={`w-5 h-5 text-[var(--text-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="p-4 border-t border-[var(--border)]">
          {/* Intro */}
          <div className="mb-4 p-3 rounded-lg bg-[var(--surface-secondary)] text-sm">
            <p className="text-[var(--text-secondary)] mb-2">
              <code className="px-1.5 py-0.5 rounded bg-[var(--surface)] text-[var(--text-primary)]">config.kdl</code> is Zellij&apos;s main configuration file.
            </p>
            <p className="text-[var(--text-muted)]">
              Place it at <code className="px-1.5 py-0.5 rounded bg-[var(--surface)]">~/.config/zellij/config.kdl</code>
            </p>
          </div>

          {/* Config Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-2 px-3 font-medium text-[var(--text-muted)]">Key</th>
                  <th className="text-left py-2 px-3 font-medium text-[var(--text-muted)]">Type</th>
                  <th className="text-left py-2 px-3 font-medium text-[var(--text-muted)]">Default</th>
                  <th className="text-left py-2 px-3 font-medium text-[var(--text-muted)]">Description</th>
                </tr>
              </thead>
              <tbody>
                {configItems.map((item) => (
                  <tr key={item.key} className="border-b border-[var(--border)]/50 hover:bg-[var(--surface-secondary)]/50">
                    <td className="py-2 px-3">
                      <code className="text-xs font-mono text-[var(--text-primary)]">{item.key}</code>
                    </td>
                    <td className="py-2 px-3">
                      <span className="px-1.5 py-0.5 rounded text-xs bg-[var(--surface-secondary)] text-[var(--text-muted)]">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <code className="text-xs font-mono text-[var(--text-muted)]">
                        {item.default || '—'}
                      </code>
                    </td>
                    <td className="py-2 px-3 text-[var(--text-secondary)]">
                      {item.description}
                      {item.values && (
                        <span className="block mt-1 text-xs text-[var(--text-muted)]">
                          Values: {item.values.join(', ')}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Example */}
          <div className="mt-4 p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
            <p className="text-xs font-medium text-[var(--text-muted)] mb-2 uppercase tracking-wide">
              Example config.kdl
            </p>
            <pre className="text-xs font-mono text-[var(--text-secondary)] overflow-x-auto">{`layout "default"
mouse_mode true
theme "gruvbox"
default_shell "zsh"

pane_frames "only_active"
show_borders true

scroll_buffer_size 20000`}</pre>
          </div>
        </div>
      )}
    </div>
  )
}