export interface Hook {
  name: string
  description: string
  useCase: string
}

export const hooks: Hook[] = [
  {
    name: 'render',
    description: 'Plugin needs to re-render its UI',
    useCase: 'Update the visual display of your plugin, draw UI elements, refresh themed components',
  },
  {
    name: 'update',
    description: 'Plugin receives a new event',
    useCase: 'Handle incoming events, process user interactions, update plugin state',
  },
  {
    name: 'on_key',
    description: 'User presses a key while plugin is focused',
    useCase: 'Capture keyboard input, implement custom keybindings, build keyboard-driven UIs',
  },
  {
    name: 'tab_update',
    description: 'Any tab changes (new, rename, close)',
    useCase: 'Track tab changes, auto-name tabs based on content, synchronize across tabs',
  },
  {
    name: 'pane_update',
    description: 'Any pane changes',
    useCase: 'Monitor pane creation/destruction, adjust plugin behavior per pane state',
  },
  {
    name: 'mode_update',
    description: 'The terminal mode changes',
    useCase: 'Respond to mode switches (normal, pane, tab, etc.), enable/disable features per mode',
  },
  {
    name: 'session_update',
    description: 'A session is created, renamed, or destroyed',
    useCase: 'Track session lifecycle, persist/restore state across sessions, coordinate multi-session',
  },
  {
    name: 'pipe_message',
    description: 'Another plugin sends a message to this one',
    useCase: 'Inter-plugin communication, build plugin ecosystems, share state between plugins',
  },
  {
    name: 'web_request_result',
    description: 'A pending HTTP request resolves',
    useCase: 'Handle async API responses, process webhooks, build HTTP-dependent plugins',
  },
  {
    name: 'file_system_update',
    description: 'A watched file or directory changes',
    useCase: 'Live reload configurations, watch for git changes, monitor project files',
  },
]

export function HooksReference() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th className="py-3 px-4 text-sm font-semibold text-[var(--text-primary)]">Hook</th>
            <th className="py-3 px-4 text-sm font-semibold text-[var(--text-primary)]">Fires when...</th>
            <th className="py-3 px-4 text-sm font-semibold text-[var(--text-primary)]">Common use case</th>
          </tr>
        </thead>
        <tbody>
          {hooks.map((hook, index) => (
            <tr
              key={hook.name}
              className={`border-b border-[var(--border)] ${
                index % 2 === 0 ? 'bg-[var(--bg-secondary)]/30' : ''
              }`}
            >
              <td className="py-3 px-4">
                <code className="px-2 py-1 text-sm font-mono bg-[var(--bg-primary)] text-[var(--accent)] rounded">
                  {hook.name}
                </code>
              </td>
              <td className="py-3 px-4 text-sm text-[var(--text-secondary)]">
                {hook.description}
              </td>
              <td className="py-3 px-4 text-sm text-[var(--text-secondary)]">
                {hook.useCase}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}