'use client'

import { useState, useEffect } from 'react'
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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const style = difficultyStyles[workflow.difficulty]

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isModalOpen])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isModalOpen])

  const handleStart = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsModalOpen(true)
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false)
    }
  }

  const handleComplete = () => {
    setIsCompleted(true)
    setIsModalOpen(false)
  }

  return (
    <>
      <div
        className={`
          rounded-xl border transition-all duration-300
          bg-[var(--bg-primary)] border-[var(--border)]
          ${isCompleted ? 'ring-2 ring-[var(--accent)]' : ''}
        `}
      >
        {/* Header */}
        <div className="p-5">
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
                {isCompleted && (
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold uppercase tracking-wider bg-[var(--accent)]/20 text-[var(--accent)]">
                    Completed
                  </span>
                )}
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

            {/* Action button */}
            <div className="flex-shrink-0">
              <button
                onClick={handleStart}
                className="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] font-mono text-sm rounded-lg
                  hover:bg-[var(--border)] transition-colors duration-200"
              >
                {isCompleted ? 'Review' : 'Start'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleOverlayClick}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal content */}
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-auto rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] shadow-2xl">
            {/* Modal header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-[var(--border)] bg-[var(--bg-primary)]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`
                      inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold uppercase tracking-wider
                      ${style.bg} ${style.text} ${style.border}
                    `}
                  >
                    {difficultyLabels[workflow.difficulty]}
                  </span>
                  <span className="text-sm text-[var(--text-secondary)]">
                    {workflow.steps.length} steps
                  </span>
                </div>
                <h2 className="text-xl font-mono font-bold text-[var(--text-primary)]">
                  {workflow.title}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)] transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="p-5">
              <p className="text-sm text-[var(--text-secondary)] mb-6">
                {workflow.description}
              </p>
              <WorkflowStepper
                steps={workflow.steps}
                onComplete={handleComplete}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}