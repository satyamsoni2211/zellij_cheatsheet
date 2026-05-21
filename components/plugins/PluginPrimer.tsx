export function PluginPrimer() {
  return (
    <div className="space-y-8">
      {/* WASM/WASI Basics */}
      <section>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center text-sm font-bold">1</span>
          WASM/WASI Basics
        </h3>
        <div className="pl-10 space-y-3 text-sm text-[var(--text-secondary)]">
          <p>
            Zellij plugins are compiled to <strong className="text-[var(--text-primary)]">WebAssembly (WASM)</strong> and run in a sandboxed environment with no direct access to the host system.
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Plugins communicate via <strong className="text-[var(--text-primary)]">message passing</strong> - no shared memory</li>
            <li>Any language that compiles to WASM can build Zellij plugins (Rust, Go, TypeScript via AssemblyScript, C, etc.)</li>
            <li>Plugins run in a <strong className="text-[var(--text-primary)]">WASI</strong> (WebAssembly System Interface) environment for file/network access</li>
            <li>Plugin execution is deterministic and crash-isolated</li>
          </ul>
        </div>
      </section>

      {/* Plugin Anatomy */}
      <section>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center text-sm font-bold">2</span>
          Plugin Anatomy
        </h3>
        <div className="pl-10 space-y-3 text-sm text-[var(--text-secondary)]">
          <p>Every Zellij plugin has a minimum structure:</p>
          <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-4 overflow-x-auto">
            <pre className="text-xs font-mono text-[var(--text-secondary)]">{`// manifest.kdl (plugin configuration)
plugin {
    version "1.0.0"
    author "Your Name"
    description "Your plugin description"
}

// main.rs (plugin logic)
use zellij_plugin::prelude::*;

struct MyPlugin;

impl Plugin for MyPlugin {
    fn render(&mut self, _rows: usize, _cols: usize) -> String {
        // Return UI as String (renderable text/ANSI)
        "Hello from my plugin!".to_string()
    }

    fn update(&mut self, event: Event) -> bool {
        // Return true to re-render after handling event
        false
    }
}

register!(MyPlugin);`}</pre>
          </div>
          <p>The three essential pieces:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong className="text-[var(--text-primary)]">render</strong> - Returns the UI string to display</li>
            <li><strong className="text-[var(--text-primary)]">update</strong> - Handles events and returns whether to re-render</li>
            <li><strong className="text-[var(--text-primary)]">manifest KDL block</strong> - Plugin metadata and permissions</li>
          </ul>
        </div>
      </section>

      {/* Permissions System */}
      <section>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center text-sm font-bold">3</span>
          Permissions System
        </h3>
        <div className="pl-10 space-y-3 text-sm text-[var(--text-secondary)]">
          <p>Plugins must request specific permissions in their manifest:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { name: 'ReadApplicationState', desc: 'Read tab/pane/session state' },
              { name: 'ChangeApplicationState', desc: 'Modify tabs, panes, mode' },
              { name: 'OpenFiles', desc: 'Read files from filesystem' },
              { name: 'RunCommands', desc: 'Execute shell commands' },
              { name: 'OpenTerminalsOrPlugins', desc: 'Spawn new terminals/plugins' },
              { name: 'WriteToStdin', desc: 'Send input to panes' },
              { name: 'WebAccess', desc: 'Make HTTP requests' },
              { name: 'ReadSecret', desc: 'Read from secrets store' },
              { name: 'WriteSecret', desc: 'Write to secrets store' },
            ].map((perm) => (
              <div
                key={perm.name}
                className="flex items-start gap-2 p-2 bg-[var(--bg-secondary)] rounded border border-[var(--border)]"
              >
                <code className="text-xs font-mono text-[var(--accent)] shrink-0">{perm.name}</code>
                <span className="text-xs">{perm.desc}</span>
              </div>
            ))}
          </div>
          <p className="mt-3">
            Users approve permissions when installing a plugin. Permissions are visible in the plugin manager.
          </p>
        </div>
      </section>

      {/* Plugin Manager */}
      <section>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center text-sm font-bold">4</span>
          Plugin Manager
        </h3>
        <div className="pl-10 space-y-3 text-sm text-[var(--text-secondary)]">
          <p>
            Since <strong className="text-[var(--text-primary)]">Zellij v0.38</strong>, a built-in plugin manager handles installation and updates without manual config editing.
          </p>
          <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-4 overflow-x-auto">
            <pre className="text-xs font-mono text-[var(--text-secondary)]">{`# Install a plugin directly
zellij plugin run https://github.com/author/plugin-name

# Or add to zellij.kdl configuration
plugins {
    my-plugin path:./plugins/my-plugin.wasm
}

# Update all plugins
zellij plugin update --all

# List installed plugins
zellij plugin list`}</pre>
          </div>
          <p>
            The plugin manager also provides a UI accessible via <code className="text-xs font-mono bg-[var(--bg-secondary)] px-1 rounded">Ctrl+o</code> {'→'} <code className="text-xs font-mono bg-[var(--bg-secondary)] px-1 rounded">P</code> for browsing and managing plugins.
          </p>
        </div>
      </section>
    </div>
  )
}