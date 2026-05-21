'use client'

import { layouts } from '@/data/layouts'
import { TemplateCard } from './TemplateCard'

interface TemplateGalleryProps {
  onLoadTemplate: (kdl: string) => void
}

export function TemplateGallery({ onLoadTemplate }: TemplateGalleryProps) {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          Layout Templates
        </h2>
        <p className="text-[var(--text-secondary)]">
          Choose from pre-built layouts or customize your own
        </p>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {layouts.map(template => (
          <TemplateCard
            key={template.id}
            template={template}
            onLoad={onLoadTemplate}
          />
        ))}
      </div>
    </div>
  )
}