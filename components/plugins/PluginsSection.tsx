import { PluginGallery } from './PluginGallery'
import { HooksReference } from './HooksReference'
import { PluginPrimer } from './PluginPrimer'
import { SectionHeader } from '@/components/ui/SectionHeader'

export function PluginsSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          id="plugins"
          title="Plugin Gallery"
          description="Extend Zellij with community plugins. Find tools for status bars, file management, git integration, and more."
        />

        {/* Plugin Gallery */}
        <div className="mb-16">
          <PluginGallery />
        </div>

        {/* Hooks Reference */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Hooks Reference</h2>
          <p className="text-[var(--text-secondary)] mb-6">
            Event hooks let plugins react to terminal and session changes.
          </p>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
            <HooksReference />
          </div>
        </div>

        {/* Plugin Primer */}
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Plugin Primer</h2>
          <p className="text-[var(--text-secondary)] mb-6">
            Learn how Zellij plugins work under the hood.
          </p>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
            <PluginPrimer />
          </div>
        </div>
      </div>
    </section>
  )
}