'use client'

import { useState } from 'react'
import { WorkflowStep as WorkflowStepType } from '@/data/workflows'
import { Kbd } from '@/components/ui/Kbd'
import { CopyButton } from '@/components/ui/CopyButton'

interface WorkflowStepperProps {
  steps: WorkflowStepType[]
  onComplete?: () => void
}

export function WorkflowStepper({ steps, onComplete }: WorkflowStepperProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const canGoPrev = currentStep > 0
  const canGoNext = currentStep < steps.length - 1
  const isCompleted = completedSteps.has(currentStep)

  const goNext = () => {
    if (canGoNext) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goPrev = () => {
    if (canGoPrev) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepComplete = () => {
    const newCompleted = new Set(completedSteps)
    newCompleted.add(currentStep)
    setCompletedSteps(newCompleted)

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete?.()
    }
  }

  const step = steps[currentStep]

  return (
    <div className="space-y-4">
      {/* Progress indicator */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <span className="font-mono">
            {completedSteps.size}/{steps.length}
          </span>
          <div className="w-24 h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--accent)] transition-all duration-300 ease-out"
              style={{ width: `${(completedSteps.size / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step navigation arrows */}
        <div className="flex items-center gap-1">
          <button
            onClick={goPrev}
            disabled={!canGoPrev}
            className={`
              p-2 rounded-lg transition-colors duration-200
              ${canGoPrev
                ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--border)]'
                : 'bg-[var(--bg-secondary)]/50 text-[var(--text-secondary)]/50 cursor-not-allowed'
              }
            `}
            aria-label="Previous step"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goNext}
            disabled={!canGoNext}
            className={`
              p-2 rounded-lg transition-colors duration-200
              ${canGoNext
                ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--border)]'
                : 'bg-[var(--bg-secondary)]/50 text-[var(--text-secondary)]/50 cursor-not-allowed'
              }
            `}
            aria-label="Next step"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Current step display */}
      <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
        {/* Step header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono font-bold
              ${isCompleted ? 'bg-[var(--accent)] text-[var(--accent-text)]' : 'bg-[var(--bg-terminal)] text-[var(--accent)]'}
              ring-2 ring-[var(--accent)]
            `}
          >
            {isCompleted ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              currentStep + 1
            )}
          </div>
          <span className="text-sm text-[var(--text-secondary)] font-mono">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>

        {/* Instruction */}
        <p className="text-lg text-[var(--text-primary)] font-medium mb-4">
          {step.instruction}
        </p>

        {/* Command (KDL or code block) */}
        {step.command && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-wider">
                {step.command.includes('{') || step.command.includes('layout') ? 'KDL Code' : 'Command'}
              </span>
              <CopyButton text={step.command} size="sm" />
            </div>
            <pre className="p-4 rounded-lg bg-[var(--bg-terminal)] border border-[var(--border)] overflow-x-auto">
              <code className="text-sm font-mono text-[var(--text-mono)] whitespace-pre">
                {step.command}
              </code>
            </pre>
          </div>
        )}

        {/* Explanation */}
        {step.explanation && (
          <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
            {step.explanation}
          </p>
        )}

        {/* Tip */}
        {step.tip && (
          <div className="flex items-start gap-2 p-3 bg-[var(--accent)]/10 rounded-lg border border-[var(--accent)]/20">
            <svg className="w-4 h-4 text-[var(--accent)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-[var(--accent)]">{step.tip}</span>
          </div>
        )}

        {/* Action row */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--border)]">
          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleStepComplete}
              className="px-6 py-2.5 bg-[var(--accent)] text-[var(--accent-text)] font-mono font-bold rounded-lg
                hover:bg-[var(--accent-muted)] transition-colors duration-200"
            >
              Complete Workflow
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--text-secondary)]">Press</span>
              <Kbd keys={['→']} className="text-xs" />
              <span className="text-sm text-[var(--text-secondary)]">or click Next to continue</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={goPrev}
              disabled={!canGoPrev}
              className={`
                px-4 py-2 rounded-lg font-mono text-sm transition-colors duration-200
                ${canGoPrev
                  ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--bg-secondary)]'
                  : 'bg-[var(--bg-primary)]/50 text-[var(--text-secondary)]/50 border border-[var(--border)]/50 cursor-not-allowed'
                }
              `}
            >
              ← Prev
            </button>
            <button
              onClick={goNext}
              disabled={!canGoNext}
              className={`
                px-4 py-2 rounded-lg font-mono text-sm transition-colors duration-200
                ${canGoNext
                  ? 'bg-[var(--accent)] text-[var(--accent-text)] hover:bg-[var(--accent-muted)]'
                  : 'bg-[var(--accent)]/50 text-[var(--accent-text)]/50 cursor-not-allowed'
                }
              `}
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Step dots */}
      <div className="flex items-center justify-center gap-2">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`
              w-2 h-2 rounded-full transition-all duration-200
              ${index === currentStep
                ? 'bg-[var(--accent)] w-6'
                : completedSteps.has(index)
                  ? 'bg-[var(--accent)]/50'
                  : 'bg-[var(--text-secondary)]/30 hover:bg-[var(--text-secondary)]/50'
              }
            `}
            aria-label={`Go to step ${index + 1}`}
          />
        ))}
      </div>

      {/* Completion celebration */}
      {completedSteps.size === steps.length && (
        <div className="p-6 bg-[var(--accent)]/20 rounded-xl border border-[var(--accent)] text-center">
          <div className="text-3xl mb-2">🎉</div>
          <p className="text-[var(--accent)] font-mono font-bold text-lg">Workflow Complete!</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">You&apos;ve mastered this workflow.</p>
        </div>
      )}
    </div>
  )
}