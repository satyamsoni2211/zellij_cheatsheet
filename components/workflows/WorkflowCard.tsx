'use client'

import { useState } from 'react'
import { Workflow } from '@/data/workflows'
import { WorkflowStepper } from './WorkflowStepper'

interface WorkflowCardProps {
  workflow: Workflow
}

const difficultyStyles = {
  beginner: {
    bg: 'bg-[var(--mode-normal)]/20',
    text: 'text-[var(--mode-normal)]',
    border: 'border-[var(--mode-normal)]/30',
  },
  intermediate: {
    bg: 'bg-[var(--mode-pane)]/20',
    text: 'text-[var(--mode-pane)]',
    border: 'border-[var(--mode-pane)]/30',
  },
  advanced: {
    bg: 'bg-[var(--mode-session)]/20',
    text: 'text-[var(--mode-session)]',
    border: 'border-[var(--mode-session)]/30',
  },
}

const difficultyLabels = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export function WorkflowCard({ workflow }: WorkflowCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const style = difficultyStyles[workflow.difficulty]

  return (
    <div
      className={`
        rounded-xl border transition-all duration-300
        bg-[var(--bg-primary)] border-[var(--border)]
        ${isCompleted ? 'ring-2 ring-[var(--accent)]' : ''}
      `}
    >
      {/* Header */}
      <div
        className="p-5 cursor-pointer"
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {/* Difficulty badge */}
              <span
                className={`
                  inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold uppercase tracking-wider
                  ${style.bg} ${style.text} ${style.border}
                `}
              >
                {difficultyLabels[workflow.difficulty]}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-mono font-bold text-[var(--text-primary)] mb-2">
              {workflow.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-[var(--text-secondary)]">
              {workflow.description}
            </p>
          </div>

          {/* Expand/collapse indicator */}
          <div className="flex-shrink-0">
            {!isExpanded && !isCompleted && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsExpanded(true)
                }}
                className="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] font-mono text-sm rounded-lg
                  hover:bg-[var(--border)] transition-colors duration-200"
              >
                Start
              </button>
            )}
            {isExpanded && (
              <svg
                className={`w-6 h-6 text-[var(--text-secondary)] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Expandable stepper */}
      {isExpanded && !isCompleted && (
        <div className="px-5 pb-5 border-t border-[var(--border)] pt-4">
          <WorkflowStepper
            steps={workflow.steps}
            onComplete={() => setIsCompleted(true)}
          />
        </div>
      )}

      {/* Completed state */}
      {isCompleted && (
        <div className="px-5 pb-5 border-t border-[var(--border)] pt-4">
          <div className="flex items-center gap-3 p-4 bg-[var(--accent)]/10 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center">
              <svg className="w-5 h-5 text-[var(--accent-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-mono font-bold text-[var(--accent)]">Completed</p>
              <p className="text-sm text-[var(--text-secondary)]">You&apos;ve mastered this workflow!</p>
            </div>
            <button
              onClick={() => {
                setIsExpanded(false)
                setIsCompleted(false)
              }}
              className="px-3 py-1 text-sm font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  )
}