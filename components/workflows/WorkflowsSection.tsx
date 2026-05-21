'use client'

import { workflows } from '@/data/workflows'
import { WorkflowCard } from './WorkflowCard'
import { SectionHeader } from '@/components/ui/SectionHeader'

export function WorkflowsSection() {
  return (
    <section className="py-16 px-4" id="workflows">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title="Advanced Workflows"
          description="Step-by-step guides for complex Zellij workflows. Click 'Start' on any workflow to begin the interactive tutorial."
          id="workflows-header"
        />

        {/* Workflows grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workflows.map((workflow) => (
            <WorkflowCard key={workflow.id} workflow={workflow} />
          ))}
        </div>

        {/* Help text */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[var(--text-secondary)]">
            New to Zellij? Start with{' '}
            <a href="#essentials" className="text-[var(--accent)] hover:underline">
              Essentials
            </a>
            {' '}or{' '}
            <a href="#modes" className="text-[var(--accent)] hover:underline">
              Modes Overview
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  )
}